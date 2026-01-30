/**
 * Script para criar as tabelas no banco de dados
 * Execute: node script/setup-database.js
 */

import pg from 'pg';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const { Pool } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Verifica DATABASE_URL
if (!process.env.DATABASE_URL) {
  console.error('❌ Erro: DATABASE_URL não configurada!');
  console.log('\nConfigure a variável de ambiente:');
  console.log('DATABASE_URL=postgresql://user:password@ballast.proxy.rlwy.net:28070/railway');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log('🔌 Conectando ao banco de dados...');
    
    // Testa conexão
    await pool.query('SELECT NOW()');
    console.log('✅ Conectado ao banco de dados!');
    
    // Lê o arquivo SQL
    const sqlPath = join(__dirname, '..', 'schema.sql');
    const sql = readFileSync(sqlPath, 'utf-8');
    
    console.log('\n📝 Executando schema...');
    
    // Executa o SQL
    await pool.query(sql);
    
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Verifica as tabelas
    console.log('\n🔍 Verificando tabelas criadas...');
    const tables = await pool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_type = 'BASE TABLE'
      ORDER BY table_name;
    `);
    
    console.log('\n📊 Tabelas encontradas:');
    tables.rows.forEach(row => {
      console.log(`  ✅ ${row.table_name}`);
    });
    
    // Verifica estrutura
    console.log('\n📋 Estrutura da tabela expenses:');
    const expensesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'expenses'
      ORDER BY ordinal_position;
    `);
    
    expensesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    console.log('\n📋 Estrutura da tabela user_states:');
    const statesColumns = await pool.query(`
      SELECT column_name, data_type, is_nullable
      FROM information_schema.columns
      WHERE table_name = 'user_states'
      ORDER BY ordinal_position;
    `);
    
    statesColumns.rows.forEach(col => {
      console.log(`  - ${col.column_name} (${col.data_type}) ${col.is_nullable === 'NO' ? 'NOT NULL' : ''}`);
    });
    
    console.log('\n🎉 Banco de dados configurado com sucesso!');
    
  } catch (error) {
    console.error('\n❌ Erro ao configurar banco de dados:');
    console.error(error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.error('\n💡 Verifique se:');
      console.error('  - O host e porta estão corretos');
      console.error('  - O banco está ativo no Railway');
      console.error('  - A DATABASE_URL está correta');
    }
    
    if (error.code === '28P01') {
      console.error('\n💡 Erro de autenticação. Verifique usuário e senha na DATABASE_URL');
    }
    
    process.exit(1);
  } finally {
    await pool.end();
  }
}

setupDatabase();
