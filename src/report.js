/**
 * Módulo de geração de relatórios
 * Gera relatórios formatados de gastos por categoria
 */

import { getExpenseStats } from './expenses.js';
import { formatCurrency } from './utils.js';

/**
 * Gera relatório de gastos formatado em texto
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {string} Relatório formatado
 */
export function generateReport(groupId, userId) {
  const stats = getExpenseStats(groupId, userId);
  
  // Se não houver gastos, retorna mensagem apropriada
  if (stats.geral === 0) {
    return `📍 RELATÓRIO DA VIAGEM

🍔 Alimentação: R$ 0,00
🚗 Transporte: R$ 0,00

💰 Total geral: R$ 0,00

ℹ️ Nenhum gasto registrado ainda.`;
  }
  
  // Formata o relatório
  const report = `📍 RELATÓRIO DA VIAGEM

🍔 Alimentação: ${formatCurrency(stats.comida)}
🚗 Transporte: ${formatCurrency(stats.transporte)}

💰 Total geral: ${formatCurrency(stats.geral)}`;
  
  return report;
}

/**
 * Gera relatório em formato JSON (útil para APIs)
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {object} Relatório em formato JSON
 */
export function generateReportJSON(groupId, userId) {
  const stats = getExpenseStats(groupId, userId);
  
  return {
    groupId,
    userId,
    categories: {
      comida: {
        total: stats.comida,
        formatted: formatCurrency(stats.comida)
      },
      transporte: {
        total: stats.transporte,
        formatted: formatCurrency(stats.transporte)
      }
    },
    total: {
      value: stats.geral,
      formatted: formatCurrency(stats.geral)
    },
    generatedAt: new Date().toISOString()
  };
}
