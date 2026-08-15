"use client"

import { BadgeCheck, Scale, ShieldCheck, Zap } from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useT } from "@/lib/i18n"

const steps = [
  { icon: Zap, title: "Find", text: "Browse verified listings or post your kicks with photos and condition details." },
  { icon: Scale, title: "Compare", text: "Check market price history and predictions so you buy and sell at the right price." },
  { icon: ShieldCheck, title: "Deal", text: "Pay securely with our escrow-style checkout. The seller ships, the buyer confirms." },
  { icon: BadgeCheck, title: "Receive", text: "Get your sneakers, verified, or get paid once the buyer confirms receipt." },
]

export default function ProcessPage() {
  const t = useT()
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title="How It Works" description="How SneakHub works: find, compare, deal, receive." />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-10 px-4 py-12 md:px-10">
        <header className="border-b-2 border-primary pb-6">
          <h1 className="font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[72px] md:leading-[72px]">
            {t("How It Works")}
          </h1>
          <p className="mt-3 max-w-2xl text-base leading-6 text-muted-foreground">
            {t("A fair, secure marketplace for sneaker resale in Indonesia.")}
          </p>
        </header>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {steps.map(({ icon: Icon, title, text }, i) => (
            <section
              key={title}
              className="flex flex-col gap-4 border border-outline bg-surface-container-lowest p-8 shadow-[4px_4px_0px_0px_#000]"
            >
              <div className="flex items-center gap-4">
                <span className="flex size-12 items-center justify-center bg-primary font-heading text-2xl font-bold text-white">
                  {i + 1}
                </span>
                <Icon className="size-7 text-primary" />
                <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">{t(title)}</h2>
              </div>
              <p className="text-base leading-6 text-muted-foreground">{t(text)}</p>
            </section>
          ))}
        </div>
      </main>
      <SiteFooter />
    </div>
  )
}
