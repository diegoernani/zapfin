# 🔄 Como o Sistema Funciona

## 📋 Visão Geral

O sistema recebe mensagens do WhatsApp via **webhook** (Evolution API ou similar), processa as mensagens e registra gastos por categoria.

---

## 🎯 Fluxo Completo de Uso

### **Cenário: Usuário registra gastos de uma viagem**

```
┌─────────────┐
│  WhatsApp   │
│   (Grupo)   │
└──────┬──────┘
       │
       │ 1. Usuário envia: "transporte"
       ▼
┌─────────────────┐
│  Evolution API   │ ────webhook───▶ ┌──────────────┐
│  (ou similar)    │                  │   Servidor   │
└─────────────────┘                  │  (Glitch/    │
       │                              │   Replit)    │
       │ 2. Usuário envia imagem      └──────┬───────┘
       │     do comprovante                 │
       ▼                                    │
┌─────────────────┐                        │
│  Evolution API   │ ────webhook───▶       │
│  (ou similar)    │                        │
└─────────────────┘                        │
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │  Processa    │
                                    │  e Registra  │
                                    └──────────────┘
                                           │
       ┌──────────────────────────────────┘
       │
       │ 3. Usuário envia: "fechar viagem"
       ▼
┌─────────────────┐
│  Evolution API   │ ────webhook───▶ ┌──────────────┐
│  (ou similar)    │                  │   Servidor   │
└─────────────────┘                  │              │
                                     │  Gera        │
                                     │  Relatório   │
                                     └──────┬───────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │  Resposta    │
                                     │  via API     │
                                     └──────┬───────┘
                                            │
                                            ▼
                                     ┌──────────────┐
                                     │  WhatsApp    │
                                     │  (Grupo)     │
                                     └──────────────┘
```

---

## 📝 Passo a Passo Detalhado

### **PASSO 1: Usuário Define a Categoria**

**No WhatsApp:**
```
Usuário envia: "transporte"
```

**O que acontece:**
1. Evolution API recebe a mensagem do WhatsApp
2. Evolution API envia **webhook** para seu servidor:
   ```json
   {
     "tipo": "texto",
     "conteudo": "transporte",
     "grupo": "grupo-123",
     "remetente": "5511999999999"
   }
   ```
3. Seu servidor processa:
   - Valida se é uma categoria válida ("transporte" ou "comida")
   - Salva a categoria em memória para esse grupo/usuário
   - Responde: `"✅ Categoria 'transporte' definida! Agora envie a imagem do comprovante."`
4. Evolution API envia a resposta de volta para o WhatsApp

**Estado interno:**
```
Grupo: "grupo-123"
Usuário: "5511999999999"
Categoria atual: "transporte" ✅ (aguardando imagem)
```

---

### **PASSO 2: Usuário Envia Imagem do Comprovante**

**No WhatsApp:**
```
Usuário envia: [imagem do comprovante]
```

**O que acontece:**
1. Evolution API recebe a imagem
2. Evolution API envia **webhook** para seu servidor:
   ```json
   {
     "tipo": "imagem",
     "url": "https://evolution-api.com/files/imagem123.jpg",
     "grupo": "grupo-123",
     "remetente": "5511999999999"
   }
   ```
3. Seu servidor processa:
   - ✅ Verifica se há categoria definida (sim, "transporte")
   - 📥 Baixa a imagem da URL
   - 🔍 Executa OCR na imagem para extrair o valor
   - 💾 Registra o gasto:
     ```json
     {
       "categoria": "transporte",
       "valor": 45.50,
       "data": "2024-01-15T10:30:00Z",
       "grupo": "grupo-123",
       "usuario": "5511999999999"
     }
     ```
   - 🗑️ Limpa a categoria (para não usar na próxima imagem)
   - Responde: `"✅ Gasto registrado! Categoria: transporte, Valor: R$ 45,50"`
4. Evolution API envia a resposta de volta para o WhatsApp

**Estado interno:**
```
Grupo: "grupo-123"
Usuário: "5511999999999"
Categoria atual: null (limpa, aguardando nova categoria)

Gastos registrados:
- transporte: R$ 45,50
```

---

### **PASSO 3: Usuário Registra Outro Gasto**

**No WhatsApp:**
```
Usuário envia: "comida"
```

**O que acontece:**
- Mesmo processo do Passo 1
- Categoria "comida" é salva

```
Usuário envia: [imagem do comprovante de restaurante]
```

**O que acontece:**
- Mesmo processo do Passo 2
- Novo gasto registrado: comida: R$ 32,75

**Estado interno:**
```
Gastos registrados:
- transporte: R$ 45,50
- comida: R$ 32,75
```

---

### **PASSO 4: Usuário Solicita Relatório**

**No WhatsApp:**
```
Usuário envia: "fechar viagem"
```

**O que acontece:**
1. Evolution API envia webhook:
   ```json
   {
     "tipo": "texto",
     "conteudo": "fechar viagem",
     "grupo": "grupo-123",
     "remetente": "5511999999999"
   }
   ```
2. Seu servidor processa:
   - Busca todos os gastos desse usuário nesse grupo
   - Calcula totais por categoria
   - Gera relatório formatado:
     ```
     📍 RELATÓRIO DA VIAGEM
     
     🍔 Alimentação: R$ 32,75
     🚗 Transporte: R$ 45,50
     
     💰 Total geral: R$ 78,25
     ```
3. Evolution API envia o relatório de volta para o WhatsApp

---

## 🧠 Lógica Interna do Sistema

### **1. Gerenciamento de Estado (`state.js`)**

O sistema mantém em memória a categoria atual de cada usuário em cada grupo:

```javascript
Estado = {
  "grupo-123": {
    "5511999999999": "transporte"  // Categoria atual
  }
}
```

**Regras:**
- ✅ Quando usuário envia categoria → salva no estado
- ✅ Quando imagem é processada → limpa o estado
- ✅ Se imagem chegar sem categoria → retorna erro

---

### **2. Processamento de Mensagens (`webhook.js`)**

Fluxo de decisão:

```
Mensagem recebida
    │
    ├─ Tipo: "texto"
    │   ├─ É "fechar viagem"? → Gera relatório
    │   ├─ É categoria válida? → Salva categoria
    │   └─ Outro → Retorna ajuda
    │
    ├─ Tipo: "imagem"
    │   ├─ Tem categoria salva? → Processa imagem
    │   └─ Não tem categoria? → Retorna erro
    │
    └─ Tipo: "audio"
        └─ Retorna: "use texto" (não implementado ainda)
```

---

### **3. OCR (`ocr.js`)**

**Atualmente (Mock):**
- Retorna valor aleatório entre R$ 10 e R$ 200
- Simula delay de processamento (500ms)

**Futuro (Real):**
- Integração com Google Vision API, Tesseract, etc.
- Extrai texto da imagem
- Procura padrões monetários (R$ 123,45)
- Retorna valor numérico

---

### **4. Armazenamento (`expenses.js`)**

**Em memória:**
```javascript
gastos = [
  {
    id: "1234567890",
    grupo: "grupo-123",
    usuario: "5511999999999",
    categoria: "transporte",
    valor: 45.50,
    data: "2024-01-15T10:30:00Z"
  },
  // ...
]
```

**Persistência:**
- Salva automaticamente em `data/expenses.json`
- Carrega ao iniciar o servidor
- Mantém histórico mesmo após reiniciar

---

### **5. Geração de Relatórios (`report.js`)**

Processo:
1. Busca todos os gastos do usuário no grupo
2. Agrupa por categoria
3. Calcula totais:
   ```javascript
   {
     comida: 32.75,
     transporte: 45.50,
     geral: 78.25
   }
   ```
4. Formata em texto bonito:
   ```
   📍 RELATÓRIO DA VIAGEM
   
   🍔 Alimentação: R$ 32,75
   🚗 Transporte: R$ 45,50
   
   💰 Total geral: R$ 78,25
   ```

---

## 🔌 Integração com Evolution API

### **Configuração do Webhook na Evolution API**

1. Acesse o painel da Evolution API
2. Configure o webhook para:
   ```
   https://seu-projeto.glitch.me/webhook
   ```
3. Formato esperado:
   ```json
   {
     "tipo": "texto" | "imagem" | "audio",
     "conteudo": "texto da mensagem",
     "url": "url da imagem (se tipo=imagem)",
     "grupo": "id-do-grupo",
     "remetente": "numero-do-usuario"
   }
   ```

### **Resposta do Sistema**

O sistema sempre responde em JSON:
```json
{
  "success": true,
  "response": "Mensagem formatada para o usuário"
}
```

A Evolution API pega o campo `response` e envia de volta para o WhatsApp.

---

## 🎬 Exemplo Real Completo

### **Conversa no WhatsApp:**

```
[10:30] Usuário: transporte
[10:30] Bot: ✅ Categoria "transporte" definida! Agora envie a imagem do comprovante.

[10:32] Usuário: [imagem do ticket de metrô]
[10:32] Bot: ✅ Gasto registrado!
            📋 Categoria: transporte
            💰 Valor: R$ 4,50
            
            Envie outra categoria ou "fechar viagem" para ver o relatório.

[10:35] Usuário: comida
[10:35] Bot: ✅ Categoria "comida" definida! Agora envie a imagem do comprovante.

[10:37] Usuário: [imagem do cupom do restaurante]
[10:37] Bot: ✅ Gasto registrado!
            📋 Categoria: comida
            💰 Valor: R$ 45,00
            
            Envie outra categoria ou "fechar viagem" para ver o relatório.

[10:40] Usuário: fechar viagem
[10:40] Bot: 📍 RELATÓRIO DA VIAGEM
            
            🍔 Alimentação: R$ 45,00
            🚗 Transporte: R$ 4,50
            
            💰 Total geral: R$ 49,50
```

---

## ⚙️ Componentes Técnicos

### **Servidor HTTP (`server.js`)**
- Escuta na porta 3000 (ou PORT definida)
- Rota `/webhook` recebe POST com JSON
- Rota `/health` para verificar se está online
- Rota `/` mostra documentação

### **Processamento Assíncrono**
- Download de imagens (http/https nativo)
- OCR (atualmente mock, preparado para real)
- Salvamento em arquivo (fs/promises)

### **Isolamento por Grupo/Usuário**
- Cada grupo tem seu próprio estado
- Cada usuário tem sua própria categoria
- Gastos são separados por grupo e usuário

---

## 🧪 Como Testar

### **1. Teste Local (HTML)**
Abra `test-local.html` no navegador e simule o fluxo completo.

### **2. Teste com Servidor Online**
1. Hospede em Glitch/Replit
2. Use `curl` ou Postman para enviar webhooks
3. Ou configure Evolution API apontando para sua URL

### **3. Teste Real com WhatsApp**
1. Configure Evolution API
2. Adicione o bot no grupo do WhatsApp
3. Envie mensagens reais e veja funcionando!

---

## 📊 Dados Armazenados

**Arquivo: `data/expenses.json`**
```json
[
  {
    "id": "1705315800000",
    "groupId": "grupo-123",
    "userId": "5511999999999",
    "category": "transporte",
    "value": 4.50,
    "date": "2024-01-15T10:32:00.000Z",
    "timestamp": 1705315800000
  },
  {
    "id": "1705315900000",
    "groupId": "grupo-123",
    "userId": "5511999999999",
    "category": "comida",
    "value": 45.00,
    "date": "2024-01-15T10:37:00.000Z",
    "timestamp": 1705315900000
  }
]
```

---

## 🔒 Segurança e Limitações

**Atual (MVP):**
- ⚠️ Sem autenticação (qualquer um pode enviar webhook)
- ⚠️ Sem validação de origem
- ⚠️ OCR em modo mock

**Para Produção:**
- Adicionar autenticação (token no header)
- Validar origem dos webhooks
- Implementar OCR real
- Adicionar rate limiting

---

## 🎯 Resumo Rápido

1. **Usuário envia categoria** → Sistema salva em memória
2. **Usuário envia imagem** → Sistema extrai valor e registra gasto
3. **Usuário envia "fechar viagem"** → Sistema gera relatório consolidado
4. **Tudo funciona via webhook** → Evolution API envia/recebe mensagens

**Simples, direto e funcional!** 🚀
