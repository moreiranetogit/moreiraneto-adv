# 🔌 API.md — Endpoints & Funções

**Data:** 2026-04-14  
**Base URL:** https://moreiraneto.adv.br/api

---

## 📋 Índice de Endpoints

| Método | Rota | Descrição | Auth | Status |
|--------|------|-----------|------|--------|
| GET | `/artigos` | Listar artigos | - | ✅ |
| GET | `/artigos/[id]` | Um artigo | - | ✅ |
| PATCH | `/artigos/[id]` | Atualizar artigo | admin/editor | ✅ |
| DELETE | `/artigos/[id]` | Deletar artigo | admin | ✅ |
| POST | `/rss/refresh` | Sincronizar RSS | ✅ | ✅ |
| POST | `/amaa/adoption-interests` | Registrar interesse | - | ✅ |
| GET | `/amaa/adoption-interests` | Listar interesses | admin/editor | ✅ |
| GET | `/noticias` | Últimas notícias | - | ✅ |

---

## 🔍 Detalhes dos Endpoints

### 1. GET `/api/artigos`

**Descrição:** Lista artigos com filtros  
**Query Parameters:**
```
?status=published    (publicado | pending | rejected)
?categoria=agrario   (agrario | civil | trabalhista | familia | animal)
?limit=10            (padrão: 20)
?offset=0            (para paginação)
?search=termo        (busca por título/conteúdo)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "titulo": "Lei de Propriedade Intelectual Rural",
      "slug": "lei-propriedade-intelectual-rural",
      "excerpt": "Novo direcionamento jurídico...",
      "content": "...",
      "categoria": "agrario",
      "status": "published",
      "image_url": "https://...",
      "source_name": "STJ",
      "published_at": "2026-04-14T10:00:00Z",
      "read_count": 125
    }
  ],
  "total": 350,
  "page": 1,
  "limit": 20
}
```

---

### 2. GET `/api/artigos/[id]`

**Descrição:** Buscar um artigo específico  
**Response:**
```json
{
  "id": "uuid-1",
  "titulo": "...",
  "content": "...",
  "analise_texto": "Análise jurídica do artigo...",
  "analise_gerada_em": "2026-04-14T10:00:00Z",
  "autor_original": "STJ",
  "tags": ["propriedade", "rural"],
  "read_count": 125
}
```

---

### 3. PATCH `/api/artigos/[id]`

**Descrição:** Atualizar artigo (admin/editor)  
**Body:**
```json
{
  "status": "publicado",
  "analise_texto": "Análise após revisão...",
  "featured": true
}
```

**Response:** Artigo atualizado

---

### 4. DELETE `/api/artigos/[id]`

**Descrição:** Deletar artigo (admin only)  
**Response:**
```json
{ "success": true, "message": "Artigo deletado" }
```

---

### 5. POST `/api/rss/refresh`

**Descrição:** Sincronizar feeds RSS  
**Query Parameters:**
```
?secret=seu_cron_secret (obrigatório)
```

**Response:**
```json
{
  "success": true,
  "articulos_novos": 5,
  "articulos_atualizados": 2,
  "imagens_geradas": 3,
  "timestamp": "2026-04-14T10:00:00Z"
}
```

**Cron Job (Vercel):**
```json
// vercel.json
{
  "crons": [
    { "path": "/api/rss/refresh", "schedule": "0 * * * *" }
  ]
}
```

---

### 6. POST `/api/amaa/adoption-interests`

**Descrição:** Registrar interesse em adoção  
**Body:**
```json
{
  "animalId": "uuid-animal",
  "animalName": "Rex",
  "nome": "João Silva",
  "cpf": "12345678901"
}
```

**Response:**
```json
{
  "success": true,
  "interestId": "uuid-interesse",
  "whatsappSent": true,
  "message": "Interesse registrado com sucesso"
}
```

**Processo Interno:**
1. Valida CPF (11 dígitos, dígito verificador)
2. Insere em `interesses_adocao`
3. Envia WhatsApp para Fátima (+55 46 9900-0339)
4. Atualiza flag `mensagem_enviada`
5. Retorna sucesso ao usuário

---

### 7. GET `/api/amaa/adoption-interests`

**Descrição:** Listar interesses de adoção (admin/editor)  
**Query Parameters:**
```
?animal_id=uuid      (filtrar por animal)
?status=pendente     (pendente | confirmado | rejeitado | adotado)
?limit=50
?offset=0
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "animal_id": "uuid-ani",
      "animal_nome": "Rex",
      "nome": "João Silva",
      "cpf": "123.456.789-01",
      "status": "pendente",
      "mensagem_enviada": true,
      "enviado_para_fatima": "2026-04-14T10:00:00Z",
      "created_at": "2026-04-14T10:00:00Z"
    }
  ],
  "total": 23
}
```

---

### 8. GET `/api/noticias`

**Descrição:** Últimas notícias para homepage  
**Query Parameters:**
```
?limit=5 (padrão)
```

**Response:**
```json
{
  "data": [
    {
      "id": "uuid-1",
      "titulo": "Lei de Propriedade Intelectual Rural",
      "categoria": "agrario",
      "slug": "lei-propriedade-intelectual-rural",
      "excerpt": "...",
      "image_url": "https://...",
      "published_at": "2026-04-14T10:00:00Z"
    }
  ]
}
```

---

## 🔐 Autenticação

**Header necessário:**
```
Authorization: Bearer <JWT_TOKEN>
```

**Como obter token:**
1. Supabase Auth automático (sessão)
2. Via `/login`
3. Via `lib/supabase/client.ts`

**Roles & Permissões:**
```
admin        → Acesso total
editor       → Gerenciar artigos + animais
voluntária   → Gerenciar apenas animais
público      → Leitura pública
```

---

## ⚠️ Tratamento de Erros

**Resposta padrão de erro:**
```json
{
  "error": "Mensagem de erro",
  "code": "ERROR_CODE",
  "status": 400
}
```

**Status Codes:**
- 200 — OK
- 201 — Criado
- 400 — Bad Request
- 401 — Não autenticado
- 403 — Não autorizado
- 404 — Não encontrado
- 500 — Erro servidor

---

## 🧪 Exemplos com cURL

### Buscar artigos publicados
```bash
curl "https://moreiraneto.adv.br/api/artigos?status=published&limit=5"
```

### Registrar interesse de adoção
```bash
curl -X POST "https://moreiraneto.adv.br/api/amaa/adoption-interests" \
  -H "Content-Type: application/json" \
  -d '{
    "animalId": "uuid-animal",
    "animalName": "Rex",
    "nome": "João Silva",
    "cpf": "12345678901"
  }'
```

### Sincronizar RSS (com autenticação)
```bash
curl -X POST "https://moreiraneto.adv.br/api/rss/refresh?secret=seu_secret" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

---

## 📚 Estrutura de Resposta

Todos os endpoints seguem este padrão:

```typescript
interface ApiResponse<T> {
  data?: T
  error?: string
  message?: string
  status: number
  timestamp: string
}
```

---

## 🔗 Integrações Externas

### Gemini Image Generation
```typescript
// lib/gemini.ts
async function generateImageWithGemini(articleTitle: string) {
  // Gera imagem automática se artigo não tiver
  // Modelo: gemini-2.0-flash-preview-image-generation
  // Quota: 500 gerações/dia (grátis)
}
```

### WhatsApp Business API
```typescript
// app/api/amaa/adoption-interests/route.ts
async function enviarWhatsAppFatima(interesse, interestId) {
  // Envia mensagem para +55 46 9900-0339
  // Fallback: log em console se API não estiver configurada
}
```

---

**Status:** ✅ Todos os endpoints em produção  
*Última atualização: 2026-04-14*
