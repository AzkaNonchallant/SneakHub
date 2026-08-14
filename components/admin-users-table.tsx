"use client"

import { useState } from "react"
import { toast } from "sonner"

import { errMessage, type AdminUser } from "@/lib/api"
import { useAdminUsers, useUpdateUserStatus } from "@/lib/hooks"

const statuses = ["ACTIVE", "INACTIVE", "SUSPENDED", "BLOCKED"]

const statusTone: Record<string, string> = {
  ACTIVE: "bg-[#10B981]",
  INACTIVE: "bg-surface-container-highest text-primary",
  SUSPENDED: "bg-[#f59e0b]",
  BLOCKED: "bg-error",
}

export function AdminUsersTable({ limit = 20 }: { limit?: number }) {
  const { data, isLoading } = useAdminUsers({ limit })
  const update = useUpdateUserStatus()
  const [drafts, setDrafts] = useState<Record<string, string>>({})

  const save = async (u: AdminUser) => {
    const next = drafts[u.user_id] ?? u.status_akun
    if (next === u.status_akun) return
    const alasan = window.prompt(`Alasan ubah status ${u.email} ke ${next}:`, "Keputusan admin")
    if (alasan === null) return
    try {
      await update.mutateAsync({ userId: u.user_id, body: { status_akun: next, alasan } })
      toast.success("Status akun diperbarui")
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
            <th className="px-4 py-3 font-bold">Nama</th>
            <th className="px-4 py-3 font-bold">Email</th>
            <th className="px-4 py-3 font-bold">Peran</th>
            <th className="px-4 py-3 font-bold">Status</th>
            <th className="px-4 py-3 font-bold">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {isLoading ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Loading…
              </td>
            </tr>
          ) : users.length === 0 ? (
            <tr>
              <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                Belum ada data.
              </td>
            </tr>
          ) : (
            users.map((u) => (
              <tr key={u.user_id} className="border-b border-outline-variant last:border-0">
                <td className="px-4 py-3 font-heading font-bold text-primary">{u.nama}</td>
                <td className="px-4 py-3 font-mono text-xs text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <span className="border border-outline px-2 py-0.5 text-[10px] font-bold tracking-widest text-primary uppercase">
                    {u.peran}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`border border-primary px-2 py-0.5 text-[10px] font-bold tracking-widest text-white uppercase ${statusTone[u.status_akun] ?? "bg-surface-container-highest text-primary"}`}
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
          {limit} dari {data.pagination.total} user — pagination menyusul
        </div>
      ) : null}
    </div>
  )
}