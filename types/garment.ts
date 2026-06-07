import type { Database } from './database'

export type Garment = Database['public']['Tables']['garments']['Row']
export type GarmentInsert = Database['public']['Tables']['garments']['Insert']
export type GarmentUpdate = Database['public']['Tables']['garments']['Update']

export type GarmentCategory =
  | 'top'
  | 'bottom'
  | 'outerwear'
  | 'footwear'
  | 'accessory'
  | 'dress'
  | 'suit'
  | 'activewear'

export type GarmentSubcategory =
  | 't-shirt'
  | 'shirt'
  | 'blouse'
  | 'sweater'
  | 'hoodie'
  | 'jeans'
  | 'trousers'
  | 'shorts'
  | 'skirt'
  | 'jacket'
  | 'coat'
  | 'blazer'
  | 'sneakers'
  | 'boots'
  | 'loafers'
  | 'heels'
  | 'sandals'
  | 'bag'
  | 'belt'
  | 'hat'
  | 'scarf'
  | 'sunglasses'
  | 'watch'
  | 'dress'
  | 'suit'

export type Season = 'spring' | 'summer' | 'autumn' | 'winter'

export type GarmentPattern =
  | 'solid'
  | 'striped'
  | 'checkered'
  | 'floral'
  | 'geometric'
  | 'animal'
  | 'abstract'
  | 'logo'

export type GarmentAnalysis = {
  category: GarmentCategory
  subcategory: GarmentSubcategory
  primary_color: string
  secondary_colors: string[]
  pattern: GarmentPattern
  material: string
  seasons: Season[]
  formality: number
  dominant_style: string[]
  name: string
}
