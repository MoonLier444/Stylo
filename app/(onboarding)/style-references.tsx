import { useState } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity, Image, FlatList } from 'react-native'
import * as ImagePicker from 'expo-image-picker'
import { router } from 'expo-router'
import { uploadImage } from '../../services/storage'
import { uploadStyleReferences, upsertStyleProfile } from '../../services/profile'
import { useAuthStore } from '../../stores/authStore'
import { T } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { Colors, Radius, Spacing } from '../../constants/theme'

const MIN_REFERENCES = 5
const MAX_REFERENCES = 10

export default function StyleReferencesScreen() {
  const user = useAuthStore((s) => s.user)
  const setStyleProfile = useAuthStore((s) => s.setStyleProfile)
  const [images, setImages] = useState<string[]>([])
  const [uploading, setUploading] = useState(false)

  async function pickImages() {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsMultipleSelection: true,
      quality: 0.85,
      selectionLimit: MAX_REFERENCES - images.length,
    })

    if (!result.canceled) {
      const uris = result.assets.map((a) => a.uri)
      setImages((prev) => [...prev, ...uris].slice(0, MAX_REFERENCES))
    }
  }

  function removeImage(uri: string) {
    setImages((prev) => prev.filter((i) => i !== uri))
  }

  async function handleContinue() {
    if (!user) return
    setUploading(true)
    try {
      const paths = await Promise.all(
        images.map((uri, idx) => uploadImage(user.id, 'references', uri, `ref_${idx}.jpg`).then((r) => r.path))
      )
      await uploadStyleReferences(user.id, paths)
      const profile = await upsertStyleProfile(user.id, { onboarding_completed: true })
      setStyleProfile(profile)
      router.replace('/(tabs)/')
    } finally {
      setUploading(false)
    }
  }

  async function handleSkip() {
    if (!user) return
    const profile = await upsertStyleProfile(user.id, { onboarding_completed: true })
    setStyleProfile(profile)
    router.replace('/(tabs)/')
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <T variant="title2" weight="semibold">
        Referencias de estilo
      </T>
      <T variant="body" muted style={styles.subtitle}>
        Sube entre {MIN_REFERENCES} y {MAX_REFERENCES} fotos de outfits que te inspiren. La IA las usará para entender tu gusto.
      </T>

      <View style={styles.grid}>
        {images.map((uri) => (
          <TouchableOpacity key={uri} onPress={() => removeImage(uri)} activeOpacity={0.8}>
            <Image source={{ uri }} style={styles.image} />
            <View style={styles.removeOverlay}>
              <T style={styles.removeIcon} color={Colors.white}>
                ×
              </T>
            </View>
          </TouchableOpacity>
        ))}

        {images.length < MAX_REFERENCES && (
          <TouchableOpacity onPress={pickImages} style={styles.addButton} activeOpacity={0.7}>
            <T variant="title3" color={Colors.gray400}>
              +
            </T>
            <T variant="caption" muted align="center">
              Añadir foto
            </T>
          </TouchableOpacity>
        )}
      </View>

      <T variant="footnote" muted align="center" style={styles.hint}>
        {images.length}/{MAX_REFERENCES} fotos · Mínimo {MIN_REFERENCES}
      </T>

      <View style={styles.actions}>
        <Button
          label={uploading ? 'Analizando...' : 'Continuar'}
          onPress={handleContinue}
          loading={uploading}
          disabled={images.length < MIN_REFERENCES}
          fullWidth
        />
        <TouchableOpacity onPress={handleSkip} style={styles.skipBtn}>
          <T variant="subhead" muted align="center">
            Omitir por ahora
          </T>
        </TouchableOpacity>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[8],
  },
  subtitle: { marginTop: Spacing[3], marginBottom: Spacing[8] },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  image: {
    width: 100,
    height: 130,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray200,
  },
  removeOverlay: {
    position: 'absolute',
    top: 4,
    right: 4,
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: 'rgba(0,0,0,0.6)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeIcon: { fontSize: 16, lineHeight: 22 },
  addButton: {
    width: 100,
    height: 130,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.gray300,
    borderStyle: 'dashed',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 4,
  },
  hint: { marginTop: Spacing[4] },
  actions: { marginTop: Spacing[8], gap: Spacing[4] },
  skipBtn: { paddingVertical: Spacing[2] },
})
