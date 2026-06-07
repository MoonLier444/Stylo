import { useState } from 'react'
import {
  View,
  ScrollView,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from 'react-native'
import { useLocalSearchParams, router } from 'expo-router'
import { useQuery } from '@tanstack/react-query'
import { getGarmentById } from '../../../services/garments'
import { useGarments } from '../../../hooks/useGarments'
import { T } from '../../../components/ui/Typography'
import { Button } from '../../../components/ui/Button'
import { Badge } from '../../../components/ui/Badge'
import { Colors, Spacing, Radius } from '../../../constants/theme'

export default function GarmentDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { deleteGarment, isDeleting } = useGarments()

  const { data: garment, isLoading } = useQuery({
    queryKey: ['garment', id],
    queryFn: () => getGarmentById(id),
  })

  function handleDelete() {
    Alert.alert(
      'Eliminar prenda',
      '¿Estás seguro? Esta acción no se puede deshacer.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar',
          style: 'destructive',
          onPress: () => {
            deleteGarment(id)
            router.back()
          },
        },
      ]
    )
  }

  if (isLoading || !garment) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={Colors.black} />
      </View>
    )
  }

  return (
    <ScrollView style={styles.flex} showsVerticalScrollIndicator={false}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <T variant="body" color={Colors.gray600}>
          ← Volver
        </T>
      </TouchableOpacity>

      <Image source={{ uri: garment.image_url }} style={styles.image} resizeMode="cover" />

      <View style={styles.content}>
        <T variant="title3" weight="semibold">
          {garment.name ?? garment.subcategory ?? garment.category ?? 'Prenda'}
        </T>
        {garment.category && (
          <T variant="subhead" muted style={{ marginTop: 4 }}>
            {garment.category}
            {garment.subcategory ? ` · ${garment.subcategory}` : ''}
          </T>
        )}

        <View style={styles.tags}>
          {garment.primary_color && (
            <Badge label={garment.primary_color} />
          )}
          {garment.pattern && <Badge label={garment.pattern} />}
          {garment.material && <Badge label={garment.material} />}
          {garment.secondary_colors?.map((c) => (
            <Badge key={c} label={c} color={Colors.gray100} />
          ))}
        </View>

        {garment.seasons?.length > 0 && (
          <View style={styles.section}>
            <T variant="footnote" muted weight="medium" style={styles.sectionLabel}>
              TEMPORADAS
            </T>
            <View style={styles.tags}>
              {garment.seasons.map((s) => (
                <Badge key={s} label={s} color={Colors.gray100} />
              ))}
            </View>
          </View>
        )}

        {garment.formality != null && (
          <View style={styles.section}>
            <T variant="footnote" muted weight="medium" style={styles.sectionLabel}>
              FORMALIDAD
            </T>
            <View style={styles.formalityBar}>
              <View style={[styles.formalityFill, { width: `${garment.formality * 10}%` }]} />
            </View>
            <T variant="caption" muted style={{ marginTop: 4 }}>
              {garment.formality}/10
            </T>
          </View>
        )}

        <View style={styles.section}>
          <T variant="footnote" muted weight="medium" style={styles.sectionLabel}>
            USO
          </T>
          <T variant="body">
            Usada {garment.times_worn} {garment.times_worn === 1 ? 'vez' : 'veces'}
          </T>
          {garment.last_worn_at && (
            <T variant="footnote" muted>
              Último uso: {new Date(garment.last_worn_at).toLocaleDateString('es-ES')}
            </T>
          )}
        </View>

        <View style={styles.actions}>
          <Button
            label="Eliminar prenda"
            variant="destructive"
            onPress={handleDelete}
            loading={isDeleting}
            fullWidth
          />
        </View>
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  backBtn: {
    position: 'absolute',
    top: Spacing[16],
    left: Spacing[5],
    zIndex: 10,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.gray200,
  },
  content: {
    padding: Spacing[5],
    gap: Spacing[3],
  },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[2], marginTop: Spacing[3] },
  section: { marginTop: Spacing[4] },
  sectionLabel: { marginBottom: Spacing[2], letterSpacing: 0.8, textTransform: 'uppercase' },
  formalityBar: {
    height: 4,
    backgroundColor: Colors.gray200,
    borderRadius: Radius.full,
    overflow: 'hidden',
  },
  formalityFill: {
    height: '100%',
    backgroundColor: Colors.black,
    borderRadius: Radius.full,
  },
  actions: { marginTop: Spacing[6] },
})
