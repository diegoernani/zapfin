/**
 * Servidor HTTP nativo do Node.js
 * Recebe webhooks do WhatsApp e processa mensagens
 */

import http from 'http';
import url from 'url';
import { processMessage } from './webhook.js';
import { initialize as initExpenses } from './expenses.js';
import { log } from './utils.js';
import { IncomingForm } from 'formidable';
import { generatePDF } from './pdf.js';
import { getSenderId, getGroupId } from './utils.js';

const PORT = process.env.PORT || 3000;

/**
 * Inicializa o servidor
 */
async function startServer() {
  // Inicializa módulos
  await initExpenses();
  
  // Cria servidor HTTP
  const server = http.createServer(async (req, res) => {
    // Configura CORS básico
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    // Trata preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    const parsedUrl = url.parse(req.url, true);
    const path = parsedUrl.pathname;
    const method = req.method;
    
    log(`${method} ${path}`);
    
    // Rota de health check
    if (path === '/health' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ status: 'ok', timestamp: new Date().toISOString() }));
      return;
    }
    
    // Rota principal do webhook
    if (path === '/webhook' && method === 'POST') {
      await handleWebhook(req, res);
      return;
    }
    
    // Rota para gerar PDF do relatório
    if (path === '/pdf' && method === 'GET') {
      await handlePDFRequest(req, res, parsedUrl);
      return;
    }
    
    // Rota de exemplo/documentação
    if (path === '/' && method === 'GET') {
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(getDocumentationHTML());
      return;
    }
    
    // Rota não encontrada
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Rota não encontrada' }));
  });
  
  server.listen(PORT, () => {
    log(`🚀 Servidor rodando em http://localhost:${PORT}`);
    log(`📡 Webhook disponível em http://localhost:${PORT}/webhook`);
    log(`❤️  Health check em http://localhost:${PORT}/health`);
  });
  
  // Tratamento de erros
  server.on('error', (error) => {
    log('Erro no servidor:', error);
    process.exit(1);
  });
}

/**
 * Processa requisição de webhook
 * @param {object} req - Request object
 * @param {object} res - Response object
 */
async function handleWebhook(req, res) {
  try {
    let payload = null;
    const contentType = req.headers['content-type'] || '';
    
    // Processa JSON
    if (contentType.includes('application/json')) {
      let body = '';
      
      req.on('data', chunk => {
        body += chunk.toString();
      });
      
      req.on('end', async () => {
        try {
          payload = JSON.parse(body);
          const response = await processMessage(payload);
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: true, 
            response,
            received: payload 
          }));
        } catch (error) {
          log('Erro ao processar JSON:', error);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'Erro ao processar payload JSON' 
          }));
        }
      });
      
      return;
    }
    
    // Processa form-data (para upload de imagens)
    if (contentType.includes('multipart/form-data')) {
      const form = new IncomingForm({
        keepExtensions: true,
        maxFileSize: 10 * 1024 * 1024 // 10MB
      });
      
      form.parse(req, async (err, fields, files) => {
        if (err) {
          log('Erro ao processar form-data:', err);
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            success: false, 
            error: 'Erro ao processar form-data' 
          }));
          return;
        }
        
        // Constrói payload a partir dos campos do form
        payload = {
          tipo: fields.tipo || fields.type || 'imagem',
          grupo: fields.grupo || fields.group || 'default',
          remetente: fields.remetente || fields.from || 'unknown',
          imagem: files.imagem || files.image || null
        };
        
        // Se tiver arquivo, lê como buffer
        if (payload.imagem && payload.imagem.filepath) {
          const fs = await import('fs/promises');
          payload.imagem = await fs.readFile(payload.imagem.filepath);
        }
        
        const response = await processMessage(payload);
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          success: true, 
          response 
        }));
      });
      
      return;
    }
    
    // Content-Type não suportado
    res.writeHead(400, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false, 
      error: 'Content-Type não suportado. Use application/json ou multipart/form-data' 
    }));
    
  } catch (error) {
    log('Erro ao processar webhook:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      success: false, 
      error: 'Erro interno do servidor' 
    }));
  }
}

/**
 * Processa requisição de PDF
 * @param {object} req - Request object
 * @param {object} res - Response object
 * @param {object} parsedUrl - URL parseada
 */
async function handlePDFRequest(req, res, parsedUrl) {
  try {
    const query = parsedUrl.query;
    const groupId = query.grupo || query.group || 'default';
    const userId = query.remetente || query.user || query.userId || 'unknown';
    
    if (!groupId || !userId) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Parâmetros obrigatórios: grupo e remetente' 
      }));
      return;
    }
    
    log(`Gerando PDF para grupo=${groupId}, usuário=${userId}`);
    
    const pdfBuffer = await generatePDF(groupId, userId);
    const fileName = `relatorio-viagem-${groupId}-${Date.now()}.pdf`;
    
    res.writeHead(200, {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="${fileName}"`,
      'Content-Length': pdfBuffer.length
    });
    
    res.end(pdfBuffer);
    
  } catch (error) {
    log('Erro ao gerar PDF:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      error: 'Erro ao gerar PDF',
      message: error.message 
    }));
  }
}

/**
 * Retorna HTML de documentação
 * @returns {string} HTML
 */
function getDocumentationHTML() {
  return `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ZapFin - API</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 800px;
      margin: 0 auto;
      padding: 20px;
      background: #f5f5f5;
    }
    .container {
      background: white;
      padding: 30px;
      border-radius: 8px;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    h1 { color: #25D366; }
    h2 { color: #333; margin-top: 30px; }
    code {
      background: #f4f4f4;
      padding: 2px 6px;
      border-radius: 3px;
      font-family: 'Courier New', monospace;
    }
    pre {
      background: #f4f4f4;
      padding: 15px;
      border-radius: 5px;
      overflow-x: auto;
    }
    .endpoint {
      background: #e8f5e9;
      padding: 10px;
      border-left: 4px solid #25D366;
      margin: 10px 0;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>💰 ZapFin - API</h1>
    <p>Sistema de controle de gastos via WhatsApp usando webhooks.</p>
    
    <h2>🔗 Endpoints</h2>
    
    <div class="endpoint">
      <strong>POST /webhook</strong><br>
      Recebe mensagens do WhatsApp
    </div>
    
    <div class="endpoint">
      <strong>GET /health</strong><br>
      Health check do servidor
    </div>
    
    <h2>📥 Formato do Webhook</h2>
    <p>Envie um POST para <code>/webhook</code> com Content-Type: <code>application/json</code></p>
    
    <h3>Exemplo: Mensagem de Texto</h3>
    <pre>{
  "tipo": "texto",
  "conteudo": "transporte",
  "grupo": "grupo-123",
  "remetente": "5511999999999"
}</pre>
    
    <h3>Exemplo: Mensagem de Imagem</h3>
    <pre>{
  "tipo": "imagem",
  "url": "https://exemplo.com/imagem.jpg",
  "grupo": "grupo-123",
  "remetente": "5511999999999"
}</pre>
    
    <h3>Exemplo: Fechar Viagem</h3>
    <pre>{
  "tipo": "texto",
  "conteudo": "fechar viagem",
  "grupo": "grupo-123",
  "remetente": "5511999999999"
}</pre>
    
    <h2>📤 Resposta</h2>
    <pre>{
  "success": true,
  "response": "✅ Categoria 'transporte' definida! Agora envie a imagem do comprovante."
}</pre>
    
    <h2>🔄 Fluxo de Uso</h2>
    <ol>
      <li>Usuário envia categoria: "transporte" ou "comida"</li>
      <li>Sistema confirma e aguarda imagem</li>
      <li>Usuário envia imagem do comprovante</li>
      <li>Sistema extrai valor via OCR e registra</li>
      <li>Usuário pode enviar "fechar viagem" para ver relatório</li>
    </ol>
  </div>
</body>
</html>`;
}

// Inicia o servidor
startServer().catch(error => {
  log('Erro fatal ao iniciar servidor:', error);
  process.exit(1);
});
