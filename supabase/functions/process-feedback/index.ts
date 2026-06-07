import { serve } from 'https://deno.land/std@0.177.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: { 'Access-Control-Allow-Origin': '*', 'Access-Control-Allow-Headers': 'authorization, content-type' } })
  }

  const supabase = createClient(
    Deno.env.get('SUPABASE_URL')!,
    Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { user_id, outfit_id, reaction } = await req.json()

  await supabase.from('outfit_feedback').upsert({
    user_id,
    outfit_id,
    reaction,
    worn_at: reaction === 'worn' ? new Date().toISOString() : null,
  })

  const { data: outfit } = await supabase
    .from('outfits')
    .select('garment_ids, type')
    .eq('id', outfit_id)
    .single()

  if (!outfit) {
    return new Response(JSON.stringify({ success: true }), {
      headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    })
  }

  const { data: learning } = await supabase
    .from('style_learning')
    .select('*')
    .eq('user_id', user_id)
    .maybeSingle()

  const current = learning ?? {
    user_id,
    profile_vector: {},
    liked_patterns: {},
    disliked_patterns: {},
    garment_weights: {},
  }

  const garmentWeights: Record<string, number> = current.garment_weights as Record<string, number>

  const delta = reaction === 'liked' || reaction === 'worn' ? 1 : reaction === 'disliked' ? -1 : 0

  if (delta !== 0) {
    for (const gid of outfit.garment_ids) {
      garmentWeights[gid] = (garmentWeights[gid] ?? 0) + delta
    }

    const patternKey = `${outfit.type}_${outfit.garment_ids.sort().join('_').slice(0, 40)}`

    if (reaction === 'liked' || reaction === 'worn') {
      const liked: Record<string, number> = current.liked_patterns as Record<string, number>
      liked[patternKey] = (liked[patternKey] ?? 0) + 1
      current.liked_patterns = liked
    } else if (reaction === 'disliked') {
      const disliked: Record<string, number> = current.disliked_patterns as Record<string, number>
      disliked[patternKey] = (disliked[patternKey] ?? 0) + 1
      current.disliked_patterns = disliked
    }
  }

  if (reaction === 'worn') {
    for (const gid of outfit.garment_ids) {
      await supabase
        .from('garments')
        .update({ times_worn: supabase.rpc('increment', { row_id: gid, amount: 1 }), last_worn_at: new Date().toISOString() })
        .eq('id', gid)
    }
  }

  await supabase.from('style_learning').upsert({
    user_id,
    garment_weights: garmentWeights,
    liked_patterns: current.liked_patterns,
    disliked_patterns: current.disliked_patterns,
    profile_vector: current.profile_vector,
    updated_at: new Date().toISOString(),
  })

  return new Response(JSON.stringify({ success: true }), {
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
  })
})
