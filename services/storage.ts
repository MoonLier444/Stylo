import { supabase } from './supabase'
import * as ImageManipulator from 'expo-image-manipulator'

export type StorageBucket = 'garments' | 'references' | 'avatars'

export async function uploadImage(
  userId: string,
  bucket: StorageBucket,
  uri: string,
  fileName?: string
): Promise<{ path: string; url: string }> {
  const compressed = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: 1080 } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
  )

  const ext = 'jpg'
  const name = fileName ?? `${Date.now()}.${ext}`
  const path = `${userId}/${name}`

  const response = await fetch(compressed.uri)
  const blob = await response.blob()

  const { error } = await supabase.storage.from(bucket).upload(path, blob, {
    contentType: 'image/jpeg',
    upsert: false,
  })

  if (error) throw error

  const { data } = supabase.storage.from(bucket).getPublicUrl(path)
  return { path, url: data.publicUrl }
}

export async function deleteImage(bucket: StorageBucket, path: string): Promise<void> {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}
