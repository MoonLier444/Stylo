import { ScrollView, TouchableOpacity, StyleSheet, View } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'
import { CATEGORY_FILTER_OPTIONS } from '../../constants/categories'
import type { GarmentCategory } from '../../types/garment'

type Props = {
  active: GarmentCategory | 'all'
  onSelect: (category: GarmentCategory | 'all') => void
}

export function FilterBar({ active, onSelect }: Props) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.scroll}
      contentContainerStyle={styles.container}
    >
      {CATEGORY_FILTER_OPTIONS.map((opt) => {
        const isActive = active === opt.value
        return (
          <TouchableOpacity
            key={opt.value}
            activeOpacity={0.7}
            onPress={() => onSelect(opt.value as GarmentCategory | 'all')}
            style={[styles.pill, isActive && styles.pillActive]}
          >
            <T
              variant="footnote"
              weight={isActive ? 'semibold' : 'regular'}
              color={isActive ? Colors.white : Colors.gray700}
            >
              {opt.label}
            </T>
          </TouchableOpacity>
        )
      })}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  scroll: { marginHorizontal: -Spacing[5] },
  container: { paddingHorizontal: Spacing[5], gap: Spacing[2] },
  pill: {
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[2],
    borderRadius: Radius.full,
    backgroundColor: Colors.gray100,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  pillActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
})
