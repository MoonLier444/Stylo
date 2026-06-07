import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import OpenAI from 'https://esm.sh/openai@4'

const openai = new OpenAI({ apiKey: Deno.env.get('OPENAI_API_KEY')! })

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { user_id, storage_paths } = await req.json()

  const imageUrls = storage_paths.map((path: string) => {
    const { data } = supabase.storage.from('references').getPublicUrl(path)
    return data.publicUrl
  })

  const imageContent = imageUrls.slice(0, 5).map((url: string) => ({
    type: 'image_url' as const,
    image_url: { url, detail: 'low' as const },
  }))

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 600,
    messages: [
      {
        role: 'user',
        content: [
          ...imageContent,
          {
            type: 'text',
            text: `Analyze these style reference photos and extract a style profile. Return JSON:
{
  "dominant_styles": [list of style tags],
  "color_palette": [list of dominant colors in Spanish],
  "formality_range": { "min": 0-10, "max": 0-10 },
  "key_items": [list of recurring clothing items in Spanish],
  "style_notes": "brief description in Spanish of the overall aesthetic"
}
Return ONLY the JSON.`,
          },
        ],
      },
    ],
  })

  let analysis: Record<string, unknown> = {}
  try {
    const raw = response.choices[0].message.content ?? '{}'
    analysis = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim())
  } catch {
    analysis = {}
  }

  await supabase.from('style_references').insert(
    storage_paths.map((path: string, i: number) => ({
      user_id,
      image_url: imageUrls[i],
      storage_path: path,
      ai_analysis: i === 0 ? analysis : null,
    }))
  )

  await supabase.from('style_learning').upsert({
    user_id,
    profile_vector: analysis,
    liked_patterns: {},
    disliked_patterns: {},
    garment_weights: {},
    updated_at: new Date().toISOString(),
  })

  return new Response(JSON.stringify({ style_insights: analysis }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
