import { create } from 'zustand'

type UIState = {
  isAddGarmentSheetOpen: boolean
  isUploadingGarment: boolean
  uploadProgress: number

  setIsAddGarmentSheetOpen: (open: boolean) => void
  setIsUploadingGarment: (uploading: boolean) => void
  setUploadProgress: (progress: number) => void
}

export const useUIStore = create<UIState>((set) => ({
  isAddGarmentSheetOpen: false,
  isUploadingGarment: false,
  uploadProgress: 0,

  setIsAddGarmentSheetOpen: (isAddGarmentSheetOpen) => set({ isAddGarmentSheetOpen }),
  setIsUploadingGarment: (isUploadingGarment) => set({ isUploadingGarment }),
  setUploadProgress: (uploadProgress) => set({ uploadProgress }),
}))
