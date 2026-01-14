import {NextRequest, NextResponse} from "next/server";
import { prisma } from "@/lib/prisma";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret";

export async function GET(req: Request) {
    const { searchParams } = new URL(req.url);
    const spaceId = searchParams.get("shared_space_id");

    if (!spaceId) {
        return NextResponse.json({ error: "No space ID" }, { status: 400 });
    }

    try {
        const reservations = await prisma.sharedSpaceReservation.findMany({
            where: { shared_space_id: Number(spaceId) },
            orderBy: { start_time: "asc" },
            include: { user: true }
        });
        return NextResponse.json(reservations);
    } catch (err) {
        console.error("Error GET /reservations:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    const token = req.cookies.get("jwt")?.value;
    if (!token) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    let payload: any;
    try {
        payload = jwt.verify(token, JWT_SECRET);
    } catch {
        return NextResponse.json({ error: "Invalid or expired token" }, { status: 401 });
    }

    try {
        const { shared_space_id, start_time, end_time, places_reserved } = await req.json();

        if (!shared_space_id || !start_time || !end_time || !places_reserved) {
            return NextResponse.json({ error: "Invalid data" }, { status: 400 });
        }

        const space = await prisma.sharedSpace.findUnique({
            where: { id: Number(shared_space_id) },
        });

        if (!space) {
            return NextResponse.json({ error: "Space not found" }, { status: 404 });
        }

        const overlapping = await prisma.sharedSpaceReservation.findMany({
            where: {
                shared_space_id: Number(shared_space_id),
                AND: [
                    { start_time: { lt: new Date(end_time) } },
                    { end_time: { gt: new Date(start_time) } },
                ],
            },
        });

        const totalReserved = overlapping.reduce((sum, r) => sum + r.places_reserved, 0);

        if (totalReserved + places_reserved > space.max_places) {
            return NextResponse.json(
                { error: "Not enough places available in this time slot" },
                { status: 400 }
            );
        }

        const newReservation = await prisma.sharedSpaceReservation.create({
            data: {
                shared_space_id: Number(shared_space_id),
                start_time: new Date(start_time),
                end_time: new Date(end_time),
                places_reserved: Number(places_reserved),
                user_id: payload.userId,
            },
        });

        return NextResponse.json(newReservation);
    } catch (err) {
        console.error("POST /reservations error:", err);
        return NextResponse.json({ error: "Server error" }, { status: 500 });
    }
}