/**
 * Script de teste para o sistema de webhooks
 * Execute: node test-webhook.js
 */

import http from 'http';

const BASE_URL = 'http://localhost:3000';
const TEST_GROUP = 'teste-grupo-123';
const TEST_USER = '5511999999999';

/**
 * Faz uma requisição POST para o webhook
 */
function sendWebhook(payload) {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/webhook',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(data)
      }
    };
    
    const req = http.request(options, (res) => {
      let body = '';
      
      res.on('data', (chunk) => {
        body += chunk.toString();
      });
      
      res.on('end', () => {
        try {
          const response = JSON.parse(body);
          resolve(response);
        } catch (error) {
          resolve({ raw: body });
        }
      });
    });
    
    req.on('error', (error) => {
      reject(error);
    });
    
    req.write(data);
    req.end();
  });
}

/**
 * Executa testes sequenciais
 */
async function runTests() {
  console.log('🧪 Iniciando testes do sistema...\n');
  
  try {
    // Teste 1: Definir categoria transporte
    console.log('📝 Teste 1: Definir categoria "transporte"');
    const test1 = await sendWebhook({
      tipo: 'texto',
      conteudo: 'transporte',
      grupo: TEST_GROUP,
      remetente: TEST_USER
    });
    console.log('✅ Resposta:', test1.response);
    console.log('');
    
    // Aguarda um pouco
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 2: Enviar imagem (mock)
    console.log('🖼️  Teste 2: Enviar imagem (com URL mock)');
    const test2 = await sendWebhook({
      tipo: 'imagem',
      url: 'https://via.placeholder.com/400x300.jpg?text=Comprovante+R$45,50',
      grupo: TEST_GROUP,
      remetente: TEST_USER
    });
    console.log('✅ Resposta:', test2.response);
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 3: Definir categoria comida
    console.log('📝 Teste 3: Definir categoria "comida"');
    const test3 = await sendWebhook({
      tipo: 'texto',
      conteudo: 'comida',
      grupo: TEST_GROUP,
      remetente: TEST_USER
    });
    console.log('✅ Resposta:', test3.response);
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 4: Enviar outra imagem
    console.log('🖼️  Teste 4: Enviar outra imagem');
    const test4 = await sendWebhook({
      tipo: 'imagem',
      url: 'https://via.placeholder.com/400x300.jpg?text=Comprovante+R$32,75',
      grupo: TEST_GROUP,
      remetente: TEST_USER
    });
    console.log('✅ Resposta:', test4.response);
    console.log('');
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Teste 5: Fechar viagem
    console.log('📊 Teste 5: Fechar viagem (gerar relatório)');
    const test5 = await sendWebhook({
      tipo: 'texto',
      conteudo: 'fechar viagem',
      grupo: TEST_GROUP,
      remetente: TEST_USER
    });
    console.log('✅ Resposta:');
    console.log(test5.response);
    console.log('');
    
    console.log('✅ Todos os testes concluídos!');
    
  } catch (error) {
    console.error('❌ Erro nos testes:', error.message);
    console.error('\n💡 Certifique-se de que o servidor está rodando: npm start');
  }
}

// Verifica se o servidor está rodando antes de executar
const checkServer = http.get(`${BASE_URL}/health`, (res) => {
  let body = '';
  res.on('data', (chunk) => { body += chunk.toString(); });
  res.on('end', () => {
    console.log('✅ Servidor está rodando!\n');
    runTests();
  });
});

checkServer.on('error', () => {
  console.error('❌ Servidor não está rodando!');
  console.error('💡 Execute primeiro: npm start');
  process.exit(1);
});
