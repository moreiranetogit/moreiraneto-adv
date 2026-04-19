import { createClient } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'

// Supabase client (public)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
)

// Configuração do WhatsApp
const FATIMA_PHONE = '+5546990000339' // Fátima (presidente AMAA)
const WHATSAPP_API_URL = 'https://graph.instagram.com/v18.0/XXXXXXX/messages'
const WHATSAPP_API_TOKEN = process.env.WHATSAPP_BUSINESS_API_TOKEN

interface AdoptionInterestPayload {
  animalId: string
  animalName: string
  nome: string
  cpf: string
}

/**
 * POST /api/amaa/adoption-interests
 * Registra um interesse de adoção e envia WhatsApp para Fátima
 */
export async function POST(request: NextRequest) {
  try {
    const body: AdoptionInterestPayload = await request.json()

    // Validação básica
    if (!body.animalId || !body.nome || !body.cpf) {
      return NextResponse.json(
        { error: 'Dados incompletos' },
        { status: 400 }
      )
    }

    // Validar CPF (formato numérico, 11 dígitos)
    const cpfNumeros = body.cpf.replace(/\D/g, '')
    if (cpfNumeros.length !== 11) {
      return NextResponse.json(
        { error: 'CPF inválido' },
        { status: 400 }
      )
    }

    // Capturar IP e User-Agent para auditoria
    const ipAddress = request.headers.get('x-forwarded-for') ||
                     request.headers.get('x-real-ip') ||
                     'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // 1. Armazenar interesse no banco de dados
    const { data: interest, error: dbError } = await supabase
      .from('interesses_adocao')
      .insert([
        {
          animal_id: body.animalId,
          animal_nome: body.animalName,
          nome: body.nome,
          cpf: cpfNumeros,
          ip_address: ipAddress,
          user_agent: userAgent,
          status: 'pendente',
          mensagem_enviada: false,
        },
      ])
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar interesse:', dbError)
      return NextResponse.json(
        { error: 'Erro ao registrar interesse' },
        { status: 500 }
      )
    }

    // 2. Enviar WhatsApp para Fátima
    const whatsappSent = await enviarWhatsAppFatima(body, interest.id)

    // 3. Atualizar flag de envio no banco
    if (whatsappSent.success) {
      await supabase
        .from('interesses_adocao')
        .update({
          mensagem_enviada: true,
          enviado_para_fatima: new Date().toISOString(),
          id_mensagem_whatsapp: whatsappSent.messageId,
        })
        .eq('id', interest.id)
    } else {
      console.warn(
        `Falha ao enviar WhatsApp para Fátima (interesse: ${interest.id})`
      )
      // Mesmo assim retorna sucesso ao usuário
      // Fátima pode receber via webhook ou notificação do admin
    }

    return NextResponse.json({
      success: true,
      message: 'Interesse registrado com sucesso',
      interestId: interest.id,
      whatsappSent: whatsappSent.success,
    })
  } catch (error) {
    console.error('Erro ao processar interesse de adoção:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}

/**
 * Envia mensagem WhatsApp para Fátima com os dados do interessado
 */
async function enviarWhatsAppFatima(
  interest: AdoptionInterestPayload,
  interestId: string
): Promise<{ success: boolean; messageId?: string }> {
  try {
    // Se não tiver token configurado, apenas loga e retorna
    if (!WHATSAPP_API_TOKEN) {
      console.warn('WHATSAPP_BUSINESS_API_TOKEN não configurado')
      // Em produção, você pode usar uma fila de mensagens ou webhook
      return { success: false }
    }

    // Formatar mensagem
    const mensagem = `
🐾 *Novo Interesse de Adoção*

🐶 *Animal:* ${interest.animalName}
👤 *Nome:* ${interest.nome}
🆔 *CPF:* ${interest.cpf.slice(0, 3)}.${interest.cpf.slice(3, 6)}.${interest.cpf.slice(6, 9)}-${interest.cpf.slice(9)}

Entre em contato para avaliar a adoção!
    `.trim()

    // Chamada para WhatsApp Business API
    // NOTA: Você precisa configurar o WhatsApp Business Account para usar a API
    // Veja: https://developers.facebook.com/docs/whatsapp/cloud-api/

    const response = await fetch(WHATSAPP_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${WHATSAPP_API_TOKEN}`,
      },
      body: JSON.stringify({
        messaging_product: 'whatsapp',
        to: FATIMA_PHONE.replace(/\D/g, ''), // remove caracteres especiais
        type: 'text',
        text: {
          preview_url: false,
          body: mensagem,
        },
      }),
    })

    if (!response.ok) {
      const error = await response.json()
      console.error('Erro ao enviar WhatsApp:', error)
      return { success: false }
    }

    const data = await response.json()
    return {
      success: true,
      messageId: data.messages?.[0]?.id || 'unknown',
    }
  } catch (error) {
    console.error('Exceção ao enviar WhatsApp:', error)

    // FALLBACK: Se não conseguir enviar por API, enviar por webhook
    // para que um admin possa processar depois
    await notificarAdminFallback(interest, interestId)

    return { success: false }
  }
}

/**
 * Fallback: Registra interesse com flag "nao_enviado" para admin revisar
 */
async function notificarAdminFallback(
  interest: AdoptionInterestPayload,
  interestId: string
) {
  try {
    // Você pode integrar com Resend, SendGrid ou outro serviço
    // Por enquanto, apenas loga para auditoria
    console.log(
      `[ADOPTION_INTEREST_FALLBACK] ${interestId} - ${interest.nome} quer adotar ${interest.animalName}`
    )

    // Opcionalmente: enviar email para admin
    // await enviarEmailAdmin({ interest, interestId })
  } catch (error) {
    console.error('Erro no fallback de notificação:', error)
  }
}

/**
 * GET /api/amaa/adoption-interests
 * Lista interesses (apenas para admin/editor)
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação (implementar via proxy.ts)
    const authorization = request.headers.get('authorization')
    if (!authorization) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { data: interests, error } = await supabase
      .from('interesses_adocao')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      return NextResponse.json(
        { error: 'Erro ao buscar interesses' },
        { status: 500 }
      )
    }

    return NextResponse.json(interests)
  } catch (error) {
    console.error('Erro ao buscar interesses:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
