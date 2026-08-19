"use client"

import { useCallback, useState } from "react"
import Image from "next/image"
import { Dialog } from "@base-ui/react/dialog"
import { ImagePlus, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { DEFAULT_BRAND_ID, errMessage } from "@/lib/api"
import { useCategories, useCreateProduct, useUploadProductImage } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

const CONDITION_OPTIONS = ["new", "used", "refurbished"] as const

export function TambahProdukButton() {
  const t = useT()
  const schema = z.object({
    name: z.string().trim().min(1, t("Product name is required")),
    price: z.coerce.number().positive(t("Price must be greater than 0")),
    sizes: z.string().trim().min(1, t("Size is required")),
    condition: z.enum(CONDITION_OPTIONS, {
      message: t("Condition is required"),
    }),
    stock: z.coerce.number().int().nonnegative(t("Stock cannot be negative")),
    description: z.string().trim().min(10, t("Description must be at least 10 characters")),
    category_id: z.string().trim().min(1, t("Category is required")),
  })
  const create = useCreateProduct()
  const upload = useUploadProductImage()
  const { data: categories } = useCategories()
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [image, setImage] = useState<string>("")
  const [file, setFile] = useState<File | null>(null)
  const [formError, setFormError] = useState("")

  const onDrop = useCallback((accepted: File[]) => {
    const f = accepted[0]
    if (!f) return
    setFile(f)
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(f)
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  })

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
      const product = await create.mutateAsync({
        nama_produk: v.name,
        brand_id: DEFAULT_BRAND_ID,
        kondisi: v.condition,
        deskripsi: v.description ?? "",
        harga: v.price,
        stok: v.stock,


        ukuran_tersedia: v.sizes.split(",").map((s) => s.trim()).filter(Boolean),
        condition_score:
          v.condition === "new" ? 10.0 : v.condition === "refurbished" ? 8.0 : 7.0,
        category_id: v.category_id,
      })
      setImage("")
      setFile(null)
      setErrors({})
      setOpen(false)
      toast.success(t("Product saved"))
      if (file) {
        const img = new FormData()
        img.append("gambar", file)
        img.append("urutan_tampil", "1")


        upload.mutateAsync({ productId: product.product_id, fd: img }).catch(() => {
          toast.error(t("Product saved, image upload failed"))
        })
      }
    } catch (err) {
      setFormError(errMessage(err))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button className="h-auto rounded-none border border-primary bg-primary px-6 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary">
            {t("Add Product")}
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 border border-primary bg-surface-container-lowest focus:outline-none">
          <div className="flex items-center justify-between border-b border-primary px-5 py-4">
            <Dialog.Title className="font-heading text-xl leading-6 font-black text-primary uppercase">
              {t("Add Product")}
            </Dialog.Title>
            <Dialog.Close className="flex size-8 items-center justify-center border border-primary transition-colors hover:bg-primary hover:text-white">
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">

            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                {t("Product Image")}
              </label>
              <div
                {...getRootProps()}
                className={[
                  "relative flex h-40 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-outline-variant bg-surface-container-low p-4 text-center transition-colors",
                  isDragActive ? "border-primary bg-surface-container" : "hover:bg-surface-container",
                ].join(" ")}
              >
                <input {...getInputProps()} />
                {image ? (
                  <Image
                    src={image}
                    alt={t("Product preview")}
                    fill
                    sizes="400px"
                    className="object-contain mix-blend-multiply"
                  />
                ) : (
                  <>
                    <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      {t("Drag an image or click to upload")}
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("Product Name")} name="name" placeholder="Jordan 1 Retro High" />
              <Field label={t("Price (Rp)")} name="price" type="number" min={1} placeholder="4500000" />
              <Field label={t("Sizes (comma separated)")} name="sizes" placeholder="40, 41, 42" />
              <div>
                <label
                  htmlFor="condition"
                  className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
                >
                  {t("Condition")}
                </label>
                <select
                  id="condition"
                  name="condition"
                  defaultValue=""
                  className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm text-foreground outline-none focus:border-b-2 focus:border-ring"
                >
                  <option value="" disabled>
                    {t("Select condition…")}
                  </option>
                  <option value="new">{t("New")}</option>
                  <option value="used">{t("Used")}</option>
                  <option value="refurbished">{t("Refurbished")}</option>
                </select>
              </div>
              <Field label={t("Stock")} name="stock" type="number" min={0} defaultValue="1" />
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
                  defaultValue=""
                  className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm text-foreground outline-none focus:border-b-2 focus:border-ring"
                >
                  <option value="" disabled>
                    {t("Select category…")}
                  </option>
                  {categories?.map((c) => (
                    <option key={c.cateogry_id} value={c.cateogry_id}>
                      {c.nama_kategori}
                    </option>
                  ))}
                </select>
              </div>
              <Field label={t("Description (min. 10 characters)")} name="description" placeholder={t("100% original sneakers (min. 10 characters)")} />
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
                disabled={create.isPending}
                className="h-auto rounded-none border border-primary bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
              >
                {create.isPending ? t("Saving…") : t("Save Product")}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function Field({
  label,
  name,
  type = "text",
  min,
  defaultValue,
  placeholder,
}: {
  label: string
  name: string
  type?: string
  min?: number
  defaultValue?: string
  placeholder?: string
}) {
  return (
    <div>
      <label
        htmlFor={name}
        className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase"
      >
        {label}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        min={min}
        defaultValue={defaultValue}
        placeholder={placeholder}
        className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm text-foreground outline-none placeholder:text-muted-foreground focus:border-b-2 focus:border-ring"
      />
    </div>
  )
}