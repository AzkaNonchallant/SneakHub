"use client";

import {
  User,
  Store,
  Footprints,
  ClipboardCheck,
  CircleDollarSign,
  TriangleAlert,
  ArrowUp,
  ArrowDown,
  HelpCircle,
} from "lucide-react";

interface StatCard {
  icon: React.ElementType;
  iconColor: string;
  value: string;
  label: string;
  delta: string;
  deltaUp: boolean;
}

const STATS: StatCard[] = [
  {
    icon: User,
    iconColor: "text-blue-500",
    value: "12,847",
    label: "Total Pengguna",
    delta: "+234 bulan ini",
    deltaUp: true,
  },
  {
    icon: Store,
    iconColor: "text-gray-700",
    value: "1,203",
    label: "Total Seller",
    delta: "+45 bulan ini",
    deltaUp: true,
  },
  {
    icon: Footprints,
    iconColor: "text-blue-500",
    value: "48,921",
    label: "Total Produk",
    delta: "+1,204 bulan ini",
    deltaUp: true,
  },
  {
    icon: ClipboardCheck,
    iconColor: "text-gray-700",
    value: "28,341",
    label: "Total Pesanan",
    delta: "+892 bulan ini",
    deltaUp: true,
  },
  {
    icon: CircleDollarSign,
    iconColor: "text-amber-500",
    value: "Rp4.2M",
    label: "Revenue",
    delta: "+12% vs bulan lalu",
    deltaUp: true,
  },
  {
    icon: TriangleAlert,
    iconColor: "text-red-500",
    value: "23",
    label: "Laporan Aktif",
    delta: "-5 dari kemarin",
    deltaUp: false,
  },
];

interface Order {
  id: string;
  buyer: string;
  product: string;
  price: string;
}

const ORDERS: Order[] = [
  {
    id: "ORD-2024-001",
    buyer: "Budi Santoso",
    product: "Nike Air Force 1 Low",
    price: "Rp1.200.000",
  },
  {
    id: "ORD-2024-002",
    buyer: "Rina Wulandari",
    product: "Adidas Forum Low",
    price: "Rp850.000",
  },
  {
    id: "ORD-2024-003",
    buyer: "Hendra Kusuma",
    product: "Nike Dunk Low Panda",
    price: "Rp1.650.000",
  },
];

interface ReportItem {
  tags: { label: string; className: string }[];
  title: string;
  desc: string;
}

const REPORTS: ReportItem[] = [
  {
    tags: [
      { label: "PRODUK", className: "bg-red-100 text-red-600" },
      { label: "PENDING", className: "bg-amber-100 text-amber-600" },
    ],
    title: 'Nike Air Force 1 "Replika"',
    desc: "Produk palsu",
  },
  {
    tags: [
      { label: "SELLER", className: "bg-blue-100 text-blue-600" },
      { label: "DIPROSES", className: "bg-purple-100 text-purple-600" },
    ],
    title: "FakeKicks.id",
    desc: "Penjual tidak jujur",
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="relative min-h-screen bg-[#f4f4f2] px-8 py-8">
      <h1 className="mb-6 text-[28px] font-extrabold tracking-tight text-[#1a1a1a]">
        Admin Dashboard
      </h1>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-3 gap-5">
        {STATS.map((stat) => {
          const Icon = stat.icon;
          const DeltaIcon = stat.deltaUp ? ArrowUp : ArrowDown;
          return (
            <div
              key={stat.label}
              className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
            >
              <div className="mb-4 flex items-center justify-between">
                <Icon className={`h-5 w-5 ${stat.iconColor}`} strokeWidth={2} />
                <DeltaIcon
                  className={`h-4 w-4 ${
                    stat.deltaUp ? "text-green-500" : "text-red-500"
                  }`}
                />
              </div>
              <div className="text-[26px] font-extrabold leading-tight text-[#1a1a1a]">
                {stat.value}
              </div>
              <div className="mt-1 text-[13.5px] text-gray-500">
                {stat.label}
              </div>
              <div
                className={`mt-2 text-[12.5px] font-medium ${
                  stat.deltaUp ? "text-green-600" : "text-red-500"
                }`}
              >
                {stat.delta}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom two columns */}
      <div className="grid grid-cols-2 gap-5">
        {/* Pesanan Terbaru */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">
            Pesanan Terbaru
          </h2>
          <div className="flex flex-col">
            {ORDERS.map((order, idx) => (
              <div
                key={order.id}
                className={`flex items-center justify-between py-3.5 ${
                  idx !== ORDERS.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div>
                  <div className="text-[11px] text-gray-400">{order.id}</div>
                  <div className="mt-0.5 text-[13.5px] font-semibold text-[#1a1a1a]">
                    {order.buyer} · {order.product}
                  </div>
                </div>
                <div className="text-[14px] font-bold text-[#1a1a1a]">
                  {order.price}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Laporan Terbaru */}
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="mb-4 text-[16px] font-bold text-[#1a1a1a]">
            Laporan Terbaru
          </h2>
          <div className="flex flex-col">
            {REPORTS.map((report, idx) => (
              <div
                key={report.title}
                className={`flex items-center justify-between py-3.5 ${
                  idx !== REPORTS.length - 1 ? "border-b border-gray-100" : ""
                }`}
              >
                <div>
                  <div className="mb-1.5 flex gap-1.5">
                    {report.tags.map((tag) => (
                      <span
                        key={tag.label}
                        className={`rounded px-2 py-0.5 text-[10px] font-semibold tracking-wide ${tag.className}`}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>
                  <div className="text-[13.5px] font-semibold text-[#1a1a1a]">
                    {report.title}
                  </div>
                  <div className="text-[12px] text-gray-400">
                    {report.desc}
                  </div>
                </div>
                <button className="rounded-md bg-[#1a1a1a] px-4 py-2 text-[11.5px] font-semibold tracking-wide text-white hover:bg-black">
                  REVIEW
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Floating help button */}
      <button className="fixed bottom-6 right-8 flex h-11 w-11 items-center justify-center rounded-full bg-[#1a1a1a] text-white shadow-lg hover:bg-black">
        <HelpCircle className="h-5 w-5" />
      </button>
    </div>
  );
}