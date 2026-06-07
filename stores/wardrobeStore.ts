import { create } from 'zustand'
import type { Garment } from '../types/garment'
import type { GarmentCategory } from '../types/garment'

type WardrobeState = {
  garments: Garment[]
  isLoading: boolean
  searchQuery: string
  activeCategory: GarmentCategory | 'all'

  setGarments: (garments: Garment[]) => void
  addGarment: (garment: Garment) => void
  updateGarment: (garment: Garment) => void
  removeGarment: (id: string) => void
  setIsLoading: (loading: boolean) => void
  setSearchQuery: (query: string) => void
  setActiveCategory: (category: GarmentCategory | 'all') => void

  filteredGarments: () => Garment[]
}

export const useWardrobeStore = create<WardrobeState>((set, get) => ({
  garments: [],
  isLoading: false,
  searchQuery: '',
  activeCategory: 'all',

  setGarments: (garments) => set({ garments }),
  addGarment: (garment) => set((state) => ({ garments: [garment, ...state.garments] })),
  updateGarment: (garment) =>
    set((state) => ({
      garments: state.garments.map((g) => (g.id === garment.id ? garment : g)),
    })),
  removeGarment: (id) =>
    set((state) => ({ garments: state.garments.filter((g) => g.id !== id) })),
  setIsLoading: (isLoading) => set({ isLoading }),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setActiveCategory: (activeCategory) => set({ activeCategory }),

  filteredGarments: () => {
    const { garments, searchQuery, activeCategory } = get()
    return garments.filter((g) => {
      const matchesCategory = activeCategory === 'all' || g.category === activeCategory
      const matchesSearch =
        !searchQuery ||
        g.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        g.primary_color?.toLowerCase().includes(searchQuery.toLowerCase())
      return matchesCategory && matchesSearch
    })
  },
}))
