'use client'

import Link from 'next/link'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

type LoginRequest = {
    email: string
    password: string
}

export const Login = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<LoginRequest>({ email: '', password: '' })
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) {
                const data = await res.json()
                setError(data.error || 'Invalid credentials')
                return
            }

            const meRes = await fetch('/api/auth/me', { credentials: 'include' })
            if (!meRes.ok) {
                setError('Cannot fetch user info')
                return
            }

            const me = await meRes.json()
            if (me.role === "ADMIN") router.push('/admin/dashboard')
            else router.push('/user/dashboard')

        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Welcome back</h2>
            <p className={styles.welcomeBackText}>
                Glad to see you again 👋 <br/> Login to your account below
            </p>
            <input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="Email" required />
            <input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" required />
            <button type="submit">Sign in</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <p>Don't have an account? <Link href='/register'>Sign up now!</Link></p>
        </form>
    )
}
