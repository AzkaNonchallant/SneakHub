"use client"

import { useEffect } from "react"

import { ID_DICT } from "@/lib/i18n-dict"
import { useLang } from "@/lib/i18n"

// ponytail: title/description per halaman, diterjemahkan lewat kamus langsung.
// Re-apply @500ms: metadata emitter Next menimpa title saat full-load (hidrasi),
// tapi selesai <300ms; SPA nav langsung menang tanpa perlu re-apply.
export function PageMeta({ title, description }: { title: string; description?: string }) {
  const { lang } = useLang()
  useEffect(() => {
    const apply = () => {
      document.title = lang === "id" ? ID_DICT[title] ?? title : title
      if (description) {
        document
          .querySelector('meta[name="description"]')
          ?.setAttribute("content", lang === "id" ? ID_DICT[description] ?? description : description)
      }
    }
    apply()
    const id = setTimeout(apply, 500)
    return () => clearTimeout(id)
  }, [lang, title, description])
  return null
}
