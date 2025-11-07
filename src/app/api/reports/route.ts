// app/api/reports/route.ts
import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get('jwt')?.value
        let decoded: { userId?: number; role?: string } | null = null

        if (token) {
            try {
                decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role?: string }
            } catch {
                console.warn('Token invalid or expired, continuing without auth')
            }
        }

        const reports = await prisma.problemReport.findMany({
            where: {
                NOT: { status: 'ODRZUCONE' },
            },
            orderBy: { created_at: 'desc' },
        })

        return NextResponse.json(reports)
    } catch (err) {
        console.error('GET /api/reports error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

export async function POST(request: NextRequest) {
    try {
        const token = request.cookies.get('jwt')?.value
        if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

        let decoded: { userId?: number } | null = null
        try {
            decoded = jwt.verify(token, JWT_SECRET) as { userId: number }
        } catch {
            return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
        }

        // ✅ Ensure userId exists
        const userId = decoded.userId
        if (!userId) return NextResponse.json({ error: 'User ID not found in token' }, { status: 401 })

        const body = await request.json()
        const { title, type, description } = body
        if (!title || !type || !description) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
        }

        const newReport = await prisma.problemReport.create({
            data: {
                title,
                description,
                status: 'ZGLOSZONE',
                reported_by: userId, // guaranteed number now
            },
        })

        return NextResponse.json(newReport)
    } catch (err) {
        console.error('POST /api/reports error:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
