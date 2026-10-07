import Link from "next/link";
import { Link2, HelpCircle } from "lucide-react";
import { UserProfile } from "./UserProfile";
import { Button } from "./ui/button";

interface HeaderProps {
    user: {
        name?: string | null;
        image?: string | null;
        email?: string | null;
    };
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="sticky top-0 z-40 w-full border-b border-border/80 bg-background/95 backdrop-blur-md supports-[backdrop-filter]:bg-background/80">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
                {/* Left Brand & Navigation */}
                <div className="flex items-center gap-8">
                    <Link
                        href="/dashboard"
                        className="flex items-center gap-2.5 transition-opacity hover:opacity-90 group"
                    >
                        <div className="h-8 w-8 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs transition-transform group-hover:scale-105">
                            <Link2 className="h-4 w-4 stroke-[2.5]" />
                        </div>
                        <span className="font-display text-base font-bold tracking-tight text-foreground">
                            LinkLytics
                        </span>
                    </Link>

                    {/* Nav Links */}
                    <nav className="hidden md:flex items-center gap-1 text-sm">
                        <Link
                            href="/dashboard"
                            className="px-3 py-1.5 rounded-md font-medium text-foreground bg-muted/80 transition-colors"
                        >
                            Links
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                            Analytics
                        </Link>
                        <Link
                            href="/dashboard"
                            className="px-3 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/40 transition-colors"
                        >
                            Settings
                        </Link>
                    </nav>
                </div>

                {/* Right Actions */}
                <div className="flex items-center gap-2 sm:gap-3">
                    <a
                        href="https://github.com/avichal-08"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex"
                    >
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-muted-foreground hover:text-foreground rounded-lg"
                            aria-label="Help and resources"
                        >
                            <HelpCircle className="h-4 w-4" />
                        </Button>
                    </a>

                    <UserProfile user={user} />
                </div>
            </div>
        </header>
    );
}
