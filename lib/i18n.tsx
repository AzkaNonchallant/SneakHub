"use client"

import { createContext, useContext, useEffect, useState } from "react"

import { ID_DICT } from "./i18n-dict"

export type Lang = "en" | "id"

const STORAGE_KEY = "sneakhub_lang"

const LangContext = createContext<{ lang: Lang; toggleLang: () => void }>({
  lang: "en",
  toggleLang: () => {},
})


export function LangProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en")


  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY)
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (saved === "en" || saved === "id") setLang(saved)
  }, [])



  useEffect(() => {
    document.documentElement.lang = lang
  }, [lang])

  const toggleLang = () => {
    const next = lang === "en" ? "id" : "en"
    setLang(next)
    localStorage.setItem(STORAGE_KEY, next)

    document.cookie = `${STORAGE_KEY}=${next}; path=/; max-age=31536000; samesite=lax`
  }

  return <LangContext.Provider value={{ lang, toggleLang }}>{children}</LangContext.Provider>
}

export function useLang() {
  return useContext(LangContext)
}

export function useT() {
  const { lang } = useLang()

  return (en: string) => (lang === "id" ? ID_DICT[en] ?? en : en)
}
