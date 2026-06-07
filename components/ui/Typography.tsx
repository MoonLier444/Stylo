import { Text, type TextProps, StyleSheet } from 'react-native'
import { Colors, Typography } from '../../constants/theme'

type Variant = 'display' | 'title1' | 'title2' | 'title3' | 'headline' | 'body' | 'callout' | 'subhead' | 'footnote' | 'caption'
type Weight = 'light' | 'regular' | 'medium' | 'semibold' | 'bold'
type Align = 'left' | 'center' | 'right'

type Props = TextProps & {
  variant?: Variant
  weight?: Weight
  color?: string
  align?: Align
  muted?: boolean
}

const variantStyles: Record<Variant, object> = {
  display: { fontSize: Typography.size['4xl'], letterSpacing: -1.5 },
  title1: { fontSize: Typography.size['3xl'], letterSpacing: -0.8 },
  title2: { fontSize: Typography.size['2xl'], letterSpacing: -0.5 },
  title3: { fontSize: Typography.size.xl, letterSpacing: -0.3 },
  headline: { fontSize: Typography.size.md, letterSpacing: -0.1 },
  body: { fontSize: Typography.size.base, lineHeight: Typography.size.base * Typography.lineHeight.normal },
  callout: { fontSize: Typography.size.base },
  subhead: { fontSize: Typography.size.sm },
  footnote: { fontSize: Typography.size.xs },
  caption: { fontSize: Typography.size.xs, letterSpacing: 0.3 },
}

export function T({ variant = 'body', weight = 'regular', color, align = 'left', muted, style, ...props }: Props) {
  return (
    <Text
      style={[
        variantStyles[variant],
        { fontWeight: Typography.weight[weight] },
        { color: muted ? Colors.gray500 : color ?? Colors.black },
        align !== 'left' && { textAlign: align },
        style,
      ]}
      {...props}
    />
  )
}
