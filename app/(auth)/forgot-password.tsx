import { useState } from 'react'
import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../services/supabase'
import { T } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Colors, Spacing } from '../../constants/theme'

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleReset() {
    if (!email) {
      setError('Introduce tu email')
      return
    }
    setLoading(true)
    setError(null)
    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email)
    setLoading(false)
    if (resetError) {
      setError(resetError.message)
    } else {
      setSent(true)
    }
  }

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container}>
      <TouchableOpacity onPress={() => router.back()} style={styles.back}>
        <T variant="body" color={Colors.gray600}>
          ← Volver
        </T>
      </TouchableOpacity>

      <T variant="title2" weight="semibold">
        Recuperar contraseña
      </T>
      <T variant="subhead" muted style={styles.subtitle}>
        Te enviaremos un enlace para restablecer tu contraseña
      </T>

      {sent ? (
        <View style={styles.successBox}>
          <T variant="body" align="center">
            Revisa tu bandeja de entrada. Si el email está registrado, recibirás el enlace.
          </T>
        </View>
      ) : (
        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="hola@ejemplo.com"
          />
          {error && (
            <T variant="footnote" color={Colors.error}>
              {error}
            </T>
          )}
          <Button label="Enviar enlace" onPress={handleReset} loading={loading} fullWidth />
        </View>
      )}
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  container: {
    flexGrow: 1,
    paddingHorizontal: Spacing[6],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[12],
  },
  back: { marginBottom: Spacing[8] },
  subtitle: { marginTop: Spacing[2], marginBottom: Spacing[8] },
  form: { gap: Spacing[4] },
  successBox: {
    padding: Spacing[6],
    backgroundColor: Colors.gray100,
    borderRadius: 16,
    marginTop: Spacing[4],
  },
})
