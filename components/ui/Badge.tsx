import { View, StyleSheet } from 'react-native'
import { T } from './Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'

type Props = {
  label: string
  color?: string
  textColor?: string
  size?: 'sm' | 'md'
}

export function Badge({ label, color = Colors.gray100, textColor = Colors.gray700, size = 'md' }: Props) {
  return (
    <View style={[styles.base, { backgroundColor: color }, size === 'sm' && styles.sm]}>
      <T
        variant="caption"
        weight="medium"
        color={textColor}
        style={size === 'sm' && { fontSize: 10 }}
      >
        {label}
      </T>
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    paddingHorizontal: Spacing[3],
    paddingVertical: Spacing[1],
    borderRadius: Radius.full,
    alignSelf: 'flex-start',
  },
  sm: {
    paddingHorizontal: Spacing[2],
    paddingVertical: 2,
  },
})
