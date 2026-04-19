import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/artigos/[id] - Obter um artigo específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('artigos')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (error) throw error;

    return NextResponse.json({ artigo: data });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// PATCH /api/artigos/[id] - Atualizar artigo (status, análise, etc)
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { status, analise_texto, analise_editada_manualmente } = body;

    const updates: any = {
      atualizado_em: new Date().toISOString(),
    };

    if (status) updates.status = status;
    if (analise_texto) {
      updates.analise_texto = analise_texto;
      updates.analise_editada_manualmente = analise_editada_manualmente || true;
    }

    const { data, error } = await supabase
      .from('artigos')
      .update(updates)
      .eq('id', parseInt(params.id))
      .select();

    if (error) throw error;

    return NextResponse.json({ artigo: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// DELETE /api/artigos/[id] - Descartar/rejeitar artigo
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { data, error } = await supabase
      .from('artigos')
      .update({ status: 'rejeitado' })
      .eq('id', parseInt(params.id))
      .select();

    if (error) throw error;

    return NextResponse.json({ artigo: data?.[0] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
