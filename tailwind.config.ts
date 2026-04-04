import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  // Temas controlados por atributo data-theme no <html>
  // Não usar darkMode: 'class' — usamos CSS variables customizadas
  theme: {
    extend: {
      colors: {
        // Cores do escritório
        mna: {
          orange:  '#E8941F',
          'orange-dark': '#C47A10',
          silver:  '#9CA3AF',
          dark:    '#1F2937',
        },
        // Aliases para o tema atual (resolvidos via CSS variables)
        bg:       'var(--color-bg)',
        surface:  'var(--color-surface)',
        border:   'var(--color-border)',
        text:     'var(--color-text)',
        muted:    'var(--color-muted)',
      },
      fontFamily: {
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
        'card-hover': '0 8px 24px rgba(0,0,0,0.10)',
      },
    },
  },
  plugins: [],
}

export default config
