import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/lib/prisma'

const JWT_SECRET = process.env.JWT_SECRET as string

export async function POST(
    request: NextRequest,
    context: { params: Promise<{ id: string; action: string }> }
) {
    try {
        const { id, action } = await context.params

        const token = request.cookies.get('jwt')?.value
        if (!token) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const decoded = jwt.verify(token, JWT_SECRET) as { userId: number; role?: string }

        const reportId = parseInt(id)
        const { reason } = (await request.json().catch(() => ({}))) as { reason?: string }

        let updateData: any = {}

        switch (action) {
            case 'accept':
                updateData = {
                    status: 'ACCEPTED',
                    handled_by: decoded.userId,
                    accepted_at: new Date(),
                }
                break

            case 'reject':
                updateData = {
                    status: 'REJECTED',
                    handled_by: decoded.userId,
                    rejection_reason: reason || 'No reason provided',
                    closed_at: new Date(),
                }
                break

            case 'in_progress':
                updateData = {
                    status: 'IN_PROGRESS',
                    handled_by: decoded.userId,
                    started_at: new Date(),
                }
                break

            case 'complete':
                updateData = {
                    status: 'COMPLETED',
                    closed_at: new Date(),
                }
                break

            default:
                return NextResponse.json({ error: 'Invalid action' }, { status: 400 })
        }

        const updated = await prisma.problemReport.update({
            where: { id: reportId },
            data: updateData,
            select: {
                id: true,
                title: true,
                description: true,
                status: true,
                reported_by: true,
                handled_by: true,
                accepted_at: true,
                started_at: true,
                closed_at: true,
                rejection_reason: true,

                reporter: {
                    select: {
                        apartment: {
                            select: {
                                id: true,
                                number: true,
                            }
                        }
                    }
                }
            }
        })

        return NextResponse.json(updated)
    } catch (err: any) {
        console.error('Error in /api/reports/[id]/[action]:', err.message || err)
        return NextResponse.json({ error: 'Server error' }, { status: 500 })
    }
}
