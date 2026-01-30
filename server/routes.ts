import type { Express } from "express";
import type { Server } from "http";
import { storage } from "./storage";
import { api } from "@shared/routes";
import { z } from "zod";

// Helper to format currency
const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value);
};

// Mock OCR function
const processOcr = async (imageUrl: string): Promise<number> => {
  // Simulate processing delay
  await new Promise(resolve => setTimeout(resolve, 500));
  // Return random value between 10 and 200
  return Number((Math.random() * 190 + 10).toFixed(2));
};

// Normalize text for command matching
const normalizeText = (text: string) => text.toLowerCase().trim();

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  // === WEBHOOK ENDPOINT ===
  app.post(api.webhook.process.path, async (req, res) => {
    try {
      // Evolution API can send different event types. 
      // For this MVP, we simplify and check if it's a message event.
      // Format can vary, so we'll be flexible.
      const payload = req.body;
      
      // Evolution API message payload usually has:
      // data.message.conversation (for text)
      // data.message.imageMessage (for images)
      // data.key.remoteJid (for groupId/userId)
      // data.pushName (sender name)
      
      const messageData = payload.data || payload;
      const remoteJid = messageData.key?.remoteJid || payload.remetente || "default";
      const pushName = messageData.pushName || payload.remetente || "unknown";
      
      let tipo: 'texto' | 'imagem' | 'audio' = 'texto';
      let conteudo = "";
      let url = "";

      if (messageData.message?.conversation) {
        tipo = 'texto';
        conteudo = messageData.message.conversation;
      } else if (messageData.message?.imageMessage) {
        tipo = 'imagem';
        // Note: Evolution API usually provides a way to download the image. 
        // For the webhook simulation and external images, we still expect a 'url'.
        url = payload.url || ""; 
      } else if (payload.tipo) {
        // Fallback to our internal format for testing
        tipo = payload.tipo;
        conteudo = payload.conteudo;
        url = payload.url;
      }
      
      const grupo = remoteJid;
      const remetente = remoteJid;
      
      let responseText = "";

      // 1. Handle TEXT messages
      if (tipo === 'texto' && conteudo) {
        const text = normalizeText(conteudo);

        // A. Check for "fechar viagem" (Report)
        if (text.includes('fechar') || text.includes('relatorio')) {
          const expenses = await storage.getExpensesByGroupAndUser(grupo, remetente);
          
          if (expenses.length === 0) {
            responseText = `📍 RELATÓRIO DA VIAGEM\n\nNenhum gasto registrado ainda para este grupo.`;
          } else {
            const stats = expenses.reduce((acc, curr) => {
              const val = Number(curr.amount);
              acc.total += val;
              acc.byCategory[curr.category] = (acc.byCategory[curr.category] || 0) + val;
              return acc;
            }, { total: 0, byCategory: {} as Record<string, number> });

            const categoryLines = Object.entries(stats.byCategory)
              .map(([cat, val]) => `▫️ ${cat}: ${formatCurrency(val)}`)
              .join('\n');

            responseText = `📍 RELATÓRIO DA VIAGEM\n\n${categoryLines}\n\n💰 Total geral: ${formatCurrency(stats.total)}`;
          }
        } 
        // B. Check for Category definitions
        else {
          // Simple category detection
          let category = null;
          if (text.includes('transporte')) category = 'transporte';
          else if (text.includes('comida') || text.includes('alimentação')) category = 'comida';
          else if (text.includes('hospedagem')) category = 'hospedagem';
          else if (text.includes('outros')) category = 'outros';
          // Allow setting any single word as category if it's not a known command
          else if (text.split(' ').length === 1 && text.length > 2) category = text;

          if (category) {
            await storage.setUserState({
              groupId: grupo,
              userId: remetente,
              currentCategory: category
            });
            responseText = `✅ Categoria "${category}" definida! Agora envie a imagem do comprovante.`;
          } else {
            responseText = `ℹ️ Para registrar um gasto:\n1️⃣ Envie a categoria (ex: "transporte", "comida")\n2️⃣ Envie a imagem do comprovante\n3️⃣ Para ver o relatório, envie: "fechar viagem"`;
          }
        }
      }

      // 2. Handle IMAGE messages
      else if (tipo === 'imagem' && url) {
        const state = await storage.getUserState(grupo, remetente);

        if (!state || !state.currentCategory) {
          responseText = `❌ Nenhuma categoria definida!\nPor favor, envie primeiro a categoria (ex: "transporte", "comida") e depois a imagem.`;
        } else {
          // Process "OCR"
          const amount = await processOcr(url);
          const category = state.currentCategory;

          await storage.createExpense({
            groupId: grupo,
            userId: remetente,
            category: category,
            amount: amount.toString(), // Store as string for numeric type
            imageUrl: url,
          });

          // Clear state
          await storage.clearUserState(grupo, remetente);

          responseText = `✅ Gasto registrado!\n📋 Categoria: ${category}\n💰 Valor: ${formatCurrency(amount)}\n\nEnvie outra categoria ou "fechar viagem".`;
        }
      }

      // 3. Handle AUDIO (Placeholder)
      else if (tipo === 'audio') {
        responseText = `ℹ️ Áudio recebido. Transcrição ainda não disponível. Por favor, use texto para definir categorias.`;
      }

      // Fallback
      else {
        responseText = `❌ Formato de mensagem não compreendido. Envie texto ou imagem.`;
      }

      res.json({
        success: true,
        response: responseText
      });

    } catch (err) {
      console.error("Webhook Error:", err);
      if (err instanceof z.ZodError) {
        res.status(400).json({
          success: false,
          response: "Erro de validação: " + err.errors[0].message
        });
      } else {
        res.status(500).json({
          success: false,
          response: "Erro interno no servidor."
        });
      }
    }
  });

  // === DASHBOARD API ===
  app.get(api.expenses.list.path, async (req, res) => {
    const filters = {
      groupId: req.query.groupId as string,
      userId: req.query.userId as string,
      category: req.query.category as string,
    };
    const expenses = await storage.getExpenses(filters);
    res.json(expenses);
  });

  app.get(api.expenses.stats.path, async (req, res) => {
    const filters = {
      groupId: req.query.groupId as string,
    };
    const expenses = await storage.getExpenses(filters);
    
    const stats = expenses.reduce((acc, curr) => {
      const val = Number(curr.amount);
      acc.total += val;
      acc.byCategory[curr.category] = (acc.byCategory[curr.category] || 0) + val;
      return acc;
    }, { total: 0, byCategory: {} as Record<string, number> });

    res.json(stats);
  });

  // === SEED DATA ===
  const existing = await storage.getExpenses();
  if (existing.length === 0) {
    console.log("Seeding data...");
    await storage.createExpense({
      groupId: "demo-group",
      userId: "5511999999999",
      category: "transporte",
      amount: "45.50",
      imageUrl: "https://placehold.co/600x400/png?text=Uber+Receipt",
    });
    await storage.createExpense({
      groupId: "demo-group",
      userId: "5511999999999",
      category: "comida",
      amount: "120.00",
      imageUrl: "https://placehold.co/600x400/png?text=Lunch+Receipt",
    });
     await storage.createExpense({
      groupId: "demo-group",
      userId: "5511999999999",
      category: "hospedagem",
      amount: "850.00",
      imageUrl: "https://placehold.co/600x400/png?text=Hotel+Invoice",
    });
    console.log("Data seeded.");
  }

  return httpServer;
}
