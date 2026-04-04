import type { Metadata, Viewport } from 'next'
import { Inter, Lora } from 'next/font/google'
import './globals.css'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'Moreira Neto Advocacia',
    template: '%s | Moreira Neto Advocacia',
  },
  description:
    'Escritório de advocacia especializado em Direito Agrário, Civil, Trabalhista, Família e Animal. Realeza/PR.',
  keywords: [
    'advocacia', 'advogado', 'Realeza', 'Paraná', 'direito agrário',
    'direito civil', 'direito trabalhista', 'direito de família', 'direito animal',
    'Moreira Neto Advocacia',
  ],
  authors: [{ name: 'Moreira Neto Advocacia' }],
  creator: 'Moreira Neto Advocacia',
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL ?? 'https://moreiraneto.adv.br'
  ),
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: process.env.NEXT_PUBLIC_SITE_URL,
    siteName: 'Moreira Neto Advocacia',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export const viewport: Viewport = {
  themeColor: '#1F2937',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html
      lang="pt-BR"
      // Tema padrão: light. Gerenciado pelo ThemeProvider no portal.
      // O atributo é lido do localStorage no client via ThemeProvider.
      suppressHydrationWarning
    >
      <body className={`${inter.variable} ${lora.variable} font-sans antialiased`}>
        {children}
      </body>
    </html>
  )
}
