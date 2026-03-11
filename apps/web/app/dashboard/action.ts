"use server";

import { db, links } from "@repo/db";
import { eq, and } from "drizzle-orm";
import { getServerSession } from "next-auth";
import { revalidatePath } from "next/cache";
import { authOptions } from "@/lib/configs/authOptions";

import { redis } from "@/lib/configs/redis"; 

export async function deleteLinkAction(linkId: string) {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
        return { error: "Unauthorized" };
    }

    try {
        
        const linkToDelete = await db.query.links.findFirst({
            where: and(
                eq(links.id, linkId),
                eq(links.userId, session.user.id)
            ),
            columns: {
                slug: true
            }
        });

        if (!linkToDelete) {
            return { error: "Link not found or unauthorized" };
        }

        await db.delete(links).where(
            eq(links.id, linkId)
        );

        await redis.del(linkToDelete.slug);

        revalidatePath("/dashboard");
        return { success: true };
        
    } catch (error) {
        console.error("Failed to delete link:", error);
        return { error: "Failed to delete link" };
    }
}