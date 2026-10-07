import { Check, Globe, Laptop, Smartphone, Compass, ArrowUpRight } from "lucide-react";

export function AnalyticsPreview() {
  const countries = [
    { name: "United States", code: "US", percent: 48, clicks: 2314 },
    { name: "Germany", code: "DE", percent: 21, clicks: 1012 },
    { name: "India", code: "IN", percent: 16, clicks: 771 },
    { name: "United Kingdom", code: "GB", percent: 11, clicks: 530 },
  ];

  const devices = [
    { label: "Desktop", percent: 62, icon: Laptop },
    { label: "Mobile", percent: 34, icon: Smartphone },
    { label: "Tablet", percent: 4, icon: Compass },
  ];

  const referrers = [
    { source: "x.com / Twitter", percent: 44 },
    { source: "github.com", percent: 31 },
    { source: "linkedin.com", percent: 15 },
    { source: "Direct / None", percent: 10 },
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
      {/* Left Text & Value Props */}
      <div className="lg:col-span-5 space-y-6">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-100 text-neutral-800 text-xs font-semibold tracking-wide uppercase">
          Analytics Engine
        </div>

        <h2 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-neutral-950 leading-tight">
          Every click tells a story.
        </h2>

        <p className="text-neutral-600 text-base sm:text-lg leading-relaxed">
          Go beyond simple click counts. Understand where your audience comes from, what devices they use, and how your links perform over time.
        </p>

        <ul className="space-y-3.5 pt-2">
          {[
            "Real-time click tracking",
            "Geographic insights down to the country",
            "Device & operating system analytics",
            "Referrer & traffic source attribution",
          ].map((item) => (
            <li key={item} className="flex items-center gap-3 text-sm font-medium text-neutral-800">
              <div className="h-5 w-5 rounded-full bg-neutral-900 text-white flex items-center justify-center shrink-0">
                <Check className="h-3 w-3 stroke-[3]" />
              </div>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Right Analytics Mockup Window */}
      <div className="lg:col-span-7 bg-white border border-neutral-200/90 rounded-2xl p-5 sm:p-6 shadow-xl shadow-neutral-900/5 space-y-5">
        {/* Metric Header */}
        <div className="flex flex-wrap items-center justify-between pb-4 border-b border-neutral-100 gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-neutral-900">/product-launch</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200/50">
                Active
              </span>
            </div>
            <p className="text-xs text-neutral-400 truncate mt-0.5">https://example.com/v2-announcement</p>
          </div>

          <div className="flex items-center gap-5">
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Clicks</div>
              <div className="text-lg font-bold text-neutral-950 font-mono">4,821</div>
            </div>
            <div>
              <div className="text-[10px] uppercase tracking-wider text-neutral-400 font-medium">Unique</div>
              <div className="text-lg font-bold text-neutral-950 font-mono">3,490</div>
            </div>
          </div>
        </div>

        {/* Breakdown Widgets Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Countries Card */}
          <div className="bg-neutral-50/60 border border-neutral-200/70 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Globe className="h-3.5 w-3.5 text-neutral-500" />
                Countries
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Share</span>
            </div>
            <div className="space-y-2.5">
              {countries.map((c) => (
                <div key={c.name} className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-700">
                    <span className="truncate">{c.name}</span>
                    <span className="font-mono text-[11px] text-neutral-500">{c.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full"
                      style={{ width: `${c.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Devices Card */}
          <div className="bg-neutral-50/60 border border-neutral-200/70 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Laptop className="h-3.5 w-3.5 text-neutral-500" />
                Devices
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Type</span>
            </div>
            <div className="space-y-2.5">
              {devices.map((d) => {
                const Icon = d.icon;
                return (
                  <div key={d.label} className="space-y-1">
                    <div className="flex justify-between text-xs text-neutral-700">
                      <span className="flex items-center gap-1.5">
                        <Icon className="h-3 w-3 text-neutral-400" />
                        {d.label}
                      </span>
                      <span className="font-mono text-[11px] text-neutral-500">{d.percent}%</span>
                    </div>
                    <div className="h-1.5 w-full bg-neutral-200/70 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-neutral-900 rounded-full"
                        style={{ width: `${d.percent}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Referrers Card */}
          <div className="bg-neutral-50/60 border border-neutral-200/70 rounded-xl p-3.5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-neutral-800 flex items-center gap-1.5">
                <Compass className="h-3.5 w-3.5 text-neutral-500" />
                Referrers
              </span>
              <span className="text-[10px] text-neutral-400 font-mono">Source</span>
            </div>
            <div className="space-y-2.5">
              {referrers.map((r) => (
                <div key={r.source} className="space-y-1">
                  <div className="flex justify-between text-xs text-neutral-700">
                    <span className="truncate">{r.source}</span>
                    <span className="font-mono text-[11px] text-neutral-500">{r.percent}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-200/70 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-neutral-900 rounded-full"
                      style={{ width: `${r.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
