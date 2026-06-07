import { TextInput, View, StyleSheet, type TextInputProps, TouchableOpacity } from 'react-native'
import { T } from './Typography'
import { Colors, Radius, Spacing, Typography } from '../../constants/theme'

type Props = TextInputProps & {
  label?: string
  error?: string
  hint?: string
  rightElement?: React.ReactNode
}

export function Input({ label, error, hint, rightElement, style, ...props }: Props) {
  return (
    <View style={styles.container}>
      {label && (
        <T variant="footnote" weight="medium" color={Colors.gray600} style={styles.label}>
          {label}
        </T>
      )}
      <View style={[styles.inputWrapper, error && styles.inputError]}>
        <TextInput
          style={[styles.input, style]}
          placeholderTextColor={Colors.gray400}
          autoCapitalize="none"
          {...props}
        />
        {rightElement && <View style={styles.rightElement}>{rightElement}</View>}
      </View>
      {error && (
        <T variant="footnote" color={Colors.error} style={styles.message}>
          {error}
        </T>
      )}
      {hint && !error && (
        <T variant="footnote" muted style={styles.message}>
          {hint}
        </T>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: { gap: 6 },
  label: { marginBottom: 2 },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: Radius.md,
    backgroundColor: Colors.white,
    paddingHorizontal: Spacing[4],
  },
  input: {
    flex: 1,
    paddingVertical: Spacing[3] + 2,
    fontSize: Typography.size.base,
    color: Colors.black,
  },
  inputError: { borderColor: Colors.error },
  rightElement: { marginLeft: Spacing[2] },
  message: { marginTop: 2 },
})
