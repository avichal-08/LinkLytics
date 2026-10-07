"use client";

import { signOut } from "next-auth/react";
import { LogOut, User, Settings } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface UserProfileProps {
    user: {
        name?: string | null;
        image?: string | null;
        email?: string | null;
    };
}

export function UserProfile({ user }: UserProfileProps) {
    const initials = user.name
        ? user.name
            .split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase()
        : "U";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none group">
                <Avatar className="h-8 w-8 rounded-full border border-border/80 ring-2 ring-transparent transition-all group-hover:ring-border/60 cursor-pointer">
                    <AvatarImage src={user.image || ""} alt={user.name || "User profile"} />
                    <AvatarFallback className="text-xs font-medium bg-muted text-foreground">
                        {initials}
                    </AvatarFallback>
                </Avatar>
            </DropdownMenuTrigger>

            <DropdownMenuContent align="end" className="w-56 p-1.5 shadow-md">
                <div className="px-2.5 py-2">
                    <p className="text-xs font-semibold text-foreground truncate">
                        {user.name || "My Account"}
                    </p>
                    {user.email && (
                        <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                            {user.email}
                        </p>
                    )}
                </div>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem className="cursor-pointer text-xs gap-2 py-1.5">
                    <User className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer text-xs gap-2 py-1.5">
                    <Settings className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="my-1" />
                <DropdownMenuItem
                    className="text-red-600 focus:text-red-600 focus:bg-red-500/10 cursor-pointer text-xs gap-2 py-1.5"
                    onClick={() => signOut({ callbackUrl: "/" })}
                >
                    <LogOut className="h-3.5 w-3.5 text-red-600" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
