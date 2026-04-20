import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'
import Parser from 'rss-parser'

const parser = new Parser()

/**
 * GET /api/rss/refresh?secret=YOUR_CRON_SECRET
 *
 * Sincroniza fontes RSS ativas e cria artigos com status 'pending'
 *
 * Uso:
 * - Manual: curl "http://localhost:3000/api/rss/refresh?secret=dev"
 * - Vercel Cron: Configure em vercel.json
 *
 * Environment: CRON_SECRET (deve ser uma string segura em produção)
 */
export async function GET(req: NextRequest) {
  try {
    // Verificar secret (proteção básica contra uso não autorizado)
    const secret = req.nextUrl.searchParams.get('secret')
    if (!process.env.CRON_SECRET) {
      console.error('[RSS Refresh] CRON_SECRET não configurado!')
      return NextResponse.json({ error: 'Server misconfigured' }, { status: 500 })
    }
    if (secret !== process.env.CRON_SECRET) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // 1. Carregar fontes ativas
    const { data: fontes, error: fontesError } = await supabase
      .from('rss_sources')
      .select('id, name, url, category')
      .eq('active', true)

    if (fontesError) throw fontesError

    if (!fontes || fontes.length === 0) {
      return NextResponse.json({
        success: true,
        message: 'Nenhuma fonte ativa para sincronizar',
        fontes_processadas: 0,
        artigos_criados: 0,
      })
    }

    let totalArticulosAdicionados = 0
    const resultados: any[] = []

    // 2. Processar cada fonte
    for (const fonte of fontes) {
      try {
        // Buscar feed RSS
        const feed = await parser.parseURL(fonte.url)

        // 3. Processar itens do feed
        for (const item of feed.items.slice(0, 10)) {
          // Evitar duplicatas por título
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('title', item.title || 'Sem título')
            .eq('source_name', fonte.name)
            .single()

          if (existing) {
            console.log(`[RSS] Artigo duplicado: "${item.title}"`)
            continue
          }

          // Gerar slug
          const slug = (item.title || 'artigo')
            .toLowerCase()
            .replace(/[^\w\s-]/g, '')
            .replace(/\s+/g, '-')
            .slice(0, 80)

          // Inserir artigo com status 'pending'
          const { data: newArticle, error: insertError } = await supabase
            .from('articles')
            .insert({
              title: item.title || 'Sem título',
              slug: slug + '-' + Date.now(),
              excerpt: item.content?.slice(0, 200) || item.description?.slice(0, 200) || '',
              content: item.content || item.description || '',
              source_name: fonte.name,
              source_url: item.link || '',
              category: fonte.category,
              image_url: null,
              status: 'pending',
              published_at: item.pubDate ? new Date(item.pubDate).toISOString() : new Date().toISOString(),
            })
            .select()
            .single()

          if (insertError) {
            console.error(`[RSS] Erro ao inserir artigo "${item.title}":`, insertError)
            continue
          }

          totalArticulosAdicionados++
          console.log(`[RSS] ✅ Artigo adicionado: "${newArticle.title}"`)
        }

        // Atualizar última busca
        await supabase
          .from('rss_sources')
          .update({ last_fetched: new Date().toISOString() })
          .eq('id', fonte.id)

        resultados.push({
          fonte: fonte.name,
          status: 'ok',
          artigos_processados: Math.min(feed.items.length, 10),
        })
      } catch (err) {
        console.error(`[RSS] Erro ao processar ${fonte.name}:`, err)
        resultados.push({
          fonte: fonte.name,
          status: 'erro',
          erro: String(err),
        })
      }
    }

    // 4. Retornar resultado
    return NextResponse.json({
      success: true,
      message: `Sincronização concluída`,
      fontes_processadas: fontes.length,
      artigos_criados: totalArticulosAdicionados,
      resultados,
      timestamp: new Date().toISOString(),
    })
  } catch (err) {
    console.error('[RSS Refresh Error]', err)
    return NextResponse.json(
      { error: 'Erro ao sincronizar RSS', details: String(err) },
      { status: 500 }
    )
  }
}

