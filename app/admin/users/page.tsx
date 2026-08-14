"use client"

import { AdminUsersTable } from "@/components/admin-users-table"

export default function AdminUsersPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          Users
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Kelola status akun: ACTIVE, INACTIVE, SUSPENDED, BLOCKED.
        </p>
      </div>
      <AdminUsersTable />
    </div>
  )
}