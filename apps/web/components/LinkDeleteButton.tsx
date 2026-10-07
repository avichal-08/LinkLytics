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

interface LinkDetail {
    id: string;
    slug: string;
}

export function LinkDeleteButton({ link }: { link: LinkDetail }) {
    const router = useRouter();
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        setIsDeleting(true);
        try {
            await deleteLinkAction(link.id.toString());
            router.push(`/dashboard`);
        } catch (err) {
            console.error("Failed to delete link:", err);
            setIsDeleting(false);
        }
    };

    return (
        <div onClick={(e) => e.stopPropagation()}>
            <AlertDialog>
                <AlertDialogTrigger
                    render={
                        <Button
                            variant="outline"
                            size="sm"
                            className="h-8 px-2.5 text-xs font-medium text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200/80 rounded-lg gap-1.5 transition-colors cursor-pointer"
                            aria-label="Delete link"
                        />
                    }
                >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span>Delete</span>
                </AlertDialogTrigger>

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
        </div>
    );
}
