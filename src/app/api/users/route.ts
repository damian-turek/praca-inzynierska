import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET as string

type JwtPayload = {
    userId: string
    iat: number
    exp: number
}

export async function GET(request: NextRequest) {
    try {
        const authHeader = request.headers.get('authorization')
        const token = authHeader?.split(' ')[1]

        if (!token) {
            return NextResponse.json({ error: 'Brak tokena' }, { status: 401 })
        }

        let payload: JwtPayload
        try {
            payload = jwt.verify(token, JWT_SECRET) as JwtPayload
        } catch (error) {
            return NextResponse.json({ error: 'Błędny lub wygasły token' }, { status: 401 })
        }

        const user = await prisma.users.findUnique({
            where: { id: parseInt(payload.userId) },
            select: {
                id: true,
                first_name: true,
                email: true,
                second_name: true,
                created_at: true,
                phone_number: true,
                apartment_id: true,
                role: true,
            },
        })

        if (!user) {
            return NextResponse.json({ error: 'Użytkownik nie znaleziony' }, { status: 404 })
        }

        return NextResponse.json(user)
    } catch (err) {
        console.error('Błąd w /api/users:', err)
        return NextResponse.json({ error: 'Wewnętrzny błąd serwera' }, { status: 500 })
    }
}
