import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/admin/denuncias
 * Listar todas as denúncias
 */
export async function GET(req: NextRequest) {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('denuncias')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    return NextResponse.json(data || [])
  } catch (err) {
    console.error('[GET /api/admin/denuncias]', err)
    return NextResponse.json({ error: 'Failed to fetch denuncias' }, { status: 500 })
  }
}
