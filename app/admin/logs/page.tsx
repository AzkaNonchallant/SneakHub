"use client"

import { PageMeta } from "@/components/page-meta"
import { useT } from "@/lib/i18n"

export default function AdminLogsPage() {
  const t = useT()
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <PageMeta title="Logs" />
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          System Logs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("This page is not available yet — waiting for the API endpoint.")}
        </p>
      </div>
    </div>
  )
}
