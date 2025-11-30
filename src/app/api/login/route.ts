import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret'

export async function POST(request: Request) {
    const { email, password } = await request.json()

    // sprawdź, czy istnieje wniosek oczekujący
    const pending = await prisma.userRequest.findFirst({
        where: { email, status: 'PENDING' }
    })
    if (pending)
        return NextResponse.json({ error: 'Account awaiting admin approval' }, { status: 403 })

    const user = await prisma.users.findFirst({
        where: { email },
        include: { apartment: { include: { community: true } } }
    })
    if (!user) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const passwordMatch = await bcrypt.compare(password, user.password)
    if (!passwordMatch) return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })

    const token = jwt.sign(
        {
            userId: user.id,
            role: user.role,
            apartmentId: user.apartment_id,
            communityId: user.apartment?.community?.id || null
        },
        JWT_SECRET,
        { expiresIn: '1h' }
    )

    const response = NextResponse.json({ message: 'Login successful' })
    response.cookies.set('jwt', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 60 * 60
    })

    return response
}
