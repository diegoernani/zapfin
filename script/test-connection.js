/**
 * Script para testar conexão com o banco Railway
 * Execute: node script/test-connection.js
 */

import pg from 'pg';

const { Pool } = pg;

// Configuração do Railway
const config = {
  host: 'ballast.proxy.rlwy.net',
  port: 28070,
  // Preencha com suas credenciais do Railway
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || '',
  database: process.env.DB_NAME || 'railway',
  ssl: {
    rejectUnauthorized: false // Railway geralmente requer SSL
  }
};

console.log('🔌 Testando conexão com Railway...');
console.log(`Host: ${config.host}:${config.port}`);
console.log(`Database: ${config.database}`);
console.log(`User: ${config.user}`);
console.log('');

const pool = new Pool(config);

async function testConnection() {
  try {
    console.log('⏳ Tentando conectar...');
    
    const result = await pool.query('SELECT NOW() as current_time, version() as version');
    
    console.log('✅ Conexão bem-sucedida!');
    console.log('');
    console.log('📊 Informações do banco:');
    console.log(`  Hora atual: ${result.rows[0].current_time}`);
    console.log(`  PostgreSQL: ${result.rows[0].version.split(' ')[0]} ${result.rows[0].version.split(' ')[1]}`);
    console.log('');
    
    // Verifica se as tabelas já existem
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    if (tables.rows.length > 0) {
      console.log('📋 Tabelas existentes:');
      tables.rows.forEach(row => {
        console.log(`  ✅ ${row.table_name}`);
      });
    } else {
      console.log('⚠️  Nenhuma tabela encontrada. Execute o schema.sql para criar.');
    }
    
    // Gera a DATABASE_URL
    const databaseUrl = `postgresql://${config.user}:${config.password}@${config.host}:${config.port}/${config.database}`;
    console.log('');
    console.log('🔗 DATABASE_URL para configurar:');
    console.log('');
    console.log(databaseUrl);
    console.log('');
    console.log('💡 Copie essa URL e configure no Replit como variável de ambiente DATABASE_URL');
    
  } catch (error) {
    console.error('');
    console.error('❌ Erro ao conectar:');
    console.error(error.message);
    console.error('');
    
    if (error.code === 'ECONNREFUSED') {
      console.error('💡 Verifique:');
      console.error('  - Host e porta estão corretos');
      console.error('  - O banco está ativo no Railway');
    }
    
    if (error.code === '28P01') {
      console.error('💡 Erro de autenticação:');
      console.error('  - Verifique usuário e senha');
      console.error('  - Configure as variáveis: DB_USER, DB_PASSWORD, DB_NAME');
    }
    
    if (error.code === '3D000') {
      console.error('💡 Banco de dados não existe:');
      console.error('  - Verifique o nome do banco (DB_NAME)');
    }
    
    console.error('');
    console.error('📝 Para usar este script, configure:');
    console.error('  DB_USER=seu_usuario');
    console.error('  DB_PASSWORD=sua_senha');
    console.error('  DB_NAME=nome_do_banco');
    console.error('');
    console.error('Ou edite o arquivo script/test-connection.js');
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

testConnection();
