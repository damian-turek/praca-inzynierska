import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {
        const reservationsRaw = await prisma.sharedSpaceReservation.findMany({
            select: { start_time: true },
        });

        const reservationsMap = new Map<string, number>();
        for (const r of reservationsRaw) {
            const month = r.start_time.toISOString().slice(0, 7); // np. "2025-11"
            reservationsMap.set(month, (reservationsMap.get(month) || 0) + 1);
        }
        const reservations = Array.from(reservationsMap, ([month, count]) => ({ month, count }));

        const reportsGrouped = await prisma.problemReport.groupBy({
            by: ["status"],
            _count: { status: true },
        });
        const reports = reportsGrouped.map(r => ({
            status: r.status,
            count: r._count.status,
        }));

        return NextResponse.json({ reservations, reports });
    } catch (err) {
        console.error("Błąd dashboard API:", err);
        return NextResponse.json({ error: "Błąd serwera" }, { status: 500 });
    }
}
