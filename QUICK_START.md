# ⚡ Quick Start — Moreiraneto.adv.br

**5 minutos para ter o projeto rodando localmente.**

---

## 1. Instalar & Rodar

```bash
# Clonar ou abrir no VS Code
cd moreiraneto-adv

# Instalar dependências
npm install

# Copiar variáveis de ambiente
cp .env.example .env.local

# Rodar servidor de desenvolvimento
npm run dev
```

**Acesse:** http://localhost:3000

---

## 2. Configurar Supabase (Banco de Dados)

1. **Criar projeto:** https://supabase.com → New Project
2. **Copiar credenciais** para `.env.local`:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOi...
   ```
3. **Executar SQL:** Supabase → SQL Editor → Cole todo o conteúdo de `supabase/artigos-schema.sql`
4. **Criar admin:**
   ```sql
   -- No SQL Editor do Supabase
   UPDATE profiles SET role = 'admin' WHERE id = 'SEU_UUID_DO_LOGIN';
   ```

---

## 3. Testar Portal de Notícias

Após setup do Supabase:

```bash
# Acesse http://localhost:3000/noticias-e-opinioes
# (Estará vazio até receber notícias via RSS)

# Para gerar dados de teste:
curl "http://localhost:3000/api/rss/refresh?secret=dev"
```

---

## 4. Acessar Painel Admin

```bash
# Acesse http://localhost:3000/admin/artigos
# Estará vazio inicialmente

# Seções disponíveis:
/admin/artigos         # Fila de notícias (revisar/aprovar)
/admin/fontes          # Gerenciar fontes RSS
/admin/usuarios        # Gerenciar usuários
/admin/denuncias       # Visualizar denúncias AMAA
/admin/amaa            # Cadastro de animais
```

---

## 5. Próximos Passos

### Se quer testar RSS:
1. Acesse `/admin/fontes`
2. Clique "+ Adicionar Fonte"
3. Cole: `https://www.stj.jus.br/sites/rss/RssTitulos` (Nome: "STJ")
4. Ative a fonte
5. Execute: `curl "http://localhost:3000/api/rss/refresh?secret=dev"`
6. Artigos devem aparecer em `/noticias-e-opinioes` com status "pendente"

### Se quer testar Editorial:
1. Crie um artigo em `/admin/artigos` → "+ Adicionar Notícia"
2. Clique "Revisar"
3. Edite análise (ou deixe o placeholder)
4. Clique "Aprovar e Publicar"
5. Verá em `/noticias-e-opinioes`

### Se quer testar Denúncias:
1. Acesse `/amaa` (seção pública)
2. Preencha formulário de denúncia
3. Acesse `/admin/denuncias`
4. Sua denúncia aparecerá lá

---

## 📁 Estrutura Principal

```
moreiraneto-adv/
├── app/                    # App Next.js
│   ├── /                   # Homepage MNA
│   ├── noticias-e-opinioes # Portal de notícias
│   ├── amaa/               # Seção AMAA pública
│   ├── admin/              # Painel editorial protegido
│   └── api/                # Endpoints REST
│
├── lib/                    # Utilities
├── components/             # Componentes reutilizáveis
├── types/                  # TypeScript types
├── public/                 # Assets estáticos
├── supabase/              # Schema SQL
│
├── .env.example           # Template de variáveis
├── vercel.json            # Config Vercel Cron
└── CLAUDE.md              # Documentação completa
```

---

## ⚠️ Problemas Comuns

### "No rows returned"
- Rode `/api/rss/refresh?secret=dev` para gerar dados

### "Supabase connection error"
- Verificar `.env.local` — credenciais corretas?
- SQL schema foi executado?

### "Cannot find module @/lib/..."
- Rode `npm install` novamente
- Reinicie o dev server: `npm run dev`

### "Authentication failed"
- Criar usuário em Supabase → Authentication → Users
- Setar role = 'admin' para seu usuário

---

## 🚀 Deploy no Vercel

```bash
npm i -g vercel
vercel login
vercel

# Adicione variáveis de ambiente no Vercel:
# NEXT_PUBLIC_SUPABASE_URL
# SUPABASE_SERVICE_ROLE_KEY
# CRON_SECRET (para sincronização automática)
```

O cron job configurado em `vercel.json` será ativado automaticamente!

---

## 📚 Documentação Completa

Veja [`CLAUDE.md`](./CLAUDE.md) para documentação detalhada.  
Veja [`IMPLEMENTATION_PHASE_2.md`](./IMPLEMENTATION_PHASE_2.md) para o que foi implementado.

---

**Pronto!** Agora explore o projeto. Divirta-se! 🎉
