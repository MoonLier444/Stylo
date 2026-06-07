import { View, StyleSheet } from 'react-native'
import { T } from '../ui/Typography'
import { Colors, Radius, Spacing } from '../../constants/theme'
import { WEATHER_CONDITION_ICONS, WEATHER_CONDITION_LABELS } from '../../types/weather'
import type { WeatherData } from '../../types/weather'

type Props = {
  weather: WeatherData | null | undefined
  isLoading?: boolean
}

export function WeatherWidget({ weather, isLoading }: Props) {
  const today = new Date()
  const dateStr = today.toLocaleDateString('es-ES', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  })
  const formattedDate = dateStr.charAt(0).toUpperCase() + dateStr.slice(1)

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <View>
          <T variant="footnote" muted weight="medium" style={{ textTransform: 'uppercase', letterSpacing: 0.8 }}>
            {formattedDate}
          </T>
          {weather && !isLoading && (
            <T variant="title3" weight="light" style={{ marginTop: 4 }}>
              {WEATHER_CONDITION_ICONS[weather.condition]} {Math.round(weather.temperature)}°C
            </T>
          )}
        </View>
        {weather && !isLoading && (
          <View style={styles.details}>
            <T variant="caption" muted>
              {WEATHER_CONDITION_LABELS[weather.condition]}
            </T>
            <T variant="caption" muted>
              Sensación {Math.round(weather.feels_like)}°
            </T>
            <T variant="caption" muted>
              Humedad {weather.humidity}%
            </T>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.gray100,
    borderRadius: Radius.xl,
    padding: Spacing[5],
    borderWidth: 1,
    borderColor: Colors.gray200,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  details: { alignItems: 'flex-end', gap: 2 },
})
