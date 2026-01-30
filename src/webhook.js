/**
 * Módulo de processamento de webhooks
 * Processa mensagens recebidas do WhatsApp via webhook
 */

import { parseCategory, isCloseTripCommand, getSenderId, getGroupId, log } from './utils.js';
import { getCategory, setCategory, clearCategory } from './state.js';
import { extractValueFromImage } from './ocr.js';
import { addExpense } from './expenses.js';
import { generateReport } from './report.js';
import { promises as fs } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import http from 'http';
import https from 'https';
import { URL } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const UPLOADS_DIR = join(__dirname, '..', 'uploads');

/**
 * Processa uma mensagem recebida via webhook
 * @param {object} payload - Payload do webhook
 * @returns {Promise<string>} Resposta a ser enviada ao usuário
 */
export async function processMessage(payload) {
  try {
    const tipo = payload.tipo || payload.type || 'texto';
    const groupId = getGroupId(payload);
    const userId = getSenderId(payload);
    
    log(`Processando mensagem: tipo=${tipo}, grupo=${groupId}, usuário=${userId}`);
    
    // Processa conforme o tipo de mensagem
    switch (tipo.toLowerCase()) {
      case 'texto':
      case 'text':
        return await processTextMessage(payload, groupId, userId);
      
      case 'audio':
        return await processAudioMessage(payload, groupId, userId);
      
      case 'imagem':
      case 'image':
        return await processImageMessage(payload, groupId, userId);
      
      default:
        return '❌ Tipo de mensagem não suportado. Envie texto, áudio ou imagem.';
    }
  } catch (error) {
    log('Erro ao processar mensagem:', error);
    return '❌ Erro ao processar sua mensagem. Tente novamente.';
  }
}

/**
 * Processa mensagem de texto
 * @param {object} payload - Payload do webhook
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {Promise<string>} Resposta
 */
async function processTextMessage(payload, groupId, userId) {
  const texto = payload.conteudo || payload.content || payload.text || '';
  
  // Verifica se é comando de fechar viagem
  if (isCloseTripCommand(texto)) {
    const report = generateReport(groupId, userId);
    // Adiciona link para PDF no relatório
    const pdfUrl = `/pdf?grupo=${encodeURIComponent(groupId)}&remetente=${encodeURIComponent(userId)}`;
    return `${report}\n\n📄 Baixar PDF: ${pdfUrl}`;
  }
  
  // Tenta identificar categoria
  const category = parseCategory(texto);
  
  if (category) {
    setCategory(groupId, userId, category);
    return `✅ Categoria "${category}" definida! Agora envie a imagem do comprovante.`;
  }
  
  // Se não for categoria nem comando, retorna ajuda
  return `ℹ️ Para registrar um gasto:
1️⃣ Envie a categoria: "transporte" ou "comida"
2️⃣ Envie a imagem do comprovante
3️⃣ Para ver o relatório, envie: "fechar viagem"`;
}

/**
 * Processa mensagem de áudio
 * @param {object} payload - Payload do webhook
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {Promise<string>} Resposta
 */
async function processAudioMessage(payload, groupId, userId) {
  // TODO: Implementar transcrição de áudio
  // Por enquanto, retorna mensagem informando que precisa ser texto
  
  log('Áudio recebido - transcrição não implementada ainda');
  
  return `ℹ️ Transcrição de áudio ainda não está disponível.
Por favor, envie a categoria por texto: "transporte" ou "comida"`;
}

/**
 * Processa mensagem de imagem
 * @param {object} payload - Payload do webhook
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {Promise<string>} Resposta
 */
async function processImageMessage(payload, groupId, userId) {
  // Verifica se há categoria definida
  const category = getCategory(groupId, userId);
  
  if (!category) {
    return `❌ Nenhuma categoria definida!
Por favor, envie primeiro a categoria: "transporte" ou "comida"`;
  }
  
  // Obtém a imagem do payload
  // Pode vir como URL, base64, ou buffer
  let imageBuffer = null;
  let imagePath = null;
  
  if (payload.imagem) {
    // Se for base64
    if (typeof payload.imagem === 'string' && payload.imagem.startsWith('data:')) {
      const base64Data = payload.imagem.split(',')[1];
      imageBuffer = Buffer.from(base64Data, 'base64');
    } else if (Buffer.isBuffer(payload.imagem)) {
      imageBuffer = payload.imagem;
    }
  }
  
  // Se tiver URL, baixa a imagem
  if (payload.url || payload.imageUrl) {
    try {
      const imageUrl = payload.url || payload.imageUrl;
      imageBuffer = await downloadImage(imageUrl);
    } catch (error) {
      log('Erro ao baixar imagem da URL:', error);
      return '❌ Erro ao processar a imagem. Verifique se a URL é válida.';
    }
  }
  
  // Se não tiver imagem, retorna erro
  if (!imageBuffer) {
    log('Imagem não encontrada no payload');
    return '❌ Imagem não encontrada no payload. Verifique o formato do webhook.';
  }
  
  // Salva imagem temporariamente (opcional, para debug)
  try {
    await fs.mkdir(UPLOADS_DIR, { recursive: true });
    imagePath = join(UPLOADS_DIR, `${Date.now()}_${userId}.jpg`);
    await fs.writeFile(imagePath, imageBuffer);
  } catch (error) {
    log('Erro ao salvar imagem:', error);
    // Continua mesmo se não conseguir salvar
  }
  
  // Processa OCR
  const value = await extractValueFromImage(imageBuffer, imagePath);
  
  if (!value || value <= 0) {
    clearCategory(groupId, userId);
    return '❌ Não foi possível extrair o valor da imagem. Tente novamente com uma imagem mais clara.';
  }
  
  // Registra o gasto
  await addExpense(groupId, userId, category, value);
  
  // Limpa a categoria após processar
  clearCategory(groupId, userId);
  
  return `✅ Gasto registrado!
📋 Categoria: ${category}
💰 Valor: R$ ${value.toFixed(2)}

Envie outra categoria ou "fechar viagem" para ver o relatório.`;
}

/**
 * Baixa uma imagem de uma URL usando módulos nativos http/https
 * @param {string} imageUrl - URL da imagem
 * @returns {Promise<Buffer>} Buffer da imagem
 */
function downloadImage(imageUrl) {
  return new Promise((resolve, reject) => {
    try {
      const url = new URL(imageUrl);
      const client = url.protocol === 'https:' ? https : http;
      
      const request = client.get(url, (response) => {
        // Verifica status code
        if (response.statusCode < 200 || response.statusCode >= 300) {
          reject(new Error(`HTTP ${response.statusCode}: ${response.statusMessage}`));
          return;
        }
        
        // Coleta os chunks da resposta
        const chunks = [];
        response.on('data', (chunk) => {
          chunks.push(chunk);
        });
        
        response.on('end', () => {
          const buffer = Buffer.concat(chunks);
          resolve(buffer);
        });
        
        response.on('error', (error) => {
          reject(error);
        });
      });
      
      request.on('error', (error) => {
        reject(error);
      });
      
      request.setTimeout(30000, () => {
        request.destroy();
        reject(new Error('Timeout ao baixar imagem'));
      });
      
    } catch (error) {
      reject(error);
    }
  });
}
