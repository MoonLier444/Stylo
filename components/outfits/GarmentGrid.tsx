import { View, Image, StyleSheet, ScrollView } from 'react-native'
import { Colors, Radius } from '../../constants/theme'
import type { Garment } from '../../types/garment'

type Props = {
  garments: Garment[]
}

export function GarmentGrid({ garments }: Props) {
  if (garments.length === 0) return null

  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.scroll}>
      <View style={styles.container}>
        {garments.map((garment) => (
          <Image
            key={garment.id}
            source={{ uri: garment.image_url }}
            style={styles.image}
            resizeMode="cover"
          />
        ))}
      </View>
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -16 },
  container: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
  },
  image: {
    width: 90,
    height: 110,
    borderRadius: Radius.md,
    backgroundColor: Colors.gray200,
  },
})
