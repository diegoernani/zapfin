/**
 * Teste Completo e Criativo do ZapFin
 * Simula uma viagem de negócios completa
 * Execute: node script/test-completo.js
 */

// Usa fetch nativo do Node.js 18+

const BASE_URL = process.env.API_URL || 'https://zapfin.replit.app';
const WEBHOOK_URL = `${BASE_URL}/api/webhook`;

// Cores para o console
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function sendWebhook(payload) {
  try {
    const response = await fetch(WEBHOOK_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    
    const data = await response.json();
    return data;
  } catch (error) {
    return { error: error.message };
  }
}

// Cenário: Viagem de negócios para São Paulo
const cenario = {
  grupo: '120363025841234567@g.us',
  usuario: '5511999999999',
  nome: 'Diego Ernani'
};

const gastos = [
  {
    categoria: 'transporte',
    descricao: '🚗 Uber do aeroporto',
    valor: 45.50,
    delay: 1000
  },
  {
    categoria: 'comida',
    descricao: '🍔 Almoço no restaurante',
    valor: 89.90,
    delay: 1000
  },
  {
    categoria: 'transporte',
    descricao: '🚇 Metrô para reunião',
    valor: 4.50,
    delay: 1000
  },
  {
    categoria: 'hospedagem',
    descricao: '🏨 Hotel 1 noite',
    valor: 350.00,
    delay: 1000
  },
  {
    categoria: 'comida',
    descricao: '🍕 Jantar com cliente',
    valor: 156.80,
    delay: 1000
  },
  {
    categoria: 'transporte',
    descricao: '✈️ Uber para aeroporto',
    valor: 52.30,
    delay: 1000
  }
];

async function executarTeste() {
  log('\n╔══════════════════════════════════════════════════════════╗', 'cyan');
  log('║     🧪 TESTE COMPLETO - ZAPFIN 🧪                        ║', 'cyan');
  log('║     Simulação: Viagem de Negócios - São Paulo           ║', 'cyan');
  log('╚══════════════════════════════════════════════════════════╝\n', 'cyan');

  log(`📍 Grupo: ${cenario.grupo}`, 'blue');
  log(`👤 Usuário: ${cenario.nome} (${cenario.usuario})\n`, 'blue');

  // Teste 1: Verificar se está online
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('🔍 TESTE 1: Verificando se a API está online...', 'yellow');
  
  try {
    const healthCheck = await fetch(`${BASE_URL}/api/expenses/stats`);
    if (healthCheck.ok) {
      log('✅ API está online e respondendo!\n', 'green');
    } else {
      log('⚠️  API respondeu mas com erro\n', 'yellow');
    }
  } catch (error) {
    log('❌ API não está acessível. Verifique se está rodando.\n', 'yellow');
    return;
  }

  await sleep(500);

  // Teste 2: Registrar gastos
  log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('📝 TESTE 2: Registrando gastos da viagem...\n', 'yellow');

  for (let i = 0; i < gastos.length; i++) {
    const gasto = gastos[i];
    
    log(`\n${i + 1}. ${gasto.descricao}`, 'bright');
    log(`   💰 Valor: R$ ${gasto.valor.toFixed(2)}`, 'magenta');
    
    // Define categoria
    log(`   📋 Definindo categoria: "${gasto.categoria}"...`, 'blue');
    const categoriaRes = await sendWebhook({
      tipo: 'texto',
      conteudo: gasto.categoria,
      grupo: cenario.grupo,
      remetente: cenario.usuario
    });
    
    if (categoriaRes.response) {
      log(`   🤖 Bot: ${categoriaRes.response}`, 'green');
    }
    
    await sleep(gasto.delay);
    
    // Envia "imagem" (simulado)
    log(`   🖼️  Enviando comprovante...`, 'blue');
    const imagemRes = await sendWebhook({
      tipo: 'imagem',
      url: `https://via.placeholder.com/400x300.jpg?text=${encodeURIComponent(gasto.descricao)}`,
      grupo: cenario.grupo,
      remetente: cenario.usuario
    });
    
    if (imagemRes.response) {
      log(`   🤖 Bot: ${imagemRes.response}`, 'green');
    }
    
    await sleep(500);
  }

  await sleep(1000);

  // Teste 3: Gerar relatório
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('📊 TESTE 3: Gerando relatório da viagem...\n', 'yellow');
  
  const relatorioRes = await sendWebhook({
    tipo: 'texto',
    conteudo: 'fechar viagem',
    grupo: cenario.grupo,
    remetente: cenario.usuario
  });
  
  if (relatorioRes.response) {
    log('📋 RELATÓRIO DA VIAGEM:', 'bright');
    log(relatorioRes.response, 'cyan');
  }

  await sleep(1000);

  // Teste 4: Verificar API
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('🔍 TESTE 4: Verificando dados via API...\n', 'yellow');
  
  try {
    const statsRes = await fetch(`${BASE_URL}/api/expenses/stats?groupId=${encodeURIComponent(cenario.grupo)}`);
    const stats = await statsRes.json();
    
    log('📈 Estatísticas:', 'bright');
    log(`   Total: R$ ${stats.total?.toFixed(2) || '0.00'}`, 'green');
    log('   Por categoria:', 'blue');
    
    if (stats.byCategory) {
      Object.entries(stats.byCategory).forEach(([cat, val]) => {
        log(`     ${cat}: R$ ${Number(val).toFixed(2)}`, 'cyan');
      });
    }
    
    const expensesRes = await fetch(`${BASE_URL}/api/expenses?groupId=${encodeURIComponent(cenario.grupo)}&userId=${encodeURIComponent(cenario.usuario)}`);
    const expenses = await expensesRes.json();
    
    log(`\n   📝 Total de gastos registrados: ${expenses.length}`, 'magenta');
    
  } catch (error) {
    log(`   ⚠️  Erro ao buscar dados: ${error.message}`, 'yellow');
  }

  // Teste 5: Testar categorias customizadas
  log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━', 'yellow');
  log('🎨 TESTE 5: Testando categoria customizada...\n', 'yellow');
  
  log('   📋 Enviando: "estacionamento"', 'blue');
  const customRes = await sendWebhook({
    tipo: 'texto',
    conteudo: 'estacionamento',
    grupo: cenario.grupo,
    remetente: cenario.usuario
  });
  
  if (customRes.response) {
    log(`   🤖 Bot: ${customRes.response}`, 'green');
  }

  // Resumo final
  log('\n╔══════════════════════════════════════════════════════════╗', 'green');
  log('║     ✅ TESTE COMPLETO FINALIZADO!                        ║', 'green');
  log('╚══════════════════════════════════════════════════════════╝\n', 'green');
  
  log('🎉 Todos os testes foram executados!', 'bright');
  log('\n📱 Acesse o dashboard:', 'blue');
  log(`   ${BASE_URL}/dashboard\n`, 'cyan');
  
  log('💡 Dicas:', 'yellow');
  log('   - Use o simulador em: /', 'blue');
  log('   - Veja estatísticas em: /dashboard', 'blue');
  log('   - Configure webhook em: /setup', 'blue');
}

// Executa o teste
executarTeste().catch(error => {
  log(`\n❌ Erro durante o teste: ${error.message}`, 'yellow');
  process.exit(1);
});
