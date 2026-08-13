"use client"

import { useCallback, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { ImagePlus, X } from "lucide-react"
import { useDropzone } from "react-dropzone"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { useInventoryStore } from "@/lib/inventory-store"

const schema = z.object({
  name: z.string().trim().min(1, "Nama produk wajib diisi"),
  brand: z.string().trim().min(1, "Brand wajib diisi"),
  colorway: z.string().trim().optional(),
  price: z.coerce.number().positive("Harga harus lebih dari 0"),
  size: z.string().trim().min(1, "Ukuran wajib diisi"),
  condition: z.string().trim().min(1, "Kondisi wajib diisi"),
  stock: z.coerce.number().int().nonnegative("Stok tidak boleh negatif"),
  alt: z.string().trim().optional(),
})

export function TambahProdukButton() {
  const add = useInventoryStore((s) => s.add)
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [image, setImage] = useState<string>("")

  const onDrop = useCallback((accepted: File[]) => {
    const file = accepted[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setImage(reader.result as string)
    reader.readAsDataURL(file) // ponytail: data URL until there's an upload API
  }, [])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple: false,
  })

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const parsed = schema.safeParse({
      name: fd.get("name"),
      brand: fd.get("brand"),
      colorway: fd.get("colorway"),
      price: fd.get("price"),
      size: fd.get("size"),
      condition: fd.get("condition"),
      stock: fd.get("stock"),
      alt: fd.get("alt"),
    })
    if (!parsed.success) {
      const next: Record<string, string> = {}
      for (const issue of parsed.error.issues) {
        const key = String(issue.path[0] ?? "form")
        // ponytail: keep first message per field
        if (!(key in next)) next[key] = issue.message
      }
      setErrors(next)
      return
    }
    const v = parsed.data
    add({
      brand: v.brand,
      name: v.name,
      colorway: v.colorway ?? "",
      price: v.price,
      size: v.size,
      condition: v.condition,
      stock: v.stock,
      alt: v.alt || `${v.brand} ${v.name}`,
      image: image || fallbackImage(v.brand),
    })
    setImage("")
    setErrors({})
    setOpen(false)
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button className="h-auto rounded-none border border-primary bg-primary px-6 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary">
            Tambah Produk
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 bg-black/60" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 w-[min(92vw,560px)] -translate-x-1/2 -translate-y-1/2 border border-primary bg-surface-container-lowest focus:outline-none">
          <div className="flex items-center justify-between border-b border-primary px-5 py-4">
            <Dialog.Title className="font-heading text-xl leading-6 font-black text-primary uppercase">
              Tambah Produk
            </Dialog.Title>
            <Dialog.Close className="flex size-8 items-center justify-center border border-primary transition-colors hover:bg-primary hover:text-white">
              <X className="size-4" aria-hidden />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="max-h-[70vh] overflow-y-auto p-5">
            {/* Image upload */}
            <div className="mb-5">
              <label className="mb-1.5 block text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                Gambar Produk
              </label>
              <div
                {...getRootProps()}
                className={[
                  "flex h-40 cursor-pointer flex-col items-center justify-center gap-2 border border-dashed border-outline-variant bg-surface-container-low p-4 text-center transition-colors",
                  isDragActive ? "border-primary bg-surface-container" : "hover:bg-surface-container",
                ].join(" ")}
              >
                <input {...getInputProps()} />
                {image ? (
                  <img
                    src={image}
                    alt="Preview produk"
                    className="h-full w-full object-contain mix-blend-multiply"
                  />
                ) : (
                  <>
                    <ImagePlus className="size-6 text-muted-foreground" aria-hidden />
                    <span className="text-xs font-bold tracking-widest text-muted-foreground uppercase">
                      Seret gambar atau klik untuk upload
                    </span>
                  </>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nama Produk" name="name" placeholder="Jordan 1 Retro High" />
              <Field label="Brand" name="brand" placeholder="Nike" />
              <Field label="Colorway" name="colorway" placeholder="Lost & Found" />
              <Field label="Harga (Rp)" name="price" type="number" min={1} placeholder="4500000" />
              <Field label="Ukuran" name="size" placeholder="US 10.5" />
              <Field label="Kondisi" name="condition" placeholder="DS / 9.8/10" />
              <Field label="Stok" name="stock" type="number" min={0} defaultValue="1" />
              <Field label="Deskripsi Gambar (opsional)" name="alt" placeholder="Sepatu hitam putih merah" />
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

            <div className="mt-6 flex justify-end gap-3">
              <Dialog.Close
                render={
                  <Button
                    type="button"
                    variant="outline"
                    className="h-auto rounded-none border border-primary bg-background px-5 py-2.5 text-xs font-bold tracking-widest uppercase"
                  >
                    Batal
                  </Button>
                }
              />
              <Button
                type="submit"
                className="h-auto rounded-none border border-primary bg-primary px-5 py-2.5 text-xs font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
              >
                Simpan Produk
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

function Field({
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

const fallbackImages: Record<string, string> = {
  Nike: "https://lh3.googleusercontent.com/aida-public/AB6AXuBxPMOvyNzilLTPzxyNkFxzjqnuO0BI4PzH6RFS99H1H-g5ttiOyASk0hNpWZk9IYthePNWXwt58oMCS7I9WF22K2IJnVa4a4_5HFYxmzNUSNXuBzZdu7nWeL5_PpBu30PHbVHHhzhl7kq18l4thUBzndw3hTMGvKfvu1tuKdgSW0a2qx0c7mRbh3J7WoEcdNneDuinBdDGt41EKtW7tDx5roAQIyqwh_l0sBNQZlxtVa-zLg3gYw67",
}

// ponytail: placeholder image per brand when none uploaded — replace with a real upload API
function fallbackImage(brand: string): string {
  return fallbackImages[brand] ?? fallbackImages.Nike
}
