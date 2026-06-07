import { useQuery } from '@tanstack/react-query'
import * as Location from 'expo-location'
import { getCachedWeather, fetchAndCacheWeather } from '../services/weather'
import { useAuthStore } from '../stores/authStore'

export function useWeather() {
  const userId = useAuthStore((s) => s.user?.id)

  const { data: weather, isLoading } = useQuery({
    queryKey: ['weather', userId],
    queryFn: async () => {
      const cached = await getCachedWeather(userId!)
      if (cached) return cached

      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== 'granted') return null

      const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced })
      return fetchAndCacheWeather(userId!, location.coords.latitude, location.coords.longitude)
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 30,
  })

  return { weather, isLoading }
}
