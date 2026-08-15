"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { ID_DICT } from "./i18n-dict"

export type Lang = "en" | "id"

const STORAGE_KEY = "sneakhub_lang"

const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({
  lang: "en",
  toggleLang: () => {},
})

// ponytail: localStorage + <html lang> sinkron, default EN
export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")

  // ponytail: restore setelah hidrasi supaya SSR selalu EN (tanpa hydration mismatch)
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect -- ponytail: restore bahasa tersimpan
    if (saved === "en" || saved === "id") setLang(saved)
  }, [])

  // ponytail: hanya persist saat bukan default ("en") — kalau tidak, persist mount-1
  // akan menimpa nilai tersimpan sebelum restore mount-2 (StrictMode dev double-mount)
  useEffect(() => {
    if (lang !== "en") localStorage.setItem(STORAGE_KEY, lang)
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => setLang((prev) => (prev === "en" ? "id" : "en"))

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  const { lang } = useLang()
  // ponytail: string-as-key — kode ditulis EN, kamus ID fallback otomatis
  return (en: string) => (lang === "id" ? ID_DICT[en] ?? en : en)
}
