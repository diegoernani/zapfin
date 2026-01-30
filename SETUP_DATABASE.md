# 🗄️ Configurar Banco de Dados no Railway

## 📋 Informações do Banco

- **Host:** `ballast.proxy.rlwy.net`
- **Porta:** `28070`
- **Database:** (verifique no painel do Railway)
- **User:** (verifique no painel do Railway)
- **Password:** (verifique no painel do Railway)

---

## 🚀 Método 1: Usando Drizzle (Recomendado)

O projeto já está configurado para usar Drizzle ORM. É o método mais fácil:

### **1. Configure a DATABASE_URL**

No Railway:
1. Vá em "Variables" ou "Secrets"
2. Adicione: `DATABASE_URL`
3. Valor: `postgresql://user:password@ballast.proxy.rlwy.net:28070/railway`

**Formato completo:**
```
postgresql://[USER]:[PASSWORD]@ballast.proxy.rlwy.net:28070/[DATABASE]
```

### **2. Execute o comando Drizzle**

No terminal do Replit (ou local):

```bash
npm run db:push
```

Isso criará automaticamente todas as tabelas!

---

## 🚀 Método 2: Executar SQL Manualmente

### **Opção A: Via Railway Dashboard**

1. Acesse o painel do Railway
2. Clique no banco de dados PostgreSQL
3. Vá em "Data" ou "Query"
4. Cole o conteúdo do arquivo `schema.sql`
5. Execute

### **Opção B: Via psql (linha de comando)**

Se você tiver `psql` instalado:

```bash
psql -h ballast.proxy.rlwy.net -p 28070 -U [USER] -d [DATABASE] -f schema.sql
```

### **Opção C: Via DBeaver / pgAdmin**

1. Conecte ao banco:
   - Host: `ballast.proxy.rlwy.net`
   - Port: `28070`
   - Database: (do Railway)
   - User: (do Railway)
   - Password: (do Railway)

2. Abra o arquivo `schema.sql`
3. Execute o script

---

## 🔍 Verificar se Funcionou

Execute esta query para verificar:

```sql
-- Verificar tabelas
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public';

-- Verificar estrutura da tabela expenses
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'expenses';

-- Verificar estrutura da tabela user_states
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'user_states';
```

Você deve ver:
- ✅ `expenses` (6 colunas)
- ✅ `user_states` (5 colunas)

---

## ⚙️ Configurar no Replit

Depois de criar as tabelas:

1. No Replit, vá em "Secrets" (ícone de cadeado)
2. Adicione: `DATABASE_URL`
3. Cole a URL completa do Railway:
   ```
   postgresql://user:password@ballast.proxy.rlwy.net:28070/railway
   ```

4. Execute:
   ```bash
   npm install
   npm run dev
   ```

---

## 🆘 Problemas Comuns

### **"relation does not exist"**
- As tabelas não foram criadas
- Execute o `schema.sql` novamente

### **"connection refused"**
- Verifique se o host e porta estão corretos
- Verifique se o banco está ativo no Railway

### **"authentication failed"**
- Verifique usuário e senha
- Verifique se a DATABASE_URL está correta

---

## ✅ Próximos Passos

Depois de configurar o banco:

1. ✅ Tabelas criadas
2. ✅ DATABASE_URL configurada no Replit
3. ✅ Execute `npm run dev`
4. ✅ Acesse a aplicação
5. ✅ Teste o webhook!
