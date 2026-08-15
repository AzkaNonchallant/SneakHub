"use client"

import { useParams } from "next/navigation"

import { PageMeta } from "@/components/page-meta"
import { SiteFooter } from "@/components/site-footer"
import { SiteHeader } from "@/components/site-header"
import { useT } from "@/lib/i18n"

const docs = {
  terms: {
    title: "Terms of Service",
    sections: [
      ["1. Accounts", "You are responsible for the accuracy of your account information and for all activity under your account."],
      ["2. Listings", "Sellers must provide accurate product descriptions, conditions, and prices. Misleading listings may be removed."],
      ["3. Orders & Payment", "Payment is held until the buyer confirms receipt. Refunds follow our review process."],
      ["4. Prohibited Items", "Counterfeit products and replicas are strictly prohibited on SneakHub."],
      ["5. Liability", "SneakHub is a marketplace platform and is not a party to transactions between buyers and sellers."],
    ],
  },
  privacy: {
    title: "Privacy Policy",
    sections: [
      ["1. Data We Collect", "Account details, order information, and device data needed to operate the marketplace."],
      ["2. How We Use Data", "To process orders, send notifications, prevent fraud, and improve the platform."],
      ["3. Sharing", "We share data with shipping and payment partners only as needed to fulfil your orders."],
      ["4. Security", "Passwords are hashed and payment data is processed by PCI-compliant partners."],
      ["5. Your Rights", "You may request access, correction, or deletion of your personal data at any time."],
    ],
  },
} as const

export default function LegalDocPage() {
  const t = useT()
  const params = useParams<{ doc: string }>()
  const doc = docs[params.doc as keyof typeof docs] ?? docs.terms
  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <PageMeta title={doc.title} />
      <SiteHeader />
      <main className="mx-auto flex w-full max-w-[1280px] flex-1 flex-col gap-8 px-4 py-12 md:px-10">
        <h1 className="border-b-2 border-primary pb-4 font-heading text-[32px] leading-8 font-bold tracking-tight text-primary uppercase md:text-[56px] md:leading-14">
          {t(doc.title)}
        </h1>
        <div className="flex flex-col gap-6">
          {doc.sections.map(([heading, body]) => (
            <section key={heading} className="flex flex-col gap-2">
              <h2 className="font-heading text-xl font-semibold text-primary uppercase">{t(heading)}</h2>
              <p className="text-base leading-6 text-muted-foreground">{t(body)}</p>
            </section>
          ))}
        </div>
        <p className="border-t border-outline-variant pt-6 font-mono text-xs text-muted-foreground">
          SNEAKHUB — {t("Last updated")}: 2026
        </p>
      </main>
      <SiteFooter />
    </div>
  )
}
