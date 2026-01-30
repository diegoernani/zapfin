/**
 * Módulo de geração de PDF
 * Gera relatórios em formato PDF
 */

import PDFDocument from 'pdfkit';
import { getExpenseStats } from './expenses.js';
import { formatCurrency } from './utils.js';

/**
 * Gera PDF do relatório de gastos
 * @param {string} groupId - ID do grupo
 * @param {string} userId - ID do usuário
 * @returns {Promise<Buffer>} Buffer do PDF gerado
 */
export async function generatePDF(groupId, userId) {
  return new Promise((resolve, reject) => {
    try {
      const stats = getExpenseStats(groupId, userId);
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 }
      });
      
      const buffers = [];
      doc.on('data', buffers.push.bind(buffers));
      doc.on('end', () => {
        const pdfBuffer = Buffer.concat(buffers);
        resolve(pdfBuffer);
      });
      doc.on('error', reject);
      
      // Título
      doc.fontSize(24)
         .fillColor('#25D366') // Verde WhatsApp
         .text('RELATÓRIO DA VIAGEM', { align: 'center' })
         .moveDown(0.5);
      
      // Data
      const dataAtual = new Date().toLocaleDateString('pt-BR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
      doc.fontSize(10)
         .fillColor('#666666')
         .text(`Gerado em: ${dataAtual}`, { align: 'center' })
         .moveDown(1);
      
      // Linha separadora
      doc.strokeColor('#CCCCCC')
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke()
         .moveDown(1);
      
      // Categorias
      doc.fontSize(14)
         .fillColor('#000000');
      
      // Alimentação
      doc.text('🍔 Alimentação', { continued: true })
         .text(formatCurrency(stats.comida), { align: 'right' })
         .moveDown(0.8);
      
      // Transporte
      doc.text('🚗 Transporte', { continued: true })
         .text(formatCurrency(stats.transporte), { align: 'right' })
         .moveDown(1.5);
      
      // Linha separadora
      doc.strokeColor('#CCCCCC')
         .moveTo(50, doc.y)
         .lineTo(545, doc.y)
         .stroke()
         .moveDown(1);
      
      // Total
      doc.fontSize(18)
         .font('Helvetica-Bold')
         .fillColor('#000000')
         .text('💰 Total Geral', { continued: true })
         .text(formatCurrency(stats.geral), { align: 'right' });
      
      // Rodapé
      doc.fontSize(8)
         .font('Helvetica')
         .fillColor('#999999')
         .text('ZapFin - Sistema de Controle de Gastos', 
               50, doc.page.height - 50, { align: 'center' });
      
      doc.end();
    } catch (error) {
      reject(error);
    }
  });
}
