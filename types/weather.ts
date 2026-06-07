export type WeatherCondition =
  | 'clear'
  | 'partly_cloudy'
  | 'cloudy'
  | 'rain'
  | 'heavy_rain'
  | 'snow'
  | 'storm'
  | 'fog'
  | 'wind'

export type WeatherData = {
  temperature: number
  feels_like: number
  humidity: number
  wind_speed: number
  condition: WeatherCondition
  city?: string
  fetched_at: string
}

export const WEATHER_CONDITION_LABELS: Record<WeatherCondition, string> = {
  clear: 'Soleado',
  partly_cloudy: 'Parcialmente nublado',
  cloudy: 'Nublado',
  rain: 'Lluvia',
  heavy_rain: 'Lluvia intensa',
  snow: 'Nieve',
  storm: 'Tormenta',
  fog: 'Niebla',
  wind: 'Viento',
}

export const WEATHER_CONDITION_ICONS: Record<WeatherCondition, string> = {
  clear: '☀️',
  partly_cloudy: '⛅',
  cloudy: '☁️',
  rain: '🌧️',
  heavy_rain: '⛈️',
  snow: '❄️',
  storm: '🌩️',
  fog: '🌫️',
  wind: '💨',
}
