import { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { supabase } from '../../services/supabase'
import { T } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Divider } from '../../components/ui/Divider'
import { Colors, Spacing } from '../../constants/theme'

export default function LoginScreen() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleLogin() {
    if (!email || !password) {
      setError('Completa todos los campos')
      return
    }
    setLoading(true)
    setError(null)
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (authError) setError(authError.message)
  }

  async function handleGoogleLogin() {
    await supabase.auth.signInWithOAuth({ provider: 'google' })
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        style={styles.flex}
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <T variant="display" weight="light" align="center" style={styles.logo}>
            STYLO
          </T>
          <T variant="subhead" muted align="center">
            Tu estilista personal
          </T>
        </View>

        <View style={styles.form}>
          <Input
            label="Email"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            placeholder="hola@ejemplo.com"
          />
          <Input
            label="Contraseña"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            placeholder="••••••••"
          />

          {error && (
            <T variant="footnote" color={Colors.error} align="center">
              {error}
            </T>
          )}

          <Button
            label="Iniciar sesión"
            onPress={handleLogin}
            loading={loading}
            fullWidth
            style={styles.loginBtn}
          />

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')}>
            <T variant="footnote" muted align="center">
              ¿Olvidaste tu contraseña?
            </T>
          </TouchableOpacity>
        </View>

        <Divider label="o continúa con" />

        <Button
          label="Continuar con Google"
          variant="secondary"
          onPress={handleGoogleLogin}
          fullWidth
        />

        <TouchableOpacity
          style={styles.registerLink}
          onPress={() => router.push('/(auth)/register')}
        >
          <T variant="subhead" muted align="center">
            ¿No tienes cuenta?{' '}
            <T variant="subhead" weight="semibold" color={Colors.black}>
              Regístrate
            </T>
          </T>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing[6],
    paddingVertical: Spacing[12],
  },
  header: { marginBottom: Spacing[12] },
  logo: { marginBottom: Spacing[2] },
  form: { gap: Spacing[4] },
  loginBtn: { marginTop: Spacing[2] },
  registerLink: { marginTop: Spacing[6] },
})
