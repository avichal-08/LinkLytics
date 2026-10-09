"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
    Copy,
    Check,
    ExternalLink,
    MoreHorizontal,
    BarChart2,
    Trash2,
    Calendar,
    Globe,
    Link2
} from "lucide-react";
import { Button } from "./ui/button";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "./ui/alert-dialog";
import { deleteLinkAction } from "@/app/dashboard/action";

export interface LinkItem {
    id: string;
    slug: string;
    destinationUrl: string;
    createdAt: Date | string;
    clicks?: number | string;
}

export function LinkCard({ link }: { link: LinkItem }) {
    const router = useRouter();
    const [copied, setCopied] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
    const [imageError, setImageError] = useState(false);

    const domain = (() => {
        try {
            const url = new URL(
                link.destinationUrl.startsWith("http")
                    ? link.destinationUrl
                    : `https://${link.destinationUrl}`
            );
            return url.hostname.replace(/^www\./, "");
        } catch {
            return "";
        }
    })();

    const shortUrl = typeof window !== "undefined"
        ? `${window.location.origin}/${link.slug}`
        : `http://localhost:3001/${link.slug}`;

    const handleCopy = (e: React.MouseEvent, urlToCopy = shortUrl) => {
        e.stopPropagation();
        navigator.clipboard.writeText(urlToCopy);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const handleOpenDestination = (e: React.MouseEvent) => {
        e.stopPropagation();
        window.open(link.destinationUrl, "_blank", "noopener,noreferrer");
    };

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLinkAction(link.id.toString());
            router.refresh();
        } catch (err) {
            console.error("Failed to delete link", err);
        } finally {
            setIsDeleting(false);
            setIsDeleteDialogOpen(false);
        }
    };

    const clickCount = Number(link.clicks ?? 0);

    const formattedDate = (() => {
        try {
            const d = new Date(link.createdAt);
            return d.toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric"
            });
        } catch {
            return "";
        }
    })();

    return (
        <>
            <div
                onClick={() => router.push(`/dashboard/${link.slug}`)}
                className={`group flex flex-col sm:flex-row sm:items-center justify-between p-4 sm:px-5 sm:py-3.5 gap-3.5 sm:gap-4 transition-colors duration-150 hover:bg-neutral-50/80 cursor-pointer ${
                    isDeleting ? "opacity-40 pointer-events-none" : ""
                }`}
            >
                {/* Left: Favicon & URLs */}
                <div className="flex items-center gap-3.5 min-w-0 flex-1">
                    <div className="h-9 w-9 rounded-lg bg-neutral-100 border border-neutral-200/60 flex items-center justify-center shrink-0 text-neutral-600 overflow-hidden">
                        {domain && !imageError ? (
                            <img
                                src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
                                alt={domain}
                                className="h-4 w-4 rounded-xs"
                                onError={() => setImageError(true)}
                            />
                        ) : (
                            <Link2 className="h-4 w-4 text-neutral-500" />
                        )}
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                            <span className="font-semibold text-sm text-neutral-900 group-hover:text-blue-600 transition-colors">
                                /{link.slug}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground truncate max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg mt-0.5">
                            {link.destinationUrl}
                        </p>
                    </div>
                </div>

                {/* Middle: Clicks & Date */}
                <div className="flex items-center gap-4 sm:gap-6 shrink-0 text-xs text-muted-foreground pl-12 sm:pl-0">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-neutral-100/90 text-neutral-700 font-medium">
                        <BarChart2 className="h-3.5 w-3.5 text-neutral-500" />
                        <span>{clickCount.toLocaleString()} {clickCount === 1 ? "click" : "clicks"}</span>
                    </div>

                    <div
                        className="hidden md:inline-flex items-center gap-1.5 text-neutral-500"
                        suppressHydrationWarning
                    >
                        <Calendar className="h-3.5 w-3.5 text-neutral-400" />
                        <span>{formattedDate}</span>
                    </div>
                </div>

                {/* Right: Actions */}
                <div
                    className="flex items-center justify-end gap-1 shrink-0 pl-12 sm:pl-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-border/40"
                    onClick={(e) => e.stopPropagation()}
                >
                    {/* Copy Link Button */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={(e) => handleCopy(e)}
                        className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title={copied ? "Copied!" : "Copy link"}
                        aria-label="Copy short link"
                    >
                        {copied ? (
                            <Check className="h-3.5 w-3.5 text-green-600" />
                        ) : (
                            <Copy className="h-3.5 w-3.5" />
                        )}
                    </Button>

                    {/* Open Destination */}
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={handleOpenDestination}
                        className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                        title="Open destination URL"
                        aria-label="Open destination URL"
                    >
                        <ExternalLink className="h-3.5 w-3.5" />
                    </Button>

                    {/* More Menu Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
                                    aria-label="More options"
                                />
                            }
                        >
                            <MoreHorizontal className="h-3.5 w-3.5" />
                        </DropdownMenuTrigger>

                        <DropdownMenuContent align="end" className="w-48 p-1 shadow-md">
                            <DropdownMenuItem
                                onClick={() => router.push(`/dashboard/${link.slug}`)}
                                className="cursor-pointer text-xs gap-2 py-1.5"
                            >
                                <BarChart2 className="h-3.5 w-3.5 text-neutral-500" />
                                <span>View analytics</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(e) => handleCopy(e, shortUrl)}
                                className="cursor-pointer text-xs gap-2 py-1.5"
                            >
                                <Copy className="h-3.5 w-3.5 text-neutral-500" />
                                <span>Copy short URL</span>
                            </DropdownMenuItem>

                            <DropdownMenuItem
                                onClick={(e) => handleCopy(e, link.destinationUrl)}
                                className="cursor-pointer text-xs gap-2 py-1.5"
                            >
                                <Globe className="h-3.5 w-3.5 text-neutral-500" />
                                <span>Copy destination URL</span>
                            </DropdownMenuItem>

                            <DropdownMenuSeparator className="my-1" />

                            <DropdownMenuItem
                                variant="destructive"
                                onClick={() => setIsDeleteDialogOpen(true)}
                                className="cursor-pointer text-xs gap-2 py-1.5 text-red-600 focus:text-red-600 focus:bg-red-500/10"
                            >
                                <Trash2 className="h-3.5 w-3.5 text-red-600" />
                                <span>Delete link</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Delete Confirmation Alert Dialog */}
            <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Delete shortened link?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This will permanently delete <strong>/{link.slug}</strong> and remove all associated analytics. This action cannot be undone.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel disabled={isDeleting} className="cursor-pointer">
                            Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDelete}
                            disabled={isDeleting}
                            className="bg-red-600 hover:bg-red-700 text-white cursor-pointer"
                        >
                            {isDeleting ? "Deleting..." : "Delete link"}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
