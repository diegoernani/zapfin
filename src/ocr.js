/**
 * Módulo OCR - Extração de valores monetários de imagens
 * 
 * IMPLEMENTAÇÃO INICIAL: Mock simples
 * PREPARADO PARA: Integração futura com Google Vision API ou similar
 */

import { log } from './utils.js';

/**
 * Extrai valor monetário de uma imagem usando OCR
 * 
 * @param {Buffer} imageBuffer - Buffer da imagem
 * @param {string} imagePath - Caminho do arquivo (opcional, para logs)
 * @returns {Promise<number|null>} Valor extraído ou null se não encontrar
 */
export async function extractValueFromImage(imageBuffer, imagePath = null) {
  // TODO: Implementar OCR real (Google Vision, Tesseract, etc.)
  
  // MOCK: Retorna um valor fixo para demonstração
  // Em produção, aqui seria a chamada à API de OCR
  
  log('Processando OCR na imagem...', { path: imagePath, size: imageBuffer.length });
  
  // Simula delay de processamento
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // MOCK: Retorna valor aleatório entre 10 e 200 para demonstração
  // Em produção, substituir por chamada real de OCR
  const mockValue = Math.floor(Math.random() * 190 + 10);
  const mockValueDecimal = mockValue + (Math.random() * 0.99);
  
  log(`OCR extraiu valor: R$ ${mockValueDecimal.toFixed(2)}`);
  
  return parseFloat(mockValueDecimal.toFixed(2));
}

/**
 * Função auxiliar para processar texto extraído do OCR
 * Procura padrões monetários no texto
 * 
 * @param {string} ocrText - Texto extraído do OCR
 * @returns {number|null} Valor encontrado ou null
 */
export function parseValueFromText(ocrText) {
  // Regex para encontrar valores monetários
  // Padrões: R$ 123,45 | 123,45 | 123.45 | R$123,45
  const patterns = [
    /R\$\s*(\d{1,3}(?:\.\d{3})*(?:,\d{2})?)/i,
    /(\d{1,3}(?:\.\d{3})*,\d{2})/,
    /(\d{1,3}(?:\.\d{3})*\.\d{2})/,
    /R\$\s*(\d+,\d{2})/i
  ];
  
  for (const pattern of patterns) {
    const match = ocrText.match(pattern);
    if (match) {
      let valueStr = match[1];
      // Normaliza: remove pontos de milhar, troca vírgula por ponto
      valueStr = valueStr.replace(/\./g, '').replace(',', '.');
      const value = parseFloat(valueStr);
      
      if (!isNaN(value) && value > 0) {
        return parseFloat(value.toFixed(2));
      }
    }
  }
  
  return null;
}
