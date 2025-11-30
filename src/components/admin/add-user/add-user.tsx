'use client'

import React, { useEffect, useState } from 'react'
import styles from './add-user.module.css'
import { toast } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

type UserRequest = {
    id: number
    first_name: string
    second_name: string
    email: string
    phone_number: string
    status: string
    created_at: string
}

export const AddUser = () => {
    const [requests, setRequests] = useState<UserRequest[]>([])
    const [loading, setLoading] = useState(false)

    const [apartmentIds, setApartmentIds] = useState<{ [key: number]: string }>({})
    const [passwords, setPasswords] = useState<{ [key: number]: string }>({})

    const fetchRequests = async () => {
        const res = await fetch('/api/admin/request')
        const data = await res.json()
        setRequests(data)
    }

    useEffect(() => {
        fetchRequests()
    }, [])

    const handleAction = async (id: number, action: 'APPROVE' | 'REJECT') => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/request', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    requestId: id,
                    action,
                    password: passwords[id] || "",
                    apartment_id: apartmentIds[id] || null,
                }),
            })

            const data = await res.json()

            if (!res.ok) {
                toast.error(data.error || "Error occurred")
                return
            }

            toast.success(data.message)
            fetchRequests()

        } catch (e) {
            console.error(e)
            toast.error('Something went wrong')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Pending User Requests</h2>

            {requests.length === 0 ? (
                <p className={styles.empty}>No pending requests</p>
            ) : (
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Status</th>
                        <th>Apartment ID</th>
                        <th>Password</th>
                        <th>Actions</th>
                    </tr>
                    </thead>
                    <tbody>
                    {requests.map((req) => (
                        <tr key={req.id}>
                            <td>{req.id}</td>
                            <td>{req.first_name} {req.second_name}</td>
                            <td>{req.email}</td>
                            <td>{req.phone_number}</td>
                            <td className={styles.status}>{req.status}</td>

                            <td>
                                <input
                                    type="number"
                                    className={styles.input}
                                    value={apartmentIds[req.id] || ""}
                                    onChange={(e) =>
                                        setApartmentIds({
                                            ...apartmentIds,
                                            [req.id]: e.target.value
                                        })
                                    }
                                    placeholder="apt ID"
                                />
                            </td>

                            <td>
                                <input
                                    type="password"
                                    className={styles.input}
                                    value={passwords[req.id] || ""}
                                    onChange={(e) =>
                                        setPasswords({
                                            ...passwords,
                                            [req.id]: e.target.value
                                        })
                                    }
                                    placeholder="set password"
                                />
                            </td>

                            <td>
                                <button
                                    onClick={() => handleAction(req.id, 'APPROVE')}
                                    disabled={loading}
                                    className={`${styles.button} ${styles.approve}`}
                                >
                                    Approve
                                </button>
                                <button
                                    onClick={() => handleAction(req.id, 'REJECT')}
                                    disabled={loading}
                                    className={`${styles.button} ${styles.reject}`}
                                >
                                    Reject
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </div>
    )
}
