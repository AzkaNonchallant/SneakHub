"use client"

import { useEffect, useState } from "react"
import { Dialog } from "@base-ui/react/dialog"
import { Pencil } from "lucide-react"
import { useForm } from "react-hook-form"
import { toast } from "sonner"
import { z } from "zod"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { errMessage, type User } from "@/lib/api"
import { useUpdateMe } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

type ProfileForm = {
  nama: string
  nomor_telepon: string
  preferensi_ukuran?: string
  brand_favorit?: string
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
  return (
    <label className="flex flex-col gap-1">
      <span className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
        {label}
      </span>
      {children}
      {error ? <span className="text-xs leading-4 text-error">{error}</span> : null}
    </label>
  )
}

export function EditProfilButton({ user }: { user?: User }) {
  const t = useT()
  const profileSchema = z.object({
    nama: z.string().trim().min(1, t("Name is required")),
    nomor_telepon: z.string().trim().min(6, t("Invalid phone number")),
    preferensi_ukuran: z.string().trim().optional(),
    brand_favorit: z.string().trim().optional(),
  })
  const update = useUpdateMe()
  const [open, setOpen] = useState(false)
  const [errors, setErrors] = useState<Partial<ProfileForm>>({})
  const { register, handleSubmit, reset } = useForm<ProfileForm>()

  useEffect(() => {
    if (open && user) {
      reset({
        nama: user.nama,
        nomor_telepon: user.nomor_telepon,
        preferensi_ukuran: user.preferensi_ukuran?.join(", ") ?? "",
        brand_favorit: user.brand_favorit?.join(", ") ?? "",
      })
    }
  }, [open, user, reset])

  const onSubmit = async (values: ProfileForm) => {
    const parsed = profileSchema.safeParse(values)
    if (!parsed.success) {
      setErrors(
        Object.fromEntries(
          Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v?.[0] ?? ""]),
        ) as Partial<ProfileForm>,
      )
      return
    }
    setErrors({})
    try {
      await update.mutateAsync({
        nama: parsed.data.nama,
        nomor_telepon: parsed.data.nomor_telepon,
        preferensi_ukuran: parsed.data.preferensi_ukuran
          ? parsed.data.preferensi_ukuran.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
        brand_favorit: parsed.data.brand_favorit
          ? parsed.data.brand_favorit.split(",").map((s) => s.trim()).filter(Boolean)
          : [],
      })
      toast.success(t("Profile updated"))
      setOpen(false)
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger
        render={
          <Button className="mt-4 h-auto w-full gap-2 rounded-none border border-primary bg-primary px-4 py-2 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary">
            <Pencil className="size-4" />
            {t("Edit Profile")}
          </Button>
        }
      />
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-40 bg-black/40" />
        <Dialog.Popup className="fixed top-1/2 left-1/2 z-50 w-[calc(100vw-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 border border-outline bg-surface-container-lowest shadow-[4px_4px_0px_0px_#000]">
          <Dialog.Title className="border-b border-outline px-6 py-4 font-heading text-2xl leading-7 font-bold text-primary uppercase">
            {t("Edit Profile")}
          </Dialog.Title>
          <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4 p-6">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field label={t("Name")} error={errors.nama}>
                <Input {...register("nama")} />
              </Field>
              <Field label={t("Phone Number")} error={errors.nomor_telepon}>
                <Input {...register("nomor_telepon")} />
              </Field>
            </div>
            <Field
              label={t("Size Preference (comma separated)")}
              error={errors.preferensi_ukuran}
            >
              <Input {...register("preferensi_ukuran")} placeholder="40, 41, 42" />
            </Field>
            <Field label={t("Favorite Brand (comma separated)")} error={errors.brand_favorit}>
              <Input {...register("brand_favorit")} placeholder="Nike, Adidas" />
            </Field>
            <div className="mt-2 flex justify-end gap-3">
              <Dialog.Close render={<Button type="button" variant="outline" className="rounded-none" />}>
                {t("Cancel")}
              </Dialog.Close>
              <Button type="submit" disabled={update.isPending} className="rounded-none">
                {t("Save")}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
