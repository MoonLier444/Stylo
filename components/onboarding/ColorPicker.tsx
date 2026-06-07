import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'
import { COLOR_OPTIONS } from '../../constants/categories'

type Props = {
  selected: string[]
  onToggle: (color: string) => void
  excluded?: string[]
}

export function ColorPicker({ selected, onToggle, excluded = [] }: Props) {
  return (
    <View style={styles.grid}>
      {COLOR_OPTIONS.filter((c) => !excluded.includes(c.value)).map((color) => {
        const active = selected.includes(color.value)
        return (
          <TouchableOpacity
            key={color.value}
            activeOpacity={0.8}
            onPress={() => onToggle(color.value)}
            style={styles.item}
          >
            <View
              style={[
                styles.swatch,
                { backgroundColor: color.hex },
                active && styles.swatchActive,
                color.value === 'white' && styles.swatchBorder,
              ]}
            >
              {active && (
                <T style={styles.checkmark} color={color.value === 'white' || color.value === 'cream' ? Colors.black : Colors.white}>
                  ✓
                </T>
              )}
            </View>
            <T variant="caption" align="center" muted>
              {color.label}
            </T>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing[3],
  },
  item: { alignItems: 'center', gap: 4, width: 52 },
  swatch: {
    width: 44,
    height: 44,
    borderRadius: Radius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  swatchActive: { transform: [{ scale: 1.15 }] },
  swatchBorder: { borderWidth: 1, borderColor: Colors.gray300 },
  checkmark: { fontSize: 18, fontWeight: '600' },
})
