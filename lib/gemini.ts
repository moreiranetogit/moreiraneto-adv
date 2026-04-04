import { GoogleGenerativeAI } from '@google/generative-ai'
import type { ArticleCategory } from '@/types'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '')

/**
 * Prompts em inglês por categoria — Gemini responde melhor em EN para imagens jurídicas.
 */
const CATEGORY_PROMPTS: Record<ArticleCategory, string> = {
  agrario:
    'Professional editorial photo representing Brazilian rural law and agribusiness: '
    + 'modern farmland, contract signing, rural property documents, soybean or sugarcane fields. '
    + 'Clean, bright, editorial style. No text overlays.',
  civil:
    'Professional editorial photo representing Brazilian civil law: '
    + 'modern courthouse exterior, legal documents, scales of justice on a clean desk. '
    + 'Corporate, neutral tones. No text.',
  trabalhista:
    'Professional editorial photo representing Brazilian labor law: '
    + 'workers in a professional setting, labor contract, handshake in office. '
    + 'Warm, professional tones. No text.',
  familia:
    'Soft editorial photo representing Brazilian family law: '
    + 'family silhouette, wedding rings, document with family and gavel. '
    + 'Warm, empathetic tones. No faces. No text.',
  animal:
    'Editorial photo representing Brazilian animal law and welfare: '
    + 'dog or cat in a shelter, protective hands around an animal, compassionate scene. '
    + 'Hopeful, warm tones. No text.',
  advocacia:
    'Professional editorial photo representing the Brazilian legal profession: '
    + 'lawyer reading documents, law library, gavel, Brazilian courthouse. '
    + 'Authoritative, professional. No text.',
  oab:
    'Editorial photo representing the Brazilian Bar Association (OAB): '
    + 'OAB insignia context, lawyer in suit, legal chamber. '
    + 'Formal, institutional look. No text.',
}

/**
 * Gera uma imagem para um artigo usando a API Gemini (modelo de geração de imagens).
 * Retorna uma URL base64 data URI ou null em caso de falha.
 *
 * NOTA: Requer modelo gemini-2.0-flash-preview-image-generation ou superior.
 * O plano gratuito do Google AI Studio permite ~500 gerações/dia.
 */
export async function generateArticleImage(
  title: string,
  category: ArticleCategory
): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null

  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-preview-image-generation',
    })

    const basePrompt = CATEGORY_PROMPTS[category]
    const fullPrompt =
      `${basePrompt} The image should relate to this headline: "${title.slice(0, 100)}". `
      + 'Photorealistic, 16:9 aspect ratio, high quality editorial stock photo style.'

    const result = await model.generateContent({
      contents: [{ role: 'user', parts: [{ text: fullPrompt }] }],
      generationConfig: {
        // @ts-expect-error — campo não tipado na versão atual do SDK
        responseModalities: ['image'],
      },
    })

    const parts = result.response.candidates?.[0]?.content?.parts ?? []
    for (const part of parts) {
      // @ts-expect-error — inlineData é retornado mas não tipado ainda
      if (part.inlineData?.data) {
        const mimeType = part.inlineData.mimeType ?? 'image/png'
        return `data:${mimeType};base64,${part.inlineData.data}`
      }
    }

    return null
  } catch (err) {
    console.error('[Gemini] Erro na geração de imagem:', err)
    return null
  }
}

/**
 * Wrapper simples para geração de texto (ex: resumos de artigos).
 */
export async function generateSummary(content: string): Promise<string | null> {
  if (!process.env.GEMINI_API_KEY) return null

  try {
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' })
    const result = await model.generateContent(
      `Resuma o seguinte conteúdo jurídico em 2-3 frases diretas, em português brasileiro, `
      + `sem mencionar nomes de pessoas. Tom profissional e informativo:\n\n${content.slice(0, 2000)}`
    )
    return result.response.text() ?? null
  } catch {
    return null
  }
}
