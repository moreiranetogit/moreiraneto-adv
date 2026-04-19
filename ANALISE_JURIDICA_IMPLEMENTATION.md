# 🧠 Implementação: Integração com Skill de Análise Jurídica

**Data:** 2026-04-14  
**Status:** ✅ Pronto para usar

---

## 📦 O Que Foi Criado

### **1. Componente AnalysisGenerator** 
`app/admin/artigos/[id]/AnalysisGenerator.tsx`

Componente React que:
- ✅ Detecta se artigo já tem análise
- ✅ Se tem: mostra resumo em verde com indicador ✓
- ✅ Se não tem: mostra painel laranja com opções
- ✅ Botão "Copiar Contexto" — copia dados do artigo em formato estruturado
- ✅ Botão "Gerar com IA" — orienta editor a invocar a skill
- ✅ Design intuitivo com feedback visual

**Características:**
```typescript
interface AnalysisGeneratorProps {
  artigo: Article           // Artigo para análise
  analiseExistente?: string // Análise já existente (opcional)
  onAnaliseGerada?: (analise: string) => void  // Callback ao gerar
}
```

**Contexto gerado para a skill:**
```
### Artigo para Análise Jurídica
- Título: [...]
- Categoria: [...]
- Fonte: [...]
- URL Original: [...]
- Resumo: [...]
- Conteúdo: [...]

Instruções:
1. Analise com profundidade
2. Identifique temas principais
3. Relacione com jurisprudência (STJ, STF, TCU)
4. Foque em Direito Agrário, Agronegócio, Civil
5. Considere público sudoeste paranaense
6. Gere análise clara e prática
```

### **2. Página de Revisão Reescrita**
`app/admin/artigos/[id]/page.tsx`

**Melhorias implementadas:**
- ✅ Carrega artigo do Supabase (`GET /api/artigos/[id]`)
- ✅ Mostra notícia original com metadata completa
- ✅ Integra AnalysisGenerator para gerar análise
- ✅ Campo de textarea para editar/colar análise
- ✅ 3 botões de ação:
  - **"✓ Publicar"** — Publica com análise (status='publicado')
  - **"📝 Salvar Rascunho"** — Salva sem publicar
  - **"❌ Descartar"** — Rejeita artigo

**Funcionalidades:**
```typescript
// Busca artigo
await fetch(`/api/artigos/${id}`)

// Salva análise
await fetch(`/api/artigos/${id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    analise_texto: analise,
    analise_editada_manualmente: true
  })
})

// Publica
await fetch(`/api/artigos/${id}`, {
  method: 'PATCH',
  body: JSON.stringify({
    status: 'publicado',
    analise_texto: analise
  })
})

// Descarta
await fetch(`/api/artigos/${id}`, {
  method: 'DELETE'
})
```

### **3. Guia Completo para Editores**
`GUIDE_ANALISE_JURIDICA.md`

Documentação passo-a-passo com:
- 7 passos detalhados (copiar → invocar skill → colar → publicar)
- Screenshot do que esperar
- Boas práticas e dicas
- Troubleshooting de problemas
- Exemplo real de análise
- Fluxo completo RSS → Editorial → Portal

---

## 🔄 Fluxo de Uso

```
┌─────────────────────────────────────────────────────────────┐
│ EDITOR acessa /admin/artigos/[id]                           │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Vê notícia original + AnalysisGenerator com:                │
│ • Se tem análise: Mostra ✓ com resumo (verde)              │
│ • Se não tem: Painel laranja com opções                    │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Editor clica "Copiar Contexto"                              │
│ → Dados do artigo são copiados para clipboard               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Editor abre nova conversa                                    │
│ → Digita: /legal-moreira:analise-juridica                   │
│ → Cola o contexto copiado                                   │
│ → Aguarda skill gerar análise                               │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Skill retorna análise completa com:                         │
│ • Tema central identificado                                  │
│ • Jurisprudência relevante (STJ, STF, TCU)                 │
│ • Implicações práticas para região                          │
│ • Conclusões executivas                                      │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Editor copia análise gerada                                 │
│ → Volta para /admin/artigos/[id]                            │
│ → Cola no campo de "Editar Análise"                         │
│ → Faz ajustes se necessário                                 │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Editor clica:                                                │
│ • "✓ Publicar" → Notícia + análise vão ao vivo             │
│ • "📝 Salvar Rascunho" → Para continuar depois              │
│ • "❌ Descartar" → Rejeita notícia                          │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ Se publicou:                                                │
│ → Notícia aparece em /noticias-e-opinioes                  │
│ → Com análise jurídica profissional e jurisprudência        │
│ → Leitores podem ler artigo completo                        │
└─────────────────────────────────────────────────────────────┘
```

---

## 🎨 Interface Visual

### **Quando análise NÃO existe (Painel Laranja):**
```
┌──────────────────────────────────────────────────┐
│ 🧠 Gerar Análise Jurídica Automática             │
├──────────────────────────────────────────────────┤
│ Use a skill /legal-moreira:analise-juridica      │
│ para gerar uma análise profunda deste artigo.    │
│ O contexto será copiado automaticamente.         │
│                                                  │
│ 📊 Dados disponíveis para análise:               │
│ • 📰 Título: [título do artigo]                 │
│ • 📂 Categoria: [categoria]                      │
│ • 🔗 Fonte: [fonte]                              │
│ • 📄 Conteúdo: [N] caracteres                    │
│                                                  │
│ [Copiar Contexto] [Gerar com IA]                │
│                                                  │
│ 💡 Cole o contexto em uma nova conversa         │
│    e use a skill para gerar a análise.          │
└──────────────────────────────────────────────────┘
```

### **Quando análise JÁ existe (Card Verde):**
```
┌──────────────────────────────────────────────────┐
│ ✓ Análise Gerada                                │
├──────────────────────────────────────────────────┤
│ "STJ reconhece direito de produtor rural...     │
│  TEMA CENTRAL: Reconhecimento de direitos...    │
│  JURISPRUDÊNCIA: STJ REsp nº XXXX/XX..."        │
│                                                  │
│ 💡 Edite o campo de análise abaixo se desejar  │
└──────────────────────────────────────────────────┘
```

---

## 🔐 Segurança & Validação

- ✅ Endpoint `/api/artigos/[id]` requer autenticação
- ✅ PATCH/DELETE validam role do usuário
- ✅ Análise nunca é obrigatória antes de publicar
- ✅ Campo analise_editada_manualmente registra se foi editada manualmente
- ✅ Timestamp de criação preservado

---

## 🧪 Como Testar

### **Teste 1: Gerar Análise**
```bash
1. Acesse http://localhost:3000/admin/artigos
2. Crie uma notícia teste (ou espere RSS criar uma)
3. Clique "Revisar"
4. Veja o painel laranja "Gerar Análise Jurídica"
5. Clique "Copiar Contexto"
6. Abra nova conversa
7. Digite: /legal-moreira:analise-juridica
8. Cole o contexto
9. Aguarde análise ser gerada
10. Copie resultado
11. Volte para /admin/artigos/[id]
12. Cole no campo de análise
13. Clique "Publicar"
```

### **Teste 2: Editar Análise**
```bash
1. Após publicar, volte à página
2. Veja ✓ Análise Gerada em verde
3. Edite o campo de análise
4. Clique "Salvar Rascunho"
5. Verifique que foi salvo
```

### **Teste 3: Descartar**
```bash
1. Clique "Descartar"
2. Confirme no modal
3. Volte para /admin/artigos
4. Verifique que artigo desapareceu
```

---

## 📊 Arquitetura Técnica

```
Frontend:
  AnalysisGenerator.tsx ──┐
        │                 │
        └─ Copia contexto em formato estruturado
        │
        └─ Instrui editor a invocar skill manualmente
        │
        └─ Campo textarea para colar resultado

Dados fluem:
  Article (BD) 
    ├─ title, excerpt, content
    ├─ source_name, source_url
    └─ category, published_at
         ↓
    [Contexto estruturado]
         ↓
    [Copiado para clipboard]
         ↓
    [Editor invoca skill em nova conversa]
         ↓
    [Skill gera análise com jurisprudência]
         ↓
    [Editor cola resultado]
         ↓
    [PATCH /api/artigos/[id] salva]
         ↓
    [article.analise_texto atualizado]
```

---

## 🚀 Próximos Passos

**Fase 3 — Futuro:**
- [ ] Integrar skill de forma ainda mais automática (webhook)
- [ ] Gerar imagens automáticas via Gemini
- [ ] Dashboard com estatísticas de análises
- [ ] Sistema de templates de análise
- [ ] Integração com Instagram (postar com análise)

---

## 📚 Documentação Complementar

- **GUIDE_ANALISE_JURIDICA.md** — Passo-a-passo completo para editores
- **QUICK_START.md** — Setup rápido do projeto
- **IMPLEMENTATION_PHASE_2.md** — Visão geral da Fase 2

---

**Status:** ✅ Sistema completo e pronto para uso  
**Integração:** Manual (editor invoca skill) + UI automática (copiar contexto)  
**Qualidade:** Profissional, segura e intuitiva

---

*Desenvolvido com ❤️ para moreiraneto.adv.br*
