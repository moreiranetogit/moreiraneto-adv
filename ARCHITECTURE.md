# 🏗️ ARCHITECTURE.md — Arquitetura Técnica

**Data:** 2026-04-14  
**Stack:** Next.js 14 (App Router) + TypeScript + Supabase + Tailwind CSS

---

## 📐 Diagrama de Arquitetura

```
┌────────────────────────────────────────────────────────────────┐
│                      FRONTEND (Next.js 14)                     │
│  ┌──────────────┬──────────────┬──────────────────────────┐   │
│  │   Homepage   │   Despacho   │        AMAA              │   │
│  │   (áreas)    │   (notícias) │   (adoção + denúncia)    │   │
│  └──────────────┴──────────────┴──────────────────────────┘   │
│                                                                 │
│  ┌──────────────────────────────────────────────────────────┐ │
│  │          Admin Dashboard (SSR + Protected Routes)        │ │
│  │  Artigos │ Animais │ Denúncias │ RSS │ Usuários         │ │
│  └──────────────────────────────────────────────────────────┘ │
└────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌────────────────────────────────────────────────────────────────┐
│                   API ROUTES (Next.js)                         │
│  GET/POST /api/artigos           (CRUD artigos)              │
│  GET/POST /api/rss/refresh       (sincronização RSS)         │
│  POST /api/amaa/adoption-interests (interesse adoção + WA)   │
│  GET /api/noticias               (últimas notícias)          │
└────────────────────────────────────────────────────────────────┘
                           │
                           ↓
┌────────────────────────────────────────────────────────────────┐
│                   EXTERNAL SERVICES                            │
│  ┌──────────────┬──────────────┬──────────────────────────┐   │
│  │   Supabase   │   Gemini AI  │   WhatsApp Business API │   │
│  │   (DB Auth)  │   (Imagens)  │   (Notificações)        │   │
│  └──────────────┴──────────────┴──────────────────────────┘   │
└────────────────────────────────────────────────────────────────┘
```

---

## 🔐 Fluxo de Autenticação

```
┌─────────────────────────────────┐
│   Usuário acessa /admin         │
└──────────────┬──────────────────┘
               │
               ↓
┌─────────────────────────────────┐
│   proxy.ts intercepta rota      │ (Next.js 16)
└──────────────┬──────────────────┘
               │
               ├─→ Sem auth? → Redireciona /login
               │
               ↓
┌─────────────────────────────────┐
│  Verifica role (admin/editor)   │
└──────────────┬──────────────────┘
               │
               ├─→ admin → /admin
               ├─→ editor → /admin/artigos
               └─→ voluntária_amaa → /admin/amaa
               │
               ↓
┌─────────────────────────────────┐
│   RLS no Supabase garante       │
│   que vê apenas dados permitos  │
└─────────────────────────────────┘
```

---

## 📦 Camadas de Aplicação

### 1️⃣ **Presentation Layer (UI)**
- Componentes React em `app/`
- Estilos com Tailwind CSS + CSS variables
- Temas: light, dark, sepia (localStorage)
- Responsive: mobile-first

### 2️⃣ **API Layer**
- Route handlers em `app/api/`
- RESTful endpoints
- Validação de input
- Tratamento de erros centralizado

### 3️⃣ **Business Logic Layer**
- Funções em `lib/`
- RLS policies no Supabase
- Gemini Image Generation
- RSS parsing

### 4️⃣ **Data Access Layer**
- Supabase SDK (server + client)
- Migrations SQL
- Row Level Security

### 5️⃣ **External Services**
- Supabase Auth
- Gemini API
- WhatsApp Business API (opcional)
- Vercel Cron Jobs

---

## 🔄 Fluxos Principais

### A. Publicar um Artigo

```
1. Admin cria/importa artigo
2. RSS sincroniza ou editor insere manualmente
3. Artigo fica em status 'pending'
4. Editor vê fila em /admin/artigos
5. Clica e abre /admin/artigos/[id]
6. Editor copia contexto → invoca skill de análise
7. Análise é feita via /legal-moreira:analise-juridica
8. Editor cola análise no textarea
9. Clica "Publicar" → PATCH /api/artigos/[id]
10. Status vira 'publicado' → aparece em /despacho
```

### B. Registrar Interesse de Adoção

```
1. Visitante acessa /amaa
2. Vê card de animal com botão "Quero adotar"
3. Clica → Modal abre
4. Preenche: Nome + CPF (validado)
5. Clica "Registrar Interesse"
6. POST /api/amaa/adoption-interests
7. API: valida CPF → armazena no banco → envia WhatsApp
8. Fátima recebe mensagem
9. Visitante vê "Sucesso!" + notificação verde
```

### C. Sincronizar RSS Automático

```
1. Vercel Cron dispara /api/rss/refresh (1x/hora)
2. API busca URLs configuradas em lib/rss/sources.ts
3. Parse XML → extrai artigos
4. Para cada artigo: verifica se já existe (source_url)
5. Se novo: insere com status 'pending'
6. Se imagem não existe: Gemini gera
7. Log em console
```

---

## 🗄️ Database Design

### Principais Tabelas

| Tabela | Descrição | RLS |
|--------|-----------|-----|
| `auth.users` | Usuários Supabase | ✅ |
| `profiles` | Perfil + role | ✅ |
| `articles` | Artigos do portal | ✅ |
| `rss_sources` | Fontes monitoradas | ✅ |
| `animals` | Animais AMAA | ✅ |
| `denuncias` | Denúncias de maus-tratos | ✅ |
| `interesses_adocao` | Interesse de adoção | ✅ |

**RLS Policy Pattern:**
```sql
-- Público lê dados publicados
CREATE POLICY "public_read" ON articles
  FOR SELECT USING (status = 'published');

-- Admin/editor gerenciam
CREATE POLICY "admin_editor_all" ON articles
  FOR ALL USING (current_user_role() IN ('admin', 'editor'));
```

---

## 🎨 Design Patterns Usados

### 1. **Server Components + Client Components**
```tsx
// app/amaa/page.tsx — Server Component (async)
export default async function AmaaPage() {
  const animais = await getAnimaisDisponiveis()
  return (
    <AmaaClientWrapper> {/* Client Component */}
      <main>... animais renderizados ...</main>
    </AmaaClientWrapper>
  )
}
```

### 2. **Custom Hooks**
```tsx
// lib/hooks/useAuth.ts
export function useAuth() {
  const [user, setUser] = useState(null)
  const [role, setRole] = useState(null)
  // ... lógica de auth
}
```

### 3. **Route Protection**
```tsx
// proxy.ts
const protectedRoutes = ['/admin', '/admin/*']
// Intercepta automaticamente
```

### 4. **Event-Driven Modal**
```tsx
// Dispara event customizado
window.dispatchEvent(
  new CustomEvent('openAdoptionModal', {
    detail: { animalId, animalName }
  })
)

// AmaaClientWrapper escuta
window.addEventListener('openAdoptionModal', handleOpen)
```

---

## ⚡ Performance Optimizations

| Otimização | Implementação |
|------------|---------------|
| **ISR** | `export const revalidate = 300` (5 min cache) |
| **Image Optimization** | Next.js `Image` component |
| **Code Splitting** | Dynamic imports automáticos |
| **Bundle Analysis** | Vercel Web Analytics |
| **CSS-in-JS** | Tailwind (JIT compilation) |
| **Database Indexing** | Índices em `status`, `created_at`, `slug` |

---

## 🔄 CI/CD Pipeline

```
┌──────────────────┐
│  git push main   │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  GitHub Actions  │ (se configurado)
│  - Lint          │
│  - Tests         │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│  Vercel Deploy   │
│  - Build         │
│  - Test          │
│  - Preview       │
│  - Production    │
└────────┬─────────┘
         │
         ↓
┌──────────────────┐
│ moreiraneto.adv. │
│      br          │
└──────────────────┘
```

---

## 🛠️ Tech Stack Detalhado

### Frontend
- **Next.js 14** — Framework React com SSR/SSG
- **TypeScript** — Type safety
- **Tailwind CSS** — Utility-first styling
- **React 18** — UI components
- **Lucide React** — Ícones

### Backend
- **Node.js 18+** — Runtime
- **Supabase** — PostgreSQL + Auth + Storage
- **Google Gemini** — Image generation

### External APIs
- **WhatsApp Business API** — Notificações
- **Vercel Cron** — Sincronização RSS automática

### DevOps
- **Vercel** — Hosting + CI/CD
- **GitHub** — Versionamento
- **Supabase** — Cloud Database

---

## 📋 Decisões de Arquitetura & Rationale

### 1. **Por que Next.js 14 App Router?**
✅ Server Components nativo  
✅ Routing simplificado  
✅ API Routes integradas  
✅ Suporte a SSR/SSG/ISR  

### 2. **Por que Supabase?**
✅ PostgreSQL managed  
✅ Auth integrado  
✅ RLS nativa (segurança)  
✅ Real-time subscriptions  
✅ Free tier generoso  

### 3. **Por que Tailwind CSS?**
✅ Desenvolvimento rápido  
✅ Tema customizável (CSS variables)  
✅ Não precisa escrever CSS  
✅ Performance (JIT)  

### 4. **Por que Gemini para imagens?**
✅ Geração automática de imagens  
✅ Free tier: 500 gerações/dia  
✅ Alternativa barata ao Unsplash/Pexels  

---

## 🚨 Pontos Críticos

| Ponto | Status | Solução |
|-------|--------|---------|
| WhatsApp API | ⚠️ Optional | Fallback via logs |
| RSS sources | ⚠️ Hardcoded | Movida para admin soon |
| Gemini quota | ⚠️ 500/dia | Upgrade conforme necessário |
| Rate limiting | ❌ TODO | Implementar Redis next |
| Email | ❌ TODO | Resend integration |

---

**Status:** ✅ Arquitetura sólida e produção-ready  
*Para dúvidas técnicas, veja COMPONENTS.md ou API.md*
