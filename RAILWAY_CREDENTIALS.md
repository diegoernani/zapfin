# 🔐 Credenciais do Railway

## 📋 URLs de Conexão

### **URL Externa (Para uso local/Replit)**
```
postgresql://postgres:TsxuRHybebXeFWtpKEygyeyVPJDPmLyx@ballast.proxy.rlwy.net:28070/railway
```

**Use esta URL quando:**
- Conectando de fora do Railway
- Testando localmente
- Usando no Replit
- Usando em Render/Fly.io

---

### **URL Interna (Para uso dentro do Railway)**
```
postgresql://postgres:TsxuRHybebXeFWtpKEygyeyVPJDPmLyx@postgres.railway.internal:5432/railway
```

**Use esta URL quando:**
- Deploy no Railway
- Aplicação rodando no mesmo projeto Railway
- Conexão mais rápida (rede interna)

---

## ⚙️ Como Configurar

### **1. No Replit / Render / Outros Serviços**

Configure a variável de ambiente `DATABASE_URL` com a **URL Externa**:

```
postgresql://postgres:TsxuRHybebXeFWtpKEygyeyVPJDPmLyx@ballast.proxy.rlwy.net:28070/railway
```

### **2. No Railway (se fizer deploy lá)**

Configure a variável de ambiente `DATABASE_URL` com a **URL Interna**:

```
postgresql://postgres:TsxuRHybebXeFWtpKEygyeyVPJDPmLyx@postgres.railway.internal:5432/railway
```

### **3. Localmente (quando tiver Node.js)**

Crie um arquivo `.env` na raiz:

```env
DATABASE_URL=postgresql://postgres:TsxuRHybebXeFWtpKEygyeyVPJDPmLyx@ballast.proxy.rlwy.net:28070/railway
```

---

## 🧪 Testar Conexão

### **No Replit:**

```bash
# Configure DATABASE_URL nos Secrets primeiro
npm run db:test
```

### **Localmente (quando tiver Node.js):**

```bash
# Configure .env primeiro
npm run db:test
```

---

## 📝 Criar Tabelas

Depois de configurar a DATABASE_URL:

```bash
npm run db:setup
```

Ou execute o `schema.sql` manualmente no Railway Dashboard.

---

## 🔒 Segurança

⚠️ **IMPORTANTE:**
- ⚠️ Não commite o arquivo `.env` no Git (já está no .gitignore)
- ⚠️ Não compartilhe essas credenciais publicamente
- ⚠️ Se a senha vazar, gere uma nova no Railway

---

## ✅ Próximos Passos

1. ✅ Configure `DATABASE_URL` no serviço de deploy
2. ✅ Execute `npm run db:setup` para criar tabelas
3. ✅ Execute `npm run dev` para iniciar
4. ✅ Acesse a aplicação!
