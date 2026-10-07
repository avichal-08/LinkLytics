import { 
  Link2, 
  BarChart2, 
  Copy, 
  ExternalLink, 
  MoreHorizontal, 
  Calendar, 
  MousePointerClick, 
  TrendingUp,
  Search,
  Check
} from "lucide-react";

export function HeroDashboardPreview() {
  return (
    <div className="relative w-full max-w-5xl mx-auto mt-10 sm:mt-14">
      {/* Background Ambient Glow */}
      <div 
        className="absolute -inset-x-12 -top-16 h-80 bg-gradient-to-b from-blue-500/15 via-indigo-500/10 to-transparent blur-3xl -z-10 rounded-full pointer-events-none"
        aria-hidden="true" 
      />

      {/* Main Window Mockup Container */}
      <div className="rounded-2xl border border-neutral-200/90 bg-white shadow-2xl shadow-neutral-900/10 overflow-hidden text-left">
        {/* Browser Window Header Chrome */}
        <div className="h-10 px-4 bg-neutral-50/80 border-b border-neutral-200/70 flex items-center justify-between gap-4 select-none">
          {/* Window dots */}
          <div className="flex items-center gap-1.5">
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
            <span className="h-2.5 w-2.5 rounded-full bg-neutral-300" />
          </div>

          {/* Browser Address Pill */}
          <div className="flex items-center gap-2 px-3 py-1 rounded-md bg-white border border-neutral-200/80 text-[11px] font-mono text-neutral-500 shadow-2xs">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
            <span>linklytics.app/dashboard</span>
          </div>

          <div className="w-12 text-right">
            <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-wider">Live</span>
          </div>
        </div>

        {/* Dashboard Top Navbar Mockup */}
        <div className="h-14 px-5 sm:px-6 border-b border-neutral-200/70 flex items-center justify-between bg-white">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Link2 className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span className="font-display text-sm font-bold tracking-tight text-neutral-950">
                LinkLytics
              </span>
            </div>

            <div className="hidden sm:flex items-center gap-1 text-xs">
              <span className="px-2.5 py-1 rounded-md font-medium text-neutral-900 bg-neutral-100">
                Links
              </span>
              <span className="px-2.5 py-1 rounded-md text-neutral-500">
                Analytics
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-2 px-2.5 py-1 rounded-md bg-neutral-50 border border-neutral-200 text-neutral-400 text-xs w-48">
              <Search className="h-3 w-3" />
              <span>Search links...</span>
            </div>
            <div className="h-7 w-7 rounded-full bg-neutral-900 text-white flex items-center justify-center text-[10px] font-semibold border border-neutral-300">
              A
            </div>
          </div>
        </div>

        {/* Dashboard Body Preview */}
        <div className="p-4 sm:p-6 bg-neutral-50/40 space-y-5">
          {/* Stats KPI Row */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {/* Stat 1 */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Total clicks</span>
                <MousePointerClick className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              <div className="text-xl font-bold tracking-tight text-neutral-950">
                12,842
              </div>
              <p className="text-[10px] text-emerald-600 font-medium mt-0.5">
                +18.4% from last week
              </p>
            </div>

            {/* Stat 2 */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Total links</span>
                <Link2 className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              <div className="text-xl font-bold tracking-tight text-neutral-950">
                24
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Active tracked short links
              </p>
            </div>

            {/* Stat 3 */}
            <div className="bg-white border border-neutral-200/80 rounded-xl p-3.5 shadow-2xs">
              <div className="flex items-center justify-between text-neutral-500 mb-1">
                <span className="text-[11px] font-medium uppercase tracking-wider text-neutral-500">Clicks today</span>
                <TrendingUp className="h-3.5 w-3.5 text-neutral-400" />
              </div>
              <div className="text-xl font-bold tracking-tight text-neutral-950">
                486
              </div>
              <p className="text-[10px] text-neutral-400 mt-0.5">
                Live engagements in 24h
              </p>
            </div>
          </div>

          {/* Grid: Link List & Analytics Chart */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
            {/* Left 7 Columns: Links Resource List */}
            <div className="lg:col-span-7 bg-white border border-neutral-200/80 rounded-xl shadow-xs divide-y divide-neutral-100 overflow-hidden">
              <div className="px-4 py-2.5 bg-neutral-50/60 border-b border-neutral-100 flex items-center justify-between">
                <span className="text-xs font-semibold text-neutral-700">Top Performing Links</span>
                <span className="text-[11px] text-neutral-400 font-mono">Showing 3 of 24</span>
              </div>

              {/* Row 1: /github */}
              <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shrink-0">
                    <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24">
                      <path fillRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-neutral-900 font-mono">/github</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      github.com/avichal-08
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                    <BarChart2 className="h-3 w-3 text-neutral-500" />
                    1,284 clicks
                  </span>
                  <div className="flex items-center text-neutral-400">
                    <Copy className="h-3.5 w-3.5 hover:text-neutral-700 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 2: /launch */}
              <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/60 flex items-center justify-center shrink-0">
                    <TrendingUp className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-neutral-900 font-mono">/launch</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      example.com/product
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                    <BarChart2 className="h-3 w-3 text-neutral-500" />
                    842 clicks
                  </span>
                  <div className="flex items-center text-neutral-400">
                    <Copy className="h-3.5 w-3.5 hover:text-neutral-700 transition-colors" />
                  </div>
                </div>
              </div>

              {/* Row 3: /docs */}
              <div className="p-3.5 flex items-center justify-between gap-3 hover:bg-neutral-50/70 transition-colors">
                <div className="flex items-center gap-3 min-w-0 flex-1">
                  <div className="h-8 w-8 rounded-lg bg-purple-50 text-purple-600 border border-purple-200/60 flex items-center justify-center shrink-0">
                    <Link2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs text-neutral-900 font-mono">/docs</span>
                    </div>
                    <p className="text-[11px] text-neutral-500 truncate mt-0.5">
                      linklytics.app/documentation
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-700 text-[11px] font-medium">
                    <BarChart2 className="h-3 w-3 text-neutral-500" />
                    618 clicks
                  </span>
                  <div className="flex items-center text-neutral-400">
                    <Copy className="h-3.5 w-3.5 hover:text-neutral-700 transition-colors" />
                  </div>
                </div>
              </div>
            </div>

            {/* Right 5 Columns: Beautiful Analytics Chart */}
            <div className="lg:col-span-5 bg-white border border-neutral-200/80 rounded-xl p-4 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <div>
                  <h4 className="text-xs font-semibold text-neutral-900">Traffic Trend</h4>
                  <p className="text-[10px] text-neutral-400">Clicks over last 7 days</p>
                </div>
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200/60">
                  <TrendingUp className="h-3 w-3" />
                  <span>+24.8%</span>
                </div>
              </div>

              {/* SVG Area Chart Mockup */}
              <div className="relative h-36 w-full pt-2">
                <svg
                  viewBox="0 0 320 120"
                  className="w-full h-full overflow-visible"
                  fill="none"
                  preserveAspectRatio="none"
                >
                  <defs>
                    <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#2563eb" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#2563eb" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>

                  {/* Horizontal grid lines */}
                  <line x1="0" y1="20" x2="320" y2="20" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="60" x2="320" y2="60" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />
                  <line x1="0" y1="100" x2="320" y2="100" stroke="#f1f5f9" strokeWidth="1" strokeDasharray="3 3" />

                  {/* Shaded Area */}
                  <path
                    d="M 0,90 Q 50,75 100,50 T 200,20 T 260,35 T 320,15 L 320,110 L 0,110 Z"
                    fill="url(#chartGradient)"
                  />

                  {/* Trend Curve Line */}
                  <path
                    d="M 0,90 Q 50,75 100,50 T 200,20 T 260,35 T 320,15"
                    stroke="#2563eb"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  {/* Active Data Point */}
                  <circle cx="200" cy="20" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
                </svg>

                {/* Tooltip Overlay */}
                <div className="absolute top-2 left-[58%] -translate-x-1/2 bg-neutral-950 text-white text-[10px] font-medium px-2 py-0.5 rounded shadow-md pointer-events-none whitespace-nowrap">
                  Fri · 2,840 clicks
                </div>
              </div>

              {/* Chart Day Labels */}
              <div className="flex items-center justify-between text-[10px] text-neutral-400 font-mono pt-2 border-t border-neutral-100">
                <span>Mon</span>
                <span>Tue</span>
                <span>Wed</span>
                <span>Thu</span>
                <span className="font-semibold text-neutral-900">Fri</span>
                <span>Sat</span>
                <span>Sun</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
