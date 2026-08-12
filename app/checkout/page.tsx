"use client"

import Link from "next/link"
import { ChevronDown, Lock, ShieldCheck } from "lucide-react"

import { SiteFooter } from "@/components/site-footer"
import { Button } from "@/components/ui/button"
import { useCartStore } from "@/lib/cart-store"

// ponytail: fixed fee + flat rate until there's a payment backend
const AUTH_FEE = 15
const TAX_RATE = 0.08

const steps = ["Shipping Address", "Shipping Method", "Payment Details"]

export default function CheckoutPage() {
  const items = useCartStore((s) => s.items)
  const subtotal = items.reduce((sum, i) => sum + i.price * i.qty, 0)
  const tax = subtotal * TAX_RATE
  const total = subtotal + AUTH_FEE + tax

  return (
    <div className="flex min-h-screen flex-col bg-background font-sans text-foreground antialiased">
      <header className="sticky top-0 z-50 w-full border-b border-outline-variant bg-surface-container-lowest">
        <div className="relative mx-auto flex max-w-[1280px] items-center justify-center px-5 py-4 md:px-10">
          <Link
            href="/home"
            className="font-heading text-[32px] leading-8 font-bold tracking-tighter text-primary uppercase"
          >
            Sneakhub
          </Link>
          <span className="absolute right-5 flex items-center gap-2 text-sm font-medium text-on-surface-variant md:right-10">
            <Lock className="size-4" fill="currentColor" />
            Encrypted
          </span>
        </div>
      </header>

      <main className="mx-auto w-full max-w-[1280px] flex-1 px-4 py-8 md:px-10 md:py-12">
        <div className="mb-8">
          <h1 className="font-heading text-[32px] leading-8 font-bold text-primary uppercase md:text-[48px] md:leading-12">
            Checkout
          </h1>
          <p className="mt-2 text-base leading-6 text-on-surface-variant">
            Complete your technical transaction.
          </p>
        </div>

        <div className="flex flex-col gap-8 lg:flex-row lg:gap-12">
          <div className="w-full space-y-6 lg:w-2/3">
            {/* Step 1: active form */}
            <div className="relative border border-primary bg-surface-container-lowest p-6">
              <div className="absolute top-0 bottom-0 left-0 w-1 bg-primary" />
              <h2 className="mb-6 flex items-center gap-3 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                <span className="flex size-8 items-center justify-center bg-primary text-xs leading-4 font-bold text-white">
                  01
                </span>
                Shipping Address
              </h2>
              {/* ponytail: static form, no validation until there's a backend */}
              <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                  {["First Name", "Last Name"].map((label, i) => (
                    <div key={label}>
                      <label className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={["John", "Doe"][i]}
                        className="w-full border border-outline bg-background p-3 font-sans text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-t-outline focus:border-r-outline focus:border-b-2 focus:border-l-outline focus:border-b-on-tertiary-container"
                      />
                    </div>
                  ))}
                </div>
                <div>
                  <label className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                    Street Address
                  </label>
                  <input
                    type="text"
                    placeholder="123 Sneaker St, Apt 4B"
                    className="w-full border border-outline bg-background p-3 font-sans text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-t-outline focus:border-r-outline focus:border-b-2 focus:border-l-outline focus:border-b-on-tertiary-container"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <div className="md:col-span-2">
                    <label className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                      City
                    </label>
                    <input
                      type="text"
                      placeholder="New York"
                      className="w-full border border-outline bg-background p-3 font-sans text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-t-outline focus:border-r-outline focus:border-b-2 focus:border-l-outline focus:border-b-on-tertiary-container"
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                      ZIP Code
                    </label>
                    <input
                      type="text"
                      placeholder="10001"
                      className="w-full border border-outline bg-background p-3 font-sans text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-t-outline focus:border-r-outline focus:border-b-2 focus:border-l-outline focus:border-b-on-tertiary-container"
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-on-surface-variant uppercase">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="+1 (555) 000-0000"
                    className="w-full border border-outline bg-background p-3 font-sans text-base transition-colors outline-none placeholder:text-muted-foreground focus:border-t-outline focus:border-r-outline focus:border-b-2 focus:border-l-outline focus:border-b-on-tertiary-container"
                  />
                </div>
                <Button
                  type="button"
                  className="mt-6 h-auto w-full rounded-none border border-primary bg-primary px-8 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-surface-container-lowest hover:text-primary md:w-auto"
                >
                  Continue to Shipping
                </Button>
              </form>
            </div>

            {/* Steps 2-3: collapsed (mockup state) */}
            {steps.slice(1).map((step, i) => (
              <div
                key={step}
                className="flex cursor-pointer items-center justify-between border border-outline bg-surface-container-lowest p-6 opacity-70 transition-colors hover:border-primary"
              >
                <h2 className="flex items-center gap-3 font-heading text-2xl leading-7 font-semibold text-on-surface-variant uppercase">
                  <span className="flex size-8 items-center justify-center border border-outline text-xs leading-4 font-bold text-on-surface-variant">
                    0{i + 2}
                  </span>
                  {step}
                </h2>
                <ChevronDown className="size-5 text-on-surface-variant" />
              </div>
            ))}
          </div>

          <div className="w-full lg:w-1/3">
            <div className="sticky top-8 border border-outline bg-surface-container-lowest p-6">
              <h3 className="mb-4 border-b border-outline pb-4 font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                Order Summary
              </h3>
              {items.length === 0 ? (
                <div className="py-8 text-center">
                  <p className="font-heading text-xl leading-7 font-semibold text-primary uppercase">
                    Your cart is empty
                  </p>
                  <Link
                    href="/cart"
                    className="mt-3 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
                  >
                    Back to Cart
                  </Link>
                </div>
              ) : (
                <>
                  <div className="mb-6 space-y-4">
                    {items.map((item) => (
                      <div key={item.id} className="flex gap-4">
                        <div className="relative size-20 shrink-0 border border-outline bg-surface-container">
                          <img
                            src={item.image}
                            alt={item.alt}
                            className="h-full w-full object-cover"
                          />
                          <span className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white">
                            {item.qty}
                          </span>
                        </div>
                        <div className="flex grow flex-col justify-between">
                          <div>
                            <p className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                              {item.name}
                            </p>
                            <p className="font-mono text-sm font-medium text-on-surface-variant">
                              Size: {item.size}
                            </p>
                          </div>
                          <p className="font-heading text-2xl leading-7 font-semibold text-primary">
                            ${(item.price * item.qty).toFixed(2)}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mb-6 space-y-3 border-t border-outline pt-4 text-base leading-6 text-on-surface-variant">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${subtotal.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping (Calculated next step)</span>
                      <span>--</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Authentication Fee</span>
                      <span>${AUTH_FEE.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tax</span>
                      <span>${tax.toFixed(2)}</span>
                    </div>
                  </div>
                  <div className="mb-6 flex items-end justify-between border-t border-primary pt-4">
                    <span className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                      Total
                    </span>
                    <span className="font-heading text-[36px] leading-9 font-bold text-primary">
                      ${total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex items-start gap-3 border border-outline bg-surface p-4">
                    <ShieldCheck className="mt-0.5 size-5 shrink-0 text-on-tertiary-container" />
                    <div>
                      <p className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
                        SneakHub Verified
                      </p>
                      <p className="mt-1 text-sm leading-tight text-on-surface-variant">
                        Every item passes our strict, multi-point physical and technical
                        authentication protocol before shipping.
                      </p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </main>

      <SiteFooter variant="dark" />
    </div>
  )
}