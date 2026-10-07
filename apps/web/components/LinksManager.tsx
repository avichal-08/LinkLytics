"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
    Search, 
    X, 
    Link2, 
    Plus, 
    SlidersHorizontal,
    ArrowUpDown,
    Check
} from "lucide-react";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { LinkCard, type LinkItem } from "./LinkCard";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";

interface LinksManagerProps {
    initialLinks: LinkItem[];
}

type FilterOption = "all" | "has_clicks" | "no_clicks";
type SortOption = "newest" | "oldest" | "most_clicks";

export function LinksManager({ initialLinks }: LinksManagerProps) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filter, setFilter] = useState<FilterOption>("all");
    const [sortBy, setSortBy] = useState<SortOption>("newest");

    const filteredAndSortedLinks = useMemo(() => {
        let result = [...initialLinks];

        // 1. Search Query
        if (searchQuery.trim()) {
            const query = searchQuery.toLowerCase().trim();
            result = result.filter(
                (l) =>
                    l.slug.toLowerCase().includes(query) ||
                    l.destinationUrl.toLowerCase().includes(query)
            );
        }

        // 2. Filter
        if (filter === "has_clicks") {
            result = result.filter((l) => Number(l.clicks ?? 0) > 0);
        } else if (filter === "no_clicks") {
            result = result.filter((l) => Number(l.clicks ?? 0) === 0);
        }

        // 3. Sort
        result.sort((a, b) => {
            if (sortBy === "newest") {
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
            } else if (sortBy === "oldest") {
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
            } else if (sortBy === "most_clicks") {
                return Number(b.clicks ?? 0) - Number(a.clicks ?? 0);
            }
            return 0;
        });

        return result;
    }, [initialLinks, searchQuery, filter, sortBy]);

    // Global empty state (user has never created any links)
    if (initialLinks.length === 0) {
        return (
            <div className="rounded-2xl border border-dashed border-border/80 bg-neutral-50/50 p-12 text-center flex flex-col items-center justify-center my-4">
                <div className="h-12 w-12 rounded-2xl bg-neutral-100 border border-neutral-200/80 flex items-center justify-center text-neutral-500 mb-4 shadow-xs">
                    <Link2 className="h-6 w-6 stroke-[1.8]" />
                </div>
                <h3 className="text-base font-semibold text-neutral-900 mb-1">
                    No links yet
                </h3>
                <p className="text-sm text-neutral-500 max-w-sm mb-6 leading-relaxed">
                    Create your first short link and start tracking how people interact with it in real-time.
                </p>
                <Link href="/create">
                    <Button className="bg-neutral-900 text-white hover:bg-neutral-800 h-9 px-4 rounded-lg font-medium text-sm flex items-center gap-2 shadow-xs cursor-pointer">
                        <Plus className="h-4 w-4 stroke-[2.5]" />
                        <span>Create your first link</span>
                    </Button>
                </Link>
            </div>
        );
    }

    const filterLabels: Record<FilterOption, string> = {
        all: "All links",
        has_clicks: "With clicks",
        no_clicks: "Zero clicks",
    };

    const sortLabels: Record<SortOption, string> = {
        newest: "Newest first",
        oldest: "Oldest first",
        most_clicks: "Most clicks",
    };

    return (
        <div className="space-y-4">
            {/* Toolbar: Search, Filter, Sort */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                {/* Search Bar */}
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400 pointer-events-none" />
                    <Input
                        type="text"
                        placeholder="Search links by slug or destination..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-8 h-9 text-xs sm:text-sm bg-white border-border/80 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 rounded-lg shadow-2xs"
                    />
                    {searchQuery && (
                        <button
                            type="button"
                            onClick={() => setSearchQuery("")}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 cursor-pointer"
                        >
                            <X className="h-3.5 w-3.5" />
                            <span className="sr-only">Clear search</span>
                        </button>
                    )}
                </div>

                {/* Filters & Sort Controls */}
                <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
                    {/* Filter Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 gap-1.5 text-xs font-medium text-neutral-700 bg-white border-border/80 hover:bg-neutral-50 rounded-lg shadow-2xs cursor-pointer"
                                />
                            }
                        >
                            <SlidersHorizontal className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{filterLabels[filter]}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-1">
                            <DropdownMenuItem
                                onClick={() => setFilter("all")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>All links</span>
                                {filter === "all" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setFilter("has_clicks")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>With clicks</span>
                                {filter === "has_clicks" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setFilter("no_clicks")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>Zero clicks</span>
                                {filter === "no_clicks" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Sort Dropdown */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="h-9 px-3 gap-1.5 text-xs font-medium text-neutral-700 bg-white border-border/80 hover:bg-neutral-50 rounded-lg shadow-2xs cursor-pointer"
                                />
                            }
                        >
                            <ArrowUpDown className="h-3.5 w-3.5 text-neutral-500" />
                            <span>{sortLabels[sortBy]}</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-40 p-1">
                            <DropdownMenuItem
                                onClick={() => setSortBy("newest")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>Newest first</span>
                                {sortBy === "newest" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy("oldest")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>Oldest first</span>
                                {sortBy === "oldest" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                            <DropdownMenuItem
                                onClick={() => setSortBy("most_clicks")}
                                className="text-xs py-1.5 flex items-center justify-between cursor-pointer"
                            >
                                <span>Most clicks</span>
                                {sortBy === "most_clicks" && <Check className="h-3.5 w-3.5 text-neutral-900" />}
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Links Resource List */}
            {filteredAndSortedLinks.length > 0 ? (
                <div className="bg-card border border-border/80 rounded-xl shadow-xs divide-y divide-border/60 overflow-hidden">
                    {filteredAndSortedLinks.map((link) => (
                        <LinkCard key={link.id} link={link} />
                    ))}
                </div>
            ) : (
                /* Search Empty State */
                <div className="rounded-xl border border-dashed border-border/80 bg-neutral-50/50 p-8 text-center my-4">
                    <p className="text-sm text-neutral-500 mb-2">
                        No links found matching <span className="font-semibold text-neutral-800">&quot;{searchQuery}&quot;</span>
                    </p>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                            setSearchQuery("");
                            setFilter("all");
                        }}
                        className="text-xs text-neutral-600 hover:text-neutral-900 cursor-pointer"
                    >
                        Reset filters
                    </Button>
                </div>
            )}
        </div>
    );
}
