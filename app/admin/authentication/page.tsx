"use client";

import { use, useState } from "react";
import { ChevronLeft, ChevronRight, SlidersHorizontal, Check, X, Eye } from "lucide-react";

type Condition = "NEW" | "USED" | "REFURBISHED";

interface QueueItem {
  id: string;
  name: string;
  sku: string;
  image: string;
  condition: Condition;
  date: string;
  time: string;
  seller: string;
  flagged?: boolean;
}

const QUEUE_ITEMS: QueueItem[] = [
  {
    id: "#8842",
    name: 'AJ1 HIGH OG "CHICAGO"',
    sku: "555088-101",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&q=70",
    condition: "NEW",
    date: "Oct 24, 2023",
    time: "14:32:05 UTC",
    seller: "KICKSVAULT_99",
    flagged: true,
  },
  {
    id: "#8843",
    name: "YEEZY BOOST 350 V2",
    sku: "CP9652",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&q=70",
    condition: "USED",
    date: "Oct 24, 2023",
    time: "15:10:22 UTC",
    seller: "HYPETRADER_X",
  },
  {
    id: "#8844",
    name: "DUNK LOW PRO SB",
    sku: "304292-001",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=70",
    condition: "REFURBISHED",
    date: "Oct 24, 2023",
    time: "16:45:00 UTC",
    seller: "SOLESEARCH_NY",
  },
];

const CONDITION_STYLES: Record<Condition, string> = {
  NEW: "bg-[#1a1a1a] text-white",
  USED: "bg-gray-100 text-gray-500 border border-gray-300",
  REFURBISHED: "bg-[#1e3a8a] text-white",
};

const CONDITION_ICON: Record<Condition, string> = {
  NEW: "⊘",
  USED: "↺",
  REFURBISHED: "🔧",
};

export default function AuthenticationPage() {
  const [page, setPage] = useState(1);
  const [decisions, setDecisions] = useState<Record<string, "accepted" | "rejected">>({});

  const decide = (id: string, action: "accepted" | "rejected") =>
    setDecisions((prev) => ({ ...prev, [id]: action }));

  return (
    <div className="min-h-screen bg-[#f4f4f2] px-10 py-10">
      <div className="mx-auto w-full max-w-[1500px] overflow-hidden rounded-lg border border-gray-300 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-gray-200 px-8 py-6">
          <div className="flex items-center gap-3.5">
            <h1 className="text-[22px] font-extrabold tracking-tight text-[#1a1a1a]">
              ACTIVE QUEUE
            </h1>
            <span className="rounded-sm bg-[#1a1a1a] px-2.5 py-1 text-[12px] font-semibold tracking-wide text-white">
              HIGH PRIORITY
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-2 rounded-md border border-gray-300 bg-white px-4 py-2.5 text-[13px] font-medium tracking-wide text-gray-600 hover:bg-gray-50">
              SORT: OLDEST FIRST
              <ChevronRight className="h-3.5 w-3.5 rotate-90" />
            </button>
            <button className="flex h-[42px] w-[42px] items-center justify-center rounded-md border border-gray-300 bg-white text-gray-500 hover:bg-gray-50">
              <SlidersHorizontal className="h-4.5 w-4.5" />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-[90px_1fr_170px_170px_190px_230px] items-center border-b border-gray-200 bg-gray-50 px-8 py-3.5 text-[12.5px] font-semibold tracking-wide text-gray-500">
          <span>ID</span>
          <span>PRODUCT</span>
          <span>CONDITION</span>
          <span>DATE / TIME</span>
          <span>SELLER</span>
          <span className="text-right">ACTIONS</span>
        </div>

        <div>
          {QUEUE_ITEMS.map((item) => {
            const decision = decisions[item.id];
            return (
              <div
                key={item.id}
                className={`grid grid-cols-[90px_1fr_170px_170px_190px_230px] items-center border-b border-gray-100 px-8 py-6 transition-colors ${
                  decision ? "opacity-50" : "hover:bg-gray-50/60"
                }`}
              >
                <span className="text-[14px] text-gray-500">{item.id}</span>

                <div className="flex items-center gap-4">
                  <div className="relative h-14 w-20 overflow-hidden rounded-md border border-gray-200 bg-gray-100">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-full w-full object-cover"
                    />
                    {item.flagged && (
                      <span className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full bg-red-500" />
                    )}
                  </div>
                  <div>
                    <div className="text-[15px] font-bold text-[#1a1a1a]">
                      {item.name}
                    </div>
                    <div className="text-[12.5px] text-gray-400">
                      SKU: {item.sku}
                    </div>
                  </div>
                </div>

                <div>
                  <span
                    className={`inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-wide ${CONDITION_STYLES[item.condition]}`}
                  >
                    <span>{CONDITION_ICON[item.condition]}</span>
                    {item.condition}
                  </span>
                </div>

                <div className="text-[13.5px] leading-snug text-gray-600">
                  <div>{item.date}</div>
                  <div className="text-gray-400">{item.time}</div>
                </div>

                <span className="text-[13.5px] font-medium text-gray-700">
                  {item.seller}
                </span>

                <div className="flex items-center justify-end gap-2.5">
                  {decision ? (
                    <span
                      className={`rounded-md px-3 py-1.5 text-[12px] font-semibold tracking-wide ${
                        decision === "accepted"
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-600"
                      }`}
                    >
                      {decision === "accepted" ? "ACCEPTED" : "REJECTED"}
                    </span>
                  ) : (
                    <>
                      <button
                        title="Accept"
                        onClick={() => decide(item.id, "accepted")}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-green-600 hover:border-green-500 hover:bg-green-50"
                      >
                        <Check className="h-4.5 w-4.5" />
                      </button>
                      <button
                        title="Reject"
                        onClick={() => decide(item.id, "rejected")}
                        className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-red-500 hover:border-red-500 hover:bg-red-50"
                      >
                        <X className="h-4.5 w-4.5" />
                      </button>
                     <a
  href={`/admin/authentication/${item.id.replace("#", "")}`}
  title="Detail"
  className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-500 hover:border-gray-500 hover:bg-gray-50"
>
  <Eye className="h-4.5 w-4.5" />
</a>
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-8 py-5">
          <span className="text-[13px] text-gray-400">
            SHOWING 1-3 OF 142 REQUESTS
          </span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            {[1, 2, 3].map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`flex h-9 w-9 items-center justify-center rounded-md text-[14px] font-medium ${
                  page === n
                    ? "bg-[#1a1a1a] text-white"
                    : "border border-gray-300 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(3, p + 1))}
              className="flex h-9 w-9 items-center justify-center rounded-md border border-gray-300 text-gray-400 hover:bg-gray-50"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}