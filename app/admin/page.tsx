import { AlertTriangle, Gauge, ScanLine, TrendingUp } from "lucide-react"

// ---- Data contoh — ganti dengan data live dari sistem kamu ----
const stats = {
  authQueue: { total: 142, avgWait: "45m", slaBreach: 2 },
  marketVolatility: { level: "High", driver: "'Air Jordan 4' Release", pct: 78 },
  latency: { ms: 24, status: "Optimal Performance" },
}

const authQueueRows = [
  { sku: "SNK-2023-994", sellerLevel: "TIER 1", queueTime: "12m", priority: 98 },
  { sku: "SNK-2023-995", sellerLevel: "TIER 3", queueTime: "45m", priority: 72 },
  { sku: "SNK-2023-996", sellerLevel: "TIER 2", queueTime: "1h 12m", priority: 45 },
]

const escalationAlerts = [
  {
    title: "Condition Mismatch",
    time: "2m ago",
    description: "SKU: SNK-882. Seller listed 'New', AI detects wear.",
    actionLabel: "REVIEW CLAIM",
  },
  {
    title: "Potential Counterfeit",
    time: "15m ago",
    description: "SKU: SNK-710. Stitching anomaly detected.",
    actionLabel: "ISOLATE ASSET",
  },
]

const platformLogs = [
  { text: "[SYS] Auth successful: SNK-990. Verifier: AI_Node_4.", tone: "muted" as const },
  { text: "[TXN] Sale completed: $450. SKU: SNK-812.", tone: "green" as const },
  { text: "[SYS] Image processing queue cleared.", tone: "muted" as const },
  { text: "[WARN] High traffic detected on 'Yeezy' endpoints.", tone: "yellow" as const },
  { text: "[SYS] Auth successful: SNK-991.", tone: "muted" as const },
]

export default function AdminDashboardPage() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-8 py-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">
          COMMAND CENTER
        </h1>
        <p className="mt-1 text-sm text-neutral-500">
          Real-time oversight of platform operations, authentication queues, and
          market dynamics.
        </p>
      </div>

      {/* Stat cards */}
      <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
        {/* Auth Queue */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-neutral-400">
              AUTH QUEUE
            </span>
            <ScanLine className="size-4 text-neutral-300" aria-hidden />
          </div>
          <div className="mt-3 text-4xl font-black text-neutral-900">
            {stats.authQueue.total}
          </div>
          <div className="mt-3 flex items-center justify-between text-xs">
            <div>
              <div className="text-neutral-400">Avg Wait</div>
              <div className="font-bold text-neutral-900">{stats.authQueue.avgWait}</div>
            </div>
            <div className="text-right">
              <div className="text-neutral-400">SLA Breach</div>
              <div className="font-bold text-red-600">{stats.authQueue.slaBreach}</div>
            </div>
          </div>
        </div>

        {/* Market Volatility */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-neutral-400">
              MARKET VOLATILITY
            </span>
            <TrendingUp className="size-4 text-blue-500" aria-hidden />
          </div>
          <div className="mt-3 text-4xl font-black text-blue-600">
            {stats.marketVolatility.level}
          </div>
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded-full bg-neutral-100">
            <div
              className="h-full rounded-full bg-blue-500"
              style={{ width: `${stats.marketVolatility.pct}%` }}
            />
          </div>
          <div className="mt-2 text-[11px] font-medium tracking-wide text-neutral-400 uppercase">
            Driven by {stats.marketVolatility.driver}
          </div>
        </div>

        {/* Processing Latency */}
        <div className="rounded-lg border border-neutral-200 bg-white p-5">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold tracking-wide text-neutral-400">
              PROCESSING LATENCY
            </span>
            <Gauge className="size-4 text-neutral-300" aria-hidden />
          </div>
          <div className="mt-3 text-4xl font-black text-neutral-900">
            {stats.latency.ms}
            <span className="ml-1 text-lg font-bold text-neutral-400">ms</span>
          </div>
          <div className="mt-3 flex items-center gap-1.5 text-xs">
            <span className="size-1.5 rounded-full bg-green-500" />
            <span className="text-neutral-500">{stats.latency.status}</span>
          </div>
        </div>
      </div>

      {/* Queue table + Escalation/Log */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr]">
        {/* Authentication Queue */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-black tracking-wide text-neutral-900 uppercase">
              Authentication Queue
            </h2>
            <a href="#" className="text-xs font-semibold text-blue-600 hover:underline">
              VIEW ALL
            </a>
          </div>

          <div className="overflow-hidden rounded-lg border border-neutral-200 bg-white">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-neutral-200 text-left text-[11px] font-semibold tracking-wide text-neutral-400 uppercase">
                  <th className="px-4 py-3 font-semibold">Asset SKU</th>
                  <th className="px-4 py-3 font-semibold">Seller Level</th>
                  <th className="px-4 py-3 font-semibold">Queue Time</th>
                  <th className="px-4 py-3 font-semibold">Priority Score</th>
                  <th className="px-4 py-3 font-semibold">Action</th>
                </tr>
              </thead>
              <tbody>
                {authQueueRows.map((row) => (
                  <tr key={row.sku} className="border-b border-neutral-100 last:border-0">
                    <td className="px-4 py-4 font-semibold text-neutral-900">{row.sku}</td>
                    <td className="px-4 py-4">
                      <span className="rounded border border-neutral-200 px-2 py-0.5 text-xs font-medium text-neutral-600">
                        {row.sellerLevel}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-neutral-600">{row.queueTime}</td>
                    <td className="px-4 py-4">
                      <span
                        className={[
                          "font-bold",
                          row.priority >= 90
                            ? "text-red-600"
                            : row.priority >= 60
                              ? "text-neutral-900"
                              : "text-neutral-500",
                        ].join(" ")}
                      >
                        {row.priority}/100
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <button
                        className={[
                          "rounded-md px-4 py-2 text-xs font-bold text-white",
                          row.priority >= 90
                            ? "bg-blue-600 hover:bg-blue-700"
                            : "bg-neutral-900 hover:bg-neutral-800",
                        ].join(" ")}
                      >
                        VERIFY NOW
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Escalation Alerts + Platform Log */}
        <div className="flex flex-col gap-6">
          <div className="rounded-lg border border-red-200 bg-red-50 p-5">
            <div className="mb-4 flex items-center gap-2">
              <AlertTriangle className="size-4 text-red-600" aria-hidden />
              <h2 className="text-sm font-black tracking-wide text-red-700 uppercase">
                Escalation Alerts
              </h2>
            </div>
            <div className="flex flex-col gap-4">
              {escalationAlerts.map((alert) => (
                <div key={alert.title}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-bold text-red-700">{alert.title}</span>
                    <span className="text-[11px] text-red-400">{alert.time}</span>
                  </div>
                  <p className="mt-1 text-xs text-red-600/80">{alert.description}</p>
                  <a
                    href="#"
                    className="mt-1 inline-block text-xs font-bold text-red-700 underline underline-offset-2 hover:text-red-800"
                  >
                    {alert.actionLabel}
                  </a>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-5">
            <h2 className="mb-3 text-xs font-bold tracking-wide text-neutral-400 uppercase">
              Platform Log
            </h2>
            <div className="flex flex-col gap-1.5 font-mono text-[11px] leading-relaxed">
              {platformLogs.map((log, i) => (
                <div
                  key={i}
                  className={
                    log.tone === "green"
                      ? "text-green-400"
                      : log.tone === "yellow"
                        ? "text-yellow-400"
                        : "text-neutral-500"
                  }
                >
                  {log.text}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}