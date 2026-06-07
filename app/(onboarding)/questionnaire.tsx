import { useState } from 'react'
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native'
import { router } from 'expo-router'
import { upsertStyleProfile, updateProfile } from '../../services/profile'
import { useAuthStore } from '../../stores/authStore'
import { T } from '../../components/ui/Typography'
import { Button } from '../../components/ui/Button'
import { StylePicker } from '../../components/onboarding/StylePicker'
import { ColorPicker } from '../../components/onboarding/ColorPicker'
import { ProgressBar } from '../../components/onboarding/ProgressBar'
import { Colors, Spacing } from '../../constants/theme'
import {
  STYLE_OPTIONS,
  GENDER_OPTIONS,
  EXPERIMENTATION_OPTIONS,
  type Gender,
  type ExperimentationLevel,
  type StyleOption,
} from '../../types/user'

const TOTAL_STEPS = 4

type FormData = {
  gender: Gender | ''
  age: string
  country: string
  primaryStyle: StyleOption | ''
  secondaryStyles: StyleOption[]
  favoriteColors: string[]
  avoidedColors: string[]
  favoriteBrands: string
  experimentationLevel: ExperimentationLevel | ''
}

export default function QuestionnaireScreen() {
  const user = useAuthStore((s) => s.user)
  const setStyleProfile = useAuthStore((s) => s.setStyleProfile)
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState<FormData>({
    gender: '',
    age: '',
    country: '',
    primaryStyle: '',
    secondaryStyles: [],
    favoriteColors: [],
    avoidedColors: [],
    favoriteBrands: '',
    experimentationLevel: '',
  })

  function update<K extends keyof FormData>(key: K, value: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: value }))
  }

  function toggleSecondaryStyle(style: StyleOption) {
    setForm((prev) => ({
      ...prev,
      secondaryStyles: prev.secondaryStyles.includes(style)
        ? prev.secondaryStyles.filter((s) => s !== style)
        : [...prev.secondaryStyles, style],
    }))
  }

  function toggleColor(key: 'favoriteColors' | 'avoidedColors', color: string) {
    setForm((prev) => ({
      ...prev,
      [key]: prev[key].includes(color)
        ? prev[key].filter((c) => c !== color)
        : [...prev[key], color],
    }))
  }

  async function handleFinish() {
    if (!user) return
    setLoading(true)
    try {
      await updateProfile(user.id, {
        gender: form.gender as Gender,
        age: parseInt(form.age) || null,
        country: form.country,
      })

      const profile = await upsertStyleProfile(user.id, {
        primary_style: form.primaryStyle,
        secondary_styles: form.secondaryStyles,
        favorite_colors: form.favoriteColors,
        avoided_colors: form.avoidedColors,
        favorite_brands: form.favoriteBrands
          .split(',')
          .map((b) => b.trim())
          .filter(Boolean),
        experimentation_level: form.experimentationLevel as ExperimentationLevel,
        onboarding_completed: false,
      })

      setStyleProfile(profile)
      router.replace('/(onboarding)/style-references')
    } finally {
      setLoading(false)
    }
  }

  const canContinue = () => {
    if (step === 1) return !!form.gender
    if (step === 2) return !!form.primaryStyle
    if (step === 3) return form.favoriteColors.length > 0
    if (step === 4) return !!form.experimentationLevel
    return false
  }

  return (
    <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView style={styles.flex} contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <ProgressBar total={TOTAL_STEPS} current={step} />

        <View style={styles.stepContent}>
          {step === 1 && (
            <>
              <T variant="title2" weight="semibold" style={styles.question}>
                Cuéntanos sobre ti
              </T>
              <T variant="subhead" muted style={styles.subQuestion}>
                Género
              </T>
              <StylePicker
                options={GENDER_OPTIONS}
                selected={form.gender}
                onSelect={(v) => update('gender', v as Gender)}
                columns={1}
              />
              <T variant="subhead" muted style={[styles.subQuestion, { marginTop: Spacing[6] }]}>
                Edad
              </T>
              <TextInput
                style={styles.textInput}
                value={form.age}
                onChangeText={(v) => update('age', v)}
                keyboardType="numeric"
                placeholder="Tu edad"
                placeholderTextColor={Colors.gray400}
                maxLength={3}
              />
              <T variant="subhead" muted style={[styles.subQuestion, { marginTop: Spacing[6] }]}>
                País
              </T>
              <TextInput
                style={styles.textInput}
                value={form.country}
                onChangeText={(v) => update('country', v)}
                placeholder="España, México, Argentina..."
                placeholderTextColor={Colors.gray400}
                autoCapitalize="words"
              />
            </>
          )}

          {step === 2 && (
            <>
              <T variant="title2" weight="semibold" style={styles.question}>
                ¿Cuál es tu estilo principal?
              </T>
              <StylePicker
                options={STYLE_OPTIONS}
                selected={form.primaryStyle}
                onSelect={(v) => update('primaryStyle', v as StyleOption)}
              />
              {form.primaryStyle && (
                <>
                  <T variant="subhead" muted style={[styles.subQuestion, { marginTop: Spacing[6] }]}>
                    Estilos secundarios (opcional)
                  </T>
                  <StylePicker
                    options={STYLE_OPTIONS.filter((s) => s.value !== form.primaryStyle)}
                    selected={form.secondaryStyles}
                    multiSelect
                    onSelect={toggleSecondaryStyle}
                  />
                </>
              )}
            </>
          )}

          {step === 3 && (
            <>
              <T variant="title2" weight="semibold" style={styles.question}>
                Tus colores
              </T>
              <T variant="subhead" muted style={styles.subQuestion}>
                Colores favoritos
              </T>
              <ColorPicker
                selected={form.favoriteColors}
                onToggle={(c) => toggleColor('favoriteColors', c)}
                excluded={form.avoidedColors}
              />
              <T variant="subhead" muted style={[styles.subQuestion, { marginTop: Spacing[6] }]}>
                Colores que evitas
              </T>
              <ColorPicker
                selected={form.avoidedColors}
                onToggle={(c) => toggleColor('avoidedColors', c)}
                excluded={form.favoriteColors}
              />
              <T variant="subhead" muted style={[styles.subQuestion, { marginTop: Spacing[6] }]}>
                Marcas favoritas (opcional)
              </T>
              <TextInput
                style={styles.textInput}
                value={form.favoriteBrands}
                onChangeText={(v) => update('favoriteBrands', v)}
                placeholder="Zara, COS, Nike... (separadas por coma)"
                placeholderTextColor={Colors.gray400}
                autoCapitalize="words"
              />
            </>
          )}

          {step === 4 && (
            <>
              <T variant="title2" weight="semibold" style={styles.question}>
                ¿Cómo eres con la moda?
              </T>
              <StylePicker
                options={EXPERIMENTATION_OPTIONS}
                selected={form.experimentationLevel}
                onSelect={(v) => update('experimentationLevel', v as ExperimentationLevel)}
                columns={1}
              />
            </>
          )}
        </View>

        <View style={styles.actions}>
          {step > 1 && (
            <TouchableOpacity onPress={() => setStep((s) => s - 1)} style={styles.backBtn}>
              <T variant="subhead" color={Colors.gray600}>
                ← Atrás
              </T>
            </TouchableOpacity>
          )}
          {step < TOTAL_STEPS ? (
            <Button
              label="Continuar"
              onPress={() => setStep((s) => s + 1)}
              disabled={!canContinue()}
              style={styles.nextBtn}
            />
          ) : (
            <Button
              label="Finalizar"
              onPress={handleFinish}
              loading={loading}
              disabled={!canContinue()}
              style={styles.nextBtn}
            />
          )}
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
    paddingBottom: Spacing[8],
  },
  stepContent: { flex: 1, marginTop: Spacing[8] },
  question: { marginBottom: Spacing[6] },
  subQuestion: { marginBottom: Spacing[3] },
  textInput: {
    borderWidth: 1,
    borderColor: Colors.gray200,
    borderRadius: 12,
    paddingHorizontal: Spacing[4],
    paddingVertical: Spacing[3] + 2,
    fontSize: 15,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing[8],
    gap: Spacing[4],
  },
  backBtn: { paddingVertical: Spacing[3] },
  nextBtn: { flex: 1 },
})
