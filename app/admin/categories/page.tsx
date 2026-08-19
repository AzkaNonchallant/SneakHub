"use client"

import { useState } from "react"
import { Check, Pencil, Plus, Trash2, X } from "lucide-react"

import { PageMeta } from "@/components/page-meta"
import { SkeletonBlock } from "@/components/skeleton"
import { errMessage } from "@/lib/api"
import {
  useCategories,
  useCreateCategory,
  useDeleteCategory,
  useUpdateCategory,
} from "@/lib/hooks"
import { useT } from "@/lib/i18n"

function ErrorBanner({ message }: { message: string }) {
  return (
    <div className="mb-4 border border-error bg-error/5 px-4 py-3 text-sm text-error">
      {message}
    </div>
  )
}

export default function AdminCategoriesPage() {
  const t = useT()
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
    if (!window.confirm(`${t("Delete category")} "${namaKategori}"?`)) return
    setError("")
    try {
      await remove.mutateAsync(id)
    } catch (err) {
      setError(errMessage(err))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1400px] px-6 py-8 md:px-8">
      <PageMeta title="Categories" />
      <div className="mb-6 border-b border-primary pb-4">
        <h1 className="font-heading text-3xl leading-9 font-black text-primary uppercase">
          Categories
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("Manage the platform's product categories.")}
        </p>
      </div>

      {error ? <ErrorBanner message={error} /> : null}

      <form
        onSubmit={onCreate}
        className="mb-6 flex flex-col gap-3 border border-outline-variant bg-surface-container-lowest p-4 sm:flex-row sm:items-center"
      >
        <input
          type="text"
          value={nama}
          onChange={(e) => setNama(e.target.value)}
          placeholder={t("New category name (e.g. Running Shoes)")}
          className="flex-1 border border-outline-variant bg-transparent px-3 py-2 text-sm text-primary focus:border-on-tertiary-container focus:ring-0"
        />
        <button
          type="submit"
          disabled={create.isPending}
          className="flex items-center justify-center gap-2 border border-primary bg-primary px-4 py-2 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
        >
          <Plus className="size-4" aria-hidden />
          {create.isPending ? t("Saving…") : t("Add")}
        </button>
      </form>

      <div className="overflow-x-auto border border-outline-variant bg-surface-container-lowest">
        <table className="w-full min-w-[480px] text-sm">
          <thead>
            <tr className="border-b border-outline-variant text-left text-[11px] font-bold tracking-widest text-muted-foreground uppercase">
              <th className="px-4 py-3 font-bold">{t("Category Name")}</th>
              <th className="w-44 px-4 py-3 text-right font-bold">{t("Actions")}</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <>
                {Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={2} className="px-4 py-3">
                      <SkeletonBlock className="h-4 w-full" />
                    </td>
                  </tr>
                ))}
              </>
            ) : categories?.length === 0 ? (
              <tr>
                <td colSpan={2} className="px-4 py-8 text-center text-muted-foreground">
                  {t("No categories yet.")}
                </td>
              </tr>
            ) : (
              categories?.map((cat) => (
                <tr key={cat.cateogry_id} className="border-b border-outline-variant last:border-0">
                  <td className="px-4 py-3">
                    {editingId === cat.cateogry_id ? (
                      <input
                        type="text"
                        value={editNama}
                        onChange={(e) => setEditNama(e.target.value)}
                        autoFocus
                        className="w-full max-w-sm border border-outline-variant bg-transparent px-2 py-1 text-sm text-primary focus:border-on-tertiary-container focus:ring-0"
                      />
                    ) : (
                      <span className="font-heading font-bold text-primary">{cat.nama_kategori}</span>
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
                            className="flex items-center gap-1 border border-primary bg-primary px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
                          >
                            <Check className="size-3.5" aria-hidden />
                            {t("Save")}
                          </button>
                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="flex items-center gap-1 border border-outline-variant px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase transition-colors hover:bg-surface-container hover:text-primary"
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
                            className="flex items-center gap-1 border border-primary bg-primary px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
                          >
                            <Pencil className="size-3.5" aria-hidden />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => onDelete(cat.cateogry_id, cat.nama_kategori)}
                            disabled={remove.isPending}
                            className="flex items-center gap-1 border border-destructive bg-destructive px-2.5 py-1.5 text-[10px] font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-destructive disabled:opacity-40"
                          >
                            <Trash2 className="size-3.5" aria-hidden />
                            {t("Delete")}
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
