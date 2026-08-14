"use client"

import { motion } from "motion/react"
import { useRouter } from "next/navigation"
import { ArrowUpRight, Plus, TrendingUp } from "lucide-react"
import { useState } from "react"

import { cn } from "@/lib/utils"
import type { ProductCardData } from "@/lib/api"
import { Button } from "@/components/ui/button"
import { useAddCartItems } from "@/lib/hooks"

export function ProductCard({
  product,
  number,
  index = 0,
  className,
}: {
  product: ProductCardData
  number?: number
  index?: number
  className?: string
}) {
  const router = useRouter()
  const addToCart = useAddCartItems()
  const [adding, setAdding] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => router.push(`/product/${product.id}`)}
      className={cn(
        "group flex cursor-pointer flex-col border border-primary bg-surface-container-lowest transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[4px_4px_0px_0px_#000] active:translate-y-0",
        number === undefined ? "w-72 shrink-0 snap-start" : "h-full w-auto",
        className,
      )}
    >
      <div className="relative flex h-64 items-center justify-center border-b border-primary bg-surface-container-low p-4">
        {number !== undefined ? (
          <span className="absolute top-4 left-4 z-10 font-heading text-2xl leading-7 font-black text-outline opacity-30">
            {String(number).padStart(2, "0")}
          </span>
        ) : null}
        <div className="absolute top-2 right-2 z-10 flex flex-col items-end gap-1">
          {product.badge ? (
            <span className="border border-primary bg-surface-container-highest px-2 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
              {product.badge}
            </span>
          ) : null}
          {product.trend ? (
            <span className="inline-flex items-center gap-1 border border-primary bg-on-tertiary-container px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase">
              <TrendingUp className="size-2.5" />
              {product.trend}
            </span>
          ) : null}
        </div>
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          className="h-auto w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105"
        />
      </div>
      <div className="flex grow flex-col p-4">
        <span className="mb-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {product.brand}
        </span>
        <h3 className="mb-2 line-clamp-1 font-heading text-2xl leading-7 font-semibold text-primary">
          {product.name}
        </h3>
        <div className="mt-auto flex items-end justify-between border-t border-outline-variant pt-4">
          <div>
            <span className="block text-xs font-bold tracking-widest text-muted-foreground uppercase">
              Current Ask
            </span>
            <span className="font-heading text-2xl leading-7 font-bold text-primary">
              {product.price}
            </span>
          </div>
          {number !== undefined ? (
            <ArrowUpRight className="size-5 text-muted-foreground transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" />
          ) : (
            <Button
              type="button"
              size="icon"
              aria-label={`Add ${product.name} to cart`}
              disabled={adding}
              onClick={async (e) => {
                e.stopPropagation()
                setAdding(true)
                try {
                  await addToCart.mutateAsync([{ product_id: product.id, jumlah: 1 }])
                } finally {
                  setAdding(false)
                }
              }}
              className="size-10 rounded-none border border-primary bg-primary text-white shadow-none transition-all hover:bg-on-tertiary-container hover:text-white active:translate-x-[2px] active:translate-y-[2px] active:shadow-none"
            >
              <Plus className="size-4 transition-transform duration-200 group-hover:rotate-90" />
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  )
}