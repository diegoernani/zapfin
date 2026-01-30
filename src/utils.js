/**
 * Utilitários gerais do sistema
 */

/**
 * Formata valor monetário para exibição
 * @param {number} value - Valor numérico
 * @returns {string} Valor formatado como R$ XX,XX
 */
export function formatCurrency(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
}

/**
 * Valida se uma string é uma categoria válida
 * @param {string} text - Texto a validar
 * @returns {string|null} Categoria válida ou null
 */
export function parseCategory(text) {
  const normalized = text.toLowerCase().trim();
  
  if (normalized.includes('transporte') || normalized.includes('transport')) {
    return 'transporte';
  }
  
  if (normalized.includes('comida') || normalized.includes('alimentação') || normalized.includes('alimentacao')) {
    return 'comida';
  }
  
  return null;
}

/**
 * Valida se o texto é o comando de fechar viagem
 * @param {string} text - Texto a validar
 * @returns {boolean}
 */
export function isCloseTripCommand(text) {
  const normalized = text.toLowerCase().trim();
  return normalized.includes('fechar viagem') || normalized.includes('fechar');
}

/**
 * Extrai o número do remetente do payload
 * @param {object} payload - Payload do webhook
 * @returns {string} Número do remetente
 */
export function getSenderId(payload) {
  return payload.remetente || payload.from || payload.sender || 'unknown';
}

/**
 * Extrai o ID do grupo do payload
 * @param {object} payload - Payload do webhook
 * @returns {string} ID do grupo
 */
export function getGroupId(payload) {
  return payload.grupo || payload.group || payload.groupId || 'default';
}

/**
 * Log formatado para debug
 * @param {string} message - Mensagem a logar
 * @param {object} data - Dados adicionais (opcional)
 */
export function log(message, data = null) {
  const timestamp = new Date().toISOString();
  if (data) {
    console.log(`[${timestamp}] ${message}`, data);
  } else {
    console.log(`[${timestamp}] ${message}`);
  }
}
