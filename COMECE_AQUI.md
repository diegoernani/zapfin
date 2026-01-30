# 🚀 COMECE AQUI - Guia de Início Rápido

## 📋 O Que Você Precisa

### ✅ **Obrigatório:**
1. **Conta no Evolution API** (ou similar) - para receber mensagens do WhatsApp
2. **Conta em um serviço de hospedagem** (Glitch, Replit, etc.) - para rodar o servidor

### ❌ **NÃO precisa:**
- Instalar nada no seu computador
- Conhecimento técnico avançado
- Pagar por nada (tudo gratuito)

---

## 🎯 Passo a Passo Completo

### **ETAPA 1: Criar Conta no Glitch (Hospedagem)**

**Glitch é o mais fácil para começar!**

1. **Acesse:** https://glitch.com
2. **Clique em "Sign In"** (canto superior direito)
3. **Escolha uma forma de login:**
   - GitHub (recomendado se você tem)
   - Google
   - Email
4. **Pronto!** Conta criada (gratuito)

**⏱️ Tempo:** 2 minutos

---

### **ETAPA 2: Criar Projeto no Glitch**

1. **No Glitch, clique em "New Project"**
2. **Escolha "Import from GitHub"** (se você tem GitHub)
   - OU escolha "hello-express" (qualquer template serve)
3. **Aguarde o projeto carregar**

**⏱️ Tempo:** 1 minuto

---

### **ETAPA 3: Enviar Seus Arquivos para o Glitch**

#### **Opção A: Via Interface do Glitch (Mais Fácil)**

1. **No projeto do Glitch, você verá arquivos à esquerda**
2. **Delete os arquivos padrão** (se houver)
3. **Crie a pasta `src`:**
   - Clique no "+" ao lado de "Files"
   - Escolha "New Folder"
   - Nome: `src`
4. **Adicione os arquivos um por um:**
   - Clique em "+" → "New File"
   - Cole o conteúdo de cada arquivo:

**Arquivos necessários:**

**Na raiz:**
- `package.json`
- `glitch.json`

**Na pasta `src/`:**
- `server.js`
- `webhook.js`
- `state.js`
- `ocr.js`
- `expenses.js`
- `report.js`
- `utils.js`

5. **Copie e cole o conteúdo de cada arquivo** do seu projeto local

#### **Opção B: Via GitHub (Mais Rápido se você tem GitHub)**

1. **Crie um repositório no GitHub**
2. **Envie todos os arquivos do projeto**
3. **No Glitch, use "Import from GitHub"**
4. **Cole a URL do seu repositório**

**⏱️ Tempo:** 5-10 minutos

---

### **ETAPA 4: Glitch Instala Tudo Automaticamente**

1. **O Glitch detecta o `package.json`**
2. **Instala dependências automaticamente** (aparece no console)
3. **Inicia o servidor automaticamente**
4. **Você verá uma URL** tipo: `https://seu-projeto.glitch.me`

**✅ Seu servidor está rodando!**

**⏱️ Tempo:** 1-2 minutos (automático)

---

### **ETAPA 5: Testar se Está Funcionando**

1. **Copie a URL do seu projeto** (ex: `https://seu-projeto.glitch.me`)
2. **Abra no navegador:** `https://seu-projeto.glitch.me/health`
3. **Deve aparecer:**
   ```json
   {
     "status": "ok",
     "timestamp": "..."
   }
   ```
4. **Se aparecer isso, está funcionando! ✅**

**⏱️ Tempo:** 30 segundos

---

### **ETAPA 6: Criar Conta no Evolution API**

**Evolution API é o serviço que conecta com WhatsApp**

1. **Acesse:** https://evolution-api.com
2. **Clique em "Sign Up" ou "Criar Conta"**
3. **Preencha o cadastro** (email, senha, etc.)
4. **Confirme o email** (se solicitado)
5. **Faça login**

**⏱️ Tempo:** 3-5 minutos

---

### **ETAPA 7: Conectar WhatsApp na Evolution API**

1. **No painel da Evolution API, procure por:**
   - "Instâncias" ou "Instances"
   - "Criar Instância" ou "Create Instance"
2. **Crie uma nova instância:**
   - Nome: qualquer (ex: "minha-instancia")
   - Tipo: WhatsApp
3. **Escaneie o QR Code** com seu WhatsApp:
   - Abra WhatsApp no celular
   - Configurações → Aparelhos conectados → Conectar um aparelho
   - Escaneie o QR Code que aparece na tela
4. **Aguarde conectar** (pode levar alguns segundos)

**✅ WhatsApp conectado!**

**⏱️ Tempo:** 2-3 minutos

---

### **ETAPA 8: Configurar Webhook na Evolution API**

**Aqui você conecta o WhatsApp com seu servidor!**

1. **No painel da Evolution API, procure por:**
   - "Webhooks" ou "Configurações"
   - "Webhook URL" ou "Callback URL"
2. **Cole a URL do seu servidor Glitch:**
   ```
   https://seu-projeto.glitch.me/webhook
   ```
   (Substitua `seu-projeto` pelo nome real do seu projeto)
3. **Salve as configurações**

**✅ Webhook configurado!**

**⏱️ Tempo:** 1 minuto

---

### **ETAPA 9: Testar no WhatsApp**

1. **Crie um grupo no WhatsApp** (ou use um existente)
2. **Adicione o número do bot** (o número conectado na Evolution API)
3. **Envie uma mensagem de teste:**
   ```
   transporte
   ```
4. **O bot deve responder:**
   ```
   ✅ Categoria "transporte" definida! Agora envie a imagem do comprovante.
   ```

**✅ Está funcionando!**

**⏱️ Tempo:** 1 minuto

---

## 📊 Resumo dos Cadastros Necessários

| Serviço | O que é | É pago? | Obrigatório? |
|---------|---------|---------|--------------|
| **Glitch** | Hospeda seu servidor | ❌ Gratuito | ✅ Sim |
| **Evolution API** | Conecta com WhatsApp | ❌ Gratuito (plano básico) | ✅ Sim |
| **GitHub** | Para enviar código (opcional) | ❌ Gratuito | ❌ Não |

---

## 🎯 Checklist de Início

Marque conforme for completando:

- [ ] Conta criada no Glitch
- [ ] Projeto criado no Glitch
- [ ] Arquivos enviados para o Glitch
- [ ] Servidor rodando (teste em `/health`)
- [ ] Conta criada no Evolution API
- [ ] WhatsApp conectado na Evolution API
- [ ] Webhook configurado (URL do Glitch)
- [ ] Teste no WhatsApp funcionando

---

## 🆘 Problemas Comuns

### **"Servidor não está respondendo"**
- Verifique se o Glitch está rodando (veja o console)
- Verifique se copiou todos os arquivos corretamente
- Veja se há erros no console do Glitch

### **"Webhook não está funcionando"**
- Verifique se a URL está correta: `https://seu-projeto.glitch.me/webhook`
- Teste a URL no navegador (deve retornar erro 404, mas não erro de conexão)
- Verifique se o servidor está rodando no Glitch

### **"Bot não responde no WhatsApp"**
- Verifique se o número do bot está no grupo
- Verifique se o webhook está configurado corretamente
- Veja os logs no Glitch (aba "Logs")

### **"Não consigo conectar WhatsApp"**
- Tente gerar novo QR Code
- Verifique se o WhatsApp está atualizado
- Aguarde alguns minutos e tente novamente

---

## 📞 Próximos Passos

Depois que tudo estiver funcionando:

1. **Teste o fluxo completo:**
   - Envie "transporte"
   - Envie uma imagem
   - Envie "fechar viagem"

2. **Personalize se quiser:**
   - Edite mensagens em `src/webhook.js`
   - Adicione mais categorias
   - Mude o formato do relatório

3. **Implemente OCR real:**
   - Edite `src/ocr.js`
   - Integre com Google Vision ou Tesseract

---

## ⏱️ Tempo Total Estimado

- **Iniciante:** 20-30 minutos
- **Com experiência:** 10-15 minutos

**Vale a pena! Depois está tudo configurado e funcionando!** 🚀

---

## 💡 Dica Extra

**Para testar sem WhatsApp primeiro:**

1. Abra `test-local.html` no navegador
2. Teste todo o fluxo localmente
3. Depois configure o webhook real

Isso ajuda a entender como funciona antes de conectar com WhatsApp!
