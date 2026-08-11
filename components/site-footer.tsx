import { cn } from "@/lib/utils"

export function SiteFooter({ variant = "light" }: { variant?: "light" | "dark" }) {
  const dark = variant === "dark"
  return (
    <footer
      className={cn(
        "w-full border-t border-primary px-5 py-12 md:px-10",
        dark ? "bg-primary text-white" : "bg-surface-container-highest",
      )}
    >
      <div className="mx-auto flex max-w-[1280px] flex-col items-center justify-between gap-8 md:flex-row">
        <div
          className={cn(
            "font-heading text-2xl leading-7 font-black uppercase",
            dark ? "text-white" : "text-primary",
          )}
        >
          SNEAKHUB
        </div>
        <nav className="flex flex-wrap justify-center gap-6">
          {["Terms of Service", "Privacy Policy", "Authentication Process", "Contact Support"].map(
            (label) => (
              <a
                key={label}
                href="#"
                className={cn(
                  "text-sm font-medium transition-colors",
                  dark ? "text-white/80 hover:text-white" : "text-muted-foreground hover:text-on-tertiary-container",
                )}
              >
                {label}
              </a>
            ),
          )}
        </nav>
        <div className={cn("text-sm", dark ? "text-white/80" : "text-primary")}>
          © 2024 SNEAKHUB. TECHNICAL PRECISION IN RESALE.
        </div>
      </div>
    </footer>
  )
}