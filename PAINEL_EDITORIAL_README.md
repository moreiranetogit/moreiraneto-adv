# 📰 PAINEL EDITORIAL — RADAR JURÍDICO MNA

## 📋 Visão Geral

Sistema completo de gestão editorial para o **Radar Jurídico** do Moreira Neto Advocacia.

Permite:
- ✅ Busca automática de notícias jurídicas de 11 fontes especializadas
- ✅ Análise automática com a skill `/legal-moreira:analise-juridica`
- ✅ Adição manual de artigos via link ou texto
- ✅ Dashboard editorial com filtros e busca
- ✅ Revisão de cada artigo antes de publicação
- ✅ Edição de análises e comentários
- ✅ Publicação com um clique
- ✅ Integração futura com Instagram (automático)

---

## 🏗️ Arquitetura

```
PAINEL EDITORIAL
│
├─ Dashboard (/admin/artigos)
│  ├─ Lista de notícias pendentes
│  ├─ Filtros: categoria, fonte, status, busca
│  ├─ Botão "Adicionar notícia manual"
│  └─ Card com ações (revisar, descartar)
│
├─ Revisão (/admin/artigos/[id])
│  ├─ Notícia original (título, resumo, fonte)
│  ├─ Análise jurídica (editável)
│  ├─ Preview de publicação
│  └─ Ações: Aprovar & Publicar | Descartar | Salvar Rascunho
│
└─ API Endpoints
   ├─ GET /api/artigos (listar com filtros)
   ├─ POST /api/artigos (criar artigo)
   ├─ GET /api/artigos/[id] (obter artigo)
   ├─ PATCH /api/artigos/[id] (atualizar status/análise)
   ├─ DELETE /api/artigos/[id] (descartar)
   └─ POST /api/artigos/[id]/analisar (gerar análise automática)
```

---

## 🗄️ Banco de Dados (Supabase)

### Tabelas

#### `artigos`
Notícias jurídicas com análises.

```sql
artigos {
  id: BIGSERIAL PRIMARY KEY
  titulo: TEXT NOT NULL
  slug: TEXT UNIQUE NOT NULL
  descricao: TEXT (resumo)
  conteudo: TEXT (conteúdo completo)
  categoria_id: BIGINT FOREIGN KEY
  fonte_nome: TEXT (ex: "STJ", "Conjur")
  fonte_url: TEXT (URL original)
  fonte_id: BIGINT FOREIGN KEY
  analise_texto: TEXT (análise MNA)
  analise_gerada_em: TIMESTAMP
  analise_editada_manualmente: BOOLEAN
  status: TEXT ('pendente'|'aprovado'|'publicado'|'rejeitado')
  data_publicacao: TIMESTAMP
  views_count: INTEGER
  criado_por: UUID FOREIGN KEY
  criado_em: TIMESTAMP
  atualizado_em: TIMESTAMP
}
```

#### `fontes_rss`
Fontes monitoradas para busca automática.

```sql
fontes_rss {
  id: BIGSERIAL PRIMARY KEY
  nome: TEXT NOT NULL (ex: "STJ", "Conjur")
  url: TEXT UNIQUE NOT NULL
  tipo: TEXT ('rss' | 'web')
  categoria_id: BIGINT FOREIGN KEY
  ativo: BOOLEAN DEFAULT true
  ultima_busca: TIMESTAMP
}
```

#### `categorias`
Categorias de direito (Agrário, Civil, Trabalhista, etc).

```sql
categorias {
  id: BIGSERIAL PRIMARY KEY
  slug: TEXT UNIQUE
  nome: TEXT
  descricao: TEXT
  cor: TEXT (hex color)
  ativo: BOOLEAN
}
```

#### `artigos_acoes`
Histórico: quando aprovado, rejeitado, publicado, etc.

```sql
artigos_acoes {
  id: BIGSERIAL PRIMARY KEY
  artigo_id: BIGINT FOREIGN KEY
  acao: TEXT ('aprovado'|'rejeitado'|'editado'|'publicado')
  comentario: TEXT
  realizado_por: UUID FOREIGN KEY
  realizado_em: TIMESTAMP
}
```

#### `artigos_analise_historico`
Rastreamento de mudanças na análise.

```sql
artigos_analise_historico {
  id: BIGSERIAL PRIMARY KEY
  artigo_id: BIGINT FOREIGN KEY
  analise_anterior: TEXT
  analise_nova: TEXT
  motivo_edicao: TEXT
  editado_por: UUID FOREIGN KEY
  editado_em: TIMESTAMP
}
```

---

## 🔌 Fontes de Notícias Monitoradas

| Fonte | URL | Tipo | Categoria |
|-------|-----|------|-----------|
| STJ | https://www.stj.jus.br/sites/rss/RssTitulos | RSS | Direito Geral |
| STF | https://www.stf.jus.br/rss/rss.xml | RSS | Direito Geral |
| TST | https://www.tst.jus.br/ | Web | Direito Trabalhista |
| Conjur | https://www.conjur.com.br/feed.xml | RSS | Direito Geral |
| Migalhas | https://www.migalhas.com.br/feed | RSS | Direito Geral |
| Direito Rural | https://direitorural.com.br/feed/ | RSS | Direito Agrário |
| Direito Agrário | https://direitoagrario.com/feed/ | RSS | Direito Agrário |
| Direito News | https://www.direitonews.com.br/feed | RSS | Direito Geral |
| A Modireito | https://www.amodireito.com.br/feed | RSS | Direito Geral |
| CNA Brasil | https://www.cnabrasil.org.br/feed | RSS | Direito Agrário |
| The Agribiz | https://www.theagribiz.com/feed | RSS | Direito Agrário |
| Agrolink | https://www.agrolink.com.br/rss.xml | RSS | Direito Agrário |

---

## 🎯 Fluxo Completo

### 1️⃣ BUSCA AUTOMÁTICA (Cron Job — Futuro)

```
Cron Job (a cada 2 horas)
  ↓
Busca RSS de todas as fontes ativas
  ↓
Deduplica notícias existentes
  ↓
Extrai: título, resumo, link, data
  ↓
Cria registro em artigos com status='pendente'
  ↓
Chama skill /legal-moreira:analise-juridica
  ↓
Salva análise no campo analise_texto
  ↓
Admin vê no dashboard
```

### 2️⃣ ADIÇÃO MANUAL

```
Admin clica "Adicionar"
  ↓
Preenche: título, descrição, fonte, categoria
  ↓
POST /api/artigos
  ↓
Cria registro com status='pendente'
  ↓
Vai para dashboard
```

### 3️⃣ REVISÃO & ANÁLISE

```
Admin clica "Revisar" em uma notícia
  ↓
/admin/artigos/[id] abre
  ↓
Vê: notícia original + análise gerada
  ↓
Pode:
  - Editar análise manualmente
  - Clicar "Gerar Análise" para atualizar
  - Aprovar e publicar
  - Descartar
```

### 4️⃣ PUBLICAÇÃO

```
Admin clica "Aprovar e Publicar"
  ↓
PATCH /api/artigos/[id] { status: 'publicado' }
  ↓
Artigo aparece em /despacho
  ↓
Registra ação em artigos_acoes
  ↓
(Futuro) Gera post Instagram e envia automaticamente
```

---

## 🛠️ Como Usar — Admin

### Dashboard (`/admin/artigos`)

1. **Ver pendentes:**
   - Acesse `/admin/artigos`
   - Filtre por status "Pendentes"
   - Veja lista de notícias para revisar

2. **Adicionar notícia:**
   - Clique "+ Adicionar"
   - Preencha: título, descrição, texto/link
   - Selecione categoria
   - Clique "Adicionar"

3. **Revisar notícia:**
   - Clique "Revisar" em qualquer card
   - Edite a análise se necessário
   - Clique "Aprovar e Publicar"

### Página de Revisão (`/admin/artigos/[id]`)

1. **Ver notícia original:**
   - Título, resumo, fonte
   - Link para original

2. **Editar análise:**
   - Campo de texto editável
   - Pode colar análise manual ou deixar a gerada

3. **Gerar análise automática:**
   - Botão "Gerar Análise" chama a skill
   - Skill `/legal-moreira:analise-juridica` processa

4. **Aprovar:**
   - "Aprovar e Publicar" → publica em `/despacho`
   - "Salvar Rascunho" → salva sem publicar
   - "Descartar" → rejeita artigo

---

## 📁 Estrutura de Arquivos

```
/app/admin/artigos/
├─ page.tsx                    # Dashboard (lista, filtros, adicionar)
└─ [id]/
   └─ page.tsx                 # Revisão de artigo individual

/app/api/artigos/
├─ route.ts                    # GET (listar), POST (criar)
└─ [id]/
   ├─ route.ts                 # GET, PATCH, DELETE
   └─ analisar/
      └─ route.ts              # POST (gerar análise automática)

/supabase/
└─ artigos-schema.sql          # Schema completo (todas as tabelas)
```

---

## 🔑 Ambientes Necessários

No `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIs...
GEMINI_API_KEY=AIzaSy...  # Para gerar imagens (futuro)
```

---

## ⚙️ Próximas Etapas

### Fase 2 (Implementar depois):
- [ ] Cron job de busca automática (RSS + web scraping)
- [ ] Chamada real à skill `/legal-moreira:analise-juridica`
- [ ] Sistema de deduplição de notícias
- [ ] Integração Instagram automática (webhook)
- [ ] Página pública `/despacho` (portal de notícias)
- [ ] Filtros avançados e busca full-text
- [ ] Exportação em PDF
- [ ] Agendamento de publicação

### Melhorias de UX:
- [ ] Drag-and-drop para reordenar
- [ ] Bulk actions (aprovar múltiplos)
- [ ] Preview de publicação em tempo real
- [ ] Comments/notas privadas no artigo
- [ ] Notificações (Slack, email) quando nova notícia
- [ ] Estatísticas (notícias/mês, categorias mais lidas)

---

## 🧪 Testes Sugeridos

1. **Criar notícia manual:**
   - Acesse `/admin/artigos`
   - Clique "+ Adicionar"
   - Preencha dados de teste
   - Verifique se aparece no dashboard

2. **Revisar notícia:**
   - Clique "Revisar" em uma notícia
   - Edite análise
   - Clique "Salvar Rascunho"
   - Verifique se salva (PATCH)

3. **Aprovar e publicar:**
   - Clique "Aprovar e Publicar"
   - Status muda para 'publicado'
   - Nota: página `/despacho` ainda não existe (Fase 2)

4. **Descartar:**
   - Clique "Descartar"
   - Status muda para 'rejeitado'
   - Artigo sai do dashboard de pendentes

---

## 📚 Integração com Skills

### `/legal-moreira:analise-juridica`

**Quando usar:** Ao revisar notícia ou clicar "Gerar Análise"

**Entrada:**
```json
{
  "titulo": "STJ reconhece direito agrário em caso de arrendamento",
  "descricao": "Tribunal decidiu sobre conformidade contratual",
  "conteudo": "Conteúdo da notícia...",
  "fonte_nome": "STJ",
  "categoria": "Direito Agrário",
  "instrucao": "Analise esta notícia jurídica com viés para advogados especializados em direito agrário e agronegócio. Explique a importância, implicações práticas e como afeta os clientes do escritório."
}
```

**Saída:**
```text
[ANÁLISE - Moreira Neto Advocacia]

Importância: Esta decisão impacta diretamente contratos de arrendamento rural...
Implicações práticas: Recomendamos revisar todos os contratos em vigor...
Cliente-foco: Produtores rurais com arrendamentos podem agora...
```

---

## 💾 Backup & Manutenção

- **Backup automático:** Supabase (automático)
- **Limpeza de antigos:** Rodar query de arquivamento mensal
- **Índices:** Já criados no schema (performance OK)

---

## 📞 Suporte

Para dúvidas sobre o painel:
- Leia `supabase/artigos-schema.sql` (schema com comentários)
- Verifique `app/api/artigos/` (endpoints documentados)
- Teste em `/admin/artigos` (interface pronta)

---

**Versão:** 1.0  
**Data:** 2026-04-14  
**Status:** 🟢 Pronto para testes (Dashboard + API básica)  
**Próximo:** Implementar busca automática e integração real com skill
