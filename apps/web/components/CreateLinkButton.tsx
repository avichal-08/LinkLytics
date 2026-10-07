import Link from "next/link";
import { Plus } from "lucide-react";
import { Button } from "./ui/button";

export function CreateLinkButton({ className = "" }: { className?: string }) {
    return (
        <Link href="/create" className={className}>
            <Button
                className="bg-neutral-900 text-white hover:bg-neutral-800 shadow-xs hover:shadow-sm font-medium text-sm h-9 px-3.5 rounded-lg flex items-center gap-1.5 transition-all active:scale-[0.98] cursor-pointer"
            >
                <Plus className="h-4 w-4 stroke-[2.5]" />
                <span>Create link</span>
            </Button>
        </Link>
    );
}
