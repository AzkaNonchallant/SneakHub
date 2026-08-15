"use client"

import { useCallback, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ImagePlus, Pencil, Trash2, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { z } from "zod"

import { Field } from "@/components/tambah-produk-dialog"
import { Button } from "@/components/ui/button"
import { DEFAULT_BRAND_ID, errMessage, type ApiProduct } from "@/lib/api"
import {
  useCategories,
  useDeleteProductImage,
  useUpdateProduct,
  useUploadProductImage,
} from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export function EditProdukButton({ product }: { product: ApiProduct }) {
  const t = useT()
  const schema = z.object({
    name: z.string().trim().min(1, t("Product name is required")),
    price: z.coerce.number().positive(t("Price must be greater than 0")),
    sizes: z.string().trim().min(1, t("Size is required")),
    condition: z.string().trim().min(1, t("Condition is required")),
    stock: z.coerce.number().int().nonnegative(t("Stock cannot be negative")),
    description: z.string().trim().min(10, t("Description must be at least 10 characters")),
    category_id: z.string().optional(),
  })
  const update = useUpdateProduct()
  const upload = useUploadProductImage()
  const deleteImage = useDeleteProductImage()
  const { data: categories } = useCategories()
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [formError, setFormError] = useState("")
  const [file, setFile] = useState<File | null>(null)

  const onDrop = useCallback((accepted: File[]) => {
    setFile(accepted[0] ?? null)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  })

  const images = product.images ?? []

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setFormError("")
    const fd = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      name: fd.get("name"),
      price: fd.get("price"),
      sizes: fd.get("sizes"),
      condition: fd.get("condition"),
      stock: fd.get("stock"),
      description: fd.get("description"),
      category_id: fd.get("category_id"),
    })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form")
        if (!(key in next)) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    const v = parsed.data
    try {
      await update.mutateAsync({
        id: product.product_id,
        body: {
          nama_produk: v.name,
          brand_id: product.brand_id ?? DEFAULT_BRAND_ID,
          kondisi: v.condition,
          deskripsi: v.description ?? "",
          harga: v.price,
          stok: v.stock,
          status_publikasi: product.status_publikasi ?? "aktif",
          ukuran_tersedia: v.sizes.split(",").map((s) => s.trim()).filter(Boolean),
          condition_score: v.condition.includes("/") ? Number(v.condition.split("/")[0]) : 9.0,
          category_id: v.category_id || product.category_id || categories?.[0]?.cateogry_id,
        },
      })
      if (file) {
        const img = new FormData()
        img.append("gambar", file)
        img.append("urutan_tampil", "1")
        await upload.mutateAsync({ productId: product.product_id, fd: img })
      }
      toast.success(t("Product updated"))
      setFile(null)
      setErrors({})
      setOpen(false)
    } catch (err) {
      setFormError(errMessage(err))
    }
  }

  const onDeleteImage = async (imageId: string) => {
    try {
      await deleteImage.mutateAsync({ productId: product.product_id, imageId })
      toast.success(t("Photo deleted"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button className="h-auto gap-2 rounded-none border border-primary px-3 py-2 text-xs leading-4 font-bold tracking-widest text-primary uppercase transition-colors hover:bg-primary hover:text-white">
            <Pencil className="size-3.5" /> {t("Edit")}
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 border border-primary bg-surface-container-lowest focus:outline-none">
          <div className="flex items-center justify-between border-b border-primary px-5 py-4">
            <Dialog.Title className="font-heading text-xl leading-6 font-black text-primary uppercase">
              {t("Edit Product")}
            </Dialog.Title>
            <Dialog.Close className="flex size-8 items-center justify-center border border-primary transition-colors hover:bg-primary hover:text-white">
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
            {images.length > 0 ? (
              <div className="mb-5">
                <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                  {t("Attached Photos")}
                </label>
                <div className="flex flex-wrap gap-3">
                  {images.map((img) => (
                    <div key={img.image_id} className="relative size-20 border border-outline bg-surface-container-low">
                      <img
                        src={img.image_url}
                        alt={product.nama_produk}
                        className="h-full w-full object-contain mix-blend-multiply"
                      />
                      <button
                        type="button"
                        aria-label={t("Delete photo")}
                        onClick={() => onDeleteImage(img.image_id)}
                        className="absolute -top-2 -right-2 flex size-6 items-center justify-center border border-primary bg-white text-primary transition-colors hover:bg-primary hover:text-white"
                      >
                        <Trash2 className="size-3" aria-hidden />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {t("Add New Photo")}
              </label>
              <div
                {...getRootProps()}
                className={[
                  "flex h-28 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-outline-variant bg-surface-container-low p-4 text-center transition-colors",
                  isDragActive ? "border-primary bg-surface-container" : "hover:bg-surface-container",
                ].join(" ")}
              >
                <input {...getInputProps()} />
                {file ? (
                  <span className="text-xs font-bold tracking-widest text-primary uppercase">
                    {file.name} ({t("click to replace")})
                  </span>
                ) : (
                  <>
                    <ImagePlus className="size-5 text-muted-foreground" aria-hidden />
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      {t("Drag an image or click to upload")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label={t("Product Name")}
                name="name"
                defaultValue={product.nama_produk}
              />
              <Field label={t("Price (Rp)")} name="price" type="number" min={1} defaultValue={String(product.harga)} />
              <Field
                label={t("Sizes (comma separated)")}
                name="sizes"
                defaultValue={product.ukuran_tersedia.join(", ")}
              />
              <Field label={t("Condition")} name="condition" defaultValue={product.kondisi} />
              <Field label={t("Stock")} name="stock" type="number" min={0} defaultValue={String(product.stok)} />
              <div>
                <label
                  htmlFor="category_id"
                  className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  {t("Category")}
                </label>
                <select
                  id="category_id"
                  name="category_id"
                  defaultValue={product.category_id ?? ""}
                  className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm text-foreground outline-none focus:border-b-2 focus:border-ring"
                >
                  <option value="">{t("Select category…")}</option>
                  {categories?.map((c) => (
                    <option key={c.cateogry_id} value={c.cateogry_id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
              <Field
                label={t("Description (min. 10 characters)")}
                name="description"
                defaultValue={product.deskripsi ?? ""}
              />
            </div>

            {Object.keys(errors).length > 0 ? (
              <ul className="mt-4 space-y-1">
                {Object.entries(errors).map(([key, msg]) => (
                  <li key={key} className="text-xs font-bold text-error">
                    {msg}
                  </li>
                ))}
              </ul>
            ) : null}
            {formError ? (
              <p className="mt-4 bg-error/10 px-3 py-2 text-xs font-bold text-error">{formError}</p>
            ) : null}

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto rounded-none border border-primary bg-background px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                  >
                    {t("Cancel")}
                  </Button>
                }
              />
              <Button
                type="submit"
                disabled={update.isPending}
                className="h-auto rounded-none border border-primary bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
              >
                {update.isPending ? t("Saving…") : t("Save Changes")}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
