import { supabase } from './supabase'
import { uploadImage, deleteImage } from './storage'
import type { Garment, GarmentInsert, GarmentUpdate } from '../types/garment'

export async function getGarments(userId: string): Promise<Garment[]> {
  const { data, error } = await supabase
    .from('garments')
    .select('*')
    .eq('user_id', userId)
    .eq('is_active', true)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data
}

export async function getGarmentById(id: string): Promise<Garment> {
  const { data, error } = await supabase
    .from('garments')
    .select('*')
    .eq('id', id)
    .single()

  if (error) throw error
  return data
}

export async function uploadAndAnalyzeGarment(
  userId: string,
  imageUri: string
): Promise<Garment> {
  const { path, url } = await uploadImage(userId, 'garments', imageUri)

  const { data, error } = await supabase.functions.invoke('analyze-garment', {
    body: { storage_path: path, user_id: userId, image_url: url },
  })

  if (error) throw error
  return data.garment
}

export async function updateGarment(id: string, updates: GarmentUpdate): Promise<Garment> {
  const { data, error } = await supabase
    .from('garments')
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteGarment(garment: Garment): Promise<void> {
  await supabase.from('garments').update({ is_active: false }).eq('id', garment.id)
  await deleteImage('garments', garment.storage_path)
}

export async function getGarmentsByIds(ids: string[]): Promise<Garment[]> {
  if (ids.length === 0) return []

  const { data, error } = await supabase
    .from('garments')
    .select('*')
    .in('id', ids)

  if (error) throw error
  return data
}
