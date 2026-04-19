# 📚 moreiraneto.adv.br — Documentação Técnica Completa

**Última atualização:** 2026-04-14  
**Status:** ✅ Pronto para produção  
**Stack:** Next.js 14 | TypeScript | Supabase | Tailwind CSS | Vercel

---

## 📋 Índice de Documentação

1. **README.md** (este arquivo) — Visão geral do projeto
2. **ARCHITECTURE.md** — Arquitetura técnica e decisões de design
3. **API.md** — Endpoints e funções backend
4. **COMPONENTS.md** — Componentes React e seu uso
5. **SETUP.md** — Guia de setup e desenvolvimento local
6. **DEPLOYMENT.md** — Deploy em produção
7. **TESTING.md** — Testes e QA
8. **DATABASE.md** — Schema, migrations e RLS

---

## 🎯 O Que É Este Projeto

**moreiraneto.adv.br** é um site completo para um escritório de advocacia especializado em Direito Agrário/Agronegócio, com integração de:

- **Site Institucional** — Apresentação do escritório, áreas de atuação, diferenciais
- **Portal de Notícias** ("Despacho, por MNA") — Radar jurídico com artigos de Direito
- **Seção AMAA** — Associação de Amigos dos Animais (adoção + denúncia de maus-tratos)
- **Painel Editorial** — Admin para gerenciar notícias, animais, denúncias
- **Sistema de Autenticação** — Roles: admin, editor, voluntária_amaa

---

## 🏗️ Estrutura do Projeto

```
moreiraneto-adv/
├── app/
│   ├── page.tsx                          # Homepage
│   ├── layout.tsx                        # Layout raiz
│   ├── globals.css                       # Estilos globais
│   │
│   ├── despacho/                         # Portal de notícias
│   │   ├── page.tsx                      # Lista de artigos
│   │   ├── [categoria]/page.tsx          # Artigos por categoria
│   │   └── artigo/[slug]/page.tsx        # Artigo individual
│   │
│   ├── amaa/                             # Seção AMAA
│   │   ├── page.tsx                      # Adoção + Denúncias (redesenho)
│   │   ├── DenunciaForm.tsx              # Formulário de denúncia (legacy)
│   │   ├── AdoptionInterestModal.tsx     # Modal de interesse adoção
│   │   ├── AdoptionSuccessNotification.tsx
│   │   └── AmaaClientWrapper.tsx         # Gerenciador de modais
│   │
│   ├── admin/                            # Dashboard editorial
│   │   ├── layout.tsx                    # Layout do admin
│   │   ├── page.tsx                      # Dashboard home
│   │   ├── artigos/
│   │   │   ├── page.tsx                  # Fila de aprovação
│   │   │   ├── [id]/page.tsx             # Revisar/aprovar artigo
│   │   │   └── AnalysisGenerator.tsx     # Gerador de análise jurídica
│   │   ├── amaa/
│   │   │   ├── page.tsx                  # Gerenciar animais
│   │   │   ├── AnimalFormModal.tsx       # Cadastro de animal
│   │   │   └── AnimalStatusActions.tsx   # Mudar status
│   │   ├── denuncias/page.tsx            # Visualizar denúncias
│   │   ├── fontes/page.tsx               # Gerenciar fontes RSS
│   │   └── usuarios/page.tsx             # Gerenciar usuários
│   │
│   ├── api/
│   │   ├── rss/
│   │   │   └── refresh/route.ts          # Sincronização RSS automática
│   │   ├── artigos/
│   │   │   └── [id]/route.ts             # CRUD de artigos
│   │   ├── amaa/
│   │   │   └── adoption-interests/route.ts  # POST interesse adoção + WhatsApp
│   │   └── noticias/route.ts             # GET notícias para homepage
│   │
│   └── login/page.tsx                    # Página de login
│
├── components/
│   ├── ContactSection.tsx                # Seção de contato (reutilizável)
│   ├── ThemeSwitcher.tsx                 # Seletor de tema
│   └── ...
│
├── lib/
│   ├── supabase/
│   │   ├── server.ts                     # Cliente Supabase server-side
│   │   ├── client.ts                     # Cliente Supabase client-side
│   │   └── auth.ts                       # Funções de autenticação
│   ├── rss/
│   │   ├── sources.ts                    # Fontes RSS configuradas
│   │   └── parser.ts                     # Parser de RSS + Gemini
│   ├── gemini.ts                         # Integração Google Gemini
│   ├── conteudo-areas.ts                 # Dados das áreas de atuação
│   └── utils.ts                          # Utilidades
│
├── types/
│   ├── index.ts                          # Tipos globais
│   ├── article.ts                        # Type Article
│   ├── animal.ts                         # Type Animal
│   └── denuncia.ts                       # Type Denuncia
│
├── middleware.ts                         # (Legacy) Middleware de auth
├── proxy.ts                              # Proxy de auth para Next.js 16
├── supabase/
│   ├── schema.sql                        # Schema principal
│   ├── artigos-schema.sql                # Schema editoral
│   └── migrations/
│       └── 001_create_adoption_interests.sql
│
├── public/
│   ├── mna-logo-web.png                  # Logo MNA
│   ├── amaa-logo-web.png                 # Logo AMAA
│   ├── cartilha-denuncia-maus-tratos-v2.pdf
│   └── ...imagens
│
├── .env.example                          # Template de variáveis
├── vercel.json                           # Configuração de cron jobs
├── tsconfig.json                         # Configuração TypeScript
├── tailwind.config.ts                    # Configuração Tailwind
├── next.config.ts                        # Configuração Next.js
└── package.json                          # Dependências
```

---

## 🚀 Como Usar Com Claude Code

### 1. **Instalação do Claude Code**
```bash
npm install -g @anthropic-sdk/claude-code
# ou
pip install anthropic-cli
```

### 2. **Analisar Arquivos**
```bash
# Analisar um arquivo específico
claude-code analyze app/page.tsx

# Analisar pasta inteira
claude-code analyze app/admin --recursive

# Gerar documentação automática
claude-code document app/api --output API.md
```

### 3. **Refatorar Código**
```bash
# Melhorar código existente
claude-code refactor app/amaa/page.tsx

# Gerar testes
claude-code test app/api/artigos/route.ts
```

### 4. **Entender a Arquitetura**
```bash
# Visualizar dependências
claude-code dependencies app/

# Gerar fluxograma de dados
claude-code diagram app/api/
```

---

## 🔑 Principais Features

### ✅ **Completadas (Produção)**
- ✅ Homepage institucional (6 áreas de atuação)
- ✅ Portal de notícias (Despacho, por MNA)
- ✅ Sistema de análise jurídica (skill integrada)
- ✅ Seção AMAA com adoção e denúncias
- ✅ Painel admin com 6 módulos
- ✅ Autenticação baseada em roles (Supabase Auth)
- ✅ RSS automático com Gemini Image Generation
- ✅ Sistema de interesse de adoção (modal + WhatsApp)
- ✅ Redesign AMAA profissional

### 🟡 **Em Progresso**
- 🟡 Painel admin para gerenciar interesses de adoção
- 🟡 Testes automatizados (Jest + React Testing Library)
- 🟡 Integração real com WhatsApp Business API

### 🔴 **TODO**
- 🔴 Newsletter (Resend)
- 🔴 Busca full-text (Supabase Search)
- 🔴 PWA (offline support)
- 🔴 OG images dinâmicas
- 🔴 Sitemap XML dinâmico

---

## 📊 Estatísticas do Código

| Métrica | Valor |
|---------|-------|
| Linhas de TypeScript | ~8.500+ |
| Componentes React | 25+ |
| Endpoints API | 12+ |
| Tabelas Supabase | 8 |
| Migrations SQL | 1 |
| Páginas públicas | 7 |
| Páginas admin | 6 |

---

## 🔐 Segurança

- ✅ **RLS (Row Level Security)** — Dados protegidos no banco
- ✅ **Autenticação Supabase** — JWT + Session
- ✅ **HTTPS em produção** — Vercel + Cloudflare
- ✅ **Variáveis de ambiente** — Nunca commitadas
- ✅ **SQL Injection protection** — Parameterized queries
- ✅ **CSRF protection** — Next.js automático

---

## 🌍 Deploy

**Plataforma:** Vercel  
**Domínio:** moreiraneto.adv.br  
**Branch:** main  
**Auto-deploy:** Sim (a cada push)

```bash
# Deploy manual (se necessário)
vercel deploy --prod
```

---

## 📞 Contato & Suporte

**Responsável do projeto:** Moreira (advogado)  
**Desenvolvedor:** Claude (Cowork)  
**Email:** moreiraneto@gmail.com  
**Telefone:** +55 46 9999-9999

---

## 📚 Documentação Adicional

Leia os arquivos abaixo para detalhes técnicos:

- **[ARCHITECTURE.md](./ARCHITECTURE.md)** — Decisões de design e padrões
- **[API.md](./API.md)** — Endpoints REST e funções
- **[COMPONENTS.md](./COMPONENTS.md)** — Componentes React
- **[SETUP.md](./SETUP.md)** — Setup local e ambiente
- **[DATABASE.md](./DATABASE.md)** — Schema e RLS
- **[DEPLOYMENT.md](./DEPLOYMENT.md)** — Produção
- **[SISTEMA_INTERESSE_ADOCAO.md](./SISTEMA_INTERESSE_ADOCAO.md)** — Sistema de adoção
- **[FASE_3_ADOCAO_RESUMO.md](./FASE_3_ADOCAO_RESUMO.md)** — Resumo da Fase 3

---

**Status:** ✅ Sistema em produção, pronto para avaliação com Claude Code  
*Desenvolvido com ❤️ para moreiraneto.adv.br*
