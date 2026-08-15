"use client"

import { useMemo, useState } from "react"
import { ChevronLeft, ChevronRight, Trash2, TrendingUp } from "lucide-react"
import { toast } from "sonner"

import { EditProdukButton } from "@/components/edit-produk-dialog"
import { PageMeta } from "@/components/page-meta"
import { TambahProdukButton } from "@/components/tambah-produk-dialog"
import { errMessage, formatRp, PLACEHOLDER_IMAGE, type ApiProduct } from "@/lib/api"
import { useDeleteProduct, useProducts } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const PAGE_SIZE = 6

type SortKey = "newest" | "price-asc" | "price-desc" | "name"

function sortItems(items: ApiProduct[], key: SortKey): ApiProduct[] {
  switch (key) {
    case "newest":
      return [...items].sort(
        (a, b) => new Date(b.created_at ?? 0).getTime() - new Date(a.created_at ?? 0).getTime(),
      )
    case "price-asc":
      return [...items].sort((a, b) => a.harga - b.harga)
    case "price-desc":
      return [...items].sort((a, b) => b.harga - a.harga)
    case "name":
      return [...items].sort((a, b) => a.nama_produk.localeCompare(b.nama_produk))
  }
}

export default function InventoryPage() {
  const t = useT()
  const sortLabels: Record<SortKey, string> = {
    newest: t("Sort: Newest"),
    "price-asc": t("Price: Cheapest"),
    "price-desc": t("Price: Most Expensive"),
    name: t("Name: A-Z"),
  }
  const { data } = useProducts({ limit: 100 })
  const items = data?.items ?? []
  const remove = useDeleteProduct()
  const [sort, setSort] = useState<SortKey>("newest")
  const [page, setPage] = useState(1)

  const onDelete = async (item: ApiProduct) => {
    if (!window.confirm(`${t("Delete product")} "${item.nama_produk}"?`)) return
    try {
      await remove.mutateAsync(item.product_id)
      toast.success(t("Product deleted"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const sorted = useMemo(() => sortItems(items, sort), [items, sort])
  const pages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const pageItems = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE)
  const paginate = (p: number) => setPage(Math.min(Math.max(1, p), pages))

  return (
    <div className="mx-auto w-full max-w-[1600px] px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <PageMeta title="Inventory" />
      {/* Header */}
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            {t("Seller Center")}
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary">
            {t("Inventory")}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {items.length} {t("verified products")}.
          </p>
        </div>
        <TambahProdukButton />
      </div>

      {/* Controls */}
      <div className="mb-8 flex items-center justify-between border-b border-outline-variant pb-4">
        <div className="flex gap-2">
          <span className="inline-flex items-center gap-1 border border-primary bg-surface-container-highest px-2 py-1 text-[10px] font-bold tracking-widest text-primary uppercase">
            <TrendingUp className="size-3" aria-hidden /> {t("Active")}
          </span>
        </div>
        <select
          value={sort}
          onChange={(e) => {
            setSort(e.target.value as SortKey)
            setPage(1)
          }}
          className="h-9 rounded-none border border-primary bg-transparent px-3 text-xs font-bold tracking-widest text-primary uppercase outline-none focus:border-b-2 focus:border-ring"
        >
          {(Object.keys(sortLabels) as SortKey[]).map((key) => (
            <option key={key} value={key}>
              {sortLabels[key]}
            </option>
          ))}
        </select>
      </div>

      {items.length === 0 ? (
        <p className="border border-dashed border-outline-variant p-10 text-center text-sm text-muted-foreground">
          {t("No products yet")}. {t("Click")} &quot;{t("Add Product")}&quot; {t("to start selling")}.
        </p>
      ) : (
        <>
          {/* Grid */}
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {pageItems.map((item) => (
              <InventoryCard key={item.product_id} item={item} onDelete={onDelete} />
            ))}
          </div>

          {/* Pagination */}
          {pages > 1 ? (
            <div className="mt-12 flex items-center justify-center gap-2">
              <button
                type="button"
                aria-label={t("Previous page")}
                onClick={() => paginate(page - 1)}
                disabled={page === 1}
                className="flex size-10 items-center justify-center border border-primary transition-colors hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronLeft className="size-4" aria-hidden />
              </button>
              {Array.from({ length: pages }, (_, i) => i + 1).map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setPage(p)}
                  className={[
                    "size-10 border border-primary text-xs font-bold tracking-widest transition-colors hover:bg-primary hover:text-white",
                    p === page ? "bg-primary text-white" : "text-primary",
                  ].join(" ")}
                >
                  {p}
                </button>
              ))}
              <button
                type="button"
                aria-label={t("Next page")}
                onClick={() => paginate(page + 1)}
                disabled={page === pages}
                className="flex size-10 items-center justify-center border border-primary transition-colors hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-40"
              >
                <ChevronRight className="size-4" aria-hidden />
              </button>
            </div>
          ) : null}
        </>
      )}
    </div>
  )
}

function InventoryCard({ item, onDelete }: { item: ApiProduct; onDelete: (item: ApiProduct) => void }) {
  const t = useT()
  const image = item.images?.[0]?.image_url || item.image_url || PLACEHOLDER_IMAGE
  return (
    <article className="group relative flex flex-col border border-primary bg-surface-container-lowest transition-all duration-200 hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_#000]">
      <span className="absolute top-2 right-2 z-10 border border-primary bg-surface-container-highest px-2 py-1 text-[10px] font-bold tracking-widest text-primary uppercase shadow-[2px_2px_0px_0px_#000]">
        {item.kondisi}
      </span>

      <div className="flex aspect-square items-center justify-center overflow-hidden border-b border-primary bg-surface-container-low p-4">
        <img
          src={image}
          alt={item.nama_produk}
          loading="lazy"
          className="h-full w-full object-contain mix-blend-multiply transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="flex grow flex-col p-4">
        <h3 className="line-clamp-1 font-heading text-xl leading-6 font-semibold text-primary uppercase">
          {item.nama_produk}
        </h3>
        <p className="mt-1 text-xs font-medium tracking-widest text-muted-foreground uppercase">
          {item.seller?.nama_toko ?? "SNEAKHUB"}
        </p>
        <div className="mt-auto flex items-end justify-between border-t border-outline-variant pt-3">
          <div>
            <span className="block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
              {t("Price")}
            </span>
            <span className="font-heading text-2xl leading-7 font-black text-primary">
              {formatRp(item.harga)}
            </span>
          </div>
          <span className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
            {t("Stock")} {item.stok} • {item.ukuran_tersedia.join(", ") || "-"}
          </span>
        </div>
      </div>

      <div className="flex gap-2 border-t border-primary p-2">
        <EditProdukButton product={item} />
        <button
          type="button"
          onClick={() => onDelete(item)}
          className="flex flex-1 items-center justify-center gap-2 border border-primary bg-white py-2 text-xs font-bold tracking-widest text-error uppercase transition-colors hover:bg-error hover:text-white"
        >
          <Trash2 className="size-3.5" /> {t("Delete")}
        </button>
      </div>
    </article>
  )
}