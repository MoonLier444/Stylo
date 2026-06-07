import { create } from 'zustand'
import type { Session, User } from '@supabase/supabase-js'
import type { Profile, StyleProfile } from '../types/user'

type AuthState = {
  session: Session | null
  user: User | null
  profile: Profile | null
  styleProfile: StyleProfile | null
  isLoading: boolean
  isOnboarded: boolean

  setSession: (session: Session | null) => void
  setProfile: (profile: Profile | null) => void
  setStyleProfile: (styleProfile: StyleProfile | null) => void
  setIsLoading: (loading: boolean) => void
  setIsOnboarded: (onboarded: boolean) => void
  reset: () => void
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  user: null,
  profile: null,
  styleProfile: null,
  isLoading: true,
  isOnboarded: false,

  setSession: (session) => set({ session, user: session?.user ?? null }),
  setProfile: (profile) => set({ profile }),
  setStyleProfile: (styleProfile) =>
    set({ styleProfile, isOnboarded: styleProfile?.onboarding_completed ?? false }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setIsOnboarded: (isOnboarded) => set({ isOnboarded }),
  reset: () =>
    set({
      session: null,
      user: null,
      profile: null,
      styleProfile: null,
      isLoading: false,
      isOnboarded: false,
    }),
}))
