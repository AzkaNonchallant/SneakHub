"use client"

import { useState } from "react"
import { toast } from "sonner"

import { errMessage, type AdminSeller } from "@/lib/api"
import { useAdminSellers, useUpdateSellerVerification } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const statuses = ["VERIFIED", "REJECTED"]

const statusTone: Record<string, string> = {
  PENDING: "bg-[#f59e0b] text-white",
  VERIFIED: "bg-[#10B981] text-white",
  REJECTED: "bg-error text-white",
}

export function AdminSellersTable({ limit = 20 }: { limit?: number }) {
  const t = useT()
  const { data, isLoading } = useAdminSellers({ limit })
  const update = useUpdateSellerVerification()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const save = async (s: AdminSeller) => {
    // ponytail: backend live campur case ("verified"/"VERIFIED") — normalisasi pembanding
    const next = (drafts[s.seller_id] ?? s.status_verifikasi).toUpperCase()
    if (next === s.status_verifikasi.toUpperCase()) return
    try {
      await update.mutateAsync({ sellerId: s.seller_id, body: { status: next } })
      toast.success(t("Seller status updated"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const sellers = data?.items ?? []

  return (
    <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
      <table className="w-full min-w-[720px] text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <th className="px-4 py-3 font-bold">{t("Store")}</th>
            <th className="px-4 py-3 font-bold">{t("Name")}</th>
            <th className="px-4 py-3 font-bold">{t("Email")}</th>
            <th className="px-4 py-3 font-bold">{t("Status")}</th>
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
          ) : sellers.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                {t("No data yet.")}
              </td>
            </tr>
          ) : (
            sellers.map((s) => (
              <tr key={s.seller_id} className="border-b border-outline-variant last:border-0">
                <td className="px-4 py-3 font-heading font-bold text-primary">{s.nama_toko}</td>
                <td className="px-4 py-3">{s.nama_user}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{s.email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusTone[s.status_verifikasi.toUpperCase()] ?? "bg-surface-container-highest text-primary"}`}
                  >
                    {s.status_verifikasi.toUpperCase()}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={(drafts[s.seller_id] ?? s.status_verifikasi).toUpperCase()}
                      onChange={(e) => setDrafts((d) => ({ ...d, [s.seller_id]: e.target.value }))}
                      className="border border-outline-variant bg-transparent px-2 py-1 text-xs focus:border-on-tertiary-container focus:ring-0"
                    >
                      {statuses.map((st) => (
                        <option key={st}>{st}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={() => save(s)}
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
      {data && data.pagination.total > limit ? (
        <div className="border-t border-outline-variant px-4 py-2 font-mono text-xs text-muted-foreground">
          {limit} {t("of")} {data.pagination.total} {t("sellers")} — {t("pagination coming soon")}
        </div>
      ) : null}
    </div>
  )
}
