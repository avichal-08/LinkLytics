import { redirect } from "next/navigation";
import { getServerSession } from "next-auth";
import { BarChart3, Globe, Link as LinkIcon, Zap, Github } from "lucide-react";

import { AuthButtons } from "@/components/AuthButtons";
import { authOptions } from "../lib/configs/authOptions";
import { Button } from "@/components/ui/button";

export default async function Home() {
  const session = await getServerSession(authOptions);

  if (session) {
    redirect("/dashboard");
  }

  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground selection:bg-primary selection:text-primary-foreground">

      <header className="px-6 lg:px-14 h-20 flex items-center justify-between border-b border-border/40 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <div className="bg-primary/10 p-2 rounded-xl">
            <LinkIcon className="h-5 w-5 text-primary" />
          </div>
          <span className="text-2xl font-display font-bold tracking-tight text-primary">
            LinkLytics
          </span>
        </div>
        <nav className="flex items-center gap-3">
          <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground hover:text-primary">
            <a href="https://github.com/avichal-08" target="_blank" rel="noopener noreferrer">
              <Github className="h-5 w-5" />
              <span className="sr-only">GitHub</span>
            </a>
          </Button>

          <Button variant="ghost" size="icon" className="h-12 w-12 text-muted-foreground hover:text-primary">
            <a href="https://x.com/Avichal_08" target="_blank" rel="noopener noreferrer">
              <svg viewBox="0 0 24 24" className="h-7 w-7" fill="currentColor" aria-hidden="true">
                <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
              </svg>
              <span className="sr-only">X</span>
            </a>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex flex-col items-center">

        <section className="w-full px-6 py-24 md:py-32 flex flex-col items-center text-center max-w-5xl mx-auto relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-blue-500/10 dark:bg-blue-500/20 blur-[120px] rounded-full pointer-events-none" />

          <div className="inline-flex items-center rounded-full border border-border bg-muted/50 px-3 py-1 text-sm text-muted-foreground mb-8">
            <span className="flex h-2 w-2 rounded-full bg-primary mr-2 animate-pulse"></span>
            Now with real-time analytics
          </div>

          <h1 className="text-5xl md:text-7xl font-display font-bold tracking-tight mb-6 leading-tight">
            Shorten links. <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-indigo-600 dark:from-blue-400 dark:to-indigo-500">
              Measure everything.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mb-10 leading-relaxed">
            Create custom, trackable short links in seconds. Get deep insights into your audience with beautiful charts for devices, locations, and referrers.
          </p>

          <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
            <div className="scale-110">
              <AuthButtons />
            </div>
          </div>
        </section>

        <section className="w-full px-6 py-24 bg-muted/30 border-t border-border/40">
          <div className="max-w-5xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">Everything you need to track your traffic</h2>
              <p className="text-muted-foreground">Built for speed, reliability, and deep insights.</p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center mb-6">
                  <Zap className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Lightning Fast</h3>
                <p className="text-muted-foreground">Redirects powered by Upstash Redis cache ensuring your users never wait to reach their destination.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center mb-6">
                  <BarChart3 className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Beautiful Analytics</h3>
                <p className="text-muted-foreground">Visualize your traffic with interactive Recharts. Track clicks over time, OS, and browsers instantly.</p>
              </div>

              <div className="flex flex-col items-center text-center p-6 rounded-2xl border border-border bg-card shadow-sm transition-all hover:shadow-md hover:border-primary/50">
                <div className="h-12 w-12 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center mb-6">
                  <Globe className="h-6 w-6" />
                </div>
                <h3 className="text-xl font-bold mb-2">Global Audience</h3>
                <p className="text-muted-foreground">Know exactly where your clicks are coming from with detailed country and city-level tracking.</p>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full border-t border-border/40 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} LinkLytics. All rights reserved.</p>
      </footer>
    </div>
  );
}