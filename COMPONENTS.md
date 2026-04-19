# 🎨 COMPONENTS.md — Componentes React

**Data:** 2026-04-14  
**Padrão:** React 18 + TypeScript + Tailwind CSS

---

## 📋 Componentes Públicos

### 1. **ContactSection** (`components/ContactSection.tsx`)

Seção de contato reutilizável em várias páginas.

```tsx
interface ContactSectionProps {
  title?: string
  subtitle?: string
  showMap?: boolean
  showPhone?: boolean
  showWhatsApp?: boolean
}

export default function ContactSection({
  title = "Entre em Contato",
  subtitle = "Clique para encontrar nosso endereço",
  showMap = true,
  showPhone = true,
  showWhatsApp = true,
}: ContactSectionProps)
```

**Uso:**
```tsx
import ContactSection from '@/components/ContactSection'

export default function Page() {
  return (
    <>
      <h1>Minha página</h1>
      <ContactSection showMap showPhone showWhatsApp />
    </>
  )
}
```

**Features:**
- ✅ Google Maps integrado
- ✅ WhatsApp link (Fátima)
- ✅ Email link
- ✅ Phone link
- ✅ Responsivo

---

### 2. **ThemeSwitcher** (`components/ThemeSwitcher.tsx`)

Seletor de tema (light/dark/sepia).

```tsx
export default function ThemeSwitcher()
```

**Features:**
- ✅ Detecta preferência do SO
- ✅ Salva em localStorage
- ✅ 3 temas: light, dark, sepia
- ✅ Ícone muda dinamicamente

---

## 📱 Componentes AMAA

### 3. **AdoptionInterestModal** (`app/amaa/AdoptionInterestModal.tsx`)

Modal para registrar interesse em adoção.

```tsx
interface AdoptionInterestModalProps {
  animalId: string
  animalName: string
  isOpen: boolean
  onClose: () => void
  onSuccess?: () => void
}

export default function AdoptionInterestModal({
  animalId,
  animalName,
  isOpen,
  onClose,
  onSuccess,
}: AdoptionInterestModalProps)
```

**Features:**
- ✅ Validação de CPF (algoritmo completo)
- ✅ Formatação automática: `000.000.000-00`
- ✅ Estados: idle, loading, error, success
- ✅ Integração com `/api/amaa/adoption-interests`
- ✅ Notificação de sucesso

**Uso:**
```tsx
const [isOpen, setIsOpen] = useState(false)

return (
  <>
    <button onClick={() => setIsOpen(true)}>Abrir Modal</button>
    <AdoptionInterestModal
      animalId="uuid-animal"
      animalName="Rex"
      isOpen={isOpen}
      onClose={() => setIsOpen(false)}
      onSuccess={() => alert('Sucesso!')}
    />
  </>
)
```

---

### 4. **AdoptionSuccessNotification** (`app/amaa/AdoptionSuccessNotification.tsx`)

Notificação de sucesso animada.

```tsx
interface AdoptionSuccessNotificationProps {
  message: string
}

export default function AdoptionSuccessNotification({
  message,
}: AdoptionSuccessNotificationProps)
```

**Features:**
- ✅ Aparece no canto inferior direito
- ✅ Desaparece automaticamente em 5s
- ✅ Animação suave (fade-in)
- ✅ Botão de fechar

---

### 5. **AmaaClientWrapper** (`app/amaa/AmaaClientWrapper.tsx`)

Wrapper que gerencia estado de modais da AMAA.

```tsx
interface AmaaClientWrapperProps {
  children: React.ReactNode
}

export default function AmaaClientWrapper({
  children,
}: AmaaClientWrapperProps)
```

**Responsabilidades:**
- ✅ Event listeners para `openAdoptionModal`
- ✅ Gerencia estado do modal
- ✅ Gerencia notificações
- ✅ Permite server component + client interactivity

---

### 6. **DenunciaForm** (`app/amaa/DenunciaForm.tsx`)

Formulário de denúncia de maus-tratos (legacy).

```tsx
export default function DenunciaForm()
```

**Features:**
- ✅ Localização (rua, bairro, cidade)
- ✅ Tipo de animal
- ✅ Tipo de abuso (checkboxes)
- ✅ Descrição do ocorrido
- ✅ Opção de denúncia anônima
- ✅ Dados do denunciante (opcional)
- ✅ POST para API

---

## 🎛️ Componentes Admin

### 7. **AnalysisGenerator** (`app/admin/artigos/[id]/AnalysisGenerator.tsx`)

Gerador de análise jurídica para artigos.

```tsx
interface AnalysisGeneratorProps {
  artigo: Article
  analiseExistente?: string
  onAnaliseGerada?: (analise: string) => void
}

export default function AnalysisGenerator({
  artigo,
  analiseExistente,
  onAnaliseGerada,
}: AnalysisGeneratorProps)
```

**Features:**
- ✅ Copia contexto do artigo
- ✅ Abre skill `/legal-moreira:analise-juridica`
- ✅ Mostra badge: ✓ (se análise existe) ou ⚠️ (se não existe)
- ✅ Textarea para editar análise

---

### 8. **AnimalFormModal** (`app/admin/amaa/AnimalFormModal.tsx`)

Modal para cadastrar/editar animal.

```tsx
interface AnimalFormModalProps {
  isOpen: boolean
  animal?: Animal
  onClose: () => void
  onSave: (animal: Animal) => Promise<void>
}

export default function AnimalFormModal({
  isOpen,
  animal,
  onClose,
  onSave,
}: AnimalFormModalProps)
```

**Campos:**
- Nome, espécie, raça, sexo, porte
- Idade, situação, temperamento
- Saúde (castrado, vacinado, etc)
- Descrição, foto
- Urgência (verde/amarelo/vermelho)

---

### 9. **AnimalStatusActions** (`app/admin/amaa/AnimalStatusActions.tsx`)

Botões para mudar status do animal (publish/reject/adopt).

```tsx
interface AnimalStatusActionsProps {
  animal: Animal
  onStatusChange: (status: AnimalStatus) => Promise<void>
}

export default function AnimalStatusActions({
  animal,
  onStatusChange,
}: AnimalStatusActionsProps)
```

**Ações:**
- ✅ Publicar (pending → published)
- ✅ Rejeitar (any → rejected)
- ✅ Adotado (published → adopted)

---

## 🏠 Componentes da Homepage

### 10. **AreaCard** (Hypothetical)

Card das áreas de atuação.

```tsx
interface AreaCardProps {
  titulo: string
  descricao: string
  icone: string
  cor: string
}

export default function AreaCard({
  titulo,
  descricao,
  icone,
  cor,
}: AreaCardProps)
```

---

## 📚 Padrões de Componentes

### Pattern: Props Spreading
```tsx
interface BaseProps {
  className?: string
  children?: React.ReactNode
}

export default function MyComponent({ className, children }: BaseProps) {
  return <div className={`${className} base-styles`}>{children}</div>
}
```

### Pattern: Compound Components
```tsx
export function Modal() {
  return (
    <div className="modal">
      <Modal.Header />
      <Modal.Body />
      <Modal.Footer />
    </div>
  )
}

Modal.Header = function Header() { ... }
Modal.Body = function Body() { ... }
Modal.Footer = function Footer() { ... }
```

### Pattern: Render Props (quando necessário)
```tsx
interface ProviderProps {
  children: React.ReactNode
}

export function ThemeProvider({ children }: ProviderProps) {
  return <ThemeContext.Provider value={theme}>{children}</ThemeContext.Provider>
}
```

---

## 🎯 Tipagem TypeScript

Tipos reutilizáveis em `types/index.ts`:

```typescript
// Artigos
interface Article {
  id: string
  title: string
  slug: string
  content: string
  status: 'pending' | 'published' | 'rejected'
  // ...
}

// Animais
interface Animal {
  id: string
  nome: string
  especie: 'cachorro' | 'gato' | 'outro'
  status: 'pending' | 'published' | 'adopted' | 'rejected'
  // ...
}

// Denúncias
interface Denuncia {
  id: string
  endereco: string
  tipo_abuso: string[]
  status: 'nova' | 'em_apuracao' | 'encerrada'
  // ...
}
```

---

## 🎨 Styling Conventions

### Tailwind Utility Classes
```tsx
// ✅ Good
<div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
  Content
</div>

// ❌ Avoid
<div style={{ backgroundColor: 'white', padding: '16px', ... }}>
  Content
</div>
```

### CSS Variables para Temas
```css
/* app/globals.css */
:root[data-theme="light"] {
  --color-primary: #2D6A4F;
  --color-text: #1F2937;
  --color-bg: #FFFFFF;
}

:root[data-theme="dark"] {
  --color-primary: #4A9D6F;
  --color-text: #F3F4F6;
  --color-bg: #1F2937;
}
```

### Uso em componentes
```tsx
<div style={{ color: 'var(--color-text)' }}>
  Texto com tema dinâmico
</div>
```

---

## 🧪 Testing Components

### Exemplo com React Testing Library
```tsx
import { render, screen } from '@testing-library/react'
import AdoptionInterestModal from './AdoptionInterestModal'

describe('AdoptionInterestModal', () => {
  it('abre e valida CPF corretamente', () => {
    render(
      <AdoptionInterestModal
        animalId="uuid"
        animalName="Rex"
        isOpen={true}
        onClose={jest.fn()}
      />
    )
    
    const cpfInput = screen.getByPlaceholderText(/CPF/)
    expect(cpfInput).toBeInTheDocument()
  })
})
```

---

## 📦 Exportações Públicas

```typescript
// components/index.ts
export { default as ContactSection } from './ContactSection'
export { default as ThemeSwitcher } from './ThemeSwitcher'

// app/amaa/index.ts
export { default as AdoptionInterestModal } from './AdoptionInterestModal'
export { default as AdoptionSuccessNotification } from './AdoptionSuccessNotification'
export { default as AmaaClientWrapper } from './AmaaClientWrapper'
export { default as DenunciaForm } from './DenunciaForm'
```

---

**Status:** ✅ Componentes em produção, documentados e tipados  
*Para exemplos de uso, veja as páginas em app/*
