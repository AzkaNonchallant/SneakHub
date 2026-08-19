"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useQueryClient } from "@tanstack/react-query"
import { AlertCircle, ArrowRight, Mail, Phone, UserRound } from "lucide-react"

import { AuthShell, PasswordField, TextField } from "@/components/auth-shell"
import { PageMeta } from "@/components/page-meta"
import { Button } from "@/components/ui/button"
import { errMessage, setToken } from "@/lib/api"
import { useRegister } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export default function RegisterPage() {
  const router = useRouter()
  const t = useT()
  const register = useRegister()
  const qc = useQueryClient()
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    const password = String(fd.get("password"))
    if (password !== String(fd.get("confirmPassword"))) {
      setError(t("Password confirmation does not match."))
      return
    }
    try {
      const data = await register.mutateAsync({
        nama: String(fd.get("nama")),
        email: String(fd.get("email")),
        password,
        nomor_telepon: String(fd.get("nomor_telepon")),
      })
      setToken(data.access_token)

      qc.clear()
      router.push("/home")
    } catch (err) {
      setError(errMessage(err))
    }
  }

  return (
    <AuthShell>
      <PageMeta title="Register" />
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <TextField
            id="nama"
            name="nama"
            label="Nama"
            placeholder="Budi Santoso"
            icon={UserRound}
          />
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email address"
            icon={Mail}
          />
          <TextField
            id="nomor_telepon"
            name="nomor_telepon"
            type="tel"
            label="Nomor Telepon"
            placeholder="08123456789"
            icon={Phone}
          />
          <PasswordField id="password" name="password" />
          <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm Password" />
        </div>
        {error ? (
          <p className="flex items-center gap-2 bg-error/10 px-3 py-2 text-xs font-bold text-error">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={register.isPending}
          className="h-12 w-full rounded-none border border-primary bg-primary font-heading text-2xl font-semibold text-primary-foreground uppercase hover:bg-background hover:text-primary"
        >
          {register.isPending ? t("Creating...") : t("Create Account")}
          <ArrowRight className="size-5 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </form>
      <div className="mt-8 border-t border-primary pt-6 text-center">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          {t("Already have an account?")}
        </p>
        <Link
          href="/login"
          className="mt-2 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
        >
          {t("Sign In")}
        </Link>
      </div>
    </AuthShell>
  )
}