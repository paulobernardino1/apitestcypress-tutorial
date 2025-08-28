# 🚀 Tutorial: Testes de API com Cypress

> **Aprenda a testar APIs de forma simples e eficiente com Cypress**

## 📋 O que você vai aprender

- Como configurar o Cypress para testes de API
- Fazer requisições GET, POST, PUT e DELETE
- Validar status codes, headers e body das respostas
- Trabalhar com autenticação
- Boas práticas para testes de API

## 🛠️ Pré-requisitos

- Node.js instalado
- Conhecimento básico de JavaScript
- Conhecimento básico de APIs REST

## 📚 Contexto

Este tutorial usa a **JSONPlaceholder API** (https://jsonplaceholder.typicode.com/) - uma API fake gratuita perfeita para testes e aprendizado.

## 🚀 Configuração Inicial

### 1. Instalação do Cypress

```bash
npm init -y
npm install --save-dev cypress
```

### 2. Configuração do cypress.config.js

```javascript
const { defineConfig } = require('cypress')

module.exports = defineConfig({
  e2e: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
})
```

## 📖 Exemplos Práticos

### 🔍 Teste GET - Buscar dados

```javascript
describe('API Tests - GET', () => {
  it('Deve buscar todos os posts', () => {
    cy.request('GET', '/posts')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body).to.have.length.greaterThan(0)
        expect(response.body[0]).to.have.property('id')
        expect(response.body[0]).to.have.property('title')
      })
  })

  it('Deve buscar um post específico', () => {
    cy.request('GET', '/posts/1')
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.id).to.eq(1)
        expect(response.body.title).to.be.a('string')
      })
  })
})
```

### ➕ Teste POST - Criar dados

```javascript
describe('API Tests - POST', () => {
  it('Deve criar um novo post', () => {
    const newPost = {
      title: 'Meu novo post de teste',
      body: 'Este é o conteúdo do meu post de teste',
      userId: 1
    }

    cy.request('POST', '/posts', newPost)
      .should((response) => {
        expect(response.status).to.eq(201)
        expect(response.body.title).to.eq(newPost.title)
        expect(response.body.body).to.eq(newPost.body)
        expect(response.body.userId).to.eq(newPost.userId)
        expect(response.body.id).to.exist
      })
  })
})
```

### ✏️ Teste PUT - Atualizar dados

```javascript
describe('API Tests - PUT', () => {
  it('Deve atualizar um post existente', () => {
    const updatedPost = {
      id: 1,
      title: 'Post atualizado',
      body: 'Conteúdo atualizado do post',
      userId: 1
    }

    cy.request('PUT', '/posts/1', updatedPost)
      .should((response) => {
        expect(response.status).to.eq(200)
        expect(response.body.title).to.eq(updatedPost.title)
        expect(response.body.body).to.eq(updatedPost.body)
      })
  })
})
```

### 🗑️ Teste DELETE - Remover dados

```javascript
describe('API Tests - DELETE', () => {
  it('Deve deletar um post', () => {
    cy.request('DELETE', '/posts/1')
      .should((response) => {
        expect(response.status).to.eq(200)
      })
  })
})
```

## 🔐 Testando com Autenticação

```javascript
describe('API Tests - Com Autenticação', () => {
  it('Deve fazer requisição autenticada', () => {
    cy.request({
      method: 'GET',
      url: '/posts',
      headers: {
        'Authorization': 'Bearer seu-token-aqui',
        'Content-Type': 'application/json'
      }
    }).should((response) => {
      expect(response.status).to.eq(200)
    })
  })
})
```

## 🎯 Validações Avançadas

### Validando Headers

```javascript
it('Deve validar headers da resposta', () => {
  cy.request('GET', '/posts/1')
    .should((response) => {
      expect(response.status).to.eq(200)
      expect(response.headers).to.have.property('content-type')
      expect(response.headers['content-type']).to.include('application/json')
    })
})
```

### Validando Schema da Resposta

```javascript
it('Deve validar schema da resposta', () => {
  cy.request('GET', '/posts/1')
    .should((response) => {
      expect(response.body).to.deep.include({
        id: 1,
        userId: 1
      })
      
      // Validar tipos de dados
      expect(response.body.id).to.be.a('number')
      expect(response.body.title).to.be.a('string')
      expect(response.body.body).to.be.a('string')
      expect(response.body.userId).to.be.a('number')
    })
})
```

## 🛠️ Utilitários e Comandos Customizados

Crie comandos customizados em `cypress/support/commands.js`:

```javascript
Cypress.Commands.add('apiLogin', (email, password) => {
  cy.request({
    method: 'POST',
    url: '/auth/login',
    body: { email, password }
  }).then((response) => {
    window.localStorage.setItem('authToken', response.body.token)
  })
})

Cypress.Commands.add('apiRequest', (method, url, body = null) => {
  const token = window.localStorage.getItem('authToken')
  
  cy.request({
    method,
    url,
    body,
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json'
    }
  })
})
```

## 📁 Estrutura do Projeto

```
cypress-api-tutorial/
├── cypress/
│   ├── e2e/
│   │   └── api-tests.cy.js
│   └── support/
│       ├── commands.js
│       └── e2e.js
├── cypress.config.js
├── package.json
└── README.md
```

## ✅ Boas Práticas

### 1. **Organize seus testes por funcionalidade**
```javascript
describe('Posts API', () => {
  describe('GET /posts', () => {
    // testes de GET
  })
  
  describe('POST /posts', () => {
    // testes de POST
  })
})
```

### 2. **Use dados dinâmicos**
```javascript
const randomTitle = `Post ${Date.now()}`
const testPost = {
  title: randomTitle,
  body: 'Conteúdo de teste',
  userId: 1
}
```

### 3. **Valide sempre status codes**
```javascript
cy.request('GET', '/posts')
  .its('status')
  .should('eq', 200)
```

### 4. **Use aliases para reutilizar dados**
```javascript
cy.request('POST', '/posts', newPost)
  .its('body.id')
  .as('postId')

cy.get('@postId').then((postId) => {
  cy.request('DELETE', `/posts/${postId}`)
})
```

## 🚦 Como executar os testes

```bash
# Modo interativo
npx cypress open

# Modo headless
npx cypress run

# Executar arquivo específico
npx cypress run --spec "cypress/e2e/api-tests.cy.js"
```

## 📝 Exemplo de Saída

```
✓ Deve buscar todos os posts (145ms)
✓ Deve buscar um post específico (89ms)  
✓ Deve criar um novo post (156ms)
✓ Deve atualizar um post existente (134ms)
✓ Deve deletar um post (98ms)

5 passing (622ms)
```

## 🎓 Próximos Passos

- Implementar testes de performance com `cy.request()`
- Integrar com CI/CD
- Adicionar relatórios de teste
- Explorar interceptação de requests (`cy.intercept()`)

## 📞 Dúvidas?

Deixe suas dúvidas nos comentários ou abra uma issue no GitHub!

---

**📌 Curtiu o tutorial? Deixe uma ⭐ no repositório e compartilhe com outros QAs!**

---

*Tutorial criado por [Seu Nome] - Conecte-se no [LinkedIn](seu-linkedin)*
