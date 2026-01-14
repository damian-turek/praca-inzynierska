'use client'

import { useEffect, useState } from 'react'
import styles from './users-list.module.css'

type User = {
    id: number
    first_name: string
    second_name: string
    email: string
    phone_number: string
    role: string
    apartment?: {
        id: number
        number: string
    } | null
}

export const AdminUsersList = () => {
    const [users, setUsers] = useState<User[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        setLoading(true)
        fetch('/api/admin/users', { credentials: 'include' })
            .then(async res => {
                if (!res.ok) throw new Error('Error fetching users')
                const data = await res.json()
                setUsers(data)
            })
            .catch(err => {
                console.error(err)
                setError('Error fetching user data')
            })
            .finally(() => setLoading(false))
    }, [])

    if (loading) return <p>Loading users...</p>
    if (error) return <p>{error}</p>
    if (users.length === 0) return <p>No users found</p>

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>User List</h1>
            <div className={styles.tableWrapper}>
                <table className={styles.table}>
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>First Name</th>
                        <th>Last Name</th>
                        <th>Email</th>
                        <th>Phone</th>
                        <th>Role</th>
                        <th>Apartment</th>
                    </tr>
                    </thead>
                    <tbody>
                    {users.map(user => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.first_name}</td>
                            <td>{user.second_name}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>{user.role}</td>
                            <td>{user.apartment?.number ?? '—'}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
