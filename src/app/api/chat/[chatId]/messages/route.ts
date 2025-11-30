import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

// Rozwiązanie parametrów dla App Router dynamic API
async function resolveParams(context: any) {
    if (!context) return {};
    const maybeParams = context.params ?? context;
    return typeof maybeParams?.then === "function" ? await maybeParams : maybeParams;
}

// GET /api/chat/[chatId]/messages
export async function GET(req: Request, context: any) {
    const params = await resolveParams(context);
    const chatId = Number(params?.chatId);

    if (!chatId || Number.isNaN(chatId)) return NextResponse.json([], { status: 200 });

    const messages = await prisma.message.findMany({
        where: { chatId },
        include: { sender: true },
        orderBy: { createdAt: "asc" },
    });

    return NextResponse.json(messages);
}

// POST /api/chat/[chatId]/messages
export async function POST(req: Request, context: any) {
    const params = await resolveParams(context);
    const chatIdParam = params?.chatId ? Number(params.chatId) : undefined;

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
    const { content } = await req.json();
    if (!content?.trim()) return NextResponse.json({ error: "Empty message" }, { status: 400 });

    let chat = chatIdParam ? await prisma.chat.findUnique({ where: { id: chatIdParam } }) : null;

    if (!chat) {
        const admin = await prisma.users.findFirst({ where: { role: "ADMIN" } });
        if (!admin) return NextResponse.json({ error: "No admin found" }, { status: 500 });

        chat = await prisma.chat.create({
            data: {
                userId: senderId,
                adminId: admin.id,
            },
        });
    }

    const message = await prisma.message.create({
        data: {
            chatId: chat.id,
            senderId,
            content,
        },
        include: { sender: true },
    });

    return NextResponse.json(message);
}
