import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export async function GET() {
    const cookieStore = await cookies();
    const token = cookieStore.get("jwt")?.value;
    if (!token) return NextResponse.json([], { status: 401 });

    let userId: number;
    try {
        const payload = jwt.verify(token, JWT_SECRET) as { userId: number };
        userId = payload.userId;
    } catch (err) {
        console.error("JWT verification failed:", err);
        return NextResponse.json([], { status: 401 });
    }

    const docs = await prisma.billingDocument.findMany({
        where: { user_id: userId },
        orderBy: { created_at: "desc" },
    });

    return NextResponse.json(docs);
}
