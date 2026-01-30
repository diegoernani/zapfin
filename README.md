# 💰 ZapFin - Sistema de Controle de Gastos via WhatsApp

Sistema completo full-stack para controle de gastos via WhatsApp com **dashboard web moderno**, desenvolvido em TypeScript.

## 🎯 O Que É o ZapFin?

O ZapFin é uma aplicação completa que permite:
- ✅ Receber mensagens do WhatsApp via webhook (Evolution API)
- ✅ Processar categorias de gastos automaticamente
- ✅ Extrair valores de comprovantes (OCR)
- ✅ Visualizar gastos em um **dashboard web moderno**
- ✅ Gerar relatórios e estatísticas

## 🏗️ Arquitetura

### **Full-Stack Moderno**

```
zapfin/
├── client/          # Frontend React + TypeScript
│   ├── src/
│   │   ├── pages/   # Páginas (Home, Dashboard, Setup)
│   │   ├── components/  # Componentes UI (shadcn/ui)
│   │   └── hooks/   # React Hooks
│   └── public/
│
├── server/          # Backend Express + TypeScript
│   ├── index.ts     # Servidor principal
│   ├── routes.ts    # Rotas da API
│   ├── storage.ts   # Camada de dados
│   └── db.ts        # Conexão com banco
│
├── shared/          # Código compartilhado
│   ├── schema.ts    # Schemas do banco (Drizzle ORM)
│   └── routes.ts    # Definições de rotas
│
└── script/          # Scripts de build
```

### **Tecnologias**

**Frontend:**
- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS
- shadcn/ui (componentes)
- React Query (data fetching)
- Recharts (gráficos)

**Backend:**
- Express.js + TypeScript
- PostgreSQL (via Drizzle ORM)
- WebSocket (opcional)

**Banco de Dados:**
- PostgreSQL
- Drizzle ORM

## 🚀 Como Usar

### **1. Pré-requisitos**

- Node.js 18+
- PostgreSQL (ou banco fornecido pelo Replit/Glitch)
- Conta no Evolution API (para WhatsApp)

### **2. Instalação**

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
# Crie um arquivo .env:
DATABASE_URL=postgresql://user:password@host:port/database
PORT=5000
```

### **3. Configurar Banco de Dados**

```bash
# Criar tabelas no banco
npm run db:push
```

### **4. Executar**

```bash
# Desenvolvimento
npm run dev

# Produção
npm run build
npm start
```

### **5. Acessar**

- **Frontend:** http://localhost:5000
- **API:** http://localhost:5000/api
- **Webhook:** http://localhost:5000/api/webhook

## 📡 Configuração do Webhook

### **Evolution API**

Configure o webhook no painel da Evolution API:

```
URL: https://seu-servidor.com/api/webhook
Eventos: MESSAGES_UPSERT
```

### **Formato Esperado**

O sistema aceita dois formatos:

**1. Formato Evolution API (Real):**
```json
{
  "data": {
    "key": {
      "remoteJid": "120363025841234567@g.us"
    },
    "message": {
      "conversation": "transporte"
    },
    "pushName": "5511999999999"
  }
}
```

**2. Formato Simplificado (Teste):**
```json
{
  "tipo": "texto",
  "conteudo": "transporte",
  "grupo": "grupo-123",
  "remetente": "5511999999999"
}
```

## 🎨 Dashboard Web

O ZapFin inclui um **dashboard web completo** com:

- 📊 **Estatísticas em tempo real**
- 📈 **Gráficos de gastos por categoria**
- 📝 **Lista de transações**
- 🔍 **Filtros por categoria**
- 🖼️ **Visualização de comprovantes**
- 🧪 **Simulador de webhook integrado**

### **Páginas:**

- **/** - Simulador de webhook (teste sem WhatsApp)
- **/dashboard** - Dashboard com estatísticas
- **/setup** - Guia de configuração

## 📋 Funcionalidades

### **1. Processamento de Mensagens**

- **Texto:** Detecta categorias automaticamente
  - "transporte", "comida", "hospedagem", etc.
  - Aceita valores: "gastei 50 reais no almoço"
  
- **Imagem:** Processa comprovantes
  - Extrai valor via OCR (mock inicialmente)
  - Associa à última categoria informada

- **Comandos:**
  - "fechar viagem" - Gera relatório

### **2. Dashboard**

- Visualização de todos os gastos
- Estatísticas por categoria
- Gráficos interativos
- Filtros e busca

### **3. API REST**

```typescript
// Listar gastos
GET /api/expenses?groupId=xxx&userId=xxx&category=xxx

// Estatísticas
GET /api/expenses/stats?groupId=xxx

// Webhook
POST /api/webhook
```

## 🗄️ Banco de Dados

### **Tabelas:**

**expenses:**
- id, groupId, userId, category, amount, imageUrl, createdAt

**user_states:**
- id, groupId, userId, currentCategory, lastInteraction

## 🌐 Hospedagem

### **Replit (Recomendado)**

1. Importe o projeto no Replit
2. Configure `DATABASE_URL` nas variáveis de ambiente
3. Execute `npm run db:push`
4. Execute `npm run dev`

### **Render.com / Railway**

1. Conecte seu repositório GitHub
2. Configure `DATABASE_URL` (Render/Railway fornece PostgreSQL)
3. Build: `npm run build`
4. Start: `npm start`

## 📁 Estrutura de Pastas Detalhada

```
zapfin/
├── client/              # Frontend React
│   ├── src/
│   │   ├── pages/      # Páginas da aplicação
│   │   │   ├── home.tsx        # Simulador
│   │   │   ├── dashboard.tsx    # Dashboard principal
│   │   │   └── setup.tsx       # Guia de setup
│   │   ├── components/
│   │   │   ├── layout/         # Layouts
│   │   │   └── ui/             # Componentes UI (48 componentes)
│   │   ├── hooks/              # React Hooks
│   │   └── lib/                # Utilitários
│   └── public/         # Arquivos estáticos
│
├── server/             # Backend Express
│   ├── index.ts        # Servidor principal
│   ├── routes.ts       # Rotas da API
│   ├── storage.ts      # Camada de dados
│   ├── db.ts           # Conexão PostgreSQL
│   ├── static.ts       # Servir arquivos estáticos
│   └── vite.ts         # Configuração Vite (dev)
│
├── shared/             # Código compartilhado
│   ├── schema.ts       # Schemas Drizzle ORM
│   └── routes.ts       # Definições de rotas API
│
├── script/             # Scripts
│   └── build.ts        # Script de build
│
├── legacy/             # Código antigo (JavaScript puro)
│   └── src-old/        # Versão anterior
│
└── ZipFin/             # Backup do projeto Replit
```

## 🔧 Scripts Disponíveis

```bash
npm run dev      # Desenvolvimento (com hot reload)
npm run build    # Build para produção
npm start        # Executar versão de produção
npm run check    # Verificar tipos TypeScript
npm run db:push  # Atualizar schema do banco
```

## 🆕 O Que Mudou da Versão Anterior?

### **Versão 1.0 (Legacy)**
- JavaScript puro
- Sem banco de dados (arquivo JSON)
- Sem interface web
- Apenas webhook

### **Versão 2.0 (Atual)**
- ✅ TypeScript em todo o projeto
- ✅ PostgreSQL com Drizzle ORM
- ✅ Dashboard web completo
- ✅ Interface moderna com React
- ✅ API REST completa
- ✅ Simulador integrado
- ✅ Gráficos e estatísticas

## 📝 Notas Importantes

- ⚠️ **OCR está em modo mock** - retorna valores aleatórios
- ⚠️ **Transcrição de áudio** não implementada ainda
- ✅ **Categorias** são detectadas automaticamente
- ✅ **Estado** é mantido por grupo/usuário no banco
- ✅ **Dashboard** atualiza em tempo real

## 🚧 Melhorias Futuras

- [ ] OCR real (Google Vision, Tesseract)
- [ ] Transcrição de áudio
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] Autenticação e segurança
- [ ] Notificações push
- [ ] Multi-moeda

## 📄 Licença

MIT

## 👤 Autor

Sistema desenvolvido como MVP completo e funcional.

---

**💡 Dica:** Use o simulador na página inicial para testar sem conectar WhatsApp real!
