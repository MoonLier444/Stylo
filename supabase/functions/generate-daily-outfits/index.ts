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

  const { user_id, date } = await req.json()

  const [
    { data: styleProfile },
    { data: garments },
    { data: weatherCache },
    { data: learning },
  ] = await Promise.all([
    supabase.from('style_profiles').select('*').eq('user_id', user_id).single(),
    supabase.from('garments').select('*').eq('user_id', user_id).eq('is_active', true),
    supabase
      .from('weather_cache')
      .select('*')
      .eq('user_id', user_id)
      .gt('valid_until', new Date().toISOString())
      .order('fetched_at', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase.from('style_learning').select('*').eq('user_id', user_id).maybeSingle(),
  ])

  if (!garments || garments.length === 0) {
    return new Response(JSON.stringify({ outfits: [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const garmentList = garments.map((g) => ({
    id: g.id,
    name: g.name ?? g.subcategory ?? g.category,
    category: g.category,
    subcategory: g.subcategory,
    primary_color: g.primary_color,
    secondary_colors: g.secondary_colors,
    pattern: g.pattern,
    material: g.material,
    seasons: g.seasons,
    formality: g.formality,
    dominant_style: g.dominant_style,
  }))

  const weatherContext = weatherCache
    ? `Temperature: ${weatherCache.temperature}°C, Feels like: ${weatherCache.feels_like}°C, Condition: ${weatherCache.condition}, Humidity: ${weatherCache.humidity}%`
    : 'Weather data unavailable'

  const prompt = `You are a personal stylist AI. Generate 3 outfits for the user based on their wardrobe and preferences.

USER STYLE PROFILE:
- Primary style: ${styleProfile?.primary_style ?? 'not specified'}
- Secondary styles: ${styleProfile?.secondary_styles?.join(', ') ?? 'none'}
- Favorite colors: ${styleProfile?.favorite_colors?.join(', ') ?? 'any'}
- Avoided colors: ${styleProfile?.avoided_colors?.join(', ') ?? 'none'}
- Experimentation level: ${styleProfile?.experimentation_level ?? 'balanced'}

TODAY'S WEATHER:
${weatherContext}

LEARNING DATA (preferences):
${learning ? JSON.stringify(learning.liked_patterns).slice(0, 500) : 'No data yet'}

AVAILABLE GARMENTS:
${JSON.stringify(garmentList)}

Generate exactly 3 outfits. Each outfit should:
1. "safe" - Classic combination based on user's known preferences
2. "recommended" - Best balance between style and novelty
3. "exploration" - Introduces a small variation to expand style gradually

IMPORTANT RULES:
- ONLY use garment IDs from the list above
- NEVER invent garments
- Consider weather: avoid heavy outerwear in warm weather, avoid light clothing in cold
- Each outfit should have 2-5 garments
- Include footwear if available
- Make coherent combinations (no mismatched formality levels)

Return ONLY a valid JSON array:
[
  {
    "type": "safe",
    "garment_ids": ["uuid1", "uuid2", ...],
    "ai_reasoning": "Brief explanation in Spanish of why this combination works"
  },
  {
    "type": "recommended",
    "garment_ids": [...],
    "ai_reasoning": "..."
  },
  {
    "type": "exploration",
    "garment_ids": [...],
    "ai_reasoning": "..."
  }
]`

  const response = await openai.chat.completions.create({
    model: 'gpt-4o',
    max_tokens: 1000,
    messages: [{ role: 'user', content: prompt }],
  })

  let outfitData: { type: string; garment_ids: string[]; ai_reasoning: string }[]
  try {
    const raw = response.choices[0].message.content ?? '[]'
    outfitData = JSON.parse(raw.replace(/```json\n?|\n?```/g, '').trim())
  } catch {
    return new Response(JSON.stringify({ outfits: [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const validGarmentIds = new Set(garments.map((g) => g.id))
  const validatedOutfits = outfitData.filter(
    (o) =>
      ['safe', 'recommended', 'exploration'].includes(o.type) &&
      Array.isArray(o.garment_ids) &&
      o.garment_ids.every((id) => validGarmentIds.has(id)) &&
      o.garment_ids.length >= 2
  )

  if (validatedOutfits.length === 0) {
    return new Response(JSON.stringify({ outfits: [] }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const { data: savedOutfits, error } = await supabase
    .from('outfits')
    .insert(
      validatedOutfits.map((o) => ({
        user_id,
        type: o.type,
        garment_ids: o.garment_ids,
        ai_reasoning: o.ai_reasoning,
        weather_context: weatherCache ?? null,
        date_for: date,
      }))
    )
    .select()

  if (error) return new Response(JSON.stringify({ error: error.message }), { status: 500 })

  return new Response(JSON.stringify({ outfits: savedOutfits }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
