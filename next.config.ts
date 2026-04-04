import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: '**.supabase.co' },
      { protocol: 'https', hostname: 'images.unsplash.com' },
      { protocol: 'https', hostname: '**.migalhas.uol.com.br' },
      { protocol: 'https', hostname: '**.conjur.com.br' },
      { protocol: 'https', hostname: '**.jota.info' },
      { protocol: 'https', hostname: '**.stj.jus.br' },
      { protocol: 'https', hostname: '**.tst.jus.br' },
    ],
  },
  // rss-parser roda no servidor (Next.js 15+)
  serverExternalPackages: ['rss-parser'],
}

export default nextConfig
