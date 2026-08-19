"use client"

import { useEffect } from "react"

import { Button } from "@/components/ui/button"
import { useT } from "@/lib/i18n"

export default function RootError({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  const t = useT()
  useEffect(() => {
    console.error(error)
  }, [error])
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-background px-4 font-sans text-foreground antialiased">
      <p className="font-heading text-[96px] leading-none font-black tracking-tighter text-primary uppercase">
        500
      </p>
      <h1 className="font-heading text-3xl font-bold text-primary uppercase">
        {t("Something went wrong")}
      </h1>
      <p className="max-w-md text-center text-base leading-6 text-muted-foreground">
        {t("An unexpected error occurred. Please try again.")}
      </p>
      <Button
        type="button"
        onClick={retry}
        className="mt-2 h-auto rounded-none border border-primary bg-primary px-8 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
      >
        {t("Try again")}
      </Button>
    </div>
  )
}
