"use client"

import { useEffect } from "react"

import { ID_DICT } from "@/lib/i18n-dict"
import { useLang } from "@/lib/i18n"




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
