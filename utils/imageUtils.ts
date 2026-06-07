import * as ImagePicker from 'expo-image-picker'
import * as ImageManipulator from 'expo-image-manipulator'

export async function requestCameraPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestCameraPermissionsAsync()
  return status === 'granted'
}

export async function requestMediaLibraryPermission(): Promise<boolean> {
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
  return status === 'granted'
}

export async function pickFromLibrary(options?: {
  multiple?: boolean
  limit?: number
}): Promise<string[]> {
  const granted = await requestMediaLibraryPermission()
  if (!granted) return []

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsMultipleSelection: options?.multiple ?? false,
    quality: 0.9,
    selectionLimit: options?.limit ?? 1,
  })

  if (result.canceled) return []
  return result.assets.map((a) => a.uri)
}

export async function captureFromCamera(): Promise<string | null> {
  const granted = await requestCameraPermission()
  if (!granted) return null

  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    quality: 0.9,
  })

  if (result.canceled) return null
  return result.assets[0].uri
}

export async function compressImage(uri: string, maxWidth = 1080): Promise<string> {
  const result = await ImageManipulator.manipulateAsync(
    uri,
    [{ resize: { width: maxWidth } }],
    { compress: 0.85, format: ImageManipulator.SaveFormat.JPEG }
  )
  return result.uri
}
