import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! })

const ANALYSIS_PROMPT = `Analyze this clothing item photo and return a JSON object with exactly these fields:
{
  "name": "descriptive name in Spanish",
  "category": one of [top, bottom, outerwear, footwear, accessory, dress, suit, activewear],
  "subcategory": specific type (e.g. t-shirt, jeans, blazer, sneakers),
  "primary_color": main color in Spanish,
  "secondary_colors": array of other visible colors in Spanish,
  "pattern": one of [solid, striped, checkered, floral, geometric, animal, abstract, logo],
  "material": material in Spanish (cotton, denim, wool, leather, etc.),
  "seasons": array of seasons from [spring, summer, autumn, winter],
  "formality": integer 0-10 (0=very casual, 10=very formal),
  "dominant_style": array of style tags from [casual, formal, streetwear, minimalist, vintage, sporty, bohemian, classic, preppy, edgy]
}
Return ONLY the JSON, no explanation.`

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const authHeader = req.headers.get('Authorization')
  if (!authHeader) return new Response('Unauthorized', { status: 401 })

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { storage_path, user_id, image_url } = await req.json()

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 500,
    messages: [
      {
        role: 'user',
        content: [
          { type: 'image_url', image_url: { url: image_url, detail: 'low' } },
          { type: 'text', text: ANALYSIS_PROMPT },
        ],
      },
    ],
  })

  let analysis: Record<string, unknown>
  try {
    const raw = response.choices[0].message.content ?? '{}'
    analysis = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim())
  } catch {
    analysis = {}
  }

  const { data: garment, error } = await supabase
    .from('garments')
    .insert({
      user_id,
      image_url,
      storage_path,
      name: analysis.name as string,
      category: analysis.category as string,
      subcategory: analysis.subcategory as string,
      primary_color: analysis.primary_color as string,
      secondary_colors: (analysis.secondary_colors as string[]) ?? [],
      pattern: analysis.pattern as string,
      material: analysis.material as string,
      seasons: (analysis.seasons as string[]) ?? [],
      formality: analysis.formality as number,
      dominant_style: (analysis.dominant_style as string[]) ?? [],
      ai_tags: analysis,
    })
    .select()
    .single()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ garment }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
