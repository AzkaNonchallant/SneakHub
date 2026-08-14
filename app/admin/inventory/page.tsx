"use client";

import { useState } from "react";
import {
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Pencil,
  Trash2,
  Square,
} from "lucide-react";

type StockStatus = "in" | "low" | "out";

interface InventoryItem {
  sku: string;
  name: string;
  image: string;
  seller: string;
  category: string;
  condition: string;
  stock: number;
  status: StockStatus;
  price: string;
}

const ITEMS: InventoryItem[] = [
  {
    sku: "#8842",
    name: 'AJ1 High OG "Chicago"',
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&q=70",
    seller: "KICKSVAULT_99",
    category: "HYPE",
    condition: "NEW",
    stock: 12,
    status: "in",
    price: "9.500.000",
  },
  {
    sku: "#8843",
    name: "Yeezy Boost 350 V2",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&q=70",
    seller: "HYPETRADER_X",
    category: "RARE",
    condition: "USED",
    stock: 2,
    status: "low",
    price: "4.200.000",
  },
  {
    sku: "#8844",
    name: "Dunk Low Pro SB",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=70",
    seller: "SOLESEARCH_NY",
    category: "DAILY",
    condition: "REFURBISHED",
    stock: 0,
    status: "out",
    price: "3.150.000",
  },
];

const STOCK_DOT: Record<StockStatus, string> = {
  in: "bg-emerald-500",
  low: "bg-amber-400",
  out: "bg-red-500",
};

function FilterSelect({ label }: { label: string }) {
  return (
    <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-[13px] font-medium text-gray-600 hover:bg-gray-50">
      {label}
      <ChevronDown className="h-3.5 w-3.5 text-gray-400" />
    </button>
  );
}

export default function InventoryPage() {
  const [page, setPage] = useState(1);

  return (
    <div className="min-h-screen bg-[#f4f4f2] px-10 py-10">
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-[38px] font-extrabold uppercase leading-[1.05] tracking-tight text-[#1a1a1a]">
            Inventory
            <br />
            Ledger
          </h1>
          <p className="mt-2 text-[13.5px] text-gray-500">
            Real-time tracking of marketplace assets and stock levels.
          </p>
        </div>

        <div className="flex flex-col items-end gap-3">
          <div className="flex gap-2.5">
            <FilterSelect label="Brand: All" />
            <FilterSelect label="Condition: All" />
            <FilterSelect label="Status: All" />
          </div>
          <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-5 py-2.5 text-[12.5px] font-semibold tracking-wide text-gray-700 hover:bg-gray-50">
            <Filter className="h-3.5 w-3.5" />
            APPLY
          </button>
        </div>
      </div>

      {/* Table card */}
      <div className="overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        {/* Table header */}
        <div className="grid grid-cols-[90px_1.6fr_1fr_0.8fr_0.9fr_0.9fr_1fr_0.7fr] items-center border-b border-gray-200 bg-gray-50 px-6 py-3 text-[11px] font-semibold tracking-wide text-gray-500">
          <span>#SKU</span>
          <span>PRODUCT</span>
          <span>SELLER</span>
          <span>CATEGORY</span>
          <span>CONDITION</span>
          <span>STOCK LEVEL</span>
          <span>PRICE (RP)</span>
          <span className="text-right">ACTIONS</span>
        </div>

        {/* Rows */}
        <div>
          {ITEMS.map((item) => {
            const outOfStock = item.status === "out";
            return (
              <div
                key={item.sku}
                className="grid grid-cols-[90px_1.6fr_1fr_0.8fr_0.9fr_0.9fr_1fr_0.7fr] items-center border-b border-gray-100 px-6 py-4"
              >
                <span className="text-[13px] text-gray-500">{item.sku}</span>

                <div className="flex items-center gap-3">
                  <div className="h-12 w-16 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <span
                    className={`text-[13.5px] font-semibold ${
                      outOfStock
                        ? "text-gray-400 line-through"
                        : "text-[#1a1a1a]"
                    }`}
                  >
                    {item.name}
                  </span>
                </div>

                <span className="text-[13px] font-medium text-gray-600">
                  {item.seller}
                </span>

                <div>
                  <span className="inline-block rounded-md border border-gray-300 bg-white px-2.5 py-1 text-[11px] font-semibold tracking-wide text-gray-600">
                    {item.category}
                  </span>
                </div>

                <div>
                  <span
                    className={`inline-block rounded-md border px-2.5 py-1 text-[11px] font-semibold tracking-wide ${
                      outOfStock
                        ? "border-gray-200 bg-gray-50 text-gray-400"
                        : "border-gray-300 bg-white text-gray-600"
                    }`}
                  >
                    {item.condition}
                  </span>
                </div>

                <div className="flex items-center gap-1.5">
                  {outOfStock ? (
                    <div className="flex items-center gap-1.5">
                      <span className="text-[13px] font-bold text-red-500">
                        0
                      </span>
                      <Square className="h-2.5 w-2.5 fill-red-500 text-red-500" />
                      <span className="text-[10px] font-semibold leading-tight text-red-500">
                        OUT OF
                        <br />
                        STOCK
                      </span>
                    </div>
                  ) : (
                    <>
                      <span className="text-[13.5px] font-semibold text-[#1a1a1a]">
                        {item.stock}
                      </span>
                      <span
                        className={`h-2 w-2 rounded-full ${STOCK_DOT[item.status]}`}
                      />
                    </>
                  )}
                </div>

                <span
                  className={`text-[14.5px] font-bold ${
                    outOfStock ? "text-gray-400" : "text-[#1a1a1a]"
                  }`}
                >
                  {item.price}
                </span>

                <div className="flex items-center justify-end gap-2">
                  <button
                    title="Edit"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-50"
                  >
                    <Pencil className="h-3.5 w-3.5" />
                  </button>
                  <button
                    title="Delete"
                    className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-red-500 hover:border-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-[12.5px] text-gray-400">
            Showing 1-3 of 1,248 entries
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-medium ${
                  page === n
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <span className="px-1 text-[13px] text-gray-400">...</span>
            <button
              onClick={() => setPage(42)}
              className={`flex h-8 w-8 items-center justify-center rounded-md text-[13px] font-medium ${
                page === 42
                  ? "bg-[#1a1a1a] text-white"
                  : "border border-gray-300 text-gray-600 hover:bg-gray-50"
              }`}
            >
              42
            </button>
            <button
              onClick={() => setPage((p) => Math.min(42, p + 1))}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}