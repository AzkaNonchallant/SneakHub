"use client"

import { useRef, useState, type ReactNode } from "react"
import { Eye, EyeOff, Lock, type LucideIcon } from "lucide-react"
import { motion } from "motion/react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useT } from "@/lib/i18n"

export function AuthShell({ children }: { children: ReactNode }) {
  const t = useT()
  return (
    <>
      <main className="bg-grid-pattern relative flex flex-1 items-center justify-center overflow-hidden px-4 py-16 md:px-10">
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 right-0 h-full w-1/2 opacity-10"
        >
          <svg
            className="h-full w-full fill-primary"
            preserveAspectRatio="none"
            viewBox="0 0 100 100"
          >
            <polygon points="100,0 100,100 0,100" />
          </svg>
        </div>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className="relative w-full max-w-md border border-primary bg-card p-8 shadow-[8px_8px_0px_0px_#000] md:p-10"
        >
          <div className="mb-10 text-center">
            <h1 className="font-heading text-[32px] leading-9 font-bold tracking-tighter text-primary uppercase md:text-[72px] md:leading-[72px]">
              SNEAKHUB
            </h1>
            <p className="mt-3 border-b border-primary pb-4 text-xs font-medium tracking-widest text-muted-foreground uppercase">
              {t("Precision Resale Authentication")}
            </p>
          </div>
          {children}
          <div aria-hidden className="absolute top-0 left-0 size-2 bg-primary" />
          <div
            aria-hidden
            className="absolute right-0 bottom-0 h-4 w-4 border-r-2 border-b-2 border-primary"
          />
        </motion.div>
      </main>
    </>
  )
}

export function TextField({
  id,
  name,
  type = "text",
  label,
  placeholder,
  icon: Icon,
}: {
  id: string
  name: string
  type?: string
  label?: string
  placeholder: string
  icon: LucideIcon
}) {
  const t = useT()
  return (
    <div>
      {label ? (
        <Label
          htmlFor={id}
          className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase"
        >
          {t(label)}
        </Label>
      ) : null}
      <div className="relative">
        <Icon
          aria-hidden
          className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          id={id}
          name={name}
          type={type}
          placeholder={t(placeholder)}
          className="h-11 rounded-none border-primary bg-surface-bright pl-10 placeholder:text-outline focus-visible:border-b-2"
        />
      </div>
    </div>
  )
}

export function PasswordField({
  id,
  name,
  label = "Password",
  placeholder = "••••••••",
}: {
  id: string
  name: string
  label?: string
  placeholder?: string
}) {
  const [show, setShow] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const t = useT()
  const toggleShow = () => {
    setShow((s) => {
      const el = inputRef.current

      if (el) el.style.setProperty("-webkit-text-security", s ? "disc" : "none")
      return !s
    })
  }
  return (
    <div>
      <Label
        htmlFor={id}
        className="mb-1 block text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase"
      >
        {t(label)}
      </Label>
      <div className="relative">
        <Lock
          aria-hidden
          className="absolute top-1/2 left-3 size-5 -translate-y-1/2 text-muted-foreground"
        />
        <Input
          ref={inputRef}
          id={id}
          name={name}
          type={show ? "text" : "password"}
          placeholder={placeholder}
          className="h-11 rounded-none border-primary bg-surface-bright pr-10 pl-10 placeholder:text-outline focus-visible:border-b-2"
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={toggleShow}
          aria-label={show ? "Hide password" : "Show password"}
          className="absolute top-1/2 right-1 size-9 -translate-y-1/2 rounded-none"
        >
          {show ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
        </Button>
      </div>
    </div>
  )
}

export function GoogleIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden>
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  )
}
