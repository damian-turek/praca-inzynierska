import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'

export async function POST(req: Request) {
    const cookieHeader = req.headers.get('cookie') || ''
    const tokenMatch = cookieHeader.match(/jwt=([^;]+)/)
    const token = tokenMatch?.[1]

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    let payload: any
    try {
        payload = jwt.verify(token, JWT_SECRET)
    } catch {
        return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })
    }

    const { title, message } = await req.json()
    if (!title || !message) {
        return NextResponse.json({ error: 'Missing title or message' }, { status: 400 })
    }

    try {
        const news = await prisma.news.create({
            data: {
                title,
                content: message,
                created_by: payload.userId,
                community_id: payload.communityId
            }
        })
        return NextResponse.json(news)
    } catch (err) {
        console.error('Error creating news:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}

// GET /api/news — fetch latest news
export async function GET() {
    try {
        const news = await prisma.news.findMany({
            take: 10,
            orderBy: { created_at: 'desc' },
            include: {
                community: true,
                user: true
            }
        })
        return NextResponse.json(news)
    } catch (err) {
        console.error('Error fetching news:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
