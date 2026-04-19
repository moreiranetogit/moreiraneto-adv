import { createClient } from '@supabase/supabase-js';
import { NextRequest, NextResponse } from 'next/server';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * POST /api/artigos/[id]/analisar
 * 
 * Chama a skill /legal-moreira:analise-juridica para gerar análise automática
 * sobre a notícia jurídica com viés para os clientes do escritório.
 * 
 * TODO: Implementar integração real com a skill via subprocess/API
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // 1. Buscar artigo
    const { data: artigo, error: erroArtigo } = await supabase
      .from('artigos')
      .select('*')
      .eq('id', parseInt(params.id))
      .single();

    if (erroArtigo) throw erroArtigo;

    // 2. TODO: Chamar skill /legal-moreira:analise-juridica com os dados do artigo
    // 
    // Pseudo-código:
    // const analise = await callSkill('legal-moreira:analise-juridica', {
    //   titulo: artigo.titulo,
    //   descricao: artigo.descricao,
    //   conteudo: artigo.conteudo,
    //   fonte_nome: artigo.fonte_nome,
    //   categoria: artigo.categoria_nome,
    //   instrucao: 'Gere uma análise jurídica sobre esta notícia com viés para...'
    // });

    // 3. Por enquanto, retornar placeholder
    const analiseGerada = `[ANÁLISE GERADA AUTOMATICAMENTE]\n\nNotícia: ${artigo.titulo}\nFonte: ${artigo.fonte_nome}\nData: ${new Date().toLocaleDateString('pt-BR')}\n\nEstá análise será gerada pela skill /legal-moreira:analise-juridica`;

    // 4. Atualizar artigo com análise
    const { data, error } = await supabase
      .from('artigos')
      .update({
        analise_texto: analiseGerada,
        analise_gerada_em: new Date().toISOString(),
        analise_editada_manualmente: false,
      })
      .eq('id', parseInt(params.id))
      .select();

    if (error) throw error;

    return NextResponse.json({ 
      artigo: data?.[0],
      mensagem: 'Análise gerada com sucesso. Você pode editar antes de aprovar.'
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
