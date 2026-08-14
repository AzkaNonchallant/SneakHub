"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { AlertCircle, ArrowRight, Mail } from "lucide-react"

import { AuthShell, PasswordField, TextField } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"
import { errMessage, setToken } from "@/lib/api"
import { useLogin } from "@/lib/hooks"

export default function LoginPage() {
  const router = useRouter()
  const login = useLogin()
  const [error, setError] = useState("")

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    if (!fd.get("email") || !fd.get("password")) {
      setError("Email dan password wajib diisi.")
      return
    }
    try {
      const data = await login.mutateAsync({
        email: String(fd.get("email")),
        password: String(fd.get("password")),
      })
      setToken(data.access_token)
      router.push("/home")
    } catch (err) {
      setError(errMessage(err))
    }
  }

  return (
    <AuthShell>
      <form className="space-y-6" onSubmit={onSubmit}>
        <div className="space-y-4">
          <TextField
            id="email"
            name="email"
            type="email"
            label="Email"
            placeholder="Enter email address"
            icon={Mail}
          />
          <PasswordField id="password" name="password" forgot />
        </div>
        {error ? (
          <p className="flex items-center gap-2 bg-error/10 px-3 py-2 text-xs font-bold text-error">
            <AlertCircle className="size-4 shrink-0" /> {error}
          </p>
        ) : null}
        <Button
          type="submit"
          disabled={login.isPending}
          className="h-12 w-full rounded-none border border-primary bg-primary font-heading text-2xl font-semibold text-primary-foreground uppercase hover:bg-background hover:text-primary"
        >
          {login.isPending ? "Logging in..." : "Execute Login"}
          <ArrowRight className="size-5 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </form>
      <div className="mt-8 border-t border-primary pt-6 text-center">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          No account yet?
        </p>
        <Link
          href="/register"
          className="mt-2 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
        >
          Sign Up
        </Link>
      </div>
    </AuthShell>
  )
}