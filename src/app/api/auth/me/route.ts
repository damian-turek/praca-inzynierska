import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'

export async function GET() {
    const cookieStore = await cookies()
    const token = cookieStore.get('jwt')?.value

    if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    try {
        const decoded = jwt.verify(token, JWT_SECRET)
        return NextResponse.json(decoded)
    } catch {
        return NextResponse.json({ error: 'Invalid token' }, { status: 401 })
    }
}
