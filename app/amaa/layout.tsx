import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'AMAA — Adoção e Denúncia de Maus-Tratos | Moreira Neto Advocacia',
  description:
    'Associação dos Melhores Amigos dos Animais de Realeza/PR. Adote um animal, denuncie maus-tratos de forma anônima e gratuita. Apoio jurídico da Moreira Neto Advocacia.',
  keywords: [
    'AMAA', 'adoção de animais', 'Realeza', 'Paraná',
    'denúncia maus-tratos animais', 'bem-estar animal',
    'Moreira Neto Advocacia', 'direito animal',
  ],
  openGraph: {
    title: 'AMAA — Adote um animal. Denuncie maus-tratos.',
    description: 'Associação dos Melhores Amigos dos Animais de Realeza/PR. Adoção responsável e denúncia anônima de maus-tratos.',
    url: 'https://moreiraneto.adv.br/amaa',
    images: [{ url: '/amaa-capa-web.jpg', width: 1200, height: 654, alt: 'AMAA — Realeza/PR' }],
  },
}

export default function AmaaLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
