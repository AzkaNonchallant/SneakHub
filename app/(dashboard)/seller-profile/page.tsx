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
    <div className="min-h-screen bg-neutral-50 px-8 py-10">
      <h1 className="mb-6 text-3xl font-extrabold tracking-tight text-neutral-900">
        PROFIL TOKO
      </h1>

      {/* Kartu profil utama */}
      <section className="mb-6 rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <div className="flex items-start justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-neutral-900 text-2xl font-bold text-white">
              {seller.initial}
            </div>
            <div>
              <h2 className="text-xl font-bold text-neutral-900">{seller.name}</h2>
              <p className="mt-1 max-w-md text-sm text-neutral-500">
                {seller.description}
              </p>
              <div className="mt-3 flex gap-2">
                {seller.badges.map((badge) => (
                  <span
                    key={badge}
                    className={
                      badge === "Top Seller"
                        ? "rounded-full border border-orange-200 bg-orange-50 px-3 py-1 text-xs font-medium text-orange-600"
                        : "rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-medium text-green-600"
                    }
                  >
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <button className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-semibold text-neutral-800 hover:bg-neutral-50">
            EDIT PROFIL
          </button>
        </div>

        {/* Statistik */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
          {seller.stats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-neutral-200 py-4 text-center"
            >
              <div className="text-xl font-extrabold text-neutral-900">
                {stat.value}
                {stat.suffix ? (
                  <span className="ml-1 text-base text-yellow-500">{stat.suffix}</span>
                ) : null}
              </div>
              <div className="mt-1 text-[11px] font-medium tracking-wide text-neutral-400">
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust score + Produk aktif */}
      <section className="mb-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Seller Trust Score */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-neutral-900">Seller Trust Score</h3>
          <div className="flex items-center gap-6">
            <TrustGauge score={seller.trustScore} />
            <div>
              <div className="text-2xl font-extrabold text-neutral-900">
                {seller.trustScore}/100
              </div>
              <div className="mt-1 text-sm font-semibold text-green-600">
                {seller.trustLabel}
              </div>
              <div className="mt-1 text-sm text-neutral-400">{seller.trustSubtext}</div>
            </div>
          </div>
        </div>

        {/* Produk Aktif */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-bold text-neutral-900">
              Produk Aktif ({totalProducts})
            </h3>
            <a href="#" className="text-sm text-neutral-500 hover:underline">
              View All
            </a>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {products.map((p) => (
              <div key={p.name} className="flex items-center gap-3">
                <div className="h-14 w-14 shrink-0 rounded-lg bg-neutral-100" />
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-neutral-900">
                    {p.name}
                  </div>
                  <div className="text-sm font-semibold text-orange-600">{p.price}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ulasan Pelanggan */}
      <section className="flex items-center justify-between rounded-2xl border border-neutral-200 bg-white p-6 shadow-sm">
        <h3 className="text-base font-bold text-neutral-900">Ulasan Pelanggan</h3>
        <div className="flex items-center gap-1 text-sm">
          <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
          <span className="font-bold text-neutral-900">{seller.reviewRating}</span>
          <span className="text-neutral-400">({seller.reviewCount} ulasan)</span>
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
          stroke="#e5e7eb"
          strokeWidth={stroke}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#16a34a"
          strokeWidth={stroke}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-xl font-extrabold text-neutral-900">
        {score}
      </div>
    </div>
  );
}