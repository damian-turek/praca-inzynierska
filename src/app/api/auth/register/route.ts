import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: Request) {
    const body = await request.json()
    const { first_name, second_name, email, phone_number, apartment_id, password } = body

    const existingUser = await prisma.users.findFirst({ where: { email } })
    if (existingUser) {
        return NextResponse.json({ errors: 'User already exists' }, { status: 400 })
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await prisma.users.create({
        data: {
            first_name,
            second_name,
            email,
            phone_number,
            apartment_id: apartment_id ? Number(apartment_id) : null,
            password: hashedPassword,
            role: 'USER'
        },
    })

    return NextResponse.json({ message: 'Registration successful', user })
}