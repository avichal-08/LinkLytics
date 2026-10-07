"use client";

import { useState } from "react";
import { Copy, Check } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CopyButton({ text }: { text: string }) {
    const [copied, setCopied] = useState(false);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(text);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors cursor-pointer"
            onClick={copyToClipboard}
            title={copied ? "Copied!" : "Copy link"}
            aria-label="Copy to clipboard"
        >
            {copied ? (
                <Check className="h-3.5 w-3.5 text-emerald-600" />
            ) : (
                <Copy className="h-3.5 w-3.5" />
            )}
        </Button>
    );
}
