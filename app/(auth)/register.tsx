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
import { Colors, Spacing } from '../../constants/theme'

export default function RegisterScreen() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleRegister() {
    if (!fullName || !email || !password) {
      setError('Completa todos los campos')
      return
    }
    if (password.length < 8) {
      setError('La contraseña debe tener al menos 8 caracteres')
      return
    }
    setLoading(true)
    setError(null)

    const { error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } },
    })

    setLoading(false)
    if (authError) {
      setError(authError.message)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <View style={styles.successContainer}>
        <T variant="title2" weight="semibold" align="center">
          Revisa tu email
        </T>
        <T variant="body" muted align="center" style={{ marginTop: Spacing[3] }}>
          Te hemos enviado un enlace de confirmación a {email}
        </T>
        <Button
          label="Volver al inicio"
          onPress={() => router.replace('/(auth)/login')}
          style={{ marginTop: Spacing[8] }}
          fullWidth
        />
      </View>
    )
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
          <TouchableOpacity onPress={() => router.back()} style={styles.back}>
            <T variant="body" color={Colors.gray600}>
              ← Volver
            </T>
          </TouchableOpacity>
          <T variant="title2" weight="semibold">
            Crear cuenta
          </T>
          <T variant="subhead" muted style={{ marginTop: Spacing[1] }}>
            Empieza tu experiencia con STYLO
          </T>
        </View>

        <View style={styles.form}>
          <Input
            label="Nombre completo"
            value={fullName}
            onChangeText={setFullName}
            placeholder="Tu nombre"
            autoCapitalize="words"
          />
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
            placeholder="Mínimo 8 caracteres"
            hint="Usa una combinación de letras, números y símbolos"
          />

          {error && (
            <T variant="footnote" color={Colors.error} align="center">
              {error}
            </T>
          )}

          <Button
            label="Crear cuenta"
            onPress={handleRegister}
            loading={loading}
            fullWidth
            style={styles.registerBtn}
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
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
  successContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing[8],
    backgroundColor: Colors.offWhite,
  },
  header: { marginBottom: Spacing[8] },
  back: { marginBottom: Spacing[6] },
  form: { gap: Spacing[4] },
  registerBtn: { marginTop: Spacing[2] },
})
