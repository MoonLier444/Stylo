import { supabase } from './supabase'
import type { Profile, StyleProfile } from '../types/user'

export async function getProfile(userId: string): Promise<Profile | null> {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  if (error) return null
  return data
}

export async function updateProfile(userId: string, updates: Partial<Profile>): Promise<Profile> {
  const { data, error } = await supabase
    .from('profiles')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', userId)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function getStyleProfile(userId: string): Promise<StyleProfile | null> {
  const { data, error } = await supabase
    .from('style_profiles')
    .select('*')
    .eq('user_id', userId)
    .single()

  if (error) return null
  return data
}

export async function upsertStyleProfile(
  userId: string,
  updates: Partial<Omit<StyleProfile, 'id' | 'user_id' | 'created_at' | 'updated_at'>>
): Promise<StyleProfile> {
  const { data, error } = await supabase
    .from('style_profiles')
    .upsert({ user_id: userId, ...updates, updated_at: new Date().toISOString() })
    .select()
    .single()

  if (error) throw error
  return data
}

export async function uploadStyleReferences(
  userId: string,
  storagePaths: string[]
): Promise<void> {
  await supabase.functions.invoke('analyze-style-references', {
    body: { user_id: userId, storage_paths: storagePaths },
  })
}

export async function isOnboardingComplete(userId: string): Promise<boolean> {
  const { data } = await supabase
    .from('style_profiles')
    .select('onboarding_completed')
    .eq('user_id', userId)
    .single()

  return data?.onboarding_completed ?? false
}
