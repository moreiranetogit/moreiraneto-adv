# CLAUDE.md — Guia do Projeto moreiraneto.adv.br

## O que é este projeto
Site completo da **Moreira Neto Advocacia** (Realeza/PR) unificando:
- Site institucional do escritório
- Portal de notícias jurídicas **"Despacho, por MNA"**
- Seção pública **AMAA** (adoção de animais + denúncia de maus-tratos)
- Painel editorial protegido (admin, editor, voluntária AMAA)

**Stack:** Next.js 14 (App Router) · TypeScript · Tailwind CSS · Supabase · Vercel

---

## Setup inicial (faça UMA VEZ)

### 1. Instalar dependências
```bash
npm install
```

### 2. Configurar variáveis de ambiente
```bash
cp .env.example .env.local
# Edite .env.local com seus dados reais do Supabase e Gemini
```

### 3. Configurar o banco Supabase
1. Crie um projeto em supabase.com
2. Vá em **SQL Editor** e execute todo o conteúdo de `supabase/schema.sql`
3. Crie os Storage Buckets conforme indicado no final do schema
4. Crie seu usuário admin: Authentication → Users → Invite User
5. No SQL Editor, promova para admin:
   ```sql
   UPDATE profiles SET role = 'admin' WHERE id = 'SEU_UUID_AQUI';
   ```

### 4. Rodar localmente
```bash
npm run dev
# Acesse http://localhost:3000
```

### 5. Deploy no Vercel
```bash
# Instale a CLI do Vercel
npm i -g vercel
vercel
# Siga as instruções e adicione as variáveis de ambiente
```

---

## Estrutura de URLs

| URL | O que é |
|-----|---------|
| `/` | Site institucional MNA |
| `/despacho` | Portal de notícias (homepage) |
| `/despacho/[categoria]` | Notícias filtradas por categoria |
| `/despacho/artigo/[slug]` | Artigo individual |
| `/amaa` | Seção pública AMAA |
| `/login` | Login único (redireciona por role) |
| `/admin` | Dashboard editorial |
| `/admin/artigos` | Fila de aprovação de notícias |
| `/admin/amaa` | Cadastro de animais (voluntárias) |
| `/api/rss/refresh` | Endpoint de sincronização RSS |

---

## O que ainda precisa ser implementado

### 🔴 Crítico (sem isso o portal não funciona)
- [x] `app/page.tsx` — Homepage do site institucional MNA ✅
- [x] `app/despacho/artigo/[slug]/page.tsx` — Página de artigo individual ✅
- [x] `app/amaa/page.tsx` + `DenunciaForm.tsx` — Seção pública AMAA ✅
- [x] `app/admin/artigos/page.tsx` + `ArticleActions.tsx` — Fila editorial ✅
- [x] `app/admin/artigos/[id]/page.tsx` — Revisão/aprovação de artigo ✅
- [x] `app/admin/amaa/page.tsx` + `AnimalFormModal.tsx` + `AnimalStatusActions.tsx` ✅

### 🟡 Importante (próximos passos)
- [x] `app/admin/fontes/page.tsx` — Gerenciamento de fontes RSS ✅
- [x] `app/admin/usuarios/page.tsx` — Criação/gerenciamento de usuários ✅
- [x] `app/admin/denuncias/page.tsx` — Visualização de denúncias recebidas ✅
- [x] `vercel.json` — Configuração de cron job para RSS automático ✅
- [x] `app/api/rss/refresh/route.ts` — Sincronização automática de RSS ✅
- [x] Sistema de Interesse de Adoção (modal + API + banco) ✅
  - `app/amaa/AdoptionInterestModal.tsx` — Formulário com validação de CPF ✅
  - `app/api/amaa/adoption-interests/route.ts` — Endpoint POST + WhatsApp fallback ✅
  - `supabase/migrations/001_create_adoption_interests.sql` — Schema + RLS ✅
  - `SISTEMA_INTERESSE_ADOCAO.md` — Documentação completa ✅
- [ ] Painel admin para gerenciar interesses: `app/admin/amaa/interests/page.tsx`
- [ ] Página de erro 404 personalizada (`app/not-found.tsx`)
- [ ] Upload de fotos de animais via Supabase Storage (já tem bucket configurado no schema)
- [ ] Atualizar número de WhatsApp em `app/page.tsx` e `app/amaa/page.tsx` (buscar "46999999999")

### 📁 Imagens institucionais MNA (em public/)
- `public/mna-logo.png` — Logo original MNA (3492×2359px, fundo carvão, 1.5 MB — master)
- `public/mna-logo-web.png` — Logo otimizada para web (600×405px, 88 KB — usar no site)
- `public/mna-logo-araucaria.png` — **Hero image criada pelo cliente** (7.5 MB, alta resolução):
  logo MNA integrado em composição com araucária, estilo dark/dramático.
  ⚠️ Imagem grande — necessita compressão antes de usar como asset web.
  Atualmente em uso no Stitch para prototipagem do layout.
  Quando for integrar no site: comprimir para ≤300 KB com `python3 -c "from PIL import Image; ..."`

### 📁 Imagens a gerar (prompts prontos — gerar no AI Studio)
- `public/hero-principal.jpg` — Fachada de tribunal ao entardecer, figura solitária, céu âmbar
- `public/area-agrario.jpg` — Campos de soja/trigo no Paraná, estilo Technicolor dark
- `public/area-civil.jpg` — Biblioteca jurídica em mogno escuro, luz âmbar
- `public/area-trabalhista.jpg` — Mãos de operário + terno, estilo Surreal dark
- `public/area-familia.jpg` — Mãos adultas com mão infantil, fundo negro, luz âmbar
- `public/area-animal.jpg` — Silhueta humano + cão, céu impossível com constelações, surreal
- `public/area-geral.jpg` — Balança da justiça em latão, fundo negro, chiaroscuro
  → Prompts completos disponíveis no histórico da conversa (16/mar/2026)

### 📁 Materiais AMAA (em public/)
- `public/amaa-logo.png` — Logo oficial AMAA (original, 2.7 MB)
- `public/amaa-logo-web.png` — Logo AMAA otimizada (400×347px, 96 KB — usar no site)
- `public/amaa-capa.png` — Imagem ilustrativa (Gemini, original 6.8 MB)
- `public/amaa-capa-web.jpg` — Versão web otimizada (1200×654px, 139 KB)
- `public/amaa-passos.png` — Ilustração passo a passo (Gemini, original)
- `public/amaa-passos-web.jpg` — Versão web otimizada (115 KB)
- `public/amaa-contatos.png` — Ícones de contato (Gemini, original)
- `public/amaa-contatos-web.jpg` — Versão web otimizada (43 KB)
- `public/cartilha-denuncia-maus-tratos.html` — Cartilha HTML interativa
- `public/cartilha-denuncia-maus-tratos-v2.pdf` — Cartilha PDF com imagens (1.1 MB)

### 🟢 Melhorias futuras
- [ ] Sistema de newsletter (Resend)
- [ ] Busca de artigos (full-text search no Supabase)
- [ ] Contador de leituras (incrementar `read_count` ao acessar artigo)
- [ ] OG images dinâmicas (`app/despacho/artigo/[slug]/opengraph-image.tsx`)
- [ ] Sitemap XML dinâmico (`app/sitemap.ts`)
- [ ] PWA (service worker para funcionar offline)

---

## Arquitetura de autenticação

- `middleware.ts` intercepta todas as rotas `/admin/*` e `/login`
- Roles definidos em Supabase: `admin` | `editor` | `voluntaria_amaa`
- Após login, o middleware lê a role e redireciona automaticamente
- RLS (Row Level Security) protege o banco — não precisa verificar permissões manualmente nas queries

---

## RSS e geração de imagens

### Sincronização manual
```
GET /api/rss/refresh?secret=SEU_CRON_SECRET
```

### Sincronização automática (Vercel Cron)
Crie `vercel.json` na raiz:
```json
{
  "crons": [
    { "path": "/api/rss/refresh", "schedule": "0 * * * *" }
  ]
}
```

### Adicionar novas fontes RSS
Edite `lib/rss/sources.ts` e adicione ao array `RSS_SOURCES`.

### Gemini Image Generation
- Configurado em `lib/gemini.ts`
- Ativado automaticamente quando o RSS não tem imagem
- Requer `GEMINI_API_KEY` no `.env.local`
- Modelo: `gemini-2.0-flash-preview-image-generation` (500 gerações/dia no plano gratuito)

---

## E-mail (configurar depois)

Duas opções no `.env.example`:
1. **Resend** (recomendado): resend.com → API Key gratuita até 3.000 emails/mês
2. **SMTP**: Zoho Mail (gratuito), Google Workspace, ou Kinghost

Use para: confirmação de denúncias, notificação de novo animal aprovado, alertas editoriais.

---

## Temas

Três temas controlados por `data-theme` no `<html>`:
- `light` (padrão)
- `dark`
- `sepia`

O usuário troca pelo botão no header do portal. A escolha fica salva em `localStorage` com a chave `mn-theme`.

CSS variables definidas em `app/globals.css`.

---

## Cores e identidade visual

| Cor | Hex | Uso |
|-----|-----|-----|
| Laranja MNA | `#E8941F` | Destaque, botões primários, links ativos |
| Prata MNA | `#9CA3AF` | Logo (letra M) |
| Cinza escuro | `#1F2937` | Header, sidebar |
| Verde AMAA | `#2D6A4F` | Seção AMAA, botões de denúncia |

---

## Contato / suporte do projeto
- **Escritório:** Moreira Neto Advocacia — Realeza/PR
- **Portal:** despacho.moreiraneto.adv.br (ou moreiraneto.adv.br/despacho)
- **AMAA:** Associação de Amigos dos Animais de Realeza/PR
