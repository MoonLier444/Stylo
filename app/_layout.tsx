import { useEffect } from 'react'
import { Stack, router } from 'expo-router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { StatusBar } from 'expo-status-bar'
import { useAuth } from '../hooks/useAuth'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: { retry: 2, staleTime: 1000 * 60 * 5 },
  },
})

function RootLayoutNav() {
  const { session, isLoading, isOnboarded } = useAuth()

  useEffect(() => {
    if (isLoading) return

    if (!session) {
      router.replace('/(auth)/login')
    } else if (!isOnboarded) {
      router.replace('/(onboarding)/questionnaire')
    } else {
      router.replace('/(tabs)/')
    }
  }, [session, isLoading, isOnboarded])

  return (
    <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(onboarding)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  )
}

export default function RootLayout() {
  return (
    <QueryClientProvider client={queryClient}>
      <StatusBar style="dark" />
      <RootLayoutNav />
    </QueryClientProvider>
  )
}
