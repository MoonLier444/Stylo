import { supabase } from './supabase'
import type { WeatherData } from '../types/weather'

export async function getCachedWeather(userId: string): Promise<WeatherData | null> {
  const { data, error } = await supabase
    .from('weather_cache')
    .select('*')
    .eq('user_id', userId)
    .gt('valid_until', new Date().toISOString())
    .order('fetched_at', { ascending: false })
    .limit(1)
    .single()

  if (error || !data) return null

  return {
    temperature: data.temperature,
    feels_like: data.feels_like,
    humidity: data.humidity,
    wind_speed: data.wind_speed,
    condition: data.condition as WeatherData['condition'],
    fetched_at: data.fetched_at,
  }
}

export async function fetchAndCacheWeather(
  userId: string,
  latitude: number,
  longitude: number
): Promise<WeatherData> {
  const { data, error } = await supabase.functions.invoke('update-weather', {
    body: { user_id: userId, latitude, longitude },
  })

  if (error) throw error
  return data.weather
}
