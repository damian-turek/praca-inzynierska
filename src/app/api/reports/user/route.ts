import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('jwt')?.value
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })


        let userId: number
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
            if (!decoded || !decoded.userId) {
                return NextResponse.json({ error: 'Błędny token' }, { status: 401 })
            }
            userId = decoded.userId
        } catch {
            return NextResponse.json({ error: 'Błędny lub wygasły token' }, { status: 401 })
        }

        const reports = await prisma.problemReport.findMany({
            where: { reported_by: userId },
            orderBy: { created_at: 'desc' },
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                created_at: true,
                updated_at: true,
            },
        })

        return NextResponse.json(reports)
    } catch (err) {
        console.error('Błąd w /api/reports/user:', err)
        return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 })
    }
}
