import { supabase } from './supabase'
import type { Outfit, OutfitFeedbackReaction, PopulatedOutfit } from '../types/outfit'
import { getGarmentsByIds } from './garments'

export async function getDailyOutfits(userId: string, date: string): Promise<PopulatedOutfit[]> {
  const { data, error } = await supabase
    .from('outfits')
    .select('*')
    .eq('user_id', userId)
    .eq('date_for', date)
    .order('type', { ascending: true })

  if (error) throw error
  if (!data || data.length === 0) return []

  return populateOutfits(userId, data)
}

export async function generateDailyOutfits(userId: string, date: string): Promise<PopulatedOutfit[]> {
  const { data, error } = await supabase.functions.invoke('generate-daily-outfits', {
    body: { user_id: userId, date },
  })

  if (error) throw error
  return populateOutfits(userId, data.outfits)
}

export async function submitOutfitFeedback(
  userId: string,
  outfitId: string,
  reaction: OutfitFeedbackReaction
): Promise<void> {
  await supabase.functions.invoke('process-feedback', {
    body: { user_id: userId, outfit_id: outfitId, reaction },
  })
}

export async function getUserFeedback(
  userId: string,
  outfitIds: string[]
): Promise<Record<string, OutfitFeedbackReaction>> {
  if (outfitIds.length === 0) return {}

  const { data, error } = await supabase
    .from('outfit_feedback')
    .select('outfit_id, reaction')
    .eq('user_id', userId)
    .in('outfit_id', outfitIds)

  if (error) throw error

  return (data ?? []).reduce(
    (acc, row) => ({ ...acc, [row.outfit_id]: row.reaction as OutfitFeedbackReaction }),
    {} as Record<string, OutfitFeedbackReaction>
  )
}

async function populateOutfits(userId: string, outfits: Outfit[]): Promise<PopulatedOutfit[]> {
  const allGarmentIds = [...new Set(outfits.flatMap((o) => o.garment_ids))]
  const garments = await getGarmentsByIds(allGarmentIds)
  const garmentMap = Object.fromEntries(garments.map((g) => [g.id, g]))

  const feedbackMap = await getUserFeedback(userId, outfits.map((o) => o.id))

  return outfits.map((outfit) => ({
    ...outfit,
    garments: outfit.garment_ids.map((id) => garmentMap[id]).filter(Boolean),
    userFeedback: feedbackMap[outfit.id] ?? null,
  }))
}
