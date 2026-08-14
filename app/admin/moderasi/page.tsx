"use client";

interface ReportTag {
  label: string;
  className: string;
}

type ReportState = "pending" | "processed" | "done";

interface ReportCard {
  id: string;
  tags: ReportTag[];
  title: string;
  reason: string;
  reportedBy: string;
  state: ReportState;
}

const REPORTS: ReportCard[] = [
  {
    id: "1",
    tags: [
      { label: "LAPORAN PRODUK", className: "bg-orange-100 text-orange-600" },
      { label: "PENDING", className: "bg-amber-100 text-amber-600" },
    ],
    title: 'Nike Air Force 1 "Replika"',
    reason: "Produk palsu",
    reportedBy: "Anonymous",
    state: "pending",
  },
  {
    id: "2",
    tags: [
      { label: "LAPORAN SELLER", className: "bg-pink-100 text-pink-500" },
      { label: "DIPROSES", className: "bg-blue-100 text-blue-500" },
    ],
    title: "FakeKicks.id",
    reason: "Penjual tidak jujur",
    reportedBy: "Budi S.",
    state: "processed",
  },
  {
    id: "3",
    tags: [
      { label: "LAPORAN PRODUK", className: "bg-orange-100 text-orange-600" },
      { label: "SELESAI", className: "bg-emerald-100 text-emerald-600" },
    ],
    title: 'Adidas Ultra Boost "OG"',
    reason: "Harga mencurigakan",
    reportedBy: "Anonymous",
    state: "done",
  },
];

export default function ModerationPage() {
  return (
    <div className="min-h-screen bg-[#f4f4f2] px-10 py-10">
      {/* Header */}
      <div className="mb-7">
        <h1 className="text-[32px] font-extrabold uppercase tracking-tight text-[#1a1a1a]">
          Moderasi
        </h1>
        <p className="mt-1 text-[13.5px] text-gray-500">
          Manage user reports and flagged items.
        </p>
      </div>

      {/* Report cards */}
      <div className="flex flex-col gap-5">
        {REPORTS.map((report) => (
          <div
            key={report.id}
            className="flex items-center justify-between rounded-lg border border-gray-300 bg-white px-7 py-5 shadow-sm"
          >
            <div>
              <div className="mb-2.5 flex gap-2">
                {report.tags.map((tag) => (
                  <span
                    key={tag.label}
                    className={`rounded px-2.5 py-1 text-[10.5px] font-bold tracking-wide ${tag.className}`}
                  >
                    {tag.label}
                  </span>
                ))}
              </div>
              <h2 className="text-[17px] font-bold text-[#1a1a1a]">
                {report.title}
              </h2>
              <p className="mt-1.5 text-[13px] text-gray-500">
                Alasan: {report.reason}
              </p>
              <p className="text-[13px] text-gray-400">
                Dilaporkan oleh: {report.reportedBy}
              </p>
            </div>

            <div className="flex flex-col gap-2">
              {report.state === "done" ? (
                <button className="rounded-md bg-[#1a1a1a] px-6 py-2.5 text-[12px] font-semibold tracking-wide text-white hover:bg-black">
                  DETAIL
                </button>
              ) : (
                <>
                  <button className="rounded-md bg-[#ff4d1c] px-6 py-2.5 text-[12px] font-semibold tracking-wide text-white hover:bg-[#e6440f]">
                    REVIEW
                  </button>
                  <button className="rounded-md border border-gray-300 bg-white px-6 py-2.5 text-[12px] font-semibold tracking-wide text-gray-600 hover:bg-gray-50">
                    ABAIKAN
                  </button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}