import { useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getGarments, uploadAndAnalyzeGarment, updateGarment, deleteGarment } from '../services/garments'
import { useWardrobeStore } from '../stores/wardrobeStore'
import { useAuthStore } from '../stores/authStore'
import type { GarmentUpdate } from '../types/garment'

export function useGarments() {
  const userId = useAuthStore((s) => s.user?.id)
  const store = useWardrobeStore()
  const queryClient = useQueryClient()

  const { data: garments = [], isLoading } = useQuery({
    queryKey: ['garments', userId],
    queryFn: () => getGarments(userId!),
    enabled: !!userId,
  })

  useEffect(() => {
    store.setGarments(garments)
  }, [garments])

  const uploadMutation = useMutation({
    mutationFn: (imageUri: string) => uploadAndAnalyzeGarment(userId!, imageUri),
    onSuccess: (garment) => {
      store.addGarment(garment)
      queryClient.invalidateQueries({ queryKey: ['garments', userId] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: GarmentUpdate }) =>
      updateGarment(id, updates),
    onSuccess: (garment) => {
      store.updateGarment(garment)
      queryClient.invalidateQueries({ queryKey: ['garments', userId] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: (garmentId: string) => {
      const garment = store.garments.find((g) => g.id === garmentId)!
      return deleteGarment(garment)
    },
    onSuccess: (_, garmentId) => {
      store.removeGarment(garmentId)
      queryClient.invalidateQueries({ queryKey: ['garments', userId] })
    },
  })

  return {
    garments: store.filteredGarments(),
    allGarments: store.garments,
    isLoading,
    isUploading: uploadMutation.isPending,
    isDeleting: deleteMutation.isPending,
    uploadGarment: uploadMutation.mutateAsync,
    updateGarment: updateMutation.mutateAsync,
    deleteGarment: deleteMutation.mutate,
  }
}
