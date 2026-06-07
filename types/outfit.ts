import type { Database } from './database'
import type { Garment } from './garment'

export type Outfit = Database['public']['Tables']['outfits']['Row']
export type OutfitInsert = Database['public']['Tables']['outfits']['Insert']

export type OutfitType = 'safe' | 'recommended' | 'exploration'

export type OutfitFeedbackReaction = 'liked' | 'disliked' | 'saved' | 'worn' | 'ignored'

export type PopulatedOutfit = Outfit & {
  garments: Garment[]
  userFeedback?: OutfitFeedbackReaction | null
}

export const OUTFIT_TYPE_LABELS: Record<OutfitType, string> = {
  safe: 'Seguro',
  recommended: 'Recomendado',
  exploration: 'Exploración',
}

export const OUTFIT_TYPE_ICONS: Record<OutfitType, string> = {
  safe: '✦',
  recommended: '★',
  exploration: '◈',
}
