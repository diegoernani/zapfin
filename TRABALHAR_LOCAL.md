# 💻 Trabalhar Localmente - ZapFin

## 📁 Estrutura do Projeto

O projeto está organizado e pronto para uso:

```
zapfin/
├── client/          # Frontend React
├── server/          # Backend Express
├── shared/          # Código compartilhado
├── script/          # Scripts úteis
├── schema.sql       # Schema do banco
└── ...
```

---

## 🔧 Scripts Disponíveis

Quando tiver Node.js instalado, você pode usar:

```bash
# Desenvolvimento
npm run dev

# Criar tabelas no banco
npm run db:setup

# Testar conexão
npm run db:test

# Build para produção
npm run build
```

---

## 🗄️ Banco de Dados Railway

### **Configurar DATABASE_URL**

Crie um arquivo `.env` na raiz do projeto:

```env
DATABASE_URL=postgresql://user:password@ballast.proxy.rlwy.net:28070/railway
```

**⚠️ Não commite o arquivo `.env` no Git!** (já está no .gitignore)

### **Criar Tabelas**

**Opção 1: Script automático**
```bash
npm run db:setup
```

**Opção 2: SQL manual**
1. Acesse o Railway Dashboard
2. Abra o banco PostgreSQL
3. Vá em "Query"
4. Cole o conteúdo de `schema.sql`
5. Execute

---

## 📝 Arquivos Importantes

### **Para Editar Código:**
- `client/src/` - Frontend React
- `server/` - Backend Express
- `shared/` - Código compartilhado

### **Para Configurar:**
- `.env` - Variáveis de ambiente (criar manualmente)
- `package.json` - Dependências e scripts
- `drizzle.config.ts` - Configuração do banco

### **Documentação:**
- `README.md` - Documentação principal
- `CONECTAR_RAILWAY.md` - Como conectar ao banco
- `SETUP_DATABASE.md` - Como configurar o banco

---

## 🚀 Deploy em Outros Serviços

### **Render.com / Railway / Fly.io**

1. Conecte o repositório GitHub
2. Configure `DATABASE_URL` nas variáveis de ambiente
3. Build: `npm run build`
4. Start: `npm start`

O código está pronto para deploy!

---

## 📦 Enviar para GitHub

Quando fizer alterações:

```bash
git add .
git commit -m "Descrição das mudanças"
git push
```

---

## 🔍 Verificar Status

```bash
# Ver status do Git
git status

# Ver commits
git log --oneline

# Ver diferenças
git diff
```

---

## 💡 Dicas

1. **Trabalhe localmente** - Edite os arquivos normalmente
2. **Teste no GitHub** - Faça commit e push
3. **Deploy automático** - Render/Railway fazem deploy do GitHub
4. **Banco Railway** - Configure DATABASE_URL no serviço de deploy

---

## 📞 Quando Precisar de Node.js

Se precisar testar localmente no futuro:

1. Instale Node.js (quando possível)
2. Execute `npm install`
3. Configure `.env` com DATABASE_URL
4. Execute `npm run dev`

Por enquanto, você pode:
- ✅ Editar código
- ✅ Fazer commit/push no GitHub
- ✅ Deploy automático nos serviços
- ✅ Configurar banco via Railway Dashboard
