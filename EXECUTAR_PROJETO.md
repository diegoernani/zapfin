# 🚀 Como Executar o ZapFin

## ⚠️ Como você não pode instalar nada no computador

Execute o projeto no **Replit** (ou outro serviço online).

---

## 📋 Passo a Passo no Replit

### **1. Acesse seu Replit**
- Vá para: https://replit.com
- Faça login
- Abra o projeto `file-helper` (ou crie um novo)

### **2. Envie os Arquivos**

**Opção A: Via Interface do Replit**
1. No Replit, delete os arquivos antigos (se houver)
2. Crie as pastas: `client`, `server`, `shared`, `script`
3. Copie e cole os arquivos de cada pasta:
   - `client/` → todos os arquivos de `client/`
   - `server/` → todos os arquivos de `server/`
   - `shared/` → todos os arquivos de `shared/`
   - `script/` → todos os arquivos de `script/`
4. Copie os arquivos da raiz:
   - `package.json`
   - `tsconfig.json`
   - `vite.config.ts`
   - `drizzle.config.ts`
   - `tailwind.config.ts`
   - `postcss.config.js`
   - `components.json`

**Opção B: Via GitHub (Mais Rápido)**
1. Envie o projeto para o GitHub
2. No Replit: "Import from GitHub"
3. Cole a URL do repositório

### **3. Configure o Banco de Dados**

No Replit:
1. Vá em "Database" (ou crie um PostgreSQL)
2. Copie a `DATABASE_URL` fornecida
3. Vá em "Secrets" (ícone de cadeado)
4. Adicione: `DATABASE_URL` = valor copiado

### **4. Instale e Execute**

No Console do Replit:

```bash
# Instalar dependências
npm install

# Criar tabelas no banco
npm run db:push

# Executar em desenvolvimento
npm run dev
```

### **5. Acesse**

O Replit mostrará uma URL tipo:
- `https://seu-projeto.repl.co`

Acesse essa URL no navegador!

---

## 🔧 Variáveis de Ambiente Necessárias

No Replit → Secrets, configure:

```
DATABASE_URL=postgresql://user:pass@host:port/db
PORT=5000 (opcional, Replit usa automático)
```

---

## ✅ Verificar se Está Funcionando

1. Acesse a URL do Replit
2. Você deve ver a página inicial com o simulador
3. Teste enviando uma mensagem no simulador
4. Acesse `/dashboard` para ver os gastos

---

## 🆘 Problemas Comuns

### **"DATABASE_URL must be set"**
- Configure a variável `DATABASE_URL` no Secrets do Replit

### **"Cannot find module"**
- Execute `npm install` novamente

### **"Port already in use"**
- Replit gerencia a porta automaticamente, ignore esse erro

### **"Table does not exist"**
- Execute `npm run db:push` para criar as tabelas

---

## 📝 Nota

O projeto está **100% pronto** e organizado. Só precisa:
1. Enviar para o Replit
2. Configurar o banco
3. Executar `npm install` e `npm run dev`

**Tudo funcionará perfeitamente!** 🚀
