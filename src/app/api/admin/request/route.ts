import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function GET() {
    const requests = await prisma.userRequest.findMany({
        where: { status: 'PENDING' },
        orderBy: { created_at: 'desc' }
    })
    return NextResponse.json(requests)
}

export async function POST(request: Request) {
    const { requestId, action, password, apartment_id } = await request.json()

    const userRequest = await prisma.userRequest.findUnique({ where: { id: requestId } })
    if (!userRequest) return NextResponse.json({ error: 'Request not found' }, { status: 404 })

    if (action === 'APPROVE') {
        const hashedPassword = await bcrypt.hash(password, 10)
        await prisma.users.create({
            data: {
                first_name: userRequest.first_name,
                second_name: userRequest.second_name,
                email: userRequest.email,
                phone_number: userRequest.phone_number,
                apartment_id: apartment_id ? Number(apartment_id) : null,
                password: hashedPassword,
                role: 'USER'
            }
        })
        await prisma.userRequest.update({ where: { id: requestId }, data: { status: 'APPROVED' } })
    }

    if (action === 'REJECT') {
        await prisma.userRequest.update({ where: { id: requestId }, data: { status: 'REJECTED' } })
    }

    return NextResponse.json({ message: `User ${action === 'APPROVE' ? 'approved' : 'rejected'}` })
}
