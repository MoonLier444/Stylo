import { View, Image, TouchableOpacity, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'
import type { Garment } from '../../types/garment'

type Props = {
  garment: Garment
  onPress: (garment: Garment) => void
}

export function GarmentCard({ garment, onPress }: Props) {
  return (
    <TouchableOpacity activeOpacity={0.85} onPress={() => onPress(garment)} style={styles.container}>
      <Image source={{ uri: garment.image_url }} style={styles.image} resizeMode="cover" />
      <View style={styles.info}>
        <T variant="footnote" weight="medium" numberOfLines={1}>
          {garment.name ?? garment.subcategory ?? garment.category ?? '—'}
        </T>
        {garment.primary_color && (
          <T variant="caption" muted numberOfLines={1}>
            {garment.primary_color}
          </T>
        )}
      </View>
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  image: {
    width: '100%',
    aspectRatio: 3 / 4,
    backgroundColor: Colors.gray100,
  },
  info: {
    padding: Spacing[3],
    gap: 2,
  },
})
