# 📚 Guia: Gerar Análise Jurídica Automática

**Como usar a integração com a skill `/legal-moreira:analise-juridica` para análises inteligentes de artigos.**

---

## 🎯 Visão Geral

Quando um artigo chega para revisão no `/admin/artigos/[id]`, você pode gerar uma **análise jurídica automática** usando a skill de análise. O processo é simples:

```
1. Editor acessa /admin/artigos/[id]
   ↓
2. Clica em "Copiar Contexto" (botão laranja)
   ↓
3. Abre uma nova conversa e invoca a skill
   ↓
4. Cola o contexto e deixa a skill analisar
   ↓
5. Copia o resultado da análise
   ↓
6. Volta para /admin/artigos/[id] e cola no campo
   ↓
7. Clica "Publicar" ou "Salvar Rascunho"
```

---

## 📋 Passo a Passo

### **Passo 1: Acessar a Página de Revisão**

```
URL: http://localhost:3000/admin/artigos/[id]
Exemplo: /admin/artigos/123abc456
```

Você verá:
- 📰 **Notícia Original** (à esquerda) - título, conteúdo, fonte
- ⚖️ **Seção de Análise** (abaixo) - onde a análise será adicionada

### **Passo 2: Copiar o Contexto**

Na seção "Gerar Análise Jurídica Automática", você verá:

```
┌─────────────────────────────────────────────┐
│ 🔄 Gerar Análise Jurídica Automática         │
│                                             │
│ Dados disponíveis para análise:             │
│ • 📰 Título: [título do artigo]            │
│ • 📂 Categoria: [categoria jurídica]        │
│ • 🔗 Fonte: [portal jurídico]              │
│ • 📄 Conteúdo: [N] caracteres              │
│                                             │
│ [Copiar Contexto] [Gerar com IA]           │
└─────────────────────────────────────────────┘
```

**Clique em "Copiar Contexto"** — o botão ficará verde com ✓ "Contexto Copiado!"

### **Passo 3: Invocar a Skill em Uma Nova Conversa**

Abra uma **nova conversa** e execute:

```
/legal-moreira:analise-juridica
```

Depois, **cole o contexto** que você copiou.

### **Passo 4: Aguarde a Análise**

A skill vai:
1. Ler o contexto do artigo
2. Identificar temas jurídicos principais
3. Relacionar com jurisprudência (STJ, STF, TCU)
4. Gerar uma análise focada em Direito Agrário, Civil, Agronegócio
5. Considerar o público-alvo (sudoeste paranaense)

**Análise típica:**
```
[Título do Artigo] — Análise Jurídica

TEMA: [Tema principal identificado]

JURISPRUDÊNCIA:
- [Precedente STJ/STF relevante]
- [Outro precedente aplicável]

IMPLICAÇÕES PRÁTICAS:
- Para produtores rurais: [...]
- Para empresas: [...]
- Para a região: [...]

CONCLUSÃO:
[Síntese executiva da importância da notícia]
```

### **Passo 5: Copiar o Resultado**

Quando a skill terminar, **copie toda a análise gerada** (Ctrl+C ou selecione todo o texto).

### **Passo 6: Colar no Campo de Análise**

Volte para `/admin/artigos/[id]` e:

1. Role até a seção "⚖️ Análise Jurídica"
2. Clique no **textarea** (campo de texto cinza)
3. **Cole** a análise que copiou (Ctrl+V)

Você pode ainda **editar** a análise se quiser ajustar algo:
```
- Melhorar redação
- Adicionar mais contexto local
- Retirar partes genéricas
- Destacar aspectos importantes
```

### **Passo 7: Publicar ou Salvar**

#### **Para Publicar Imediatamente:**
- Clique **"✓ Publicar"** (botão verde)
- A notícia aparecerá em `/noticias-e-opinioes` com a análise

#### **Para Salvar Como Rascunho:**
- Clique **"📝 Salvar Rascunho"** (botão laranja)
- Você pode continuar editando depois
- Clique **"Descartar"** se quiser rejeitar a notícia

---

## 💡 Dicas & Boas Práticas

### ✅ **Sempre Faça:**

1. **Revisar a análise gerada**
   - A skill é muito boa, mas pode deixar coisas genéricas
   - Adicione contexto local de Realeza/Sudoeste PR

2. **Manter tom profissional**
   - Análise deve soar como de um advogado experiente
   - Evite gírias, mantenha linguagem jurídica apropriada

3. **Focar em aplicabilidade**
   - "Por que isso importa para nossos clientes?"
   - Conecte jurisprudência com prática

4. **Verificar datas**
   - Confirme se a jurisprudência é recente
   - Cite STJ/STF para maior peso

### ❌ **Nunca Faça:**

1. **Publicar sem análise**
   - Todo artigo precisa ter uma análise completa
   - Se a skill não gerar, escreva manualmente

2. **Copiar 100% do resultado**
   - Sempre ajuste para a realidade local
   - Adicione sua perspectiva jurídica

3. **Ignorar erros**
   - Se a skill mencionar jurisprudência errada, corrija
   - Verifique antes de publicar

4. **Publicar notícia desconhecida**
   - Se não souber o tema, pesquise antes de publicar
   - A análise deve ser honesta e informada

---

## 🔧 Resolvendo Problemas

### **Problema: "Contexto não copiou"**
- Clique novamente em "Copiar Contexto"
- Verifique permissões do navegador (clipboard)

### **Problema: "A skill não gerou análise"**
- Verifique se a skill está disponível (`/legal-moreira:analise-juridica`)
- Tente colar o contexto novamente
- Se falhar, escreva a análise manualmente

### **Problema: "Análise copiada tá estranha"**
- Copie de novo
- Certifique-se de copiar TODO o texto (Ctrl+A depois Ctrl+C)
- Verifique se há caracteres especiais

### **Problema: "Não consegui publicar"**
- Verifique se a análise tem pelo menos 50 caracteres
- Verifique conexão com internet/Supabase
- Tente Salvar Rascunho primeiro, depois Publicar

---

## 📊 Fluxo Completo: RSS → Editorial → Portal

```
1. SISTEMA RSS busca notícias
   └─ /api/rss/refresh (cron a cada hora)
   
2. NOTÍCIA chega em /admin/artigos
   └─ Status: 🆕 Pendente
   
3. EDITOR clica "Revisar"
   └─ Acessa /admin/artigos/[id]
   
4. EDITOR gera análise
   └─ Copia contexto
   └─ Invoca skill
   └─ Cola resultado
   └─ Edita se necessário
   
5. EDITOR publica
   └─ Clica "Publicar"
   └─ Status muda para: ✓ Publicado
   
6. LEITOR vê notícia
   └─ Em /noticias-e-opinioes
   └─ Com análise jurídica profissional
   └─ Com jurisprudência relevante
```

---

## 📞 Contato & Suporte

Se a skill `/legal-moreira:analise-juridica` não estiver funcionando:

1. Verifique se você está em uma **nova conversa** (não na página do admin)
2. Digite exatamente: `/legal-moreira:analise-juridica`
3. Cole o contexto copiado
4. Aguarde a análise ser gerada

Se ainda não funcionar, contacte o desenvolvedor com:
- Screenshot do erro
- Qual artigo estava tentando analisar
- Qual foi a resposta da skill

---

## 🎯 Exemplo Real

### **Notícia Original:**
```
"STJ reconhece direito de produtor rural sobre bem imóvel adquirido em execução"
Fonte: STJ | Conteúdo sobre jurisprudência sobre bem imóvel rural
```

### **Análise Gerada:**

```
STJ Reconhece Direito de Produtor Rural — Análise Jurídica

TEMA CENTRAL:
Reconhecimento de direitos de produtor rural sobre bens imóveis 
adquiridos em execução fiscal.

JURISPRUDÊNCIA APLICÁVEL:
- STJ REsp nº XXXX/XX: Define parâmetros para proteção de bem 
  de família rural
- STF Súmula 417: Bem imóvel não passa de direito

IMPLICAÇÕES PARA SUDOESTE PR:
→ Produtores com pendências fiscais têm maior proteção
→ Banco de dados do INCRA como prova é admissível
→ Execução deve respeitar períodos de colheita

REFLEXOS PRÁTICOS:
- Renegociação de dívidas rurais pode ser viável
- Documentação fundiária é crítica
- Consultore antes de aceitar penhora

CONCLUSÃO:
Importante para produtores em mora com governo federal.
Recomenda-se consultoria especializada antes de qualquer ação.
```

---

**Pronto!** Agora você sabe como gerar análises inteligentes. 🚀

*Desenvolvido com ❤️ para moreiraneto.adv.br*
