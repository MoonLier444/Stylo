import { View, StyleSheet } from 'react-native'
import { Colors, Radius } from '../../constants/theme'

type Props = {
  total: number
  current: number
}

export function ProgressBar({ total, current }: Props) {
  return (
    <View style={styles.container}>
      {Array.from({ length: total }).map((_, i) => (
        <View
          key={i}
          style={[
            styles.segment,
            { backgroundColor: i < current ? Colors.black : Colors.gray200 },
          ]}
        />
      ))}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', gap: 4 },
  segment: { flex: 1, height: 2, borderRadius: Radius.full },
})
