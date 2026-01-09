import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/configs/authOptions";
import createLink from "../../../lib/server/createLink";

export async function POST(req: NextRequest) {
    try {
        const session = await getServerSession(authOptions);

        if (!session) {
            return NextResponse.json(
                { success: false, message: "Please login" },
                { status: 401 }
            );
        }

        const body = await req.json();
        const { url } = body;

        if (!url || typeof url !== "string") {
            return NextResponse.json(
                { success: false, message: "Invalid URL" },
                { status: 400 }
            );
        }

        const redirectUrl = await createLink(url, session.user?.id);

        if (!redirectUrl) {
            return NextResponse.json(
                { success: false, message: "Failed to create link" },
                { status: 500 }
            );
        }

        return NextResponse.json(
            { success: true, redirectUrl },
            { status: 201 }
        );

    } catch (error) {
        console.error("Create link error:", error);

        return NextResponse.json(
            { success: false, message: "Please try again later" },
            { status: 500 }
        );
    }
}
