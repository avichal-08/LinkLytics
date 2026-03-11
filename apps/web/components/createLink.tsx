"use client";

import { useRef, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Link as LinkIcon, AlertCircle, CheckCircle2, Copy, Check } from "lucide-react";

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

    return (
        <div className="max-w-2xl mx-auto p-8 flex flex-col min-h-screen">
            <div className="mb-8">
                <Button variant="ghost" className="-ml-4 text-muted-foreground hover:text-primary">
                    <Link href="/dashboard">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                    </Link>
                </Button>
            </div>

            <Card className="border-border shadow-sm">
                <CardHeader>
                    <CardTitle className="text-2xl font-display flex items-center gap-2">
                        <LinkIcon className="h-5 w-5 text-primary" />
                        Create New Link
                    </CardTitle>
                    <CardDescription>
                        Paste a long URL below to generate a trackable, short link.
                    </CardDescription>
                </CardHeader>
                
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-6">
                        
                        {error && (
                            <div className="p-3 bg-red-500/10 border border-red-500/50 rounded-md flex items-center gap-2 text-red-600 dark:text-red-400 text-sm">
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </div>
                        )}

                        {redirectUrl && (
                            <div className="p-4 bg-green-500/10 border border-green-500/50 rounded-lg flex items-center justify-between">
                                <div className="flex items-center gap-2 text-green-700 dark:text-green-400 overflow-hidden">
                                    <CheckCircle2 className="h-5 w-5 shrink-0" />
                                    <span className="font-mono text-sm truncate">{redirectUrl}</span>
                                </div>
                                <Button 
                                    type="button"
                                    variant="ghost" 
                                    size="icon" 
                                    className="shrink-0 text-green-700 hover:bg-green-500/20 dark:text-green-400"
                                    onClick={copyToClipboard}
                                >
                                    {copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4 cursor-pointer" />}
                                </Button>
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label htmlFor="url">Destination URL <span className="text-red-500">*</span></Label>
                            <Input 
                                id="url" 
                                type="url" 
                                ref={urlRef}
                                placeholder="https://example.com/my-super-long-url..." 
                                required
                                className="bg-background"
                            />
                        </div>
                        
                    </CardContent>
                    
                    <CardFooter className="flex justify-end gap-4 border-t border-border pt-6 mt-2">
                        <Button 
                            variant="outline" 
                            type="button" 
                            disabled={isLoading}
                        >
                            <Link href="/dashboard">Cancel</Link>
                        </Button>
                        <Button type="submit" disabled={isLoading} className="cursor-pointer">
                            {isLoading ? "Generating..." : "Get Redirect URL"}
                        </Button>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}