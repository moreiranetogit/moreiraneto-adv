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
    const expectedSecret = process.env.CRON_SECRET || 'dev'

    if (secret !== expectedSecret) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const supabase = await createClient()

    // 1. Carregar fontes ativas
    const { data: fontes, error: fontesError } = await supabase
      .from('rss_sources')
      .select('*')
      .eq('ativo', true)

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
        // Ignorar se tipo é web (necessitaria web scraping)
        if (fonte.tipo === 'web') {
          console.log(`[RSS] Pulando ${fonte.nome} (web scraping não implementado)`)
          continue
        }

        // Buscar feed RSS
        const feed = await parser.parseURL(fonte.url)

        // 3. Processar itens do feed
        for (const item of feed.items.slice(0, 10)) {
          // Evitar duplicatas por título
          const { data: existing } = await supabase
            .from('articles')
            .select('id')
            .eq('title', item.title || 'Sem título')
            .eq('source_name', fonte.nome)
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
              source_name: fonte.nome,
              source_url: item.link || '',
              category: mapCategory(fonte.categoria_id),
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
          .update({ ultima_busca: new Date().toISOString() })
          .eq('id', fonte.id)

        resultados.push({
          fonte: fonte.nome,
          status: 'ok',
          artigos_processados: Math.min(feed.items.length, 10),
        })
      } catch (err) {
        console.error(`[RSS] Erro ao processar ${fonte.nome}:`, err)
        resultados.push({
          fonte: fonte.nome,
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

/**
 * Mapear ID de categoria para slug
 */
function mapCategory(categoria_id?: number | null): string {
  const map: Record<number, string> = {
    1: 'agrario',
    2: 'civil',
    3: 'trabalhista',
    4: 'familia',
    5: 'animal',
    6: 'advocacia',
  }
  return map[categoria_id || 6] || 'advocacia'
}
