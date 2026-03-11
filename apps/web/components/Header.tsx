import { ModeToggle } from "./ModeToggle";
import { UserProfile } from "./UserProfile";

interface HeaderProps {
    user: {
        name?: string | null;
        image?: string | null;
    };
}

export function Header({ user }: HeaderProps) {
    return (
        <header className="flex items-center justify-between pb-6 mb-8 border-b border-border">
            <div className="text-2xl font-display font-bold tracking-tighter text-primary">
                LinkLytics
            </div>

            <div className="flex items-center gap-4">
                <ModeToggle />

                <UserProfile user={user} />
            </div>
        </header>
    );
}