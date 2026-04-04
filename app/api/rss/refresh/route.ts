import { NextRequest, NextResponse } from 'next/server'
import { fetchAllSources } from '@/lib/rss/fetcher'

/**
 * GET /api/rss/refresh
 *
 * Chamado por:
 * 1. Cron job externo (cron-job.org ou Vercel Cron) — passa ?secret=CRON_SECRET
 * 2. Botão "Buscar Notícias" no painel admin
 *
 * Para configurar cron automático no Vercel, adicione em vercel.json:
 * {
 *   "crons": [{ "path": "/api/rss/refresh", "schedule": "0 * * * *" }]
 * }
 * E adicione CRON_SECRET como variável de ambiente no Vercel.
 */
export async function GET(request: NextRequest) {
  // Verificação de segurança
  const secret = request.nextUrl.searchParams.get('secret')
    ?? request.headers.get('x-cron-secret')

  if (
    process.env.CRON_SECRET &&
    secret !== process.env.CRON_SECRET
  ) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  console.log('[RSS Refresh] Iniciando busca de todas as fontes...')

  try {
    const result = await fetchAllSources()
    console.log(`[RSS Refresh] Concluído: +${result.created} criados, ${result.skipped} ignorados`)

    return NextResponse.json({
      ok: true,
      created: result.created,
      skipped: result.skipped,
      errors: result.errors,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[RSS Refresh] Erro fatal:', err)
    return NextResponse.json(
      { ok: false, error: String(err) },
      { status: 500 }
    )
  }
}
