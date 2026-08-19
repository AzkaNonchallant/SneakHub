import { SkeletonBlock } from "@/components/skeleton"


export function BrandLoading() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-background p-8">
      <div className="border border-primary bg-surface-container-lowest px-8 py-6 shadow-[4px_4px_0px_0px_#000]">
        <div className="font-heading text-3xl leading-8 font-black tracking-tighter text-primary uppercase">
          SNEAKHUB
        </div>
        <div className="mt-1 text-center text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
          AUTHENTIC MARKETPLACE
        </div>
      </div>
      <div className="flex w-full max-w-64 flex-col gap-2">
        <SkeletonBlock className="h-2.5 w-full" />
        <SkeletonBlock className="h-2.5 w-3/4" />
        <SkeletonBlock className="h-2.5 w-1/2" />
      </div>
    </div>
  )
}
