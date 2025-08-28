const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    // URL base para os testes de API
    baseUrl: 'https://jsonplaceholder.typicode.com',
    
    // Configurações de timeout
    requestTimeout: 10000,
    responseTimeout: 10000,
    
    // Configurações de viewport (não afeta testes de API, mas é boa prática definir)
    viewportWidth: 1280,
    viewportHeight: 720,
    
    // Configurações de vídeo e screenshots
    video: false, // Para testes de API, vídeo não é necessário
    screenshotOnRunFailure: false, // Para testes de API, screenshot não é necessário
    
    // Pastas e arquivos
    specPattern: 'cypress/e2e/**/*.cy.{js,jsx,ts,tsx}',
    supportFile: 'cypress/support/e2e.js',
    
    // Configurações específicas para testes de API
    env: {
      // URLs de diferentes ambientes
      apiUrl: 'https://jsonplaceholder.typicode.com',
      apiUrlDev: 'https://jsonplaceholder.typicode.com',
      apiUrlStaging: 'https://jsonplaceholder.typicode.com',
      
      // Configurações de autenticação (para APIs reais)
      authToken: 'seu-token-aqui',
      apiKey: 'sua-api-key-aqui',
      
      // Timeouts personalizados
      apiTimeout: 10000,
      longApiTimeout: 30000
    },

    setupNodeEvents(on, config) {
      // Implementar listeners de eventos do Node.js aqui
      
      // Exemplo: Log de início e fim dos testes
      on('before:run', (details) => {
        console.log('🚀 Iniciando execução dos testes de API');
        console.log(`📊 Total de specs: ${details.totalTests}`);
      });

      on('after:run', (results) => {
        console.log('✅ Execução dos testes finalizada');
        console.log(`📈 Testes executados: ${results.totalTests}`);
        console.log(`✅ Testes passou: ${results.totalPassed}`);
        console.log(`❌ Testes falharam: ${results.totalFailed}`);
      });

      // Plugin para gerar relatórios (exemplo)
      on('task', {
        log(message) {
          console.log(message);
          return null;
        },
        
        // Task personalizada para validações complexas
        validateApiResponse(response) {
          // Lógica de validação personalizada
          return {
            isValid: response.status === 200,
            hasRequiredFields: response.body && 
                              response.body.id && 
                              response.body.title
          };
        }
      });

      // Retornar a configuração
      return config;
    },
  },
});

// Exemplo de configuração para múltiplos ambientes
// Use: npx cypress run --env configFile=staging
const environments = {
  development: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    apiUrl: 'https://jsonplaceholder.typicode.com'
  },
  staging: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    apiUrl: 'https://jsonplaceholder.typicode.com'
  },
  production: {
    baseUrl: 'https://jsonplaceholder.typicode.com',
    apiUrl: 'https://jsonplaceholder.typicode.com'
  }
};
