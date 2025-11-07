import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
    try {
        const spaces = await prisma.sharedSpace.findMany({
            orderBy: { id: "asc" },
        });
        return NextResponse.json(spaces);
    } catch (err) {
        console.error("Błąd GET /shared-spaces:", err);
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
    }
}

export async function POST(req: Request) {
    try {
        const { name, description, max_places } = await req.json();

        if (!name || typeof max_places !== "number") {
            return NextResponse.json({ error: "Nieprawidłowe dane" }, { status: 400 });
        }

        const newSpace = await prisma.sharedSpace.create({
            data: {
                name,
                description,
                max_places,
            },
        });

        return NextResponse.json(newSpace);
    } catch (err) {
        console.error("Błąd POST /shared-spaces:", err);
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
    }
}
