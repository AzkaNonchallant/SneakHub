import type { Metadata } from "next";


export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const base = process.env.API_BASE_URL ?? "http://localhost:3000";
  try {
    const res = await fetch(`${base}/api/products/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "Product — SNEAKHUB" };
    const json = (await res.json()) as {
      data?: { nama_produk?: string; brand?: string; harga?: number };
    };
    const p = json.data;
    return {
      title: p?.nama_produk ? `${p.nama_produk} — SNEAKHUB` : "Product — SNEAKHUB",
      description: p?.brand ? `${p.brand} • ${p.nama_produk ?? "Sneaker"} di pasar resale` : undefined,
    };
  } catch {
    return { title: "Product — SNEAKHUB" };
  }
}

export default function ProductLayout({ children }: { children: React.ReactNode }) {
  return children;
}