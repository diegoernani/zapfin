# 🌐 Rodar sem Instalar Nada

Como você não pode instalar nada no computador, aqui estão opções para rodar o sistema **sem instalação local**:

## 🎯 Opção 1: Glitch (Recomendado - Mais Fácil)

**Glitch** é gratuito e já tem Node.js instalado. Não precisa instalar nada!

### Passos:

1. **Acesse:** https://glitch.com
2. **Crie uma conta** (gratuito, pode usar GitHub/Google)
3. **Importe o projeto:**
   - Clique em "New Project" → "Import from GitHub"
   - Ou crie um projeto vazio e cole os arquivos
4. **Cole os arquivos:**
   - Copie todos os arquivos da pasta `src/`
   - Cole o `package.json`
5. **Glitch detecta automaticamente** e instala dependências
6. **O servidor inicia automaticamente!**
7. **Copie a URL** do seu projeto (ex: `https://seu-projeto.glitch.me`)
8. **Configure o webhook** da Evolution API para essa URL + `/webhook`

### Vantagens:
- ✅ Zero instalação
- ✅ HTTPS automático (necessário para webhooks)
- ✅ URL pública permanente
- ✅ Auto-reload ao editar código
- ✅ Gratuito

---

## 🎯 Opção 2: Replit

**Replit** também tem Node.js pré-instalado.

### Passos:

1. **Acesse:** https://replit.com
2. **Crie uma conta** (gratuito)
3. **Crie novo Repl:**
   - Escolha "Node.js" como template
4. **Cole os arquivos** do projeto
5. **Execute:** Clique em "Run"
6. **Copie a URL** do Repl
7. **Configure o webhook** para essa URL + `/webhook`

---

## 🎯 Opção 3: Render.com (Para Produção)

**Render** oferece hospedagem gratuita com Node.js.

### Passos:

1. **Acesse:** https://render.com
2. **Conecte seu GitHub** (ou faça upload dos arquivos)
3. **Crie um "Web Service"**
4. **Configure:**
   - Build Command: `npm install`
   - Start Command: `npm start`
5. **Render cria uma URL** automática (ex: `https://seu-projeto.onrender.com`)
6. **Configure o webhook** para essa URL + `/webhook`

---

## 🎯 Opção 4: Railway.app

Similar ao Render, também gratuito.

1. **Acesse:** https://railway.app
2. **Conecte GitHub** ou faça upload
3. **Deploy automático**
4. **URL pública gerada**

---

## 📝 Qual Escolher?

- **Glitch**: Mais fácil para começar rapidamente
- **Replit**: Bom para desenvolvimento e testes
- **Render/Railway**: Melhor para produção (mais estável)

---

## 🔧 Configuração do Webhook

Após escolher um serviço e ter sua URL (ex: `https://seu-projeto.glitch.me`):

1. Configure a Evolution API para enviar webhooks para:
   ```
   https://seu-projeto.glitch.me/webhook
   ```

2. Formato do payload esperado:
   ```json
   {
     "tipo": "texto",
     "conteudo": "transporte",
     "grupo": "grupo-123",
     "remetente": "5511999999999"
   }
   ```

---

## ⚠️ Importante

- Todos esses serviços são **gratuitos** para uso básico
- Não precisa instalar **nada** no seu computador
- Apenas precisa de uma **conta** (email/GitHub)
- O código funciona **exatamente igual** em todos eles
