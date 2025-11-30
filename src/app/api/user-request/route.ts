import { prisma } from '@/lib/prisma'
import { NextResponse } from 'next/server'

export async function POST(req: Request) {
    try {
        const data = await req.json()
        await prisma.userRequest.create({ data })
        return NextResponse.json({ message: 'Request saved' }, { status: 200 })
    } catch (err) {
        console.error(err)
        return NextResponse.json({ error: 'Failed to save request' }, { status: 500 })
    }
}
