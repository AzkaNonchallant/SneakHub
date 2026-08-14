"use client"

import { useState } from "react"
import { toast } from "sonner"

import { errMessage, formatRp, type AdminProduct } from "@/lib/api"
import { useAdminProducts, useUpdateProductStatus } from "@/lib/hooks"

const statuses = ["ACTIVE", "DRAFT", "INACTIVE", "PENDING"]

const statusTone: Record<string, string> = {
  ACTIVE: "bg-[#10B981]",
  DRAFT: "bg-surface-container-highest text-primary",
  INACTIVE: "bg-surface-container-highest text-primary",
  PENDING: "bg-[#f59e0b]",
}

export default function AdminInventoryPage() {
  const { data, isLoading } = useAdminProducts({ limit: 50 })
  const update = useUpdateProductStatus()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const save = async (p: AdminProduct) => {
    const next = drafts[p.product_id] ?? p.status_publikasi
    if (next === p.status_publikasi) return
    const catatan = window.prompt(`Catatan moderasi untuk "${p.nama_produk}":`, "Produk lolos moderasi")
    if (catatan === null) return
    try {
      await update.mutateAsync({ productId: p.product_id, body: { status_publikasi: next, catatan } })
      toast.success("Status produk diperbarui")
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const products = data?.items ?? []

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          Inventory
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Moderasi produk: setujui (ACTIVE) atau nonaktifkan listing.
        </p>
      </div>

      <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              <th className="px-4 py-3 font-bold">Produk</th>
              <th className="px-4 py-3 font-bold">Harga</th>
              <th className="px-4 py-3 font-bold">Status</th>
              <th className="px-4 py-3 font-bold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Loading…
                </td>
              </tr>
            ) : products.length === 0 ? (
              <tr>
                <td colSpan={4} className="px-4 py-8 text-center text-muted-foreground">
                  Belum ada data.
                </td>
              </tr>
            ) : (
              products.map((p) => (
                <tr key={p.product_id} className="border-b border-outline-variant last:border-0">
                  <td className="px-4 py-3 font-heading font-bold text-primary">{p.nama_produk}</td>
                  <td className="px-4 py-3 font-heading font-bold text-primary">{formatRp(p.harga)}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase ${statusTone[p.status_publikasi] ?? "bg-surface-container-highest text-primary"}`}
                    >
                      {p.status_publikasi}
                    </span>
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