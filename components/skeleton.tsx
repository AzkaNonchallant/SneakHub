import { cn } from "@/lib/utils"


export function SkeletonBlock({ className }: { className?: string }) {
  return (
    <div
      aria-hidden
      className={cn(
        "animate-pulse rounded-none bg-surface-container-high",
        className,
      )}
    />
  )
}

export function ProductCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("flex flex-col border border-primary bg-surface-container-lowest", className)}>
      <SkeletonBlock className="aspect-square w-full" />
      <div className="flex grow flex-col gap-2 p-4">
        <SkeletonBlock className="h-3 w-2/3" />
        <SkeletonBlock className="h-3 w-1/2" />
        <SkeletonBlock className="mt-auto h-5 w-1/3" />
      </div>
    </div>
  )
}

export function ListRowSkeleton({ bars = 2 }: { bars?: number }) {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-outline-variant py-4">
      <div className="flex-1 space-y-2">
        {Array.from({ length: bars }).map((_, i) => (
          <SkeletonBlock key={i} className={i === 0 ? "h-3 w-2/3" : "h-3 w-1/3"} />
        ))}
      </div>
      <SkeletonBlock className="h-8 w-16 shrink-0" />
    </div>
  )
}

export function StatCardSkeleton({ className }: { className?: string }) {
  return (
    <div className={cn("border border-outline-variant bg-surface-container-lowest p-5 sm:p-6", className)}>
      <SkeletonBlock className="size-11" />
      <SkeletonBlock className="mt-5 h-7 w-24" />
      <SkeletonBlock className="mt-2 h-3 w-16" />
    </div>
  )
}

export function ProductDetailSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1280px] px-4 py-8 sm:px-8 md:px-10">
      <div className="mb-6 flex items-center justify-between">
        <SkeletonBlock className="h-4 w-24" />
        <SkeletonBlock className="h-4 w-20" />
      </div>
      <div className="grid grid-cols-1 gap-5 lg:grid-cols-12">
        <div className="flex flex-col gap-4 lg:col-span-7">
          <SkeletonBlock className="aspect-square w-full" />
          <div className="flex gap-2">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonBlock key={i} className="aspect-square w-16" />
            ))}
          </div>
        </div>
        <div className="flex flex-col gap-6 lg:col-span-5">
          <SkeletonBlock className="h-8 w-3/4" />
          <SkeletonBlock className="h-3 w-1/2" />
          <SkeletonBlock className="h-10 w-2/3" />
          <SkeletonBlock className="h-12 w-full" />
          <SkeletonBlock className="h-3 w-full" />
          <SkeletonBlock className="h-3 w-5/6" />
        </div>
      </div>
    </div>
  )
}
