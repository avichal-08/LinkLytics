import { db, links } from "@repo/db";
import { eq, desc } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/configs/authOptions";

import { Header } from "@/components/Header";
import { CreateLinkButton } from "@/components/CreateLinkButton";
import { LinkCard } from "@/components/LinkCard";

export default async function DashboardPage() {
    const session = await getServerSession(authOptions);
    if (!session) redirect("/");

    const userLinks = await db
        .select()
        .from(links)
        .where(eq(links.userId, session.user.id))
        .orderBy(desc(links.createdAt));

    return (
        <div className="max-w-4xl mx-auto p-8 flex flex-col min-h-screen">
            <Header user={session.user} />

            <main className="flex-1 flex flex-col max-w-2xl mx-auto w-full">
                <CreateLinkButton />

                <div className="flex flex-col gap-4">
                    {userLinks.map((link) => (
                        <LinkCard key={link.id} link={link} />
                    ))}

                    {userLinks.length === 0 && (
                        <div className="text-center py-10 border border-dashed rounded-xl border-border bg-muted/50">
                            <p className="text-muted-foreground">No links created yet.</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}