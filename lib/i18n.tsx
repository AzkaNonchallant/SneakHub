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

  // ponytail: html lang sync seterusnya; persist hanya di toggle (bukan effect,
  // supaya StrictMode double-mount tidak menimpa nilai tersimpan)
  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    const next = lang === "en" ? "id" : "en"
    setLang(next)
    localStorage.setItem(STORAGE_KEY, next)
    // ponytail: mirror ke cookie — root layout SSR baca ini untuk <html lang>
    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`
  }

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
