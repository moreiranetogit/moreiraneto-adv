# ⚙️ SETUP.md — Configuração de Desenvolvimento

**Data:** 2026-04-14  
**Node:** 18+ | npm/pnpm  
**Tempo de setup:** ~15 minutos

---

## 📋 Índice

1. [Requisitos](#requisitos)
2. [Setup Inicial](#setup-inicial)
3. [Variáveis de Ambiente](#variáveis-de-ambiente)
4. [Configurar Supabase](#configurar-supabase)
5. [Executar Localmente](#executar-localmente)
6. [Variáveis de Ambiente Avançadas](#variáveis-de-ambiente-avançadas)
7. [Troubleshooting](#troubleshooting)

---

## 🔧 Requisitos

- ✅ **Node.js 18+** — https://nodejs.org/
- ✅ **Git** — https://git-scm.com/
- ✅ **Conta Supabase** — https://supabase.com/ (grátis)
- ✅ **Conta Google AI Studio** (opcional) — https://aistudio.google.com/
- ✅ **Editor de código** — VS Code recomendado

### Verificar versões:
```bash
node --version    # v18+
npm --version     # 9+
git --version     # 2.30+
```

---

## 🚀 Setup Inicial

### 1. Clonar repositório
```bash
git clone https://github.com/seu-usuario/moreiraneto-adv.git
cd moreiraneto-adv
```

### 2. Instalar dependências
```bash
npm install
# ou
pnpm install
```

### 3. Criar arquivo .env.local
```bash
cp .env.example .env.local
```

### 4. Preencher variáveis (ver seção abaixo)
```bash
# Editar .env.local com um editor
code .env.local
```

### 5. Executar migrations do banco (ver "Configurar Supabase")

### 6. Iniciar dev server
```bash
npm run dev
```

**Output esperado:**
```
▲ Next.js 16.1.6 (Turbopack)
- Local:        http://localhost:3000
- Environments: .env.local
✓ Ready in 4.2s
```

---

## 🔐 Variáveis de Ambiente

### Mínimo necessário para rodar

```bash
# .env.local

# ─── SUPABASE ───────────────────────────────────────────────
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# ─── SITE CONFIG ───────────────────────────────────────────
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NEXT_PUBLIC_PORTAL_NAME=Despacho
NEXT_PUBLIC_ESCRITORIO_NOME=Moreira Neto Advocacia
NEXT_PUBLIC_AMAA_WHATSAPP=5546999999999

# ─── CRON SECRET (para /api/rss/refresh) ───────────────────
CRON_SECRET=gere-um-uuid-aleatorio-aqui
```

### Como obter as chaves Supabase

1. Ir em **supabase.com** → criar conta
2. Criar novo projeto
3. Ir em **Settings** → **API**
4. Copiar:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - Anon public key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Service role secret → `SUPABASE_SERVICE_ROLE_KEY`

---

## 🗄️ Configurar Supabase

### 1. Acessar o painel do seu projeto

1. supabase.com
2. Clique no seu projeto
3. Vá em **SQL Editor**

### 2. Executar schema.sql

```bash
# Copiar e colar em: supabase.com → SQL Editor

# Conteúdo: supabase/schema.sql
```

**O que será criado:**
- ✅ Tabelas: profiles, articles, animals, denuncias, etc
- ✅ Enums: user_role, article_status, animal_status
- ✅ RLS policies (segurança)
- ✅ Triggers (automação)
- ✅ Storage buckets

### 3. Executar artigos-schema.sql (opcional, para Radar Jurídico)

```bash
# supabase/artigos-schema.sql
```

### 4. Executar migrations

```bash
# supabase/migrations/001_create_adoption_interests.sql
```

### 5. Criar usuário admin

No painel do Supabase:
1. **Authentication** → **Users** → **Invite user**
2. Digite seu email e clique Invite
3. Confirme o convite no email
4. Volte ao painel

**Promover para admin:**

Em **SQL Editor**, execute:
```sql
UPDATE profiles 
SET role = 'admin' 
WHERE id = 'SEU_UUID_AQUI';
```

(Encontre seu UUID em Authentication → Users)

### 6. Criar buckets de storage (opcional, para fotos)

Em **Storage**:
1. New bucket → Name: `article-images` → Public
2. New bucket → Name: `animal-photos` → Public
3. New bucket → Name: `denuncia-anexos` → Private

---

## 🏃 Executar Localmente

### Dev server com hot reload
```bash
npm run dev
```

Acesse: **http://localhost:3000**

### Build para produção (teste)
```bash
npm run build
npm run start
```

### Lint/Format
```bash
npm run lint          # Verificar erros
npm run format        # Corrigir formatação
```

### Rodar testes (quando disponível)
```bash
npm run test
npm run test:watch
```

---

## 📝 Variáveis de Ambiente Avançadas

### Gemini API (para gerar imagens dos artigos)
```bash
# Obter em: aistudio.google.com → Get API Key
GEMINI_API_KEY=AIzaSy...
```

### Email (Resend para notificações)
```bash
# Obter em: resend.com → API Keys
RESEND_API_KEY=re_...
EMAIL_FROM=contato@moreiraneto.adv.br
```

### WhatsApp Business API (para enviar mensagens de adoção)
```bash
# Configurar em: developers.facebook.com
WHATSAPP_BUSINESS_API_TOKEN=EAB...
WHATSAPP_PHONE_NUMBER_ID=123456789...
```

### Vercel Environment Variables
```bash
# Quando fazer deploy
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add SUPABASE_SERVICE_ROLE_KEY
vercel env add GEMINI_API_KEY
```

---

## 🌍 Deploy

### 1. Push para GitHub
```bash
git add .
git commit -m "Setup inicial do projeto"
git push origin main
```

### 2. Conectar a Vercel
1. Vá em **vercel.com**
2. Clique "New Project"
3. Selecione seu repo GitHub
4. Configure variáveis de ambiente
5. Clique "Deploy"

### 3. Configurar domínio customizado
1. Em Vercel → Seu projeto → Settings → Domains
2. Adicione `moreiraneto.adv.br`
3. Atualize seu DNS (registrar)

---

## 🧪 Verificar se está funcionando

### Checklist:

- [ ] `npm install` sem erros
- [ ] Dev server rodando em localhost:3000
- [ ] Página inicial carrega
- [ ] `/despacho` mostra artigos (ou vazio se nenhum no banco)
- [ ] `/amaa` carrega com design novo
- [ ] Clica "Quero adotar" e modal abre
- [ ] `/login` acessível
- [ ] `/admin` redireciona para login
- [ ] Faz login com seu email de admin
- [ ] `/admin/artigos` mostra fila

---

## 🐛 Troubleshooting

### Erro: "Cannot find module 'next'"
```bash
npm install
# ou
rm -rf node_modules package-lock.json
npm install
```

### Erro: "Supabase client error"
Checklist:
- [ ] `.env.local` criado
- [ ] NEXT_PUBLIC_SUPABASE_URL preenchido
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY preenchido
- [ ] Conexão com internet funcionando
- [ ] Projeto Supabase está ativo

### Erro: "Authentication required"
```bash
# Verificar se migrations foram executadas
# supabase/schema.sql e artigos-schema.sql devem estar 100% executados
```

### Erro: "Port 3000 already in use"
```bash
# Usar porta diferente
npm run dev -- -p 3001

# Ou matar processo da porta 3000
lsof -i :3000      # listar
kill -9 <PID>      # matar
```

### Erro: "CORS quando chamar API"
Verificar `.env.local`:
```bash
# Certifique-se que NEXT_PUBLIC_SITE_URL está certo
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Componente não renderiza
```bash
# Verificar se é 'use client' e está correto
# Se erro de hidratação: usar useEffect para renderizar no cliente

useEffect(() => {
  setIsMounted(true)
}, [])

if (!isMounted) return null
```

---

## 📚 Próximos Passos

Após setup bem-sucedido:

1. **Leia a documentação:**
   - [ ] ARCHITECTURE.md (arquitetura)
   - [ ] API.md (endpoints)
   - [ ] COMPONENTS.md (componentes)

2. **Experimente localmente:**
   - [ ] Crie um artigo em `/admin/artigos`
   - [ ] Veja aparecer em `/despacho`
   - [ ] Teste a adoção em `/amaa`

3. **Entenda o fluxo:**
   - [ ] Sync RSS (`/api/rss/refresh`)
   - [ ] Publicar artigo (análise → publicar)
   - [ ] Cadastrar animal para adoção

4. **Extensões (opcionais):**
   - [ ] Configurar Gemini (imagens automáticas)
   - [ ] Configurar WhatsApp (notificações)
   - [ ] Configurar email (confirmações)

---

## 🔗 Recursos Úteis

| Recurso | Link |
|---------|------|
| Docs Next.js | https://nextjs.org/docs |
| Docs Supabase | https://supabase.com/docs |
| Docs Tailwind | https://tailwindcss.com/docs |
| TypeScript | https://www.typescriptlang.org/docs |

---

**Status:** ✅ Setup pronto e testado  
*Questões? Veja TROUBLESHOOTING acima ou abra uma issue no GitHub*
