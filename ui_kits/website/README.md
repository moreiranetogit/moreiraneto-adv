# Website UI Kit

High-fidelity interactive prototype of the Moreira Neto Advocacia website and related surfaces.

## Surfaces included

| Surface | Description |
|---------|-------------|
| **Website** | Main marketing site — header, hero, about, areas de atuação, contact, footer |
| **Radar Jurídico** | News portal with light/dark/sepia theme switcher and news grid |
| **Admin** | Editorial admin panel — sidebar, stats, article table |

## Components

| File | Exports |
|------|---------|
| `Header.jsx` | `MNAHeader` — sticky dark header with gold bottom border, logo, nav, icons |
| `HeroSection.jsx` | `MNAHero` — hero with araucária image + primary/secondary CTAs |
| `AboutSection.jsx` | `AboutSection` — 2-col layout with copy + diferencial cards |
| `AreaCard.jsx` | `AreaCard`, `AreasSection` — 3-col practice area grid with hover modal |
| `ContactSection.jsx` | `MNAContact`, `MNAFooter` — dark contact section + footer |

## Usage

Open `index.html` in a browser. Use the Surface switcher at the top to navigate between views.

## Design tokens

See `../../colors_and_type.css` for all CSS variables and utility classes.

## Fonts

- **Display/Headings:** Lora (Google Fonts)
- **Body/UI:** Inter (Google Fonts)
- **Brand accent:** Poorich (`../../fonts/POORICH.TTF`)
- **Alt sans:** MankSans (`../../fonts/MankSans*.ttf`)
