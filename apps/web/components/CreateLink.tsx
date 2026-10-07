"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { 
    ArrowLeft, 
    Link2, 
    AlertCircle, 
    CheckCircle2, 
    Copy, 
    Check, 
    ExternalLink,
    BarChart2,
    Sparkles
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { createLink } from "@/lib/client/createLink";

export default function CreateLink() {
    const urlRef = useRef<HTMLInputElement>(null);
    const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
    const [error, setError] = useState<string | null>(null);
    
    const [isLoading, setIsLoading] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        const value = urlRef.current?.value.trim();
        if (!value) return;

        setIsLoading(true);
        setError(null);
        setRedirectUrl(null);
        setCopied(false);

        const payload = await createLink(value);
        
        if (payload.success) {
            setRedirectUrl(payload.redirectUrl);
            if (urlRef.current) urlRef.current.value = "";
        } else {
            setError(payload.message);
        }
        
        setIsLoading(false);
    };

    const copyToClipboard = () => {
        if (redirectUrl) {
            navigator.clipboard.writeText(redirectUrl);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const slug = redirectUrl ? redirectUrl.split("/").pop() : "";

    return (
        <div className="max-w-xl mx-auto px-4 py-8 sm:py-12 flex flex-col min-h-screen">
            {/* Small Breadcrumb Back */}
            <div className="mb-6">
                <Link 
                    href="/dashboard"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-neutral-500 hover:text-neutral-900 transition-colors"
                >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    <span>Back to links</span>
                </Link>
            </div>

            <Card className="border border-border/80 shadow-xs bg-card rounded-2xl overflow-hidden">
                <CardHeader className="pb-4 border-b border-border/60">
                    <div className="flex items-center gap-2.5 mb-1">
                        <div className="h-7 w-7 rounded-lg bg-neutral-900 text-white flex items-center justify-center shadow-xs">
                            <Link2 className="h-3.5 w-3.5 stroke-[2.5]" />
                        </div>
                        <CardTitle className="text-lg font-semibold tracking-tight text-neutral-900 font-display">
                            Create a short link
                        </CardTitle>
                    </div>
                    <CardDescription className="text-xs text-neutral-500">
                        Paste your destination URL below to generate an optimized short link with analytics.
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-5 pt-6">
                        {error && (
                            <div className="p-3 bg-red-50 border border-red-200/80 rounded-xl flex items-center gap-2.5 text-red-700 text-xs">
                                <AlertCircle className="h-4 w-4 shrink-0 text-red-600" />
                                <span>{error}</span>
                            </div>
                        )}

                        {redirectUrl && (
                            <div className="p-4 bg-emerald-50/70 border border-emerald-200/80 rounded-xl space-y-3">
                                <div className="flex items-center justify-between gap-2">
                                    <div className="flex items-center gap-2 text-emerald-800 overflow-hidden">
                                        <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-600" />
                                        <span className="font-semibold text-xs uppercase tracking-wider text-emerald-700">Link created successfully</span>
                                    </div>
                                    <Button 
                                        type="button"
                                        variant="outline" 
                                        size="sm" 
                                        className="h-7 px-2.5 text-xs text-emerald-800 bg-white border-emerald-300 hover:bg-emerald-50 rounded-lg gap-1.5 cursor-pointer shadow-2xs"
                                        onClick={copyToClipboard}
                                    >
                                        {copied ? (
                                            <>
                                                <Check className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>Copied</span>
                                            </>
                                        ) : (
                                            <>
                                                <Copy className="h-3.5 w-3.5 text-emerald-600" />
                                                <span>Copy</span>
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="p-2.5 bg-white/90 border border-emerald-200/60 rounded-lg font-mono text-xs text-neutral-900 truncate">
                                    {redirectUrl}
                                </div>

                                {slug && (
                                    <div className="flex items-center gap-3 pt-1 text-xs">
                                        <Link
                                            href={`/dashboard/${slug}`}
                                            className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors"
                                        >
                                            <BarChart2 className="h-3.5 w-3.5" />
                                            <span>View analytics</span>
                                        </Link>
                                        <a
                                            href={redirectUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-neutral-600 hover:text-neutral-900 flex items-center gap-1 font-medium transition-colors"
                                        >
                                            <ExternalLink className="h-3.5 w-3.5" />
                                            <span>Test redirect</span>
                                        </a>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className="space-y-1.5">
                            <Label htmlFor="url" className="text-xs font-medium text-neutral-700">
                                Destination URL <span className="text-red-500">*</span>
                            </Label>
                            <Input 
                                id="url" 
                                type="url" 
                                ref={urlRef}
                                placeholder="https://example.com/my-long-landing-page..." 
                                required
                                className="h-10 text-sm bg-white border-border/80 focus-visible:ring-1 focus-visible:ring-neutral-900 focus-visible:border-neutral-900 rounded-lg shadow-2xs"
                            />
                            <p className="text-[11px] text-neutral-400">
                                Enter the full destination including https://
                            </p>
                        </div>
                    </CardContent>
                    
                    <CardFooter className="flex items-center justify-end gap-2.5 border-t border-border/60 p-4 bg-neutral-50/50">
                        <Link 
                            href="/dashboard"
                            className="inline-flex items-center justify-center h-9 px-3.5 text-xs font-medium text-neutral-700 bg-white border border-border/80 hover:bg-neutral-50 rounded-lg shadow-2xs cursor-pointer transition-colors"
                        >
                            Cancel
                        </Link>
                        <Button 
                            type="submit" 
                            disabled={isLoading} 
                            className="h-9 px-4 text-xs font-medium bg-neutral-900 text-white hover:bg-neutral-800 rounded-lg shadow-xs cursor-pointer flex items-center gap-1.5"
                        >
                            <Sparkles className="h-3.5 w-3.5" />
                            <span>{isLoading ? "Generating..." : "Create link"}</span>
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}
