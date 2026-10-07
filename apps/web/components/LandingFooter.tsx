import Link from "next/link";
import { Link2 } from "lucide-react";

export function LandingFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-neutral-200/80 bg-neutral-50/50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 sm:gap-12">
          {/* Left Brand Column */}
          <div className="md:col-span-5 space-y-3">
            <Link href="/" className="flex items-center gap-2.5 group">
              <div className="h-7 w-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                <Link2 className="h-3.5 w-3.5 stroke-[2.5]" />
              </div>
              <span className="font-display text-base font-bold tracking-tight text-neutral-950">
                LinkLytics
              </span>
            </Link>
            <p className="text-sm text-neutral-500 max-w-sm">
              Short links. Better insights. Track and optimize every link with real-time analytics.
            </p>
            <p className="text-xs text-neutral-400 pt-2">
              &copy; {currentYear} LinkLytics. All rights reserved.
            </p>
          </div>

          {/* Right Columns */}
          <div className="md:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8">
            {/* Product */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Product
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li>
                  <Link href="/dashboard" className="hover:text-neutral-950 transition-colors">
                    Dashboard
                  </Link>
                </li>
                <li>
                  <Link href="/create" className="hover:text-neutral-950 transition-colors">
                    Shorten Link
                  </Link>
                </li>
                <li>
                  <a href="#analytics" className="hover:text-neutral-950 transition-colors">
                    Analytics
                  </a>
                </li>
              </ul>
            </div>

            {/* Resources */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Resources
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li>
                  <a
                    href="https://github.com/avichal-08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    Documentation
                  </a>
                </li>
                <li>
                  <a
                    href="https://github.com/avichal-08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    GitHub Repository
                  </a>
                </li>
              </ul>
            </div>

            {/* Social */}
            <div className="space-y-3">
              <h4 className="text-xs font-semibold text-neutral-900 uppercase tracking-wider">
                Connect
              </h4>
              <ul className="space-y-2 text-xs sm:text-sm text-neutral-600">
                <li>
                  <a
                    href="https://github.com/avichal-08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    GitHub
                  </a>
                </li>
                <li>
                  <a
                    href="https://x.com/Avichal_08"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-neutral-950 transition-colors"
                  >
                    X (Twitter)
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
