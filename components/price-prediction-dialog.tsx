"use client"

import { useState } from "react"
import { BrainCircuit } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { DEFAULT_BRAND_ID, errMessage, formatRp, type PricePrediction } from "@/lib/api"
import { useCategories, usePricePrediction } from "@/lib/hooks"
import { useT } from "@/lib/i18n"

export function PricePredictionButton() {
  const t = useT()
  const [open, setOpen] = useState(false)
  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="h-auto gap-2 rounded-none border border-on-tertiary-container bg-on-tertiary-container px-5 py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-on-tertiary-container"
      >
        <BrainCircuit className="size-4" />
        {t("Calculate Price Prediction")}
      </Button>
      {open ? <PricePredictionDialog onClose={() => setOpen(false)} /> : null}
    </>
  )
}

function PricePredictionDialog({ onClose }: { onClose: () => void }) {
  const t = useT()
  const { data: categories } = useCategories()
  const predict = usePricePrediction()
  const [form, setForm] = useState({
    kondisi: "USED",
    condition_score: 85,
    ukuran: "42",
    model: "",
    tahun_rilis: 2021,
    category_id: "",
  })
  const [result, setResult] = useState<PricePrediction | null>(null)

  const submit = async () => {
    try {
      const r = await predict.mutateAsync({
        brand_id: DEFAULT_BRAND_ID,
        category_id: form.category_id || undefined,
        kondisi: form.kondisi,
        condition_score: form.condition_score,
        ukuran: form.ukuran,
        model: form.model || undefined,
        tahun_rilis: form.tahun_rilis,
      })
      setResult(r)
    } catch (err) {
      toast.error(errMessage(err))
    }
  }

  const set = (k: keyof typeof form, v: string | number) => setForm((f) => ({ ...f, [k]: v }))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4" role="dialog" aria-modal>
      <div className="flex max-h-[90vh] w-full max-w-md flex-col border border-primary bg-surface-container-lowest p-6 shadow-[4px_4px_0px_0px_#000]">
        <div className="mb-4 flex items-center justify-between border-b border-outline-variant pb-4">
          <h3 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
            {t("Price Prediction")}
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer text-xs font-bold tracking-widest text-muted-foreground uppercase hover:text-primary"
          >
            {t("Close")}
          </button>
        </div>

        <div className="flex flex-col gap-4 overflow-y-auto">
          <label className="flex flex-col gap-1">
            <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">{t("Condition")}</span>
            <select
              value={form.kondisi}
              onChange={(e) => set("kondisi", e.target.value)}
              className="border border-outline-variant bg-transparent p-2 focus:border-on-tertiary-container focus:ring-0"
            >
              {["NEW", "USED", "REFURBISHED"].map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="flex flex-col gap-1">
            <span className="flex items-center justify-between text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">
              {t("Condition Score")}
              <span className="font-heading text-base font-bold text-on-tertiary-container">
                {form.condition_score}
              </span>            </span>
            <input
              type="range"
              min={0}
              max={100}
              value={form.condition_score}
              onChange={(e) => set("condition_score", Number(e.target.value))}
              className="w-full accent-black"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">{t("Size")}</span>
            <input
              type="text"
              value={form.ukuran}
              onChange={(e) => set("ukuran", e.target.value)}
              className="border border-outline-variant bg-transparent p-2 focus:border-on-tertiary-container focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">{t("Model")}</span>
            <input
              type="text"
              value={form.model}
              onChange={(e) => set("model", e.target.value)}
              placeholder={t("e.g. Air Jordan 1 High")}
              className="border border-outline-variant bg-transparent p-2 focus:border-on-tertiary-container focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">{t("Release Year")}</span>
            <input
              type="number"
              min={1900}
              value={form.tahun_rilis}
              onChange={(e) => set("tahun_rilis", Number(e.target.value))}
              className="border border-outline-variant bg-transparent p-2 focus:border-on-tertiary-container focus:ring-0"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-xs leading-4 font-bold tracking-[0.05em] text-primary uppercase">{t("Category")}</span>
            <select
              value={form.category_id}
              onChange={(e) => set("category_id", e.target.value)}
              className="border border-outline-variant bg-transparent p-2 focus:border-on-tertiary-container focus:ring-0"
            >
              <option value="">{t("— Select —")}</option>
              {(categories ?? []).map((c) => (
                <option key={c.cateogry_id} value={c.cateogry_id}>
                  {c.nama_kategori}
                </option>
              ))}
            </select>
          </label>

          {result ? (
            <div className="flex flex-col gap-3 border border-on-tertiary-container bg-on-tertiary-container/5 p-4">
              <div className="flex items-center justify-between border-b border-on-tertiary-container/20 pb-2">
                <span className="text-xs leading-4 font-bold tracking-[0.05em] text-on-tertiary-container uppercase">
                  {t("Recommended Price")}
                </span>
                <span className="font-heading text-2xl leading-7 font-bold text-on-tertiary-container">
                  {formatRp(result.recommended_price)}
                </span>
              </div>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div className="border border-outline-variant bg-white p-2">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{t("Market Min")}</div>
                  <div className="font-heading font-bold text-primary">{formatRp(result.estimated_market_price_min)}</div>
                </div>
                <div className="border border-outline-variant bg-white p-2">
                  <div className="text-[10px] font-bold tracking-widest text-muted-foreground uppercase">{t("Market Max")}</div>
                  <div className="font-heading font-bold text-primary">{formatRp(result.estimated_market_price_max)}</div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase">
                  {t("Confidence")}
                </span>
                <div className="flex flex-1 items-center gap-2 pl-4">
                  <div className="h-1.5 flex-1 bg-surface-container">
                    <div
                      className="h-1.5 bg-on-tertiary-container"
                      style={{ width: `${Math.round(result.confidence * 100)}%` }}
                    />
                  </div>
                  <span className="font-heading text-sm font-bold text-on-tertiary-container">
                    {Math.round(result.confidence * 100)}%
                  </span>
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <Button
          type="button"
          disabled={predict.isPending}
          onClick={submit}
          className="mt-6 h-auto rounded-none border border-primary bg-primary py-3 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary disabled:opacity-40"
        >
          {predict.isPending ? t("Calculating…") : t("Run Prediction")}
        </Button>
      </div>
    </div>
  )
}