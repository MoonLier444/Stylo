import { View, TouchableOpacity, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'

type Option = {
  value: string
  label: string
  emoji?: string
  description?: string
}

type Props = {
  options: Option[]
  selected: string | string[]
  multiSelect?: boolean
  onSelect: (value: string) => void
  columns?: 2 | 1
}

export function StylePicker({ options, selected, multiSelect = false, onSelect, columns = 2 }: Props) {
  const isSelected = (value: string) =>
    Array.isArray(selected) ? selected.includes(value) : selected === value

  return (
    <View style={[styles.grid, columns === 1 && styles.column]}>
      {options.map((option) => {
        const active = isSelected(option.value)
        return (
          <TouchableOpacity
            key={option.value}
            activeOpacity={0.7}
            onPress={() => onSelect(option.value)}
            style={[
              styles.option,
              columns === 2 && styles.halfWidth,
              active && styles.optionActive,
            ]}
          >
            {option.emoji && <T style={styles.emoji}>{option.emoji}</T>}
            <T variant="callout" weight={active ? 'semibold' : 'regular'} color={active ? Colors.white : Colors.black}>
              {option.label}
            </T>
            {option.description && (
              <T variant="footnote" color={active ? 'rgba(255,255,255,0.7)' : Colors.gray500} style={{ marginTop: 2 }}>
                {option.description}
              </T>
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing[3] },
  column: { flexDirection: 'column' },
  halfWidth: { width: '47%' },
  option: {
    padding: Spacing[4],
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.gray200,
    backgroundColor: Colors.white,
    gap: 4,
  },
  optionActive: {
    backgroundColor: Colors.black,
    borderColor: Colors.black,
  },
  emoji: { fontSize: 24 },
})
