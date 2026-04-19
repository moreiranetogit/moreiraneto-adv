# 📋 Fase 2 — Implementação Completa ✅

**Data:** 2026-04-14  
**Status:** 🟢 Pronto para testes  
**Sessão:** Continuação do desenvolvimento do painel editorial

---

## O que foi implementado nesta fase

### 🔌 **Gerenciamento de Fontes RSS**

#### Arquivo: `app/admin/fontes/page.tsx`
- ✅ Dashboard para visualizar todas as fontes RSS configuradas
- ✅ Adicionar nova fonte RSS (nome, URL, tipo, categoria)
- ✅ Editar fonte existente
- ✅ Deletar fonte
- ✅ Ativar/desativar fonte (checkbox com visual de Eye/EyeOff)
- ✅ Mostrar última sincronização (data/hora)
- ✅ Filtros por tipo (RSS, Web Scraping) e categoria

#### API Endpoints:
- `GET /api/rss/fontes` — Listar todas as fontes
- `POST /api/rss/fontes` — Criar nova fonte
- `PATCH /api/rss/fontes/[id]` — Atualizar fonte
- `DELETE /api/rss/fontes/[id]` — Deletar fonte

#### Mapeamento de Categorias:
```typescript
direito-agrario → categoria_id: 1
direito-civil → categoria_id: 2
direito-trabalhista → categoria_id: 3
direito-familia → categoria_id: 4
direito-animal → categoria_id: 5
direito-geral → categoria_id: 6
```

---

### 🔄 **Sincronização Automática RSS (Cron Job)**

#### Arquivo: `app/api/rss/refresh/route.ts`
- ✅ Busca automaticamente artigos de fontes RSS ativas
- ✅ Cria artigos com status `pending` (para serem revistos)
- ✅ Evita duplicatas (verifica por título + fonte)
- ✅ Gera slug automático para cada artigo
- ✅ Mapeia categoria de fonte → categoria de artigo
- ✅ Atualiza `ultima_busca` em cada fonte após sincronização
- ✅ Processa até 10 itens por fonte (configurable)
- ✅ Retorna relatório detalhado da sincronização

#### Variáveis de Ambiente:
```env
CRON_SECRET=sua-chave-segura-aqui
```

#### Uso:
```bash
# Manual (teste local)
curl "http://localhost:3000/api/rss/refresh?secret=dev"

# Produção (Vercel Cron)
# Configurado automaticamente via vercel.json
```

#### Arquivo: `vercel.json`
```json
{
  "crons": [
    {
      "path": "/api/rss/refresh",
      "schedule": "0 * * * *"  // Cada hora, no topo da hora
    }
  ]
}
```

---

### 👥 **Gerenciamento de Usuários**

#### Arquivo: `app/admin/usuarios/page.tsx`
- ✅ Listar todos os usuários do painel
- ✅ Mostrar role de cada usuário (Admin, Editor, Voluntária AMAA)
- ✅ Status de ativo/inativo
- ✅ Convidar novo usuário (formulário)
- ✅ Alterar role de usuário
- ✅ Deletar usuário

#### API Endpoints:
- `GET /api/admin/usuarios` — Listar usuários
- `POST /api/admin/usuarios` — Criar/convidar novo usuário
- `PATCH /api/admin/usuarios/[id]` — Atualizar role/status
- `DELETE /api/admin/usuarios/[id]` — Deletar usuário

#### Roles Disponíveis:
| Role | Permissions |
|------|-------------|
| `admin` | Acesso total, gerenciar usuários, editar tudo |
| `editor` | Revisar/aprovar notícias, editar análises |
| `voluntaria_amaa` | Cadastrar/gerenciar animais para adoção |

---

### 🚨 **Visualização de Denúncias AMAA**

#### Arquivo: `app/admin/denuncias/page.tsx`
- ✅ Listar todas as denúncias de maus-tratos recebidas
- ✅ Filtrar por status (Nova, Em Apuração, Encerrada)
- ✅ Visualizar estatísticas (contador por status)
- ✅ Expandir denúncia para ver detalhes completos:
  - Descrição do caso
  - Frequência dos maus-tratos
  - Descrição do suspeito
  - Contato do denunciante (se não anônimo)
  - Notas internas
- ✅ Alterar status rápido (botões In-line)
- ✅ Adicionar nota interna
- ✅ Deletar denúncia

#### API Endpoints:
- `GET /api/admin/denuncias` — Listar denúncias
- `PATCH /api/admin/denuncias/[id]` — Atualizar status/notas
- `DELETE /api/admin/denuncias/[id]` — Deletar denúncia

#### Status Disponíveis:
- `nova` — 🆕 Recém-chegada
- `em_apuracao` — 🔍 Investigação em andamento
- `encerrada` — ✓ Caso encerrado

---

## Arquivos Criados/Modificados

### Páginas do Admin:
```
app/admin/fontes/page.tsx                    ✨ NEW
app/admin/usuarios/page.tsx                  ✨ NEW
app/admin/denuncias/page.tsx                 ✨ NEW
```

### Endpoints da API:
```
app/api/rss/fontes/route.ts                  ✨ NEW
app/api/rss/fontes/[id]/route.ts             ✨ NEW
app/api/rss/refresh/route.ts                 ✨ NEW
app/api/admin/denuncias/route.ts             ✨ NEW
app/api/admin/denuncias/[id]/route.ts        ✨ NEW
app/api/admin/usuarios/route.ts              ✨ NEW
app/api/admin/usuarios/[id]/route.ts         ✨ NEW
```

### Config:
```
vercel.json                                  ✨ NEW (Cron Job)
```

### Tipos:
```
types/index.ts                               ✏️ UPDATED (RSSSource)
```

---

## Fluxo Completo: Do RSS à Publicação

```
1️⃣ ADMIN CONFIGURA FONTES (app/admin/fontes)
   └─ Adiciona STJ, Conjur, etc.
   └─ Marca como "ativo"

2️⃣ CRON JOB EXECUTA A CADA HORA
   └─ GET /api/rss/refresh?secret=...
   └─ Busca feeds das fontes ativas
   └─ Cria artigos com status 'pending'
   └─ Atualiza última_busca

3️⃣ ARTIGOS CHEGAM NO DASHBOARD EDITORIAL (app/admin/artigos)
   └─ Editor vê notícias pendentes
   └─ Editor clica "Revisar"

4️⃣ EDITOR REVISA & APROVA (app/admin/artigos/[id])
   └─ Lê notícia original
   └─ Vê análise gerada (/legal-moreira:analise-juridica)
   └─ Pode editar análise
   └─ Clica "Aprovar e Publicar"
   └─ Status muda para 'publicado'

5️⃣ NOTÍCIA APARECE NO PORTAL (app/noticias-e-opinioes)
   └─ Leitores veem em homepage
   └─ Podem ler artigo completo
   └─ Veem análise jurídica
```

---

## Próximas Etapas (Fase 3)

- [ ] Gerar imagens automáticas via Gemini para artigos sem imagem
- [ ] Integração real com `/legal-moreira:analise-juridica` skill
- [ ] Sistema de upload de fotos para animais AMAA
- [ ] Webhook para enviar posts automáticos no Instagram
- [ ] Email de notificação quando artigo é publicado
- [ ] Dashboard com gráficos (artigos/mês, categorias mais lidas)
- [ ] Busca full-text no portal de notícias
- [ ] Sistema de newsletter

---

## Como Testar Tudo

### 1. Testar Gerenciamento de Fontes
```bash
npm run dev
# Acesse http://localhost:3000/admin/fontes
# Adicione uma fonte RSS
# Clique em ativar/desativar
```

### 2. Testar Sincronização Manual
```bash
curl "http://localhost:3000/api/rss/refresh?secret=dev"
# Ou manualmente: PATCH /api/rss/fontes para ativar uma fonte
```

### 3. Testar Fila Editorial
```bash
# Acesse http://localhost:3000/admin/artigos
# Verifique se artigos foram criados com status 'pending'
# Clique "Revisar" em um artigo
```

### 4. Testar Gerenciamento de Usuários
```bash
# Acesse http://localhost:3000/admin/usuarios
# Clique "Convidar Usuário"
# Preencha email e role
# (Em produção, Email de convite será enviado)
```

### 5. Testar Denúncias
```bash
# Acesse http://localhost:3000/amaa
# Envie uma denúncia de teste
# Acesse http://localhost:3000/admin/denuncias
# Verifique se aparece lá
```

---

## Variáveis de Ambiente Necessárias

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...

# Cron Job
CRON_SECRET=sua-chave-aleatoria-super-segura

# Opcional: Gemini (para gerar imagens)
GEMINI_API_KEY=AIzaSy...

# Opcional: Email (Resend ou SMTP)
RESEND_API_KEY=re_xxxxx
```

---

## Checklist de Configuração

- [ ] Execute `supabase/artigos-schema.sql` no Supabase SQL Editor
- [ ] Crie usuário admin no Supabase Auth
- [ ] Configure CRON_SECRET em `.env.local`
- [ ] Configure NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY
- [ ] Rode `npm run dev` e teste cada seção
- [ ] Deploy no Vercel (vercel.json será lido automaticamente para cron)
- [ ] Configure variáveis em Vercel Project Settings

---

## Resumo da Arquitetura

```
moreiraneto.adv.br
│
├─ / ..................... Homepage institucional MNA
├─ /despacho ............ Portal de notícias jurídicas
│  ├─ /artigo/[slug] .... Artigo individual + sidebar
│  └─ /[categoria] ...... Notícias filtradas por área
│
├─ /amaa ................ Seção pública AMAA
│  ├─ Formulário denúncia
│  └─ Lista de animais para adoção
│
├─ /login ............... Autenticação única
│
└─ /admin ............... Painel editorial protegido
   ├─ /artigos ......... Fila de notícias (criar/revisar/publicar)
   ├─ /artigos/[id] ... Revisão individual com análise
   ├─ /fontes .......... Gerenciar fontes RSS
   ├─ /usuarios ........ Gerenciar usuários/roles
   ├─ /denuncias ....... Visualizar denúncias AMAA
   └─ /amaa ............ Cadastro de animais para adoção
```

---

**Status:** 🟢 Sistema funcional com toda a infraestrutura de notícias automáticas implementada.  
**Próximo:** Testes e ajustes de performance.
