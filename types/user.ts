import type { Database } from './database'

export type Profile = Database['public']['Tables']['profiles']['Row']
export type StyleProfile = Database['public']['Tables']['style_profiles']['Row']
export type StyleReference = Database['public']['Tables']['style_references']['Row']

export type Gender = 'male' | 'female' | 'non_binary' | 'prefer_not'
export type ExperimentationLevel = 'conservative' | 'balanced' | 'bold'

export type StyleOption =
  | 'casual'
  | 'formal'
  | 'streetwear'
  | 'minimalist'
  | 'vintage'
  | 'sporty'
  | 'bohemian'
  | 'classic'
  | 'preppy'
  | 'edgy'

export const STYLE_OPTIONS: { value: StyleOption; label: string; emoji: string }[] = [
  { value: 'casual', label: 'Casual', emoji: '👕' },
  { value: 'formal', label: 'Formal', emoji: '👔' },
  { value: 'streetwear', label: 'Streetwear', emoji: '🧢' },
  { value: 'minimalist', label: 'Minimalista', emoji: '⬛' },
  { value: 'vintage', label: 'Vintage', emoji: '🕰️' },
  { value: 'sporty', label: 'Deportivo', emoji: '👟' },
  { value: 'bohemian', label: 'Bohemio', emoji: '🌸' },
  { value: 'classic', label: 'Clásico', emoji: '🎩' },
  { value: 'preppy', label: 'Preppy', emoji: '🏫' },
  { value: 'edgy', label: 'Edgy', emoji: '🖤' },
]

export const GENDER_OPTIONS: { value: Gender; label: string }[] = [
  { value: 'male', label: 'Hombre' },
  { value: 'female', label: 'Mujer' },
  { value: 'non_binary', label: 'No binario' },
  { value: 'prefer_not', label: 'Prefiero no decirlo' },
]

export const EXPERIMENTATION_OPTIONS: { value: ExperimentationLevel; label: string; description: string }[] = [
  { value: 'conservative', label: 'Conservador', description: 'Me quedo con lo que sé que funciona' },
  { value: 'balanced', label: 'Equilibrado', description: 'Mezclo clásico con algo nuevo' },
  { value: 'bold', label: 'Arriesgado', description: 'Me encanta probar combinaciones nuevas' },
]
