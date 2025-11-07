import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'

export async function GET(request: NextRequest) {
    try {
        const cookieToken = request.cookies.get('jwt')  // <- zmienione z 'token'
        const token = cookieToken?.value

        if (!token) {
            return NextResponse.json({ error: 'Brak tokena' }, { status: 401 })
        }

        let userId: number
        try {
            const decoded = jwt.verify(token, JWT_SECRET) as { userId?: number }
            if (!decoded.userId) {
                return NextResponse.json({ error: 'Błędny token' }, { status: 401 })
            }
            userId = decoded.userId
        } catch (err) {
            return NextResponse.json({ error: 'Błędny lub wygasły token' }, { status: 401 })
        }

        const user = await prisma.users.findUnique({
            where: { id: userId },
            select: {
                id: true,
                first_name: true,
                second_name: true,
                email: true,
                phone_number: true,
                apartment_id: true,
                role: true,
                created_at: true,
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

