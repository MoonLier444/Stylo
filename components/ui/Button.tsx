import { TouchableOpacity, ActivityIndicator, StyleSheet, type TouchableOpacityProps } from 'react-native'
import { T } from './Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'

type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive'
type Size = 'sm' | 'md' | 'lg'

type Props = TouchableOpacityProps & {
  label: string
  variant?: Variant
  size?: Size
  loading?: boolean
  fullWidth?: boolean
}

const variantStyle = {
  primary: { bg: Colors.black, text: Colors.white, border: Colors.black },
  secondary: { bg: Colors.white, text: Colors.black, border: Colors.gray300 },
  ghost: { bg: Colors.transparent, text: Colors.black, border: Colors.transparent },
  destructive: { bg: Colors.error, text: Colors.white, border: Colors.error },
}

const sizeStyle = {
  sm: { paddingVertical: Spacing[2], paddingHorizontal: Spacing[4], textSize: 13 as const },
  md: { paddingVertical: Spacing[3], paddingHorizontal: Spacing[6], textSize: 15 as const },
  lg: { paddingVertical: Spacing[4], paddingHorizontal: Spacing[6], textSize: 17 as const },
}

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  loading = false,
  fullWidth = false,
  style,
  disabled,
  ...props
}: Props) {
  const v = variantStyle[variant]
  const s = sizeStyle[size]
  const isDisabled = disabled || loading

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      disabled={isDisabled}
      style={[
        styles.base,
        {
          backgroundColor: v.bg,
          borderColor: v.border,
          paddingVertical: s.paddingVertical,
          paddingHorizontal: s.paddingHorizontal,
          opacity: isDisabled ? 0.5 : 1,
        },
        fullWidth && { width: '100%' },
        style,
      ]}
      {...props}
    >
      {loading ? (
        <ActivityIndicator color={v.text} size="small" />
      ) : (
        <T
          variant="callout"
          weight="semibold"
          color={v.text}
          align="center"
          style={{ fontSize: s.textSize }}
        >
          {label}
        </T>
      )}
    </TouchableOpacity>
  )
}

const styles = StyleSheet.create({
  base: {
    borderRadius: Radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: 8,
  },
})
