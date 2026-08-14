"use client"

import { useState } from "react"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"

import { errMessage } from "@/lib/api"
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/hooks"

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
      {message}
    </div>
  )
}

export default function AdminCategoriesPage() {
  const { data: categories, isLoading } = useCategories()
  const create = useCreateCategory()
  const update = useUpdateCategory()
  const remove = useDeleteCategory()

  const [nama, setNama] = useState("")
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editNama, setEditNama] = useState("")
  const [error, setError] = useState("")

  const onCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    const value = nama.trim()
    if (!value) return
    setError("")
    try {
      await create.mutateAsync({ nama_kategori: value })
      setNama("")
    } catch (err) {
      setError(errMessage(err))
    }
  }

  const onSave = async (id: string) => {
    const value = editNama.trim()
    if (!value) return
    setError("")
    try {
      await update.mutateAsync({ id, nama_kategori: value })
      setEditingId(null)
    } catch (err) {
      setError(errMessage(err))
    }
  }

  const onDelete = async (id: string, namaKategori: string) => {
    if (!window.confirm(`Hapus kategori "${namaKategori}"?`)) return
    setError("")
    try {
      await remove.mutateAsync(id)
    } catch (err) {
      setError(errMessage(err))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-8 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">CATEGORIES</h1>
        <p className="mt-1 text-sm text-neutral-500">
          Kelola kategori produk platform.
        </p>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <form
        onSubmit={onCreate}
        className="mb-6 flex items-center gap-3 rounded-lg border border-neutral-200 bg-white p-4"
      >
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder="Nama kategori baru (mis. Sepatu Lari)"
          className="flex-1 rounded-md border border-neutral-300 bg-white px-3 py-2 text-sm text-neutral-900 outline-none focus:border-blue-600"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-blue-700 disabled:opacity-50"
        >
          <Plus className="size-4" aria-hidden />
          {create.isPending ? "Menyimpan…" : "Tambah"}
        </button>
      </form>

      <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-neutral-200 text-left text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
              <th className="px-4 py-3 font-semibold">Nama Kategori</th>
              <th className="w-40 px-4 py-3 text-right font-semibold">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-neutral-400">
                  Memuat…
                </td>
              </tr>
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-neutral-400">
                  Belum ada kategori.
                </td>
              </tr>
            ) : (
              categories?.map((cat) => (
                <tr key={cat.cateogry_id} className="border-b border-neutral-100 last:border-b-0">
                  <td className="px-4 py-3">
                    {editingId === cat.cateogry_id ? (
                      <input
                        type="text"
                        value={editNama}
                        onChange={(e) => setEditNama(e.target.value)}
                        autoFocus
                        className="w-full max-w-sm rounded-md border border-neutral-300 px-2 py-1 text-sm text-neutral-900 outline-none focus:border-blue-600"
                      />
                    ) : (
                      <span className="text-neutral-900">{cat.nama_kategori}</span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end gap-2">
                      {editingId === cat.cateogry_id ? (
                        <>
                          <button
                            type="button"
                            onClick={() => onSave(cat.cateogry_id)}
                            disabled={update.isPending}
                            className="flex items-center gap-1 rounded-md bg-green-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-green-700 disabled:opacity-50"
                          >
                            <Check className="size-3.5" aria-hidden />
                            Simpan
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
                          >
                            <X className="size-3.5" aria-hidden />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            type="button"
                            onClick={() => {
                              setEditingId(cat.cateogry_id)
                              setEditNama(cat.nama_kategori)
                            }}
                            className="flex items-center gap-1 rounded-md border border-neutral-300 px-2.5 py-1.5 text-xs font-semibold text-neutral-600 transition-colors hover:bg-neutral-100"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(cat.cateogry_id, cat.nama_kategori)}
                            disabled={remove.isPending}
                            className="flex items-center gap-1 rounded-md bg-red-600 px-2.5 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-red-700 disabled:opacity-50"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            Hapus
                          </button>
                        </>
                      )}
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
