"use client"

import Link from "next/link"
import { ArrowRight, Mail } from "lucide-react"

import { AuthShell, GoogleIcon, PasswordField, TextField } from "@/components/auth-shell"
import { Button } from "@/components/ui/button"

export default function RegisterPage() {
  return (
    <AuthShell>
      {/* ponytail: static form, no backend yet — validation when there's an API */}
      <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
        <div className="space-y-4">
          <TextField
            id="email"
            name="email"
            label="Email"
            placeholder="Enter email address"
            icon={Mail}
          />
          <PasswordField id="password" name="password" />
          <PasswordField id="confirmPassword" name="confirmPassword" label="Confirm Password" />
        </div>
        <div className="space-y-4 border-t border-border pt-6">
          <Button
            type="button"
            variant="outline"
            className="h-12 w-full rounded-none border-primary bg-surface-container font-heading text-2xl font-semibold text-foreground uppercase hover:bg-surface-variant hover:text-foreground"
          >
            <GoogleIcon className="size-5" />
            Sign Up with Google
          </Button>
        </div>
        <Button
          type="submit"
          className="h-12 w-full rounded-none border border-primary bg-primary font-heading text-2xl font-semibold text-primary-foreground uppercase hover:bg-background hover:text-primary"
        >
          Create Account
          <ArrowRight className="size-5 transition-transform group-hover/button:translate-x-1" />
        </Button>
      </form>
      <div className="mt-8 border-t border-primary pt-6 text-center">
        <p className="text-xs font-medium tracking-wider text-muted-foreground uppercase">
          Already have an account?
        </p>
        <Link
          href="/login"
          className="mt-2 inline-block border-b-2 border-primary pb-1 font-heading text-xs font-bold tracking-widest text-primary uppercase hover:border-ring hover:text-ring"
        >
          Sign In
        </Link>
      </div>
    </AuthShell>
  )
}
