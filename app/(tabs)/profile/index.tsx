import { View, ScrollView, StyleSheet, TouchableOpacity } from 'react-native'
import { useAuth } from '../../../hooks/useAuth'
import { T } from '../../../components/ui/Typography'
import { Card } from '../../../components/ui/Card'
import { Button } from '../../../components/ui/Button'
import { Colors, Spacing } from '../../../constants/theme'

export default function ProfileScreen() {
  const { profile, styleProfile, signOut } = useAuth()

  return (
    <ScrollView style={styles.flex} contentContainerStyle={styles.container} showsVerticalScrollIndicator={false}>
      <T variant="title2" weight="semibold">
        Perfil
      </T>

      <Card style={styles.profileCard}>
        <View style={styles.avatar}>
          <T style={styles.avatarEmoji}>👤</T>
        </View>
        <T variant="headline" weight="semibold" align="center">
          {profile?.full_name ?? 'Usuario'}
        </T>
        <T variant="subhead" muted align="center">
          {profile?.email}
        </T>
      </Card>

      {styleProfile && (
        <Card style={styles.styleCard}>
          <T variant="footnote" muted weight="medium" style={styles.cardLabel}>
            ESTILO
          </T>
          <View style={styles.styleRow}>
            <T variant="body" weight="semibold">
              {styleProfile.primary_style ?? '—'}
            </T>
            {styleProfile.experimentation_level && (
              <T variant="footnote" muted>
                · {styleProfile.experimentation_level}
              </T>
            )}
          </View>
          {styleProfile.secondary_styles?.length > 0 && (
            <T variant="footnote" muted>
              También: {styleProfile.secondary_styles.join(', ')}
            </T>
          )}
          {styleProfile.favorite_colors?.length > 0 && (
            <T variant="footnote" muted style={{ marginTop: Spacing[2] }}>
              Colores favoritos: {styleProfile.favorite_colors.join(', ')}
            </T>
          )}
        </Card>
      )}

      <Button
        label="Cerrar sesión"
        variant="secondary"
        onPress={signOut}
        fullWidth
        style={styles.signOutBtn}
      />
    </ScrollView>
  )
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.offWhite },
  container: {
    paddingHorizontal: Spacing[5],
    paddingTop: Spacing[16],
    paddingBottom: Spacing[10],
    gap: Spacing[5],
  },
  profileCard: { alignItems: 'center', gap: Spacing[2] },
  avatar: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.gray100,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing[2],
  },
  avatarEmoji: { fontSize: 32 },
  styleCard: { gap: Spacing[2] },
  cardLabel: { marginBottom: Spacing[2], letterSpacing: 0.8, textTransform: 'uppercase' },
  styleRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing[2] },
  signOutBtn: { marginTop: Spacing[4] },
})
