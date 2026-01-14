'use client'

import React, { useState, useEffect } from 'react'
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    ResponsiveContainer,
    PieChart,
    Pie,
    Cell,
    Legend,
} from 'recharts'
import { toast } from 'react-toastify'
import { Profile } from './segments'
import { AdminProblemReports } from '@/components/admin/tasks'
import styles from './dashboard.module.css'

type User = {
    id: string
    first_name: string
    second_name: string
    email: string
    phone_number?: string
    apartment_id?: string
    role: string
    created_at?: string
}

type ReservationData = { month: string; count: number }
type ReportData = { status: string; count: number }

const BAR_COLOR = '#0ea5e9'
const PIE_COLORS = ['#f87171', '#34d399', '#facc15', '#f97316', '#8b5cf6']

export const AdminInfo = () => {
    const [userData, setUserData] = useState<User | undefined>()
    const [reservationData, setReservationData] = useState<ReservationData[]>([])
    const [reportData, setReportData] = useState<ReportData[]>([])

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/users', { credentials: 'include' })
                if (!res.ok) throw new Error('Unauthorized')
                const data = await res.json()
                setUserData(data)
            } catch (err: any) {
                toast.error(err.message)
            }
        }
        fetchUserData()
    }, [])

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await fetch('/api/summary')
                if (!res.ok) throw new Error('Fetch data error')
                const data = await res.json()

                setReservationData(
                    data?.reservations?.length ? data.reservations : [{ month: 'No data', count: 0 }]
                )
                setReportData(
                    data?.reports?.length ? data.reports : [{ status: 'No data', count: 0 }]
                )
            } catch (err: any) {
                toast.error(err.message)
                setReservationData([{ month: 'Error', count: 0 }])
                setReportData([{ status: 'Error', count: 0 }])
            }
        }
        fetchSummary()
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={styles.mainContent}>
                <div className={`${styles.adminInfo} ${styles.item}`}>
                    {userData ? <Profile {...userData} /> : <p>Loading...</p>}
                </div>

                <div className={styles.chartsContainer}>
                    <div className={styles.chart}>
                        <h3 className={styles.chartTitle}>Reservations per month</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <BarChart
                                data={reservationData}
                                margin={{ top: 60, right: 20, left: 0, bottom: 10 }}
                            >
                                <XAxis dataKey="month" interval={0} angle={-20} textAnchor="end" />
                                <YAxis allowDecimals={false} />
                                <Tooltip />
                                <Bar dataKey="count" fill={BAR_COLOR} radius={[6, 6, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    <div className={styles.chart}>
                        <h3 className={styles.chartTitle}>Report statuses</h3>
                        <ResponsiveContainer width="100%" height="90%">
                            <PieChart>
                                <Pie
                                    data={reportData}
                                    dataKey="count"
                                    nameKey="status"
                                    outerRadius={90}
                                    label={({ name, percent }) => `(${((percent as number) * 100).toFixed(0)}%)`}
                                >
                                    {reportData.map((_, index) => (
                                        <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                                    ))}
                                </Pie>
                                <Legend layout="horizontal" verticalAlign="bottom" align="center" />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className={styles.sidebar}>
                <AdminProblemReports />
            </div>
        </div>
    )
}
