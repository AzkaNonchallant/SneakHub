"use client"

import Link from "next/link"

import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useT } from "@/lib/i18n"

export default function NotFoundPage() {
  const t = useT()
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="Page not found" />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col items-center justify-center gap-6 px-4 py-24 text-center md:px-10">
        <p className="font-heading text-[96px] leading-none font-black tracking-tighter text-primary uppercase md:text-[160px]">
          404
        </p>
        <h1 className="font-heading text-3xl font-bold text-primary uppercase">{t("Page not found")}</h1>
        <p className="max-w-md text-base leading-6 text-muted-foreground">
          {t("The page you are looking for does not exist or has been moved.")}
        </p>
        <Link
          href="/home"
          className="mt-2 border border-primary bg-primary px-8 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
        >
          {t("Back to Home")}
        </Link>
      </main>
      <SiteFooter />
    </div>
  )
}
