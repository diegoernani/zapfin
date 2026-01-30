# 🔌 Conectar ao Banco Railway

## 📋 Informações do Banco

- **Host:** `ballast.proxy.rlwy.net`
- **Porta:** `28070`
- **SSL:** Requerido (geralmente)

---

## 🔑 Obter Credenciais no Railway

1. Acesse: https://railway.app
2. Abra seu projeto
3. Clique no banco PostgreSQL
4. Vá em **"Variables"** ou **"Connect"**
5. Você verá:
   - **User** (geralmente `postgres`)
   - **Password** (senha gerada)
   - **Database** (nome do banco)
   - **Host** (já temos: `ballast.proxy.rlwy.net`)
   - **Port** (já temos: `28070`)

---

## 🚀 Método 1: Testar Conexão Localmente

### **1. Configure as variáveis**

No PowerShell (Windows):

```powershell
$env:DB_USER="postgres"
$env:DB_PASSWORD="sua_senha_aqui"
$env:DB_NAME="railway"
```

### **2. Execute o teste**

```bash
node script/test-connection.js
```

O script vai:
- ✅ Testar a conexão
- ✅ Mostrar informações do banco
- ✅ Gerar a DATABASE_URL completa
- ✅ Verificar tabelas existentes

---

## 🚀 Método 2: Usar DATABASE_URL Diretamente

O Railway fornece uma `DATABASE_URL` completa. Use ela diretamente:

### **No Replit:**

1. Vá em **"Secrets"** (ícone de cadeado)
2. Adicione: `DATABASE_URL`
3. Cole a URL completa do Railway

**Formato:**
```
postgresql://postgres:senha@ballast.proxy.rlwy.net:28070/railway
```

### **Depois execute:**

```bash
# Testar conexão
node script/test-connection.js

# Criar tabelas
npm run db:setup
```

---

## 🚀 Método 3: Executar SQL Manualmente

### **Via Railway Dashboard:**

1. Acesse o banco no Railway
2. Clique em **"Query"** ou **"Data"**
3. Cole o conteúdo de `schema.sql`
4. Execute

### **Via psql (se tiver instalado):**

```bash
psql "postgresql://postgres:senha@ballast.proxy.rlwy.net:28070/railway" -f schema.sql
```

---

## ✅ Verificar Conexão

Depois de configurar, teste:

```bash
# No Replit, com DATABASE_URL configurada
node script/test-connection.js
```

Você deve ver:
- ✅ Conexão bem-sucedida
- ✅ Informações do PostgreSQL
- ✅ DATABASE_URL gerada

---

## 🔧 Configurar no Replit

1. **Configure DATABASE_URL:**
   - Secrets → `DATABASE_URL`
   - Cole a URL completa do Railway

2. **Execute:**
   ```bash
   npm install
   npm run db:setup
   npm run dev
   ```

---

## 🆘 Problemas Comuns

### **"connection refused"**
- Verifique host e porta
- Verifique se o banco está ativo no Railway

### **"authentication failed"**
- Verifique usuário e senha
- Railway gera senhas automáticas - copie exatamente

### **"database does not exist"**
- Verifique o nome do banco
- Geralmente é `railway` ou `postgres`

### **"SSL required"**
- Adicione `?sslmode=require` na URL
- Ou configure SSL no script

---

## 📝 Próximos Passos

1. ✅ Obter credenciais no Railway
2. ✅ Configurar DATABASE_URL no Replit
3. ✅ Testar conexão: `node script/test-connection.js`
4. ✅ Criar tabelas: `npm run db:setup`
5. ✅ Executar app: `npm run dev`

---

## 💡 Dica

O Railway geralmente fornece a `DATABASE_URL` completa no painel. Use ela diretamente - é mais fácil!
