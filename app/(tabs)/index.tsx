import { View, ScrollView, StyleSheet, RefreshControl, ActivityIndicator } from 'react-native'
import { useAuth } from '../../hooks/useAuth'
import { useOutfits } from '../../hooks/useOutfits'
import { useWeather } from '../../hooks/useWeather'
import { WeatherWidget } from '../../components/weather/WeatherWidget'
import { OutfitCard } from '../../components/outfits/OutfitCard'
import { T } from '../../components/ui/Typography'
import { Colors, Spacing } from '../../constants/theme'
import { useState } from 'react'

export default function HomeScreen() {
  const { profile } = useAuth()
  const { outfits, isLoading, submitFeedback } = useOutfits()
  const { weather, isLoading: weatherLoading } = useWeather()
  const [refreshing, setRefreshing] = useState(false)

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Buenos días'
    if (hour < 19) return 'Buenas tardes'
    return 'Buenas noches'
  }

  return (
    <ScrollView
      style={styles.flex}
      contentContainerStyle={styles.container}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <View>
          <T variant="footnote" muted weight="medium">
            {greeting()}
          </T>
          <T variant="title2" weight="semibold">
            {profile?.full_name?.split(' ')[0] ?? 'STYLO'}
          </T>
        </View>
      </View>

      <WeatherWidget weather={weather} isLoading={weatherLoading} />

      <View style={styles.section}>
        <T variant="headline" weight="semibold">
          Tus outfits de hoy
        </T>
        <T variant="footnote" muted style={{ marginTop: 4 }}>
          Generados para el clima y tu estilo personal
        </T>
      </View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.black} />
          <T variant="subhead" muted style={{ marginTop: Spacing[4] }} align="center">
            Preparando tus outfits...
          </T>
        </View>
      ) : outfits.length === 0 ? (
        <View style={styles.emptyContainer}>
          <T variant="title3" align="center">
            👔
          </T>
          <T variant="headline" weight="semibold" align="center" style={{ marginTop: Spacing[4] }}>
            Sin outfits aún
          </T>
          <T variant="subhead" muted align="center" style={{ marginTop: Spacing[2] }}>
            Añade prendas a tu armario para empezar
          </T>
        </View>
      ) : (
        <View style={styles.outfits}>
          {outfits.map((outfit) => (
            <OutfitCard key={outfit.id} outfit={outfit} onFeedback={submitFeedback} />
          ))}
        </View>
      )}
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  section: { marginTop: Spacing[2] },
  outfits: { gap: Spacing[4] },
  loadingContainer: { paddingVertical: Spacing[16], alignItems: 'center' },
  emptyContainer: { paddingVertical: Spacing[16], alignItems: 'center' },
})
