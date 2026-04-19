# Moreira Neto Advocacia — Design System

## Overview

**Moreira Neto Advocacia** is a Brazilian law firm based in Realeza, Paraná, specializing in Direito Agrário (Agrarian Law), Agronegócio, Trabalho Rural, Direito Animal, Direito Civil, and Direito de Família. The firm serves rural producers, agricultural cooperatives, agribusiness companies, and individual clients with complex legal needs.

**Website:** https://moreiraneto.adv.br  
**Location:** Rua Belém, nº 2963, sala 22, Centro — Realeza, PR  
**Contact:** contato@moreiraneto.adv.br | (46) 99977-9865  

---

## Sources Provided

| Type | Path / URL |
|------|-----------|
| Next.js codebase | `moreiraneto-adv/` (mounted via File System Access API) |
| Logo (white bg) | `uploads/marca.png` → `assets/marca.png` |
| Logo (dark bg) | `uploads/marca_fundopreto.jpg` → `assets/marca_fundopreto.jpg` |
| Slide deck | `uploads/apresentacao-escolhida.pdf` (image-based, no extractable text) |
| Custom fonts | `uploads/MankSans.ttf`, `MankSans-Medium.ttf`, `MankSans-Oblique.ttf`, `POORICH.TTF` → `fonts/` |

---

## Products / Surfaces

1. **Marketing Website** (`moreiraneto.adv.br`) — Single-page layout, hero with araucária logo, 6 practice area cards, contact section. Built in Next.js (App Router).
2. **Radar Jurídico** — News/blog portal with dark header, light card layout, 3-theme switcher (light/dark/sepia), news ticker, category badges.
3. **AMAA Section** — Animal protection partner portal (Associação de Amigos dos Animais de Realeza/PR); adoption, abuse reporting, contacts.
4. **Admin Panel** — Internal editorial dashboard with dark sidebar, content management, adoption status tracking.

---

## CONTENT FUNDAMENTALS

### Language
- All copy is in **Brazilian Portuguese (pt-BR)**.
- Formal but accessible — avoids legalese unless necessary; when used, explains it.
- Direct and practical: always ends with "and now, what to do?".
- First-person plural (nós/nosso) for the firm; second-person singular (você) for the client.
- No emoji in professional copy. Checkmarks (✓) used sparingly in feature lists.

### Tone
- **Professional yet warm** — not cold or bureaucratic.
- **Didactic** — explains complex law simply without condescending.
- **Visionary & forward-thinking** — "we anticipate risks before they become crises."
- **Strategic** — emphasizes negotiation-before-litigation philosophy.

### Casing
- Section overlines: ALL CAPS with wide letter-spacing (e.g. "EXPERTISE JURÍDICA").
- Headings: Title Case for section titles; sentence case for body.
- Buttons: Title Case ("Agende uma Consulta", "Saiba Mais").
- Nav items: Title Case.

### Copy Examples
- *"Somos um escritório de advocacia especializado em Direito Agrário, Agronegócio e assessoria jurídica completa."*
- *"Nossa abordagem combina profundo conhecimento do mercado local com expertise jurídica de alto nível."*
- *"Processamos quando necessário, mas nossa meta é fechar acordos."*
- *"Soluções eficientes, dentro da lei e ajustadas à realidade de nossos clientes."*

---

## VISUAL FOUNDATIONS

### Color System
| Token | Hex | Role |
|-------|-----|------|
| `--mna-gold` | `#E8941F` | Primary accent — buttons, borders, headings, icons |
| `--mna-gold-dark` | `#C47A10` | Hover/active gold |
| `--mna-charcoal` | `#2C2C2C` | Header background |
| `--mna-dark` | `#1F2937` | Portal header, admin sidebar |
| `--mna-graphite` | `#2D2D2D` | Body text, footer |
| `--mna-sand` | `#F5E6D3` | Page background (website) |
| `--mna-off-white` | `#F4F6F9` | Portal page bg |
| `--mna-silver` | `#9CA3AF` | Secondary text, logo M |
| `--mna-mid` | `#666666` | Muted text |
| `--mna-border` | `#E5E7EB` | Card/divider borders |

### Typography
- **Display / Headings:** Lora (Google Fonts, serif) — used for section headings H1–H3. Fallback: Sitka Text → Georgia → Times New Roman.
- **Body / UI:** Inter (Google Fonts, sans-serif) — nav, body text, labels, badges, buttons.
- **Brand Accent:** Poorich (custom, `fonts/POORICH.TTF`) — for special brand moments (e.g. slide headings, brand lockup).
- **Alternative Sans:** MankSans (custom, `fonts/MankSans*.ttf`) — heavier weight alternate, 3 variants (regular/medium/oblique).

### Backgrounds
- Website: warm sand `#F5E6D3` — evokes soil, land, agribusiness roots.
- White sections (practice areas, about): `#FFFFFF`.
- Dark sections (header, footer, contact): `#2C2C2C` / `#2D2D2D`.
- Portal: light off-white `#F4F6F9`.
- No gradient backgrounds; no textures; no patterns.

### Animation & Transitions
- All transitions: `0.2s–0.3s ease` — smooth, professional, never flashy.
- Hover on cards: `translateY(-2px)` + deeper shadow.
- Hover on primary CTA: `translateY(-2px)` + gold glow shadow `rgba(232,148,31,0.3)`.
- Hover on nav links: color shifts to gold.
- No bounce animations, no spring physics.
- News ticker: `ticker-scroll` infinite linear, 30s.

### Cards
- Border radius: `12px`.
- Default shadow: `0 2px 12px rgba(0,0,0,0.06)`.
- Hover shadow: `0 8px 24px rgba(0,0,0,0.10)` + `translateY(-2px)`.
- White background, `1px solid #E5E7EB` border.
- Practice area cards: large 280px hero image on top, content below with 32px padding.
- Differential cards: white bg + 4px left gold border (no full border, just accent left).

### Buttons
- **Primary:** gold bg `#E8941F` + dark text `#2D2D2D`, radius 6px, 16px/32px padding, hover lifts + gold shadow.
- **Secondary:** dark bg `#1a1a1a` + gold text + 2px gold border; hover: fills gold.
- **Ghost:** transparent bg + gold text/border; hover: fills gold.
- **CTA special (WhatsApp):** WhatsApp green `#25D366`.

### Borders & Radius
- `4px` (sm) — small elements.
- `6px` (md) — buttons.
- `8px` (lg) — inner content boxes.
- `12px` (card) — cards.
- `999px` (pill) — badges.

### Shadows
- Card: `0 2px 12px rgba(0,0,0,0.06)`.
- Card hover: `0 8px 24px rgba(0,0,0,0.10)`.
- Gold glow: `0 8px 16px rgba(232,148,31,0.30)`.
- Dark (header): `0 2px 12px rgba(0,0,0,0.15)`.

### Borders
- Header bottom border: `3px solid #E8941F` (gold rule under dark header — signature element).
- Admin nav active: `border-left: 3px solid #E8941F`.
- Differential cards: `border-left: 4px solid #E8941F`.

### Imagery
- Photography: real sector photography (agricultural fields, rural workers, animals). Warm, natural tones.
- Avoid generic stock. Prefer images of actual Paraná agricultural context.
- Images in cards: full-width, 280px tall, `object-fit: cover`, `object-position: center`.
- Logo compositions: araucária tree paired with brand mark (regional identity symbol).

### Hover/Press States
- Links in dark sections: white → gold on hover, opacity 0.3s ease.
- Cards: shadow deepens + `translateY(-2px)`.
- Admin nav: background fades in, text brightens.
- Press: no explicit shrink; shadow collapses back.

### Transparency & Blur
- Admin sidebar active item: `background: rgba(232,148,31,0.15)` — translucent gold.
- Dark overlays: `rgba(0,0,0,0.X)` shadows only; no frosted glass / backdrop-blur.

### Layout
- Max content width: `1280px`, centered with auto margins.
- Body padding: `20px` horizontal.
- Grid columns: 3-column for practice areas; 2-column for differentials; auto-fit for responsive.
- Section padding: `80px 20px`.
- Sticky header (`z-index: 50`).

---

## ICONOGRAPHY

- **Primary icon set:** Lucide React — stroke icons, `strokeWidth="1.5"`, sized at 16–28px.
- Used icons: `Menu`, `X`, `ChevronRight`, `Mail`, `Phone`, `MapPin`, `MessageCircle`, `MapPin`.
- Icon color: gold `#E8941F` on dark backgrounds; charcoal on light.
- No icon font; no sprite sheet; SVG inline via Lucide React package.
- No emoji in professional contexts.
- Unicode checkmark `✓` used in feature lists.
- Social: WhatsApp uses a custom inline SVG chat-bubble icon (stroke, gold).
- Logo mark: "MN" monogram — left M is silver gradient, right N is gold gradient — forms a ribbon/zigzag shape. Wordmark "MOREIRA NETO" in gold serif caps, "ADVOCACIA" in silver/gray caps below.

---

## File Index

```
README.md                          — This document
colors_and_type.css                — All design tokens (colors, type, spacing, components)
SKILL.md                           — Agent skill descriptor

fonts/
  MankSans.ttf                     — Custom sans-serif (regular)
  MankSans-Medium.ttf              — Custom sans-serif (medium)
  MankSans-Oblique.ttf             — Custom sans-serif (oblique)
  POORICH.TTF                      — Custom display/brand serif

assets/
  marca.png                        — Logo on white background
  marca_fundopreto.jpg             — Logo on dark background
  mna-logo-web.png                 — Logo optimized for web (transparent)
  mna-logo.png                     — Full-res logo
  mna-logo-araucaria-web.jpg       — Logo + araucária hero composition
  amaa-logo-web.png                — AMAA partner logo
  mna-area-civil-web.jpg           — Practice area photo: Civil
  mna-area-animal-web.jpg          — Practice area photo: Animal
  mna-area-familia-web.jpg         — Practice area photo: Family
  mna-area-geral-web.jpg           — Practice area photo: General
  mna-area-trabalhista.jpg         — Practice area photo: Labor
  stj-foto-premiada.png            — STJ award photo

preview/
  colors-brand.html                — Brand color swatches
  colors-semantic.html             — Semantic / theme colors
  colors-status.html               — Status badge colors
  type-display.html                — Display & heading type specimens
  type-body.html                   — Body & UI type specimens
  type-custom-fonts.html           — MankSans & Poorich specimens
  spacing-tokens.html              — Spacing scale tokens
  spacing-radii-shadows.html       — Border radius & shadow system
  components-buttons.html          — Button states
  components-cards.html            — Card patterns
  components-badges.html           — Badges & status chips
  components-nav.html              — Header & navigation
  brand-logos.html                 — Logo variations

ui_kits/website/
  README.md                        — Website UI kit guide
  index.html                       — Interactive website prototype
  Header.jsx                       — Sticky header component
  HeroSection.jsx                  — Hero with araucária + CTAs
  AreaCard.jsx                     — Practice area card
  ContactSection.jsx               — Contact + map section
  Footer.jsx                       — Footer component
```
