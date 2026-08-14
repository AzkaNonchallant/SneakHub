"use client";

import { useState } from "react";
import { Plus, ChevronLeft, ChevronRight } from "lucide-react";

type Role = "CUSTOMER" | "SELLER";
type Status = "AKTIF" | "SUSPEND";

interface UserRow {
  id: string;
  initials: string;
  name: string;
  email: string;
  role: Role;
  status: Status;
  joined: string;
  orders: number;
}

const USERS: UserRow[] = [
  {
    id: "1",
    initials: "BS",
    name: "Budi Santoso",
    email: "budi@email.com",
    role: "CUSTOMER",
    status: "AKTIF",
    joined: "1 Jan 2026",
    orders: 12,
  },
  {
    id: "2",
    initials: "RW",
    name: "Rina Wulandari",
    email: "rina@email.com",
    role: "SELLER",
    status: "AKTIF",
    joined: "15 Feb 2026",
    orders: 0,
  },
  {
    id: "3",
    initials: "HK",
    name: "Hendra Kusuma",
    email: "hendra@email.com",
    role: "CUSTOMER",
    status: "AKTIF",
    joined: "3 Mar 2026",
    orders: 5,
  },
  {
    id: "4",
    initials: "SD",
    name: "Sari Dewi",
    email: "sari@email.com",
    role: "CUSTOMER",
    status: "SUSPEND",
    joined: "20 Apr 2026",
    orders: 2,
  },
];

const ROLE_STYLES: Record<Role, string> = {
  CUSTOMER: "bg-blue-100 text-blue-600",
  SELLER: "bg-purple-100 text-purple-500",
};

const STATUS_STYLES: Record<Status, string> = {
  AKTIF: "bg-emerald-100 text-emerald-600",
  SUSPEND: "bg-red-100 text-red-500",
};

export default function UserManagementPage() {
  const [users, setUsers] = useState(USERS);
  const [page, setPage] = useState(1);

  const toggleStatus = (id: string) =>
    setUsers((prev) =>
      prev.map((u) =>
        u.id === id
          ? { ...u, status: u.status === "AKTIF" ? "SUSPEND" : "AKTIF" }
          : u
      )
    );

  return (
    <div className="min-h-screen bg-[#f4f4f2] px-10 py-10">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-[34px] font-extrabold uppercase tracking-tight text-[#1a1a1a]">
          Manajemen Pengguna
        </h1>
        <button className="flex items-center gap-2 rounded-md bg-[#1a1a1a] px-5 py-3 text-[13px] font-semibold tracking-wide text-white hover:bg-black">
          <Plus className="h-4 w-4" />
          ADD USER
        </button>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-[2fr_1.6fr_1fr_1fr_1.2fr_0.9fr_1.5fr] items-center border-b border-gray-200 px-7 py-4 text-[11.5px] font-semibold tracking-wide text-gray-500">
          <span>NAMA</span>
          <span>EMAIL</span>
          <span>ROLE</span>
          <span>STATUS</span>
          <span>BERGABUNG</span>
          <span>PESANAN</span>
          <span className="text-right">AKSI</span>
        </div>

        {/* Rows */}
        <div>
          {users.map((u, idx) => (
            <div
              key={u.id}
              className={`grid grid-cols-[2fr_1.6fr_1fr_1fr_1.2fr_0.9fr_1.5fr] items-center px-7 py-4 ${
                idx !== users.length - 1 ? "border-b border-gray-100" : ""
              } ${u.status === "SUSPEND" ? "opacity-70" : ""}`}
            >
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gray-100 text-[12px] font-bold text-gray-500">
                  {u.initials}
                </div>
                <span className="text-[14px] font-semibold text-[#1a1a1a]">
                  {u.name}
                </span>
              </div>

              <span className="text-[13.5px] text-gray-500">{u.email}</span>

              <div>
                <span
                  className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide ${ROLE_STYLES[u.role]}`}
                >
                  {u.role}
                </span>
              </div>

              <div>
                <span
                  className={`inline-block rounded-md px-2.5 py-1 text-[11px] font-semibold tracking-wide ${STATUS_STYLES[u.status]}`}
                >
                  {u.status}
                </span>
              </div>

              <span className="text-[13.5px] text-gray-600">{u.joined}</span>

              <span
                className={`text-[14.5px] font-bold ${
                  u.orders === 0 ? "text-gray-400" : "text-[#1a1a1a]"
                }`}
              >
                {u.orders}
              </span>

              <div className="flex items-center justify-end gap-2.5">
                <button className="rounded-md border border-gray-300 bg-white px-4 py-1.5 text-[11.5px] font-semibold tracking-wide text-gray-700 hover:bg-gray-50">
                  DETAIL
                </button>
                <button
                  onClick={() => toggleStatus(u.id)}
                  className={`rounded-md px-4 py-1.5 text-[11.5px] font-semibold tracking-wide ${
                    u.status === "AKTIF"
                      ? "bg-red-100 text-red-500 hover:bg-red-200"
                      : "bg-emerald-100 text-emerald-600 hover:bg-emerald-200"
                  }`}
                >
                  {u.status === "AKTIF" ? "SUSPEND" : "AKTIFKAN"}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-7 py-4">
          <span className="text-[12.5px] text-gray-400">
            Showing 1 to 4 of 24 users
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-medium ${
                  page === n
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-[13px] text-gray-400">...</span>
            <button
              onClick={() => setPage((p) => Math.min(24, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}