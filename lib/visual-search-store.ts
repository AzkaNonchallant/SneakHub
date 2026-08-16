import { create } from "zustand"


type VisualSearchState = {
  file: File | null
  setFile: (file: File) => void
  clear: () => void
}

export const useVisualSearchStore = create<VisualSearchState>((set) => ({
  file: null,
  setFile: (file) => set({ file }),
  clear: () => set({ file: null }),
}))