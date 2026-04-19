import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

/**
 * PATCH /api/admin/denuncias/[id]
 */
export async function PATCH(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const body = await req.json()

    const supabase = await createClient()

    const { data, error } = await supabase
      .from('denuncias')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error) throw error
    if (!data) {
      return NextResponse.json({ error: 'Not found' }, { status: 404 })
    }

    return NextResponse.json(data)
  } catch (err) {
    console.error('[PATCH /api/admin/denuncias/[id]]', err)
    return NextResponse.json({ error: 'Failed to update' }, { status: 500 })
  }
}

/**
 * DELETE /api/admin/denuncias/[id]
 */
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id
    const supabase = await createClient()

    const { error } = await supabase
      .from('denuncias')
      .delete()
      .eq('id', id)

    if (error) throw error

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('[DELETE /api/admin/denuncias/[id]]', err)
    return NextResponse.json({ error: 'Failed to delete' }, { status: 500 })
  }
}
