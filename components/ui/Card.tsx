import { View, type ViewProps, StyleSheet } from 'react-native'
import { Colors, Radius, Shadow, Spacing } from '../../constants/theme'

type Props = ViewProps & {
  elevated?: boolean
  padding?: keyof typeof Spacing
}

export function Card({ elevated = false, padding = 5, style, children, ...props }: Props) {
  return (
    <View
      style={[
        styles.base,
        { padding: Spacing[padding] },
        elevated && Shadow.md,
        style,
      ]}
      {...props}
    >
      {children}
    </View>
  )
}

const styles = StyleSheet.create({
  base: {
    backgroundColor: Colors.white,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
})
