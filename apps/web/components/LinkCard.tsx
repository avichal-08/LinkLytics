"use client";

import { useState } from "react";
import Link from "next/link";
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

interface LinkItem {
    id: string;
    slug: string;
    destinationUrl: string;
    createdAt: Date;
}

export function LinkCard({ link }: { link: LinkItem }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        
        setIsDeleting(true);
        await deleteLinkAction(link.id.toString());
    };

    return (
        <Link
            href={`/dashboard/${link.id}`}
            className={`block p-5 border border-border rounded-xl hover:border-primary transition-colors bg-card text-card-foreground shadow-sm relative group ${isDeleting ? "opacity-50 pointer-events-none" : ""}`}
        >
            <div className="flex justify-between items-start mb-1">
                <span className="font-mono font-bold text-primary">
                    /{link.slug}
                </span>
                
                <div className="flex items-center gap-4">
                    <span className="text-xs text-muted-foreground">
                        {new Date(link.createdAt).toLocaleDateString()}
                    </span>
                    
                    <AlertDialog>
                        <AlertDialogTrigger>
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-muted-foreground hover:text-red-500 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-opacity"
                                aria-label="Delete link"
                                onClick={(e) => {
                                    e.preventDefault(); 
                                    e.stopPropagation();
                                }}
                            >
                                <Trash2 className="h-4 w-4" />
                            </Button>
                        </AlertDialogTrigger>
                        
                        <AlertDialogContent onClick={(e) => {
                            e.preventDefault(); 
                            e.stopPropagation();
                        }}>
                            <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                    This action cannot be undone. This will permanently delete the link 
                                    <strong> /{link.slug}</strong> and remove all associated analytics data.
                                </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                                <AlertDialogCancel onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                }}>
                                    Cancel
                                </AlertDialogCancel>
                                <AlertDialogAction 
                                    onClick={handleDelete}
                                    className="bg-red-500 hover:bg-red-600 text-white"
                                >
                                    Delete Link
                                </AlertDialogAction>
                            </AlertDialogFooter>
                        </AlertDialogContent>
                    </AlertDialog>
                </div>
            </div>
            <p className="text-sm text-muted-foreground truncate pr-12">
                {link.destinationUrl}
            </p>
        </Link>
    );
}