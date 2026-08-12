"use client"

import { useState } from "react"
import { CheckCheck, CheckCircle2, Circle, Package, TrendingDown } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { Button } from "@/components/ui/button"

// ponytail: static seed until there's a backend
const initialNotifications = [
  {
    type: "PRICE DROP",
    typeIcon: TrendingDown,
    typeClass: "text-on-tertiary-container",
    title: "Off-White x Air Jordan 1 Retro High 'Chicago'",
    body: (
      <>
        is now <b className="font-heading text-2xl font-semibold text-primary">Rp 45.000.000</b>
        (Save Rp 2.500.000)
      </>
    ),
    cta: "SHOP NOW",
    ctaVariant: "solid" as const,
    time: "10 MINS AGO",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuCHj1Znzf7W2_v0Wf741WtlmYiSsHbxZZIsL1JYWAfXifCRqURWXFx2j9Jsrbb-SY5FjaTrkbXpaCdkErXfe_tllpr7c8r38f-vBnirr7t_bw2jQcDqLLUE-eKUWCy9wZ5jQT3NcDa__nKTUesC6ZYxRbuDTxaBj745NLMkyGBcSuIZwARrMMUwkkaZyXrSv39YGzk8QX-EpJ_NStSNykR4n5tvBCTc6Eci_8QgQXIGsnvoszFxGLSl",
    alt: "Off-White x Air Jordan 1 Retro High Chicago",
  },
  {
    type: "BACK IN STOCK",
    typeIcon: Package,
    typeClass: "text-primary",
    title: "Yeezy Boost 350 V2 'Zebra'",
    body: (
      <>
        is available again in your size <b className="text-primary">US 10</b>
      </>
    ),
    cta: "VIEW PRODUCT",
    ctaVariant: "outline" as const,
    time: "2 HOURS AGO",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuAcyBBeVRRjXF31ghIbgH0GwqxWttPPYzYtoWElVhkcN6WWEXtjVPx2ob2SOMv3qlV_Sef0nZ2UmPaqziakG-D8T-3XMGAhuBJvS4VS31xP5KW3QWl0xvgFYK5PA1mIJMzwsMQRGL6BYXGusW5NPwI3bePPWS3Ij_udbDnbGz3fw2ooq7ZA84wnB3b_K_xIDwnGzW5rcnQNXxf8Zp7lT8uOXo_Sa8cC-kDXX_1vPNA9G8MNEXpoBCoP",
    alt: "Yeezy Boost 350 V2 Zebra",
  },
  {
    type: "PRICE DROP",
    typeIcon: TrendingDown,
    typeClass: "text-outline",
    title: "Nike SB Dunk Low 'Panda Pigeon'",
    body: (
      <>
        is now <b className="font-heading text-2xl font-semibold text-primary">Rp 12.000.000</b>
        (Save Rp 800.000)
      </>
    ),
    cta: "SHOP NOW",
    ctaVariant: "outline" as const,
    time: "YESTERDAY",
    image:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuB4xIh7qAAT1RPxw0sCEEcfqnAv1Ls1V1Vb6-xJv5Y3tLwo5gfXqQzM6o7OyNkKB4j54UmpAGhwVkunRnPV5lFwF98CQE7ki1wPHSByGvXpIPAM9loro17lmRkU2xxo2J4ij0EIMuntFswB30OPo0aWquU6DPbC5LukWjjqASMeRyN07CEO3VNhkcpqmhZomWRSdZLPbsi02z7H4-6_PsgUHBqFBFz5v40EU3KAoORTulDWcprV3N9A",
    alt: "Nike SB Dunk Low Panda Pigeon",
  },
]

export default function NotificationsPage() {
  const [read, setRead] = useState<boolean[]>(initialNotifications.map((_, i) => i === 2))

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <SiteHeader />

      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-12 md:px-10">
        <header className="flex items-end justify-between border-b border-outline pb-4">
          <h1 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-[48px] md:leading-12">
            Notifications
          </h1>
          <button
            type="button"
            onClick={() => setRead(read.map(() => true))}
            className="group flex cursor-pointer items-center gap-2 text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-primary"
          >
            <CheckCheck className="size-4 transition-transform group-hover:rotate-12" />
            Mark all as read
          </button>
        </header>

        <div className="flex flex-col gap-4">
          {initialNotifications.map((n, i) => {
            const isRead = read[i]
            const TypeIcon = n.typeIcon
            return (
              <article
                key={n.title}
                className={
                  isRead
                    ? "relative flex flex-col gap-6 border border-outline bg-surface-container-lowest p-6 opacity-75 transition-all duration-300 hover:opacity-100 sm:flex-row"
                    : "relative flex flex-col gap-6 border border-primary bg-surface-container-lowest p-6 transition-all duration-300 hover:shadow-[4px_4px_0px_0px_#000] sm:flex-row"
                }
              >
                <div className="absolute top-4 right-4 flex items-center gap-2">
                  <span className="font-mono text-xs font-medium text-outline">{n.time}</span>
                  {isRead ? (
                    <CheckCircle2 className="size-5 text-outline" />
                  ) : (
                    <button
                      type="button"
                      aria-label="Mark as read"
                      onClick={() => setRead((prev) => prev.map((v, j) => (j === i ? true : v)))}
                      className="cursor-pointer text-outline transition-colors hover:text-primary"
                    >
                      <Circle className="size-5" />
                    </button>
                  )}
                </div>
                <div className="flex size-24 shrink-0 items-center justify-center overflow-hidden border border-outline bg-surface-dim">
                  <img
                    src={n.image}
                    alt={n.alt}
                    className={
                      isRead
                        ? "h-full w-full object-cover opacity-60 grayscale mix-blend-multiply"
                        : "h-full w-full object-cover opacity-80 grayscale mix-blend-multiply transition-opacity group-hover:opacity-100"
                    }
                  />
                </div>
                <div className="flex grow flex-col justify-between">
                  <div>
                    <div className={`mb-2 flex items-center gap-2 ${n.typeClass}`}>
                      <TypeIcon className="size-5" />
                      <span className="text-xs leading-4 font-bold tracking-wider uppercase">
                        {n.type}
                      </span>
                    </div>
                    <h3 className="mb-1 font-heading text-2xl leading-7 font-semibold text-primary">
                      {n.title}
                    </h3>
                    <p className="text-base leading-6 text-on-surface-variant">{n.body}</p>
                  </div>
                  <div className="mt-4 flex gap-4">
                    <Button
                      type="button"
                      className={
                        n.ctaVariant === "solid"
                          ? "h-auto w-fit rounded-none border border-primary bg-primary px-6 py-3 text-xs leading-4 font-bold tracking-wider text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary"
                          : "h-auto w-fit rounded-none border border-outline bg-surface px-6 py-3 text-xs leading-4 font-bold tracking-wider text-primary uppercase transition-colors hover:border-primary"
                      }
                    >
                      {n.cta}
                    </Button>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      </main>

      <SiteFooter />
    </div>
  )
}