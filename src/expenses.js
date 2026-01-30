/**
 * Módulo de armazenamento de gastos
 * Armazena gastos em memória e persiste em arquivo JSON local
 */

import { promises as fs } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { log } from './utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'data');
const EXPENSES_FILE = join(DATA_DIR, 'expenses.json');

// Armazenamento em memória
let expenses = [];

/**
 * Inicializa o módulo - carrega dados do arquivo se existir
 */
export async function initialize() {
  try {
    // Cria diretório data se não existir
    await fs.mkdir(DATA_DIR, { recursive: true });
    
    // Tenta carregar dados existentes
    try {
      const data = await fs.readFile(EXPENSES_FILE, 'utf-8');
      expenses = JSON.parse(data);
      log(`Carregados ${expenses.length} gastos do arquivo`);
    } catch (error) {
      // Arquivo não existe ainda, começa com array vazio
      expenses = [];
      log('Iniciando com armazenamento vazio');
    }
  } catch (error) {
    log('Erro ao inicializar módulo de gastos:', error);
    expenses = [];
  }
}

/**
 * Adiciona um novo gasto
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @param {string} category - Categoria do gasto
 * @param {number} value - Valor do gasto
 * @returns {object} Gasto criado
 */
export async function addExpense(groupId, userId, category, value) {
  const expense = {
    id: Date.now().toString(),
    groupId,
    userId,
    category,
    value: parseFloat(value.toFixed(2)),
    date: new Date().toISOString(),
    timestamp: Date.now()
  };
  
  expenses.push(expense);
  
  // Persiste no arquivo
  await saveToFile();
  
  log(`Gasto adicionado: ${category} - R$ ${value.toFixed(2)}`);
  
  return expense;
}

/**
 * Obtém todos os gastos de um grupo
 * @param {string} groupId - ID do grupo
 * @returns {Array} Lista de gastos
 */
export function getExpensesByGroup(groupId) {
  return expenses.filter(exp => exp.groupId === groupId);
}

/**
 * Obtém todos os gastos de um usuário em um grupo
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {Array} Lista de gastos
 */
export function getExpensesByUser(groupId, userId) {
  return expenses.filter(
    exp => exp.groupId === groupId && exp.userId === userId
  );
}

/**
 * Remove todos os gastos de um grupo (útil para reset)
 * @param {string} groupId - ID do grupo
 */
export async function clearExpensesByGroup(groupId) {
  expenses = expenses.filter(exp => exp.groupId !== groupId);
  await saveToFile();
  log(`Gastos do grupo ${groupId} foram limpos`);
}

/**
 * Remove todos os gastos (útil para testes)
 */
export async function clearAllExpenses() {
  expenses = [];
  await saveToFile();
  log('Todos os gastos foram limpos');
}

/**
 * Salva gastos no arquivo JSON
 */
async function saveToFile() {
  try {
    await fs.writeFile(
      EXPENSES_FILE,
      JSON.stringify(expenses, null, 2),
      'utf-8'
    );
  } catch (error) {
    log('Erro ao salvar gastos no arquivo:', error);
  }
}

/**
 * Obtém estatísticas de gastos por categoria para um grupo/usuário
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {object} Estatísticas { comida: total, transporte: total, geral: total }
 */
export function getExpenseStats(groupId, userId) {
  const userExpenses = getExpensesByUser(groupId, userId);
  
  const stats = {
    comida: 0,
    transporte: 0,
    geral: 0
  };
  
  userExpenses.forEach(exp => {
    const value = exp.value;
    stats.geral += value;
    
    if (exp.category === 'comida') {
      stats.comida += value;
    } else if (exp.category === 'transporte') {
      stats.transporte += value;
    }
  });
  
  // Arredonda para 2 casas decimais
  stats.comida = parseFloat(stats.comida.toFixed(2));
  stats.transporte = parseFloat(stats.transporte.toFixed(2));
  stats.geral = parseFloat(stats.geral.toFixed(2));
  
  return stats;
}
