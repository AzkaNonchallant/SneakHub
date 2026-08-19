"use client"

import { useState } from "react"
import { toast } from "sonner"

import { errMessage, type AdminUser } from "@/lib/api"
import { SkeletonBlock } from "@/components/skeleton"
import { useAdminUsers, useUpdateUserRole, useUpdateUserStatus } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"]

const roles = ["SELLER", "CUSTOMER"]

const statusTone: Record<string, string> = {
  ACTIVE: "bg-[#10B981] text-white",
  INACTIVE: "bg-surface-container-highest text-primary",
  SUSPENDED: "bg-[#f59e0b] text-white",
  BLOCKED: "bg-error text-white",
}

export function AdminUsersTable({ limit = 20 }: { limit?: number }) {
  const t = useT()
  const { data, isLoading } = useAdminUsers({ limit })
  const update = useUpdateUserStatus()
  const updateRole = useUpdateUserRole()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const changeRole = async (u: AdminUser, peran: string) => {
    if (peran === u.peran) return
    // ponytail: turunkan seller = seluruh produk INACTIVE — konfirmasi dulu
    if (!window.confirm(`${t("Change role of")} ${u.email} ${t("to")} ${peran}?`)) return
    try {
      await updateRole.mutateAsync({ userId: u.user_id, body: { peran } })
      toast.success(t("Role updated"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const save = async (u: AdminUser) => {
    const next = drafts[u.user_id] ?? u.status_akun
    if (next === u.status_akun) return
    const alasan = window.prompt(
      t("Reason to change status") + ` ${u.email} ${t("to")} ${next}:`,
      t("Admin decision")
    )
    if (alasan === null) return
    try {
      await update.mutateAsync({ userId: u.user_id, body: { status_akun: next, alasan } })
      toast.success(t("Account status updated"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const users = data?.items ?? []

  return (
    <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
      <table className="w-full min-w-[640px] text-sm">
        <thead>
          <tr className="border-b border-outline-variant text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
            <th className="px-4 py-3 font-bold">{t("Name")}</th>
            <th className="px-4 py-3 font-bold">{t("Email")}</th>
            <th className="px-4 py-3 font-bold">{t("Role")}</th>
            <th className="px-4 py-3 font-bold">{t("Status")}</th>
            <th className="px-4 py-3 font-bold">{t("Actions")}</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <>
              {Array.from({ length: 6 }).map((_, i) => (
                <tr key={i}>
                  <td colSpan={5} className="px-4 py-3">
                    <SkeletonBlock className="h-4 w-full" />
                  </td>
                </tr>
              ))}
            </>
          ) : users.length === 0 ? (
            <tr>
                <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                  {t("No data yet.")}
                </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.user_id} className="border-b border-outline-variant last:border-0">
                <td className="px-4 py-3 font-heading font-bold text-primary">{u.nama}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  {u.peran === "admin" ? (
                    <span className="border border-outline px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                      admin
                    </span>
                  ) : (
                    <select
                      value={u.peran}
                      disabled={updateRole.isPending}
                      onChange={(e) => changeRole(u, e.target.value)}
                      className="border border-outline-variant bg-transparent px-2 py-1 text-xs uppercase focus:border-on-tertiary-container focus:ring-0 disabled:opacity-40"
                    >
                      {roles.map((r) => (
                        <option key={r}>{r}</option>
                      ))}
                    </select>
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-widest uppercase ${statusTone[u.status_akun] ?? "bg-surface-container-highest text-primary"}`}
                  >
                    {u.status_akun}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <select
                      value={drafts[u.user_id] ?? u.status_akun}
                      onChange={(e) => setDrafts((d) => ({ ...d, [u.user_id]: e.target.value }))}
                      className="border border-outline-variant bg-transparent px-2 py-1 text-xs focus:border-on-tertiary-container focus:ring-0"
                    >
                      {statuses.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                    <button
                      type="button"
                      disabled={update.isPending}
                      onClick={() => save(u)}
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
          {limit} {t("of")} {data.pagination.total} {t("users")} — {t("pagination coming soon")}
        </div>
      ) : null}
    </div>
  )
}