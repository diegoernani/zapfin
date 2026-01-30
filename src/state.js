/**
 * Gerenciamento de estado - controle de categoria atual por grupo
 * Armazena a última categoria informada por cada grupo/usuário
 */

import { log } from './utils.js';

// Estrutura: { groupId: { userId: category } }
const categoryState = new Map();

/**
 * Define a categoria atual para um grupo/usuário
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @param {string} category - Categoria ('transporte' ou 'comida')
 */
export function setCategory(groupId, userId, category) {
  if (!categoryState.has(groupId)) {
    categoryState.set(groupId, new Map());
  }
  
  const groupState = categoryState.get(groupId);
  groupState.set(userId, category);
  
  log(`Categoria definida: ${category} para grupo ${groupId}, usuário ${userId}`);
}

/**
 * Obtém a categoria atual para um grupo/usuário
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {string|null} Categoria atual ou null se não houver
 */
export function getCategory(groupId, userId) {
  const groupState = categoryState.get(groupId);
  if (!groupState) {
    return null;
  }
  
  return groupState.get(userId) || null;
}

/**
 * Remove a categoria atual após processar uma imagem
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 */
export function clearCategory(groupId, userId) {
  const groupState = categoryState.get(groupId);
  if (groupState) {
    groupState.delete(userId);
    log(`Categoria limpa para grupo ${groupId}, usuário ${userId}`);
  }
}

/**
 * Limpa todo o estado (útil para testes ou reset)
 */
export function clearAllState() {
  categoryState.clear();
  log('Estado limpo completamente');
}
