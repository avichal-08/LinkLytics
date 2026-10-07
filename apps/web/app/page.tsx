import Link from "next/link";
import { getServerSession } from "next-auth";
import { ArrowRight, Sparkles, Shield, Zap, BarChart2 } from "lucide-react";

import { authOptions } from "@/lib/configs/authOptions";
import { AuthButtons } from "@/components/AuthButtons";
import { LandingNav } from "@/components/LandingNav";
import { HeroDashboardPreview } from "@/components/HeroDashboardPreview";
import { FeaturesSection } from "@/components/FeaturesSection";
import { AnalyticsPreview } from "@/components/AnalyticsPreview";
import { LandingFooter } from "@/components/LandingFooter";

export default async function Home() {
  const session = await getServerSession(authOptions);
  const isAuthenticated = Boolean(session?.user);

  return (
    <div className="min-h-screen flex flex-col bg-white text-neutral-900 selection:bg-neutral-900 selection:text-white">
      {/* 1. Navbar */}
      <LandingNav isAuthenticated={isAuthenticated} userName={session?.user?.name} />

      <main className="flex-1 flex flex-col items-center overflow-x-hidden">
        {/* 2. Hero Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20 md:pt-24 pb-12 sm:pb-16 flex flex-col items-center text-center max-w-5xl mx-auto">
          {/* Announcement Pill */}
          <div className="inline-flex items-center gap-2 rounded-full border border-neutral-200/90 bg-neutral-50 px-3.5 py-1 text-xs font-medium text-neutral-700 mb-6 sm:mb-8 shadow-2xs transition-all hover:bg-neutral-100/80">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>Real-time link analytics</span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold font-display tracking-tight text-neutral-950 leading-[1.08] mb-6 max-w-4xl">
            Shorten links. <br className="hidden sm:inline" />
            <span className="text-neutral-950 bg-gradient-to-r from-neutral-950 via-neutral-800 to-neutral-600 bg-clip-text text-transparent">
              Measure everything.
            </span>
          </h1>

          {/* Supporting Copy */}
          <p className="text-base sm:text-lg md:text-xl text-neutral-600 max-w-2xl mb-8 sm:mb-10 leading-relaxed font-normal">
            Create short, trackable links and understand exactly how your audience interacts with them in real time.
          </p>

          {/* CTA Row */}
          <div className="w-full max-w-md mx-auto flex flex-col items-center justify-center gap-3">
            {isAuthenticated ? (
              <Link 
                href="/dashboard" 
                className="inline-flex items-center justify-center h-12 px-8 rounded-xl bg-neutral-900 hover:bg-neutral-800 text-white font-medium shadow-xs hover:shadow-sm text-sm gap-2 transition-all active:scale-[0.98] w-full sm:w-auto cursor-pointer"
              >
                <span>Go to dashboard</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
            ) : (
              <div className="w-full flex flex-col items-center gap-3">
                <AuthButtons />
                <p className="text-xs text-neutral-400 mt-2">
                  No credit card required. Free &amp; open source.
                </p>
              </div>
            )}
          </div>

          {/* 3. Hero Product Visual Mockup */}
          <div id="product" className="w-full">
            <HeroDashboardPreview />
          </div>
        </section>

        {/* 4. Trust / Positioning Statement */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-12 sm:py-16 border-y border-neutral-200/80 bg-neutral-50/50">
          <div className="max-w-5xl mx-auto text-center space-y-6">
            <p className="text-xs font-semibold tracking-wider uppercase text-neutral-400">
              Reliable Foundation
            </p>
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-neutral-950 tracking-tight">
              Everything you need to understand your links.
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-4 max-w-3xl mx-auto">
              <div className="flex flex-col items-center text-center p-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 mb-2 shadow-2xs">
                  <Zap className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Sub-millisecond redirects</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Powered by in-memory Redis edge cache</p>
              </div>

              <div className="flex flex-col items-center text-center p-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 mb-2 shadow-2xs">
                  <BarChart2 className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Real-time event stream</h4>
                <p className="text-xs text-neutral-500 mt-0.5">Asynchronously buffered through Kafka</p>
              </div>

              <div className="flex flex-col items-center text-center p-3">
                <div className="h-8 w-8 rounded-lg bg-white border border-neutral-200/80 flex items-center justify-center text-neutral-800 mb-2 shadow-2xs">
                  <Shield className="h-4 w-4" />
                </div>
                <h4 className="text-sm font-semibold text-neutral-900">Privacy-centric analytics</h4>
                <p className="text-xs text-neutral-500 mt-0.5">No invasive tracking cookies used</p>
              </div>
            </div>
          </div>
        </section>

        {/* 5. Features Section */}
        <section id="features" className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 max-w-6xl mx-auto">
          <FeaturesSection />
        </section>

        {/* 6. Analytics Visualization Section */}
        <section id="analytics" className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-neutral-50/40 border-y border-neutral-200/80">
          <div className="max-w-6xl mx-auto">
            <AnalyticsPreview />
          </div>
        </section>

        {/* 8. Final CTA Section */}
        <section className="w-full px-4 sm:px-6 lg:px-8 py-20 sm:py-24 max-w-5xl mx-auto">
          <div className="rounded-3xl border border-neutral-200/90 bg-neutral-950 text-white p-8 sm:p-14 text-center space-y-6 relative overflow-hidden shadow-xl">
            <div
              className="absolute -right-20 -top-20 w-80 h-80 bg-blue-500/20 blur-3xl rounded-full pointer-events-none"
              aria-hidden="true"
            />
            <div
              className="absolute -left-20 -bottom-20 w-80 h-80 bg-purple-500/15 blur-3xl rounded-full pointer-events-none"
              aria-hidden="true"
            />

            <div className="relative z-10 max-w-2xl mx-auto space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-neutral-900 border border-neutral-800 text-xs font-medium text-neutral-300">
                <Sparkles className="h-3 w-3 text-neutral-300" />
                <span>Start for free</span>
              </div>

              <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-display tracking-tight text-white">
                Ready to shorten smarter?
              </h2>

              <p className="text-neutral-400 text-sm sm:text-base leading-relaxed">
                Create your first link in seconds and start understanding every click with real-time insights.
              </p>

              <div className="pt-2">
                {isAuthenticated ? (
                  <Link 
                    href="/dashboard" 
                    className="inline-flex items-center justify-center h-11 px-8 rounded-xl bg-white hover:bg-neutral-100 text-neutral-950 font-semibold shadow-xs text-sm gap-2 transition-all active:scale-[0.98] cursor-pointer"
                  >
                    <span>Go to dashboard</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                ) : (
                  <div className="flex justify-center">
                    <AuthButtons />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* 9. Minimal Footer */}
      <LandingFooter />
    </div>
  );
}
