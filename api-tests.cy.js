// cypress/e2e/api-tests.cy.js

describe('🚀 Tutorial: Testes de API com Cypress', () => {
  
  // Variáveis para reutilização
  let createdPostId;
  const baseUrl = 'https://jsonplaceholder.typicode.com';

  describe('📋 Testes GET - Buscar Dados', () => {
    
    it('✅ Deve buscar todos os posts', () => {
      cy.request('GET', '/posts')
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.have.length.greaterThan(0);
          expect(response.body).to.have.length(100); // JSONPlaceholder retorna 100 posts
          
          // Validar estrutura do primeiro post
          expect(response.body[0]).to.have.property('id');
          expect(response.body[0]).to.have.property('title');
          expect(response.body[0]).to.have.property('body');
          expect(response.body[0]).to.have.property('userId');
        });
    });

    it('✅ Deve buscar um post específico', () => {
      cy.request('GET', '/posts/1')
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(1);
          expect(response.body.userId).to.eq(1);
          expect(response.body.title).to.be.a('string');
          expect(response.body.body).to.be.a('string');
        });
    });

    it('✅ Deve retornar 404 para post inexistente', () => {
      cy.request({
        method: 'GET',
        url: '/posts/99999',
        failOnStatusCode: false
      }).should((response) => {
        expect(response.status).to.eq(404);
      });
    });

    it('✅ Deve validar headers da resposta', () => {
      cy.request('GET', '/posts/1')
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.headers).to.have.property('content-type');
          expect(response.headers['content-type']).to.include('application/json');
        });
    });

  });

  describe('➕ Testes POST - Criar Dados', () => {
    
    it('✅ Deve criar um novo post', () => {
      const newPost = {
        title: `Post de teste ${Date.now()}`,
        body: 'Este é o conteúdo do meu post de teste criado com Cypress',
        userId: 1
      };

      cy.request('POST', '/posts', newPost)
        .should((response) => {
          expect(response.status).to.eq(201);
          expect(response.body.title).to.eq(newPost.title);
          expect(response.body.body).to.eq(newPost.body);
          expect(response.body.userId).to.eq(newPost.userId);
          expect(response.body.id).to.exist;
          expect(response.body.id).to.be.a('number');
        })
        .then((response) => {
          // Salvar ID para usar em outros testes
          createdPostId = response.body.id;
        });
    });

    it('✅ Deve validar campos obrigatórios', () => {
      const incompletePost = {
        title: 'Post sem body nem userId'
      };

      cy.request('POST', '/posts', incompletePost)
        .should((response) => {
          // JSONPlaceholder aceita posts incompletos, mas retorna 201
          expect(response.status).to.eq(201);
          expect(response.body.title).to.eq(incompletePost.title);
          expect(response.body.id).to.exist;
        });
    });

  });

  describe('✏️ Testes PUT - Atualizar Dados', () => {
    
    it('✅ Deve atualizar um post existente', () => {
      const updatedPost = {
        id: 1,
        title: 'Post atualizado via Cypress',
        body: 'Conteúdo completamente atualizado do post',
        userId: 1
      };

      cy.request('PUT', '/posts/1', updatedPost)
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.id).to.eq(1);
          expect(response.body.title).to.eq(updatedPost.title);
          expect(response.body.body).to.eq(updatedPost.body);
          expect(response.body.userId).to.eq(updatedPost.userId);
        });
    });

    it('✅ Deve fazer atualização parcial com PATCH', () => {
      const partialUpdate = {
        title: 'Apenas título atualizado'
      };

      cy.request('PATCH', '/posts/1', partialUpdate)
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body.title).to.eq(partialUpdate.title);
          expect(response.body.id).to.eq(1);
        });
    });

  });

  describe('🗑️ Testes DELETE - Remover Dados', () => {
    
    it('✅ Deve deletar um post', () => {
      cy.request('DELETE', '/posts/1')
        .should((response) => {
          expect(response.status).to.eq(200);
        });
    });

    it('✅ Deve confirmar que post foi deletado', () => {
      // Primeiro deletar
      cy.request('DELETE', '/posts/2');
      
      // Tentar buscar o post deletado (no JSONPlaceholder ele ainda existe)
      // Em uma API real, retornaria 404
      cy.request('GET', '/posts/2')
        .should((response) => {
          expect(response.status).to.eq(200);
          // No JSONPlaceholder, o post ainda existe após delete
        });
    });

  });

  describe('🔐 Testes com Headers e Autenticação', () => {
    
    it('✅ Deve fazer requisição com headers customizados', () => {
      cy.request({
        method: 'GET',
        url: '/posts/1',
        headers: {
          'Authorization': 'Bearer fake-token-123',
          'Content-Type': 'application/json',
          'X-Custom-Header': 'cypress-test'
        }
      }).should((response) => {
        expect(response.status).to.eq(200);
        expect(response.body.id).to.eq(1);
      });
    });

    it('✅ Deve simular erro de autenticação', () => {
      // Como JSONPlaceholder não tem autenticação real,
      // este é um exemplo de como testar APIs autenticadas
      cy.request({
        method: 'GET',
        url: '/posts',
        headers: {
          'Authorization': 'Bearer invalid-token'
        }
      }).should((response) => {
        // JSONPlaceholder ignora auth, mas em API real seria 401
        expect(response.status).to.eq(200);
      });
    });

  });

  describe('📊 Validações Avançadas de Schema', () => {
    
    it('✅ Deve validar schema completo da resposta', () => {
      cy.request('GET', '/posts/1')
        .should((response) => {
          const post = response.body;
          
          // Validar tipos de dados
          expect(post.id).to.be.a('number');
          expect(post.title).to.be.a('string');
          expect(post.body).to.be.a('string');
          expect(post.userId).to.be.a('number');
          
          // Validar valores específicos
          expect(post.id).to.eq(1);
          expect(post.userId).to.eq(1);
          
          // Validar que strings não estão vazias
          expect(post.title).to.not.be.empty;
          expect(post.body).to.not.be.empty;
          
          // Validar que tem todas as propriedades necessárias
          expect(post).to.have.all.keys('id', 'title', 'body', 'userId');
        });
    });

    it('✅ Deve validar array de posts', () => {
      cy.request('GET', '/posts?_limit=5')
        .should((response) => {
          expect(response.status).to.eq(200);
          expect(response.body).to.be.an('array');
          expect(response.body).to.have.length(5);
          
          // Validar cada item do array
          response.body.forEach((post) => {
            expect(post).to.have.property('id');
            expect(post).to.have.property('title');
            expect(post).to.have.property('body');
            expect(post).to.have.property('userId');
          });
        });
    });

  });

  describe('🔄 Testes de Fluxo Completo (CRUD)', () => {
    
    let postId;

    it('✅ Fluxo completo: Criar → Buscar → Atualizar → Deletar', () => {
      const newPost = {
        title: 'Post para teste de fluxo CRUD',
        body: 'Este post será usado para testar o fluxo completo',
        userId: 1
      };

      // 1. Criar post
      cy.request('POST', '/posts', newPost)
        .should((response) => {
          expect(response.status).to.eq(201);
          postId = response.body.id;
        })
        .then(() => {
          // 2. Buscar post criado
          cy.request('GET', `/posts/${postId}`)
            .should((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.title).to.eq(newPost.title);
            });
        })
        .then(() => {
          // 3. Atualizar post
          const updatedData = {
            ...newPost,
            id: postId,
            title: 'Post atualizado no fluxo CRUD'
          };
          
          cy.request('PUT', `/posts/${postId}`, updatedData)
            .should((response) => {
              expect(response.status).to.eq(200);
              expect(response.body.title).to.eq(updatedData.title);
            });
        })
        .then(() => {
          // 4. Deletar post
          cy.request('DELETE', `/posts/${postId}`)
            .should((response) => {
              expect(response.status).to.eq(200);
            });
        });
    });

  });

  describe('⚡ Testes de Performance e Tempo de Resposta', () => {
    
    it('✅ Deve responder em menos de 2 segundos', () => {
      const startTime = Date.now();
      
      cy.request('GET', '/posts')
        .should((response) => {
          const responseTime = Date.now() - startTime;
          expect(response.status).to.eq(200);
          expect(responseTime).to.be.lessThan(2000); // 2 segundos
        });
    });

    it('✅ Deve fazer múltiplas requisições em paralelo', () => {
      const requests = [
        cy.request('GET', '/posts/1'),
        cy.request('GET', '/posts/2'),
        cy.request('GET', '/posts/3')
      ];

      Promise.all(requests).then((responses) => {
        responses.forEach((response) => {
          expect(response.status).to.eq(200);
        });
      });
    });

  });

});

// Comandos customizados (adicionar em cypress/support/commands.js)
/*
Cypress.Commands.add('createTestPost', (postData) => {
  return cy.request('POST', '/posts', postData);
});

Cypress.Commands.add('deleteTestPost', (postId) => {
  return cy.request('DELETE', `/posts/${postId}`);
});

Cypress.Commands.add('validatePostStructure', (post) => {
  expect(post).to.have.property('id');
  expect(post).to.have.property('title');
  expect(post).to.have.property('body');
  expect(post).to.have.property('userId');
});
*/
