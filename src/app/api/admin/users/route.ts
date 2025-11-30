import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            select: {
                id: true,
                first_name: true,
                second_name: true,
                email: true,
                phone_number: true,
                role: true,
                apartment: {
                    select: {
                        id: true,
                        number: true
                    }
                }
            }
        })

        return NextResponse.json(users)
    } catch (err) {
        console.error('Błąd w /api/admin/users:', err)
        return NextResponse.json({ error: 'Błąd serwera' }, { status: 500 })
    }
}
