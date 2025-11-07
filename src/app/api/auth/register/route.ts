import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'

export async function POST(request: Request) {
    const body = await request.json()
    const { first_name, second_name, email, phone_number, apartment_id, password } = body

    const existingUser = await prisma.users.findFirst({ where: { email } })
    if (existingUser) return NextResponse.json({ errors: 'User already exists' }, { status: 400 })

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

    const token = jwt.sign(
        { userId: user.id, role: user.role, apartmentId: user.apartment_id },
        JWT_SECRET,
        { expiresIn: '1h' }
    )

    const response = NextResponse.json({ message: 'Registration successful' })
    response.cookies.set('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60,
    })

    return response
}
