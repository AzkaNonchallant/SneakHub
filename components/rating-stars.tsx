import { Star } from "lucide-react"

export function RatingStars({ value, total }: { value?: number; total?: number }) {
  if (!value || value <= 0) return null
  const filled = Math.round(value)
  return (
    <span className="inline-flex items-center gap-1 text-xs leading-4 font-bold text-muted-foreground">
      <span className="flex gap-0.5" aria-label={`${value} dari 5 bintang`}>
        {[1, 2, 3, 4, 5].map((n) => (
          <Star
            key={n}
            className={`size-3 ${n <= filled ? "text-amber-500" : "text-outline-variant"}`}
            fill="currentColor"
            aria-hidden
          />
        ))}
      </span>
      <span className="font-mono">
        {value.toFixed(1)}
        {typeof total === "number" ? ` (${total})` : ""}
      </span>
    </span>
  )
}
