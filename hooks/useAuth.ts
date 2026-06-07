import { useEffect } from 'react'
import { supabase } from '../services/supabase'
import { getProfile, getStyleProfile } from '../services/profile'
import { useAuthStore } from '../stores/authStore'

export function useAuth() {
  const store = useAuthStore()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      store.setSession(session)
      if (session?.user) {
        loadUserData(session.user.id)
      } else {
        store.setIsLoading(false)
      }
    })

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, session) => {
      store.setSession(session)
      if (session?.user) {
        await loadUserData(session.user.id)
      } else {
        store.reset()
      }
    })

    return () => subscription.unsubscribe()
  }, [])

  async function loadUserData(userId: string) {
    const [profile, styleProfile] = await Promise.all([
      getProfile(userId),
      getStyleProfile(userId),
    ])
    store.setProfile(profile)
    store.setStyleProfile(styleProfile)
    store.setIsLoading(false)
  }

  async function signOut() {
    await supabase.auth.signOut()
  }

  return {
    session: store.session,
    user: store.user,
    profile: store.profile,
    styleProfile: store.styleProfile,
    isLoading: store.isLoading,
    isOnboarded: store.isOnboarded,
    signOut,
  }
}
