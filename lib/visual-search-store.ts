import { create } from "zustand"

// ponytail: hands a picked photo from the header over to /search; a plain
// module-level ref would work too but this skips the effect wiring
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