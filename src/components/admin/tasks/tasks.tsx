'use client'

import { useState, useEffect } from 'react'
import styles from './tasks.module.css'

type ProblemReport = {
    id: number
    title: string
    description: string
    status: string
    reported_by: number
    reporter?: {
        apartment?: {
            number: string | number
        } | null
    } | null
}

export const AdminProblemReports = () => {
    const [reports, setReports] = useState<ProblemReport[]>([])

    useEffect(() => {
        fetch('/api/reports', {
            method: 'GET',
            credentials: 'include',
        })
            .then(async res => {
                if (!res.ok) throw new Error('API error')
                const data: ProblemReport[] = await res.json()
                const filtered = data.filter(r => r.status === 'REPORTED')
                setReports(filtered)
            })
            .catch(err => {
                console.error('Fetching error:', err)
                setReports([])
            })
    }, [])

    async function handleAction(id: number, action: 'accept' | 'reject') {
        await fetch(`/api/reports/${id}/${action}`, {
            method: 'POST',
            credentials: 'include',
        })
        setReports(r => r.filter(report => report.id !== id))
    }

    return (
        <div className={styles.reportsContainer}>
            <h1 className="reportsTitle">Reports</h1>
            {reports.length === 0 ? (
                <p className={styles.reportsEmpty}>No reports</p>
            ) : (
                <ul className={styles.reportsList}>
                    {reports.map(r => (
                        <li key={r.id} className={styles.reportElement}>
                            <h2 className={styles.reportTitle}>{r.title}</h2>
                            <p className={styles.reportDescription}>{r.description}</p>

                            <p className={styles.apartmentTag}>
                                Apartment: {r.reporter?.apartment?.number ?? '—'}
                            </p>

                            <div className={styles.reportActions}>
                                <button
                                    onClick={() => handleAction(r.id, 'accept')}
                                    className={styles.acceptBtn}
                                >
                                    Accept
                                </button>
                                <button
                                    onClick={() => handleAction(r.id, 'reject')}
                                    className={styles.declineBtn}
                                >
                                    Decline
                                </button>
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
