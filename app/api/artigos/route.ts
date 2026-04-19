import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// GET /api/artigos - Listar artigos com filtros
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const busca = searchParams.get('busca');
    const categoria = searchParams.get('categoria');
    const status = searchParams.get('status') || 'pendente';

    let query = supabase
      .from('artigos')
      .select('*');

    if (status) query = query.eq('status', status);
    if (categoria) query = query.eq('categoria_id', categoria);
    if (busca) query = query.ilike('titulo', `%${busca}%`);

    const { data, error } = await query.order('criado_em', { ascending: false });

    if (error) throw error;

    return NextResponse.json({ artigos: data || [] });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// POST /api/artigos - Criar novo artigo
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { titulo, descricao, conteudo, fonte_url, fonte_nome, categoria_id } = body;

    // Gerar slug
    const slug = titulo
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-');

    const { data, error } = await supabase
      .from('artigos')
      .insert({
        titulo,
        descricao,
        conteudo,
        fonte_url,
        fonte_nome,
        categoria_id,
        slug,
        status: 'pendente',
        // TODO: Chamar skill de análise aqui
      })
      .select();

    if (error) throw error;

    return NextResponse.json({ artigo: data?.[0] }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
