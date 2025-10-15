import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    const { title, message, id } = await request.json()

    const news = await prisma.news.create({
        data: {
            title,
            content: message,
            created_by: id
        }
    })

    return NextResponse.json(news)
}

export async function GET(request: Request) {
    const news = await prisma.news.findMany({
        take: 10,
        orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(news)
}