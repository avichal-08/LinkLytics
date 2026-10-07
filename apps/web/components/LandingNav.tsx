"use client";

import Link from "next/link";
import { Link2, ArrowRight } from "lucide-react";
import { Button } from "./ui/button";
import { signIn } from "next-auth/react";

interface LandingNavProps {
  isAuthenticated: boolean;
  userName?: string | null;
}

export function LandingNav({ isAuthenticated }: LandingNavProps) {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-200/80 bg-white/80 backdrop-blur-md supports-[backdrop-filter]:bg-white/70">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand */}
        <Link
          href="/"
          className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
        >
          <div className="h-8 w-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
            <Link2 className="h-4 w-4 stroke-[2.5]" />
          </div>
          <span className="font-display text-base font-bold tracking-tight text-neutral-950">
            LinkLytics
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <a
            href="#product"
            className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
          >
            Product
          </a>
          <a
            href="#features"
            className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
          >
            Features
          </a>
          <a
            href="#analytics"
            className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
          >
            Analytics
          </a>
          <a
            href="#architecture"
            className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
          >
            Architecture
          </a>
          <a
            href="https://github.com/avichal-08"
            target="_blank"
            rel="noopener noreferrer"
            className="text-neutral-500 hover:text-neutral-950 font-medium transition-colors"
          >
            Docs
          </a>
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* GitHub Icon */}
          <a
            href="https://github.com/avichal-08"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-neutral-500 hover:text-neutral-950 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="GitHub"
          >
            <svg className="h-4 w-4 fill-current" viewBox="0 0 24 24" aria-hidden="true">
              <path
                fillRule="evenodd"
                d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                clipRule="evenodd"
              />
            </svg>
          </a>

          {/* X / Twitter Icon */}
          <a
            href="https://x.com/Avichal_08"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex text-neutral-500 hover:text-neutral-950 p-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
            aria-label="X / Twitter"
          >
            <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden="true">
              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 24.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
            </svg>
          </a>

          {isAuthenticated ? (
            <Link 
              href="/dashboard"
              className="inline-flex items-center justify-center bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs h-8 px-3.5 text-xs font-medium rounded-lg gap-1.5 transition-colors cursor-pointer"
            >
              <span>Dashboard</span>
              <ArrowRight className="h-3 w-3" />
            </Link>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                className="text-xs font-medium text-neutral-600 hover:text-neutral-950 h-8 px-2.5 rounded-lg cursor-pointer"
              >
                Sign in
              </Button>
              <Button
                size="sm"
                onClick={() => signIn(undefined, { callbackUrl: "/dashboard" })}
                className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs h-8 px-3 text-xs font-medium rounded-lg cursor-pointer"
              >
                Get started
              </Button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
