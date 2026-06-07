export type Json = string | number | boolean | null | { [key: string]: Json } | Json[]

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          gender: 'male' | 'female' | 'non_binary' | 'prefer_not' | null
          age: number | null
          country: string | null
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['profiles']['Row'], 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['profiles']['Insert']>
      }
      style_profiles: {
        Row: {
          id: string
          user_id: string
          primary_style: string | null
          secondary_styles: string[]
          favorite_colors: string[]
          avoided_colors: string[]
          favorite_brands: string[]
          experimentation_level: 'conservative' | 'balanced' | 'bold' | null
          onboarding_completed: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['style_profiles']['Row'], 'id' | 'created_at' | 'updated_at'>
        Update: Partial<Database['public']['Tables']['style_profiles']['Insert']>
      }
      style_references: {
        Row: {
          id: string
          user_id: string
          image_url: string
          storage_path: string
          ai_analysis: Json | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['style_references']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['style_references']['Insert']>
      }
      garments: {
        Row: {
          id: string
          user_id: string
          image_url: string
          storage_path: string
          name: string | null
          category: string | null
          subcategory: string | null
          primary_color: string | null
          secondary_colors: string[]
          pattern: string | null
          material: string | null
          seasons: string[]
          formality: number | null
          dominant_style: string[]
          ai_tags: Json | null
          times_worn: number
          last_worn_at: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['garments']['Row'], 'id' | 'created_at' | 'updated_at' | 'times_worn' | 'is_active'>
        Update: Partial<Database['public']['Tables']['garments']['Insert']>
      }
      outfits: {
        Row: {
          id: string
          user_id: string
          type: 'safe' | 'recommended' | 'exploration'
          garment_ids: string[]
          ai_reasoning: string | null
          weather_context: Json | null
          generated_at: string
          date_for: string
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['outfits']['Row'], 'id' | 'created_at' | 'generated_at'>
        Update: Partial<Database['public']['Tables']['outfits']['Insert']>
      }
      outfit_feedback: {
        Row: {
          id: string
          user_id: string
          outfit_id: string
          reaction: 'liked' | 'disliked' | 'saved' | 'worn' | 'ignored'
          worn_at: string | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['outfit_feedback']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['outfit_feedback']['Insert']>
      }
      weather_cache: {
        Row: {
          id: string
          user_id: string
          latitude: number
          longitude: number
          temperature: number
          feels_like: number
          humidity: number
          wind_speed: number
          condition: string
          fetched_at: string
          valid_until: string
        }
        Insert: Omit<Database['public']['Tables']['weather_cache']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['weather_cache']['Insert']>
      }
      style_learning: {
        Row: {
          id: string
          user_id: string
          profile_vector: Json
          liked_patterns: Json
          disliked_patterns: Json
          garment_weights: Json
          updated_at: string
        }
        Insert: Omit<Database['public']['Tables']['style_learning']['Row'], 'id'>
        Update: Partial<Database['public']['Tables']['style_learning']['Insert']>
      }
    }
  }
}
