import Link from "next/link";
import { Button } from "./ui/button";
import { Pencil } from "lucide-react";

export function CreateLinkButton() {

    return (
        <div className="flex mb-8">

            <Link href="/create">
                <Button variant="outline" className="gap-2 px-6 py-6 text-base rounded-xl cursor-pointer hover:border-primary hover:text-primary transition-colors">
                    <Pencil className="h-4 w-4 hover:border-primary hover:text-primary" />
                    Create New
                </Button>
            </Link>
        </div>
    );
}