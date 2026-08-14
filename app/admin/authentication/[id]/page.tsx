"use client";

import { use, useState } from "react";
import Link from "next/link";
import {
  Search,
  ShieldCheck,
  CheckSquare,
  Square,
  Camera,
  ArrowLeft,
} from "lucide-react";

interface ChecklistItem {
  id: string;
  label: string;
  desc: string;
  checked: boolean;
}

const INITIAL_CHECKLIST: ChecklistItem[] = [
  {
    id: "scent",
    label: "Scent Profile Verified",
    desc: "Factory glue scent matches origin timestamp.",
    checked: true,
  },
  {
    id: "stitch",
    label: "Stitch Density Match",
    desc: "8 stitches per inch on lateral swoosh confirmed.",
    checked: true,
  },
  {
    id: "uv",
    label: "UV Light Inspection Passed",
    desc: "No foreign trace marks or irregular stamping.",
    checked: true,
  },
  {
    id: "insole",
    label: "Insole Glue Pattern",
    desc: "Pending manual review of underside pattern.",
    checked: false,
  },
];

const SCAN_METRICS = [
  { label: "MATERIAL CONSISTENCY", value: "99%" },
  { label: "STITCH VARIANCE", value: "96%" },
  { label: "LABEL TYPOGRAPHY", value: "100%" },
  { label: "UV FLUORESENCE", value: "97%" },
];

const THUMBNAILS = [
  {
    id: 1,
    label: "STITCHING (LAT)",
    image:
      "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=200&q=60&sat=-100",
  },
  {
    id: 2,
    label: "INT. LABEL",
    image:
      "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?w=200&q=60&sat=-100",
  },
  {
    id: 3,
    label: "BOX ART",
    image:
      "https://images.unsplash.com/photo-1556906781-9a412961c28c?w=200&q=60&sat=-100",
  },
  {
    id: 4,
    label: "UV SOLE SCAN",
    image:
      "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200&q=60&sat=-100",
  },
];

export default function VerificationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [checklist, setChecklist] = useState(INITIAL_CHECKLIST);
  const [activeThumb, setActiveThumb] = useState(1);

  const toggle = (itemId: string) =>
    setChecklist((prev) =>
      prev.map((i) => (i.id === itemId ? { ...i, checked: !i.checked } : i))
    );

  return (
    <div className="min-h-screen bg-[#f7f7f5] px-8 py-8">
      <div className="mx-auto max-w-6xl">
        {/* Back button */}
        <Link
          href="/admin/authentication"
          className="mb-4 flex items-center gap-1.5 text-[13px] font-medium text-gray-500 hover:text-gray-800"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Link>

        {/* Header */}
        <div className="mb-1 flex items-start justify-between">
          <h1 className="text-[26px] font-extrabold tracking-tight text-[#1a1a1a]">
            VERIFICATION DETAIL: #{id}
          </h1>
          <span className="rounded-sm bg-[#1a1a1a] px-3 py-1.5 text-[11px] font-bold tracking-wide text-white">
            AI MATCH: 98%
          </span>
        </div>
        <p className="mb-5 text-[12.5px] font-medium text-gray-500">
          STATUS: PENDING REVIEW <span className="mx-1.5">|</span> URGENCY:{" "}
          <span className="text-gray-700">HIGH</span>
        </p>

        <div className="border-t border-gray-200 pt-6">
          <div className="grid grid-cols-[1fr_320px] gap-8">
            {/* Left column */}
            <div>
              {/* Main image */}
              <div className="relative aspect-[16/9] w-full overflow-hidden rounded-md border border-gray-300 bg-gray-900">
                <img
                  src="https://images.unsplash.com/photo-1520256862855-398228c41684?w=900&q=60&grayscale"
                  alt="Source material inspection"
                  className="h-full w-full object-cover opacity-80"
                />
                <span className="absolute left-3 top-3 rounded-sm bg-[#1a1a1a] px-2.5 py-1 text-[10px] font-bold tracking-wide text-white">
                  SOURCE MATERIAL
                </span>
              </div>

              {/* Thumbnails */}
              <div className="mt-3 grid grid-cols-4 gap-3">
                {THUMBNAILS.map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setActiveThumb(t.id)}
                    className={`relative aspect-square overflow-hidden rounded-md border ${
                      activeThumb === t.id
                        ? "border-[#1a1a1a] ring-1 ring-[#1a1a1a]/40"
                        : "border-gray-300 hover:border-gray-400"
                    }`}
                  >
                    <img
                      src={t.image}
                      alt={t.label}
                      className="h-full w-full object-cover"
                    />
                    <span className="absolute bottom-1.5 left-1.5 rounded-sm bg-black/70 px-1.5 py-0.5 text-[8.5px] font-semibold tracking-wide text-white">
                      {t.label}
                    </span>
                  </button>
                ))}
              </div>

              {/* Authenticity scan data */}
              <div className="mt-8">
                <h2 className="mb-4 flex items-center gap-2 text-[13px] font-bold tracking-wide text-[#1a1a1a]">
                  <Search className="h-4 w-4" />
                  AUTHENTICITY SCAN DATA
                </h2>
                <div className="flex items-center gap-8">
                  <div className="relative flex h-32 w-32 shrink-0 items-center justify-center rounded-full border-[10px] border-blue-100">
                    <div className="absolute inset-0 rounded-full border-[10px] border-transparent border-t-blue-500 border-r-blue-500 rotate-[10deg]" />
                    <div className="text-center">
                      <div className="text-[24px] font-extrabold leading-none text-[#1a1a1a]">
                        98.4%
                      </div>
                      <div className="mt-1 text-[9px] font-semibold tracking-wide text-gray-400">
                        MATCH INDEX
                      </div>
                    </div>
                  </div>

                  <div className="flex-1">
                    {SCAN_METRICS.map((m, idx) => (
                      <div
                        key={m.label}
                        className={`flex items-center justify-between py-2.5 ${
                          idx !== SCAN_METRICS.length - 1
                            ? "border-b border-gray-100"
                            : ""
                        }`}
                      >
                        <span className="text-[12px] font-medium tracking-wide text-gray-500">
                          {m.label}
                        </span>
                        <span className="text-[13px] font-bold text-[#1a1a1a]">
                          {m.value}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-5">
              {/* Target asset */}
              <div>
                <h3 className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-400">
                  TARGET ASSET
                </h3>
                <p className="mb-3 text-[16px] font-bold text-[#1a1a1a]">
                  AJ1 HIGH OG &apos;CHICAGO&apos;
                </p>
                <div className="grid grid-cols-2 gap-y-3 text-[13px]">
                  <div>
                    <div className="text-[10.5px] text-gray-400">SKU</div>
                    <div className="font-semibold text-gray-700">
                      555088-101
                    </div>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-gray-400">
                      RELEASE YEAR
                    </div>
                    <div className="font-semibold text-gray-700">2015</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-gray-400">SIZE</div>
                    <div className="font-semibold text-gray-700">US 10.5</div>
                  </div>
                  <div>
                    <div className="text-[10.5px] text-gray-400">RETAIL</div>
                    <div className="font-semibold text-gray-700">$160.00</div>
                  </div>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Seller data + condition report */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-400">
                    SELLER DATA
                  </h3>
                  <div className="mb-1 flex items-center gap-1.5">
                    <span className="text-[13px] font-bold text-[#1a1a1a]">
                      KICKSVAULT_99
                    </span>
                    <ShieldCheck className="h-3.5 w-3.5 text-blue-500" />
                  </div>
                  <div className="mt-2 rounded-md bg-gray-50 px-2.5 py-1.5 text-[11px] text-gray-500">
                    SCORE: 4.9/5 (1,204 TRANS.)
                  </div>
                </div>

                <div>
                  <h3 className="mb-1.5 text-[11px] font-semibold tracking-wide text-gray-400">
                    CONDITION REPORT
                  </h3>
                  <span className="inline-block rounded-sm bg-[#1a1a1a] px-2.5 py-1 text-[10.5px] font-bold tracking-wide text-white">
                    NEW
                  </span>
                  <p className="mt-2 text-[11.5px] leading-snug text-gray-500">
                    100% Brand New, Unworn. Box intact.
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200" />

              {/* Protocol checklist */}
              <div>
                <h3 className="mb-3 text-[13px] font-bold tracking-wide text-[#1a1a1a]">
                  PROTOCOL CHECKLIST
                </h3>
                <ul className="flex flex-col gap-3.5">
                  {checklist.map((item) => (
                    <li key={item.id} className="flex items-start gap-2.5">
                      <button
                        onClick={() => toggle(item.id)}
                        className="mt-0.5 shrink-0"
                      >
                        {item.checked ? (
                          <CheckSquare className="h-4 w-4 fill-blue-600 text-white" />
                        ) : (
                          <Square className="h-4 w-4 text-gray-300" />
                        )}
                      </button>
                      <div>
                        <div className="text-[13px] font-semibold text-[#1a1a1a]">
                          {item.label}
                        </div>
                        <div className="text-[11.5px] text-gray-400">
                          {item.desc}
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Actions */}
              <div className="mt-2 flex flex-col gap-3">
                <button className="flex items-center justify-center gap-2 rounded-md bg-emerald-600 py-3 text-[13px] font-bold tracking-wide text-white hover:bg-emerald-700">
                  <ShieldCheck className="h-4 w-4" />
                  ACCEPT VERIFICATION
                </button>
                <button className="flex items-center justify-center gap-2 text-[12px] font-medium text-gray-500 hover:text-gray-700">
                  <Camera className="h-3.5 w-3.5" />
                  REQUEST PHOTOS
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}