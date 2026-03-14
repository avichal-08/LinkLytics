"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { deleteLinkAction } from "@/app/dashboard/action";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { LinkDeleteButton } from "./LinkDeleteButton";

interface LinkItem {
    id: string;
    slug: string;
    destinationUrl: string;
    createdAt: Date;
}

export function LinkCard({ link }: { link: LinkItem }) {
    const [isDeleting, setIsDeleting] = useState(false);
    const router = useRouter();

    const linkDeleteData = {
        id: link.id,
        slug: link.slug
    }

    return (
        <div
            onClick={() => router.push(`/dashboard/${link.slug}`)}
            className={`block cursor-pointer p-5 border border-border rounded-xl hover:border-primary transition-colors bg-card text-card-foreground shadow-sm relative group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
        >
            <div className="flex justify-between items-start mb-1">
                <span className="font-mono font-bold text-primary">
                    /{link.slug}
                </span>

                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString()}
                    </span>

                    <LinkDeleteButton link={linkDeleteData} />
                </div>
            </div>
            <p className="text-sm text-muted-foreground truncate pr-12">
                {link.destinationUrl}
            </p>
        </div>
    );
}