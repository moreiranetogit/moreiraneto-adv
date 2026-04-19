# Implementação: Google Maps + Contato Centralizado

## 📍 O Que Foi Implementado

### 1. Novo Componente Reutilizável: `components/ContactSection.tsx`

**Características:**
- ✅ Minimapa Google Maps embarcado (iframe responsivo)
- ✅ Endereço clicável (abre Google Maps em nova aba)
- ✅ Botão WhatsApp com mensagem dinâmica personalizada
- ✅ Botão Email com subject automático
- ✅ Botão "Ver no Mapa" para abrir localização
- ✅ Design responsivo (mobile-first)
- ✅ Animações hover suaves
- ✅ Cores: Laranja MNA (#E8941F), Cinza (#2D2D2D), Verde WhatsApp (#25D366)
- ✅ Fonte: Sitka Text (consistente com identidade visual)

**Props:**
```tsx
<ContactSection subject?: string />
```

**Exemplo de uso:**
```tsx
// Sem assunto (homepage)
<ContactSection />

// Com assunto (páginas de áreas)
<ContactSection subject="Direito Agrário" />
```

### 2. Integração nas Páginas

#### `app/page.tsx` (Homepage)
- Substituída seção de contato antiga
- Agora usa: `<ContactSection />`
- Sem subject (mensagem genérica no WhatsApp)

#### `app/areas/[slug]/page.tsx` (Páginas de Áreas)
- Substituída seção de contato antiga
- Agora usa: `<ContactSection subject={area.titulo} />`
- Mensagem personalizada: "Gostaria de esclarecer dúvidas sobre [Área]."

### 3. Dados de Contato

```
📍 Localização:
   Rua Belém, nº 2963, sala 22
   Centro — Realeza, PR
   
💬 WhatsApp:
   (46) 99977-9865
   
📧 Email:
   contato@moreiraneto.adv.br
```

**Arquivo:** `components/ContactSection.tsx`
```tsx
const WHATSAPP_NUMBER = '5546999779865';
const EMAIL = 'contato@moreiraneto.adv.br';
```

### 4. Fluxo de Interação

#### Cenário 1: Usuário na Homepage → Clica "Contato"
```
Clica em WhatsApp
  ↓
Abre conversa com mensagem:
"Olá! Gostaria de esclarecer dúvidas sobre 
os serviços do Moreira Neto Advocacia."
```

#### Cenário 2: Usuário na Página de Direito Agrário → Clica "WhatsApp"
```
Clica em WhatsApp (na seção ContactSection)
  ↓
Abre conversa com mensagem:
"Olá! Gostaria de esclarecer dúvidas 
sobre Direito Agrário."
```

#### Cenário 3: Usuário Clica no Endereço
```
Clica em "Rua Belém, nº 2963..."
  ↓
Abre Google Maps com localização exata
  ↓
Pode ver rota, compartilhar, etc.
```

### 5. Estrutura do Componente

```
ContactSection
├── Título "Contato"
├── Grid: [Minimapa | Informações]
│   ├── Minimapa Google Maps (iframe)
│   └── Coluna de informações
│       ├── 📍 Endereço (com link)
│       ├── 💬 WhatsApp (com link)
│       └── 📧 Email (com link)
├── Botões de Ação
│   ├── [WhatsApp] (Verde)
│   ├── [Email] (Laranja MNA)
│   └── [Ver no Mapa] (Laranja contorno)
└── Fundo cinza escuro (#2D2D2D)
```

### 6. Responsive Design

| Device | Layout |
|--------|--------|
| Mobile (<768px) | 1 coluna (mapa em cima, info embaixo) |
| Tablet (768-1024px) | 2 colunas (mapa | info) |
| Desktop (>1024px) | 2 colunas (mapa | info) |

## 🔧 Como Manter/Atualizar

### Alterar Número de WhatsApp
**Arquivo:** `components/ContactSection.tsx` (linha ~15)
```tsx
const WHATSAPP_NUMBER = 'SEU_NUMERO_AQUI'; // Ex: '5546987654321'
```

### Alterar Email
**Arquivo:** `components/ContactSection.tsx` (linha ~16)
```tsx
const EMAIL = 'seu-email@dominio.com.br';
```

### Alterar Endereço/Coordenadas do Mapa
**Arquivo:** `components/ContactSection.tsx` (linhas ~27-30)
```tsx
const mapsLink = 'https://www.google.com/maps/search/NOVO+ENDERECO';
const mapsEmbed = 'https://www.google.com/maps/embed?pb=...NOVO_EMBED...';
```

### Adicionar ContactSection em Nova Página
```tsx
// 1. Importar
import ContactSection from '@/components/ContactSection';

// 2. Usar no JSX (antes do footer)
export default function MinhaPage() {
  return (
    <div>
      {/* ... conteúdo ... */}
      <ContactSection subject="Tema Específico" />
    </div>
  );
}
```

## ✨ Benefícios da Arquitetura

| Aspecto | Antes | Depois |
|--------|-------|--------|
| **DRY (Don't Repeat Yourself)** | Seção de contato duplicada em 2+ lugares | Uma única fonte de verdade |
| **Manutenção** | Atualizar número = editar em 2+ arquivos | Atualizar número = 1 lugar |
| **Personalização** | Genérico | Subject dinâmico por página |
| **Reusabilidade** | Não | Pode adicionar em qualquer página |
| **Consistência** | Desalinhada (código copiado manualmente) | Sempre igual (componente único) |

## 🧪 Teste Recomendado

1. **Homepage:**
   ```
   npm run dev
   Acesse: http://localhost:3000
   Teste os 3 botões na seção "Contato"
   ```

2. **Página de Área (ex: Direito Agrário):**
   ```
   Acesse: http://localhost:3000/areas/direito-agrario
   Clique em WhatsApp
   Verifique se a mensagem inclui "Direito Agrário"
   ```

3. **Minimapa:**
   ```
   Todos os botões de endereço devem abrir Google Maps
   Iframe deve carregar corretamente em mobile
   ```

## 📱 Acessibilidade

- ✅ Links têm `target="_blank"` e `rel="noopener noreferrer"` (segurança)
- ✅ Ícones têm labels de título (tooltips)
- ✅ Cores de contraste atendem WCAG AA
- ✅ Fontes legíveis (Sitka Text, 1rem = 16px)

## 🚀 Próximos Passos (Opcional)

1. Adicionar formulário de contato interativo
2. Integrar calendário de agendamento
3. Add analytics para rastrear cliques
4. Adicionar seção de avaliações/depoimentos
5. Integrar com CRM (Hubspot, Pipedrive, etc)

---

**Versão:** 1.0
**Data:** 2026-04-14
**Autor:** Claude Cowork
**Status:** ✅ Pronto para produção
