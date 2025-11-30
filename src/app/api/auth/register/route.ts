import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: Request) {
    const body = await request.json()
    const { first_name, second_name, email, phone_number, pesel } = body

    const existingUser = await prisma.users.findFirst({ where: { email } })
    if (existingUser)
        return NextResponse.json({ error: 'User already exists' }, { status: 400 })

    const existingRequest = await prisma.userRequest.findFirst({ where: { email } })
    if (existingRequest)
        return NextResponse.json({ error: 'Request already pending or processed' }, { status: 400 })

    await prisma.userRequest.create({
        data: {
            first_name,
            second_name,
            email,
            phone_number,
            pesel,
            status: 'PENDING'
        }
    })

    return NextResponse.json({ message: 'Registration request submitted. Please wait for admin approval.' })
}
