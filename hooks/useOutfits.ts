import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getDailyOutfits, generateDailyOutfits, submitOutfitFeedback } from '../services/outfits'
import { useOutfitStore } from '../stores/outfitStore'
import { useAuthStore } from '../stores/authStore'
import type { OutfitFeedbackReaction } from '../types/outfit'

function getTodayDate(): string {
  return new Date().toISOString().split('T')[0]
}

export function useOutfits() {
  const userId = useAuthStore((s) => s.user?.id)
  const store = useOutfitStore()
  const queryClient = useQueryClient()
  const today = getTodayDate()

  const { isLoading } = useQuery({
    queryKey: ['outfits', userId, today],
    queryFn: async () => {
      store.setIsLoading(true)
      const existing = await getDailyOutfits(userId!, today)
      if (existing.length > 0) {
        store.setTodayOutfits(existing)
        store.setIsLoading(false)
        return existing
      }
      const generated = await generateDailyOutfits(userId!, today)
      store.setTodayOutfits(generated)
      store.setIsLoading(false)
      return generated
    },
    enabled: !!userId,
    staleTime: 1000 * 60 * 60,
  })

  const feedbackMutation = useMutation({
    mutationFn: ({ outfitId, reaction }: { outfitId: string; reaction: OutfitFeedbackReaction }) =>
      submitOutfitFeedback(userId!, outfitId, reaction),
    onMutate: ({ outfitId, reaction }) => {
      store.updateFeedback(outfitId, reaction)
    },
  })

  return {
    outfits: store.todayOutfits,
    isLoading: isLoading || store.isLoading,
    submitFeedback: feedbackMutation.mutate,
  }
}
