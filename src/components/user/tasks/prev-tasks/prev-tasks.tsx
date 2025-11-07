'use client'

import React, { useEffect, useState } from 'react'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import styles from './prev-tasks.module.css'

interface UserReport {
    id: number
    title: string
    status: string
    created_at: string
}

export const PrevTasks = () => {
    const [reports, setReports] = useState<UserReport[]>([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchReports = async () => {
            setLoading(true)
            try {
                const res = await fetch('/api/reports/user', {
                    credentials: 'include', // include httpOnly cookie
                })
                if (!res.ok) throw new Error('Failed to fetch reports')
                const data: UserReport[] = await res.json()
                setReports(data)
            } catch (err: any) {
                toast.error(err.message)
            } finally {
                setLoading(false)
            }
        }

        fetchReports()
    }, [])

    return (
        <div className={styles.container}>
            <ToastContainer position="top-right" autoClose={3000} />
            <h3 className={styles.heading}>Your Reports</h3>
            {loading ? (
                <p className={styles.loading}>Loading...</p>
            ) : reports.length === 0 ? (
                <p className={styles.empty}>No reports found</p>
            ) : (
                <ul className={styles.list}>
                    {reports.map(r => (
                        <li key={r.id} className={styles.item}>
                            <strong className={styles.title}>{r.title}</strong>
                            <span className={styles.status}>
                                — status: {r.status} ({new Date(r.created_at).toLocaleDateString()})
                            </span>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
