import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
    try {
        const users = await prisma.users.findMany({
            where: {
                role: { not: 'ADMIN' }
            },
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
        console.error('Error /api/admin/users:', err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
