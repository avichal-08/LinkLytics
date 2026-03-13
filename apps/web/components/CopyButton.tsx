"use client";

import { useState } from "react";

import { Copy, Check } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CopyButton({ text } : { text: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div>
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
    )
}