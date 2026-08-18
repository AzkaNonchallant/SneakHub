"use client"

import { toast } from "sonner"

import { PageMeta } from "@/components/page-meta"
import { errMessage } from "@/lib/api"
import { useMe, useUpdateMe } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

function Field({
  label,
  name,
  defaultValue = "",
  type = "text",
}: {
  label: string
  name: string
  defaultValue?: string
  type?: string
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
        defaultValue={defaultValue}
        className="h-10 w-full rounded-none border border-input bg-transparent px-3 text-sm text-foreground outline-none focus:border-b-2 focus:border-ring"
      />
    </div>
  )
}

export default function SettingsPage() {
  const t = useT()
  const { data: me, isLoading } = useMe()
  const update = useUpdateMe()

  const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    try {
      await update.mutateAsync({
        nama: String(fd.get("nama") ?? ""),
        email: String(fd.get("email") ?? ""),
        nomor_telepon: String(fd.get("nomor_telepon") ?? ""),
      })
      toast.success(t("Profile updated"))
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  return (
    <div className="mx-auto w-full max-w-[1280px] bg-background px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <PageMeta title="Settings" />
      <div className="mb-8">
        <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
          {t("Seller Center")}
        </div>
        <h1 className="font-heading text-4xl font-black tracking-tighter text-primary uppercase">
          {t("Settings")}
        </h1>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <form
          key={me?.user_id ?? "loading"}
          onSubmit={onSubmit}
          className="border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]"
        >
          <div className="mb-6 flex items-baseline gap-3 border-b border-outline-variant pb-4">
            <span className="font-heading text-sm leading-4 font-black text-on-tertiary-container">01</span>
            <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              {t("Account")}
            </h2>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field label={t("Name")} name="nama" defaultValue={me?.nama} />
            <Field label={t("Phone")} name="nomor_telepon" defaultValue={me?.nomor_telepon} />
            <div className="sm:col-span-2">
              <Field label={t("Email")} name="email" type="email" defaultValue={me?.email} />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading || update.isPending}
            className="mt-6 w-full border border-primary bg-primary px-4 py-3 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:pointer-events-none disabled:opacity-50"
          >
            {update.isPending ? t("Saving…") : t("Save Changes")}
          </button>
        </form>

        <div className="border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-6 flex items-baseline gap-3 border-b border-outline-variant pb-4">
            <span className="font-heading text-sm leading-4 font-black text-on-tertiary-container">02</span>
            <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
              {t("Account Info")}
            </h2>
          </div>
          <dl className="flex flex-col gap-4">
            {[
              { label: t("Role"), value: me?.peran ?? "-" },
              { label: t("Status"), value: me?.status_akun ?? "-" },
              { label: t("User ID"), value: me?.user_id ?? "-" },
            ].map((row) => (
              <div key={row.label} className="border border-outline-variant px-4 py-3">
                <dt className="text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                  {row.label}
                </dt>
                <dd className="mt-1 font-mono text-sm text-primary break-all">{row.value}</dd>
              </div>
            ))}
          </dl>
          {/* ponytail: ganti password tak ada — backend tak expose endpoint-nya */}
          <p className="mt-6 text-xs leading-5 text-muted-foreground">
            {t("Password changes are handled by account recovery.")}
          </p>
        </div>
      </div>
    </div>
  )
}