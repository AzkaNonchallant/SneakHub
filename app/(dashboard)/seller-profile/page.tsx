import { CheckCircle2, Star } from "lucide-react";

const seller = {
  initial: "S",
  name: "SneakerVault ID",
  description: "Spesialis sneaker original & premium. Berpengalaman sejak 2020.",
  badges: ["Seller Terverifikasi", "Top Seller"],
  stats: [
    { label: "TOTAL PESANAN", value: "312" },
    { label: "PENYELESAIAN", value: "98%" },
    { label: "TINGKAT RESPONS", value: "96%" },
    { label: "RATING", value: "4.8", suffix: "★" },
    { label: "PEMBATALAN", value: "2%" },
  ],
  trustScore: 94,
  trustLabel: "Seller Terpercaya",
  trustSubtext: "Teratas 5% dari seluruh seller",
  reviewCount: 312,
  reviewRating: 4.8,
};

const products = [
  { name: "Air Force 1 Low ...", price: "Rp1.200.000", image: "/products/af1.jpg" },
  { name: "Air Max 90 Black", price: "Rp950.000", image: "/products/am90.jpg" },
  { name: "Forum Low Blac...", price: "Rp850.000", image: "/products/forum.jpg" },
  { name: "Dunk Low Panda", price: "Rp1.650.000", image: "/products/dunk.jpg" },
];

const totalProducts = 24;

export default function ProfilePage() {
  return (
    <div className="mx-auto w-full max-w-[1280px] bg-background px-4 py-8 sm:px-8 sm:py-10 md:px-12">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="text-xs font-bold tracking-[0.05em] text-muted-foreground uppercase">
            Seller Center
          </div>
          <h1 className="font-heading text-4xl font-black tracking-tighter text-primary uppercase">
            Profil Toko
          </h1>
        </div>
        <button
          type="button"
          className="h-auto border border-primary bg-primary px-6 py-2.5 text-xs leading-4 font-bold tracking-widest text-white uppercase transition-colors hover:bg-white hover:text-primary"
        >
          Edit Profil
        </button>
      </div>

      {/* Kartu profil utama */}
      <section className="mb-6 border border-outline-variant bg-surface-container-low p-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center bg-primary font-heading text-3xl leading-none font-bold text-white">
              {seller.initial}
            </div>
            <div>
              <h2 className="font-heading text-2xl leading-7 font-semibold text-primary uppercase">
                {seller.name}
              </h2>
              <p className="mt-1 max-w-md text-base leading-6 text-muted-foreground">
                {seller.description}
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                {seller.badges.map((badge) => (
                  <span
                    key={badge}
                    className={
                      badge === "Top Seller"
                        ? "border border-primary bg-primary px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-white uppercase"
                        : "border border-[#10B981] bg-[#10B981]/10 px-3 py-1 text-xs leading-4 font-bold tracking-[0.05em] text-[#10B981] uppercase"
                    }
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {seller.stats.map((stat) => (
            <div key={stat.label} className="border border-outline-variant py-4 text-center">
              <div className="font-heading text-2xl leading-7 font-black text-primary">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1 text-lg font-bold text-tertiary">{stat.suffix}</span>
                ) : null}
              </div>
              <div className="mt-1 text-[10px] leading-4 font-bold tracking-widest text-muted-foreground uppercase">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust score + Produk aktif */}
      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Seller Trust Score */}
        <div className="border border-outline-variant bg-surface-container-low p-6">
          <h3 className="mb-4 font-heading text-lg font-bold text-primary">
            Seller Trust Score
          </h3>
          <div className="flex flex-wrap items-center gap-6">
            <TrustGauge score={seller.trustScore} />
            <div>
              <div className="font-heading text-3xl leading-9 font-black text-primary">
                {seller.trustScore}/100
              </div>
              <div className="mt-1 flex items-center gap-1.5 text-base font-bold text-[#10B981]">
                <CheckCircle2 className="size-4" /> {seller.trustLabel}
              </div>
              <div className="mt-1 text-sm leading-5 text-muted-foreground">
                {seller.trustSubtext}
              </div>
            </div>
          </div>
        </div>

        {/* Produk Aktif */}
        <div className="border border-outline-variant bg-surface-container-low p-6">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="font-heading text-lg font-bold text-primary">
              Produk Aktif ({totalProducts})
            </h3>
            <a
              href="#"
              className="text-xs leading-4 font-bold tracking-[0.05em] text-muted-foreground uppercase transition-colors hover:text-on-tertiary-container"
            >
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 border border-outline-variant bg-surface-container" />
                <div className="min-w-0">
                  <div className="truncate text-sm leading-5 font-medium text-primary">
                    {p.name}
                  </div>
                  <div className="font-heading text-sm leading-5 font-bold text-primary">
                    {p.price}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ulasan Pelanggan */}
      <section className="flex flex-wrap items-center justify-between gap-4 border border-outline-variant bg-surface-container-low p-6">
        <h3 className="font-heading text-lg font-bold text-primary">Ulasan Pelanggan</h3>
        <div className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground">
          <Star className="size-4 fill-tertiary text-tertiary" />
          <span className="font-heading font-black text-primary">{seller.reviewRating}</span>
          <span>({seller.reviewCount} ulasan)</span>
        </div>
      </section>
    </div>
  );
}

// Lingkaran progress trust score, dibuat dengan SVG (tidak butuh library tambahan)
function TrustGauge({ score }: { score: number }) {
  const size = 88;
  const stroke = 8;
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  return (
    <div className="relative shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-outline-variant"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          className="stroke-[#10B981]"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center font-heading text-xl leading-7 font-black text-primary">
        {score}
      </div>
    </div>
  );
}
