import { create } from 'zustand'
import type { PopulatedOutfit, OutfitFeedbackReaction } from '../types/outfit'

type OutfitState = {
  todayOutfits: PopulatedOutfit[]
  isLoading: boolean
  lastGeneratedDate: string | null

  setTodayOutfits: (outfits: PopulatedOutfit[]) => void
  setIsLoading: (loading: boolean) => void
  setLastGeneratedDate: (date: string) => void
  updateFeedback: (outfitId: string, reaction: OutfitFeedbackReaction) => void
}

export const useOutfitStore = create<OutfitState>((set) => ({
  todayOutfits: [],
  isLoading: false,
  lastGeneratedDate: null,

  setTodayOutfits: (todayOutfits) => set({ todayOutfits }),
  setIsLoading: (isLoading) => set({ isLoading }),
  setLastGeneratedDate: (lastGeneratedDate) => set({ lastGeneratedDate }),
  updateFeedback: (outfitId, reaction) =>
    set((state) => ({
      todayOutfits: state.todayOutfits.map((o) =>
        o.id === outfitId ? { ...o, userFeedback: reaction } : o
      ),
    })),
}))
