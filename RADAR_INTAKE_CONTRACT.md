# Contrato de Integração — PAA/Radar → Portal Moreira Neto

**Versão:** 1.0  
**Endpoint:** `POST /api/radar/intake`  
**Autenticação:** `Authorization: Bearer <RADAR_INTAKE_SECRET>`  
**Regra absoluta:** agentes nunca publicam. Todo conteúdo entra com `status: pending` e aguarda aprovação do Editor Master humano.

---

## Fluxo de uma notícia

```
PAA coleta → agentes processam → POST /api/radar/intake → status: pending
→ Editor Master vê no painel /admin/artigos → aprova → status: published → aparece no portal
```

---

## Endpoint

### `POST /api/radar/intake`

**Headers obrigatórios:**
```
Authorization: Bearer <RADAR_INTAKE_SECRET>
Content-Type: application/json
```

**Body — campos obrigatórios:**
```json
{
  "title": "Título da notícia (máx 500 chars)",
  "category": "agrario | civil | trabalhista | familia | animal | advocacia | oab"
}
```

**Body — campos opcionais recomendados:**
```json
{
  "excerpt": "Resumo da notícia (máx 1000 chars)",
  "content": "Conteúdo completo em texto puro ou markdown",
  "comentario_editorial": "Comentário dos agentes para o Editor Master (máx 5000 chars)",
  "analise_texto": "Análise jurídica gerada pelos agentes (4 parágrafos)",
  "source_name": "Nome da fonte original (ex: Conjur, STJ, Migalhas)",
  "source_url": "URL da notícia original",
  "image_url": "URL de imagem (se disponível)",
  "data_noticia": "Data original ISO 8601 (ex: 2026-05-10T09:00:00Z)",
  "tags": ["tag1", "tag2"],
  "destaque": false,
  "status_fonte": "aprovado | reprovado | pendente | nao_aplicavel",
  "status_etica": "aprovado | reprovado | pendente | nao_aplicavel"
}
```

**Resposta de sucesso (201):**
```json
{
  "success": true,
  "message": "Rascunho recebido. Aguardando revisão do Editor Master.",
  "artigo": {
    "id": "uuid",
    "slug": "titulo-da-noticia-1715342400000",
    "title": "Título da notícia",
    "status": "pending",
    "painel": "https://moreiraneto.adv.br/admin/artigos/uuid"
  }
}
```

**Erros possíveis:**
| Código | Causa |
|--------|-------|
| 401 | Token ausente ou inválido |
| 400 | `title` vazio ou `category` inválida |
| 500 | Erro interno do banco |

---

## Categorias válidas

| Valor | Exibição |
|-------|----------|
| `agrario` | Direito Agrário |
| `civil` | Direito Civil |
| `trabalhista` | Direito Trabalhista |
| `familia` | Direito de Família |
| `animal` | Direito Animal |
| `advocacia` | Advocacia & Jurídico |
| `oab` | OAB & Carreira |

---

## Status de revisão dos agentes

Use `status_fonte` e `status_etica` para indicar o resultado das revisões internas do PAA:

| Valor | Significado |
|-------|-------------|
| `aprovado` | Revisão passou |
| `reprovado` | Revisão falhou — include motivo em `comentario_editorial` |
| `pendente` | Não revisado ainda (padrão) |
| `nao_aplicavel` | Não se aplica a este conteúdo |

---

## Exemplo completo de payload

```json
{
  "title": "STJ decide que contrato de arrendamento rural exige forma escrita",
  "category": "agrario",
  "excerpt": "A Terceira Turma do STJ firmou entendimento de que contratos de arrendamento rural acima de 5 anos exigem escritura pública.",
  "content": "O Superior Tribunal de Justiça, em julgamento realizado...",
  "comentario_editorial": "Relevante para clientes do setor agrícola. Impacto direto em contratos de arrendamento de soja e milho. Verificar se há clientes com contratos nessa situação.",
  "analise_texto": "**Contexto jurídico:** A decisão...\n\n**Impacto prático:** ...\n\n**Precedentes:** ...\n\n**Conclusão:** ...",
  "source_name": "STJ",
  "source_url": "https://www.stj.jus.br/sites/...",
  "data_noticia": "2026-05-10T08:30:00Z",
  "tags": ["arrendamento rural", "STJ", "contrato"],
  "destaque": true,
  "status_fonte": "aprovado",
  "status_etica": "aprovado"
}
```

---

## Checklist dos agentes antes de enviar

- [ ] Notícia é de fonte confiável e verificável
- [ ] URL da fonte funciona e confere com o conteúdo
- [ ] Categoria correta escolhida
- [ ] Título jornalístico (claro, sem sensacionalismo)
- [ ] Análise jurídica em português brasileiro, 4 parágrafos
- [ ] Revisão de ética OAB: sem autopromoção excessiva, sem opinião política
- [ ] `comentario_editorial` com contexto para o Editor Master
- [ ] `status_fonte` e `status_etica` preenchidos

---

## Variáveis de ambiente necessárias (configurar no Vercel e localmente)

```
RADAR_INTAKE_SECRET=<string aleatória gerada com openssl rand -hex 32>
```

O PAA deve guardar este segredo em seu próprio ambiente seguro. Nunca expor em código público.

---

## O que o Editor Master vê no painel

- Badge roxo **🤖 PAA/Radar** identifica artigos vindos dos agentes
- `comentario_editorial` aparece antes da análise para contexto
- `status_fonte` e `status_etica` aparecem como indicadores visuais
- Editor pode editar título, análise e comentário antes de publicar
- Aprovação é manual: botão "Publicar" no painel `/admin/artigos/[id]`

---

## Limites e comportamento esperado

- Máximo recomendado: **50 artigos/dia** no RADAR contínuo
- RADAR Diário: **5-8 artigos** selecionados, enviados até 08h UTC (05h Brasília)
- Não enviar duplicatas: verificar `source_url` antes de submeter
- Em caso de erro 500: aguardar 30s e tentar novamente (máx 3 tentativas)
- Em caso de erro 401: verificar token — não retentuar automaticamente
