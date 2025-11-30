import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export async function GET(req: Request) {
    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/jwt=([^;]+)/);
    const token = tokenMatch?.[1];

    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const userId = payload.userId;
    const role = payload.role;

    if (!userId || !role) return NextResponse.json({ error: "Invalid token payload" }, { status: 401 });

    if (role === "ADMIN") {
        const chats = await prisma.chat.findMany({
            where: { adminId: userId },
            include: {
                user: true,
                messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
            },
            orderBy: { id: "asc" },
        });
        return NextResponse.json(chats);
    } else {
        let chat = await prisma.chat.findFirst({
            where: { userId },
            include: {
                admin: true,
                messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
            },
        });

        if (!chat) {
            const admin = await prisma.users.findFirst({ where: { role: "ADMIN" } });
            if (!admin) return NextResponse.json({ error: "No admin found" }, { status: 500 });

            chat = await prisma.chat.create({
                data: { userId, adminId: admin.id },
                include: {
                    admin: true,
                    messages: { include: { sender: true }, orderBy: { createdAt: "asc" } },
                },
            });
        }

        return NextResponse.json(chat);
    }
}

export async function POST(req: Request) {
    const { chatId, content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

    const cookieHeader = req.headers.get("cookie") || "";
    const tokenMatch = cookieHeader.match(/jwt=([^;]+)/);
    const token = tokenMatch?.[1];
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    const senderId = payload.userId;

    let chat = await prisma.chat.findUnique({ where: { id: chatId } });
    if (!chat) return NextResponse.json({ error: "Chat not found" }, { status: 404 });

    const message = await prisma.message.create({
        data: { chatId: chat.id, senderId, content },
        include: { sender: true },
    });

    return NextResponse.json(message);
}
