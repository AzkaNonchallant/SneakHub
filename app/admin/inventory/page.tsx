"use client"

import { useState } from "react"
import { toast } from "sonner"

import { PageMeta } from "@/components/page-meta"
import { errMessage, formatRp, type AdminProduct } from "@/lib/api"
import { useAdminProducts, useUpdateProductStatus } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const statuses = ["ACTIVE", "DRAFT", "INACTIVE", "PENDING"]

const statusTone: Record<string, string> = {
  ACTIVE: "bg-[#10B981] text-white",
  DRAFT: "bg-surface-container-highest text-primary",
  INACTIVE: "bg-surface-container-highest text-primary",
  PENDING: "bg-[#f59e0b] text-white",
}

export default function AdminInventoryPage() {
  const t = useT()
  const [statusFilter, setStatusFilter] = useState<string>(() => {
    // ponytail: useSearchParams butuh Suspense boundary — baca langsung aja
    if (typeof window === "undefined") return ""
    return new URLSearchParams(window.location.search).get("status") ?? ""
  })
  const { data, isLoading } = useAdminProducts({ limit: 50, status: statusFilter || undefined })
  const update = useUpdateProductStatus()
  const [drafts, setDrafts] = useState<Record<string, string>>({})
  const [notes, setNotes] = useState<Record<string, string>>({})

  const save = async (p: AdminProduct) => {
    const next = drafts[p.product_id] ?? p.status_publikasi
    if (next === p.status_publikasi) return
    const catatan = notes[p.product_id]?.trim() || t("Product passed moderation")
    try {
      await update.mutateAsync({ productId: p.product_id, body: { status_publikasi: next, catatan } })
      setDrafts((d) => {
        const rest = { ...d }
        delete rest[p.product_id]
        return rest
      })
      setNotes((n) => {
        const rest = { ...n }
        delete rest[p.product_id]
        return rest
      })
      toast.success(t("Product status updated"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const products = data?.items ?? []

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <PageMeta title="Inventory" />
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Moderate products: approve (ACTIVE) or deactivate listings.")}
        </p>
      </div>

      <div className="mb-4 flex items-center gap-2">
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-outline-variant bg-transparent px-2 py-1 text-xs focus:border-on-tertiary-container focus:ring-0"
        >
          <option value="">ALL</option>
          {statuses.map((s) => (
            <option key={s}>{s}</option>
          ))}
        </select>
      </div>

      <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              <th className="px-4 py-3 font-bold">{t("Product")}</th>
              <th className="px-4 py-3 font-bold">{t("Price")}</th>
              <th className="px-4 py-3 font-bold">{t("Status")}</th>
              <th className="px-4 py-3 font-bold">{t("Moderation note")}</th>
              <th className="px-4 py-3 font-bold">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {t("No data yet.")}
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.product_id} className="border-b border-outline-variant last:border-0">
                  <td className="px-4 py-3 font-heading font-bold text-primary">{p.nama_produk}</td>
                  <td className="px-4 py-3 font-heading font-bold text-primary">{formatRp(p.harga)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusTone[p.status_publikasi] ?? "bg-surface-container-highest text-primary"}`}
                    >
                      {p.status_publikasi}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <input
                      type="text"
                      value={notes[p.product_id] ?? ""}
                      onChange={(e) => setNotes((n) => ({ ...n, [p.product_id]: e.target.value }))}
                      placeholder={t("Product passed moderation")}
                      className="w-56 border border-outline-variant bg-transparent px-2 py-1 text-xs focus:border-on-tertiary-container focus:ring-0"
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <select
                        value={drafts[p.product_id] ?? p.status_publikasi}
                        onChange={(e) => setDrafts((d) => ({ ...d, [p.product_id]: e.target.value }))}
                        className="border border-outline-variant bg-transparent px-2 py-1 text-xs focus:border-on-tertiary-container focus:ring-0"
                      >
                        {statuses.map((s) => (
                          <option key={s}>{s}</option>
                        ))}
                      </select>
                      <button
                        type="button"
                        disabled={update.isPending}
                        onClick={() => save(p)}
                        className="border border-primary bg-primary px-2 py-1 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}