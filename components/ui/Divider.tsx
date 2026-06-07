import { View, StyleSheet } from 'react-native'
import { T } from './Typography'
import { Colors, Spacing } from '../../constants/theme'

type Props = {
  label?: string
}

export function Divider({ label }: Props) {
  if (!label) {
    return <View style={styles.line} />
  }

  return (
    <View style={styles.withLabel}>
      <View style={styles.flex} />
      <T variant="footnote" muted style={styles.text}>
        {label}
      </T>
      <View style={styles.flex} />
    </View>
  )
}

const styles = StyleSheet.create({
  line: {
    height: 1,
    backgroundColor: Colors.gray200,
    marginVertical: Spacing[4],
  },
  withLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing[3],
    marginVertical: Spacing[4],
  },
  flex: { flex: 1, height: 1, backgroundColor: Colors.gray200 },
  text: { flexShrink: 0 },
})
