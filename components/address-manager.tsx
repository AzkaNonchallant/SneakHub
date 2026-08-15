"use client"

import { useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Pencil, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { errMessage, type ApiAddress } from "@/lib/api"
import {
  useAddresses,
  useCreateAddress,
  useDeleteAddress,
  useUpdateAddress,
} from "@/lib/hooks"
import { useT } from "@/lib/i18n"

type AddressForm = {
  nama_penerima: string
  nomor_telepon: string
  alamat: string
  kota: string
  provinsi: string
  kode_pos: string
}

const emptyForm: AddressForm = {
  nama_penerima: "",
  nomor_telepon: "",
  alamat: "",
  kota: "",
  provinsi: "",
  kode_pos: "",
}

function Field({
  label,
  error,
  children,
}: {
  label: string
  error?: string
  children: React.ReactNode
}) {
  const t = useT()
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
        {t(label)}
      </span>
      {children}
      {error ? <span className="text-xs leading-4 text-error">{error}</span> : null}
    </label>
  )
}

export function AddressDialog({
  trigger,
  address,
}: {
  trigger: React.ReactNode
  address?: ApiAddress
}) {
  const create = useCreateAddress()
  const update = useUpdateAddress()
  const t = useT()
  const addressSchema = z.object({
    nama_penerima: z.string().min(1, t("Recipient name is required")),
    nomor_telepon: z.string().min(6, t("Invalid phone number")),
    alamat: z.string().min(1, t("Address is required")),
    kota: z.string().min(1, t("City is required")),
    provinsi: z.string().min(1, t("Province is required")),
    kode_pos: z.string().min(3, t("Invalid postal code")),
  })
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState<AddressForm>(emptyForm)
  const [errors, setErrors] = useState<Partial<AddressForm>>({})

  const openDialog = () => {
    setForm(
      address
        ? {
            nama_penerima: address.nama_penerima,
            nomor_telepon: address.nomor_telepon,
            alamat: address.alamat,
            kota: address.kota,
            provinsi: address.provinsi,
            kode_pos: address.kode_pos,
          }
        : emptyForm,
    )
    setErrors({})
    setOpen(true)
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    const parsed = addressSchema.safeParse(form)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
        ) as Partial<AddressForm>,
      )
      return
    }
    setErrors({})
    try {
      const body = { ...parsed.data, is_default: address?.is_default ?? false }
      if (address) await update.mutateAsync({ id: address.address_id, body })
      else await create.mutateAsync(body)
      toast.success(address ? t("Address updated") : t("Address added"))
      setOpen(false)
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const set = (key: keyof AddressForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((f) => ({ ...f, [key]: e.target.value }))

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button
            type="button"
            variant={address ? "outline" : "default"}
            size="sm"
            className="gap-2 rounded-none"
            onClick={openDialog}
          >
            {trigger}
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-outline bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000]">
          <Dialog.Title className="border-b border-outline px-6 py-4 font-heading text-2xl leading-7 font-bold text-primary uppercase">
            {address ? t("Edit Address") : t("Add Address")}
          </Dialog.Title>
          <form onSubmit={submit} className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label="Nama Penerima" error={errors.nama_penerima}>
                <Input value={form.nama_penerima} onChange={set("nama_penerima")} />
              </Field>
              <Field label="Nomor Telepon" error={errors.nomor_telepon}>
                <Input value={form.nomor_telepon} onChange={set("nomor_telepon")} />
              </Field>
            </div>
            <Field label="Alamat" error={errors.alamat}>
              <Input value={form.alamat} onChange={set("alamat")} />
            </Field>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field label="Kota" error={errors.kota}>
                <Input value={form.kota} onChange={set("kota")} />
              </Field>
              <Field label="Provinsi" error={errors.provinsi}>
                <Input value={form.provinsi} onChange={set("provinsi")} />
              </Field>
              <Field label="Kode Pos" error={errors.kode_pos}>
                <Input value={form.kode_pos} onChange={set("kode_pos")} />
              </Field>
            </div>
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close
                render={<Button type="button" variant="outline" className="rounded-none" />}
              >
                {t("Cancel")}
              </Dialog.Close>              <Button
                type="submit"
                disabled={create.isPending || update.isPending}
                className="rounded-none"
              >
                {t("Save")}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}

export function AddressSection() {
  const t = useT()
  const { data: addresses } = useAddresses()
  const remove = useDeleteAddress()

  const onDelete = async (a: ApiAddress) => {
    if (!window.confirm(`${t("Delete address")} "${a.nama_penerima}"?`)) return
    try {
      await remove.mutateAsync(a.address_id)
      toast.success(t("Address deleted"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
          {t("My Addresses")}
        </h2>
        <AddressDialog
          trigger={
            <>
              <Plus className="size-4" /> {t("Add")}
            </>
          }
        />
      </div>

      {addresses && addresses.length === 0 ? (
        <p className="border border-dashed border-outline-variant p-6 text-center text-sm text-muted-foreground">
          {t("No addresses yet.")}
        </p>
      ) : (
        <div className="flex flex-col gap-3">
          {addresses?.map((a) => (
            <div
              key={a.address_id}
              className="flex flex-col gap-2 border border-outline bg-surface-container-lowest p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-primary">{a.nama_penerima}</span>
                  <span className="text-sm text-muted-foreground">{a.nomor_telepon}</span>
                  {a.is_default ? (
                    <span className="border border-outline bg-surface-container px-1.5 py-0.5 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                      Default
                    </span>
                  ) : null}
                </div>
                <p className="mt-1 text-sm leading-5 text-muted-foreground">
                  {a.alamat}, {a.kota}, {a.provinsi} {a.kode_pos}
                </p>
              </div>
              <div className="flex gap-2">
                <AddressDialog
                  address={a}
                  trigger={
                    <>
                      <Pencil className="size-3.5" /> {t("Edit")}
                    </>
                  }
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-2 rounded-none text-error hover:border-error"
                  onClick={() => onDelete(a)}
                >
                  <Trash2 className="size-3.5" /> {t("Delete")}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
