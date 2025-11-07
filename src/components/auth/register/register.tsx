'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from '../auth.module.css'

type RegisterRequest = {
    first_name: string
    second_name: string
    email: string
    phone_number: string
    apartment_id: number | null
    password: string
}

export const Register = () => {
    const router = useRouter()
    const [formData, setFormData] = useState<RegisterRequest>({
        first_name: '',
        second_name: '',
        email: '',
        phone_number: '',
        apartment_id: null,
        password: ''
    })
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        try {
            const res = await fetch(`/api/auth/register`, {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (res.ok) {
                router.push('/user/dashboard')
            } else {
                const data = await res.json()
                setError(data.errors)
            }
        } catch {
            setError('Something went wrong')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Join us today</h2>
            <p className={styles.welcomeBackText}>
                We’re excited to have you here 🎉 <br/> Create your account below
            </p>
            <input name="first_name" type="text" placeholder="first name" onChange={handleChange} value={formData.first_name} required />
            <input name="second_name" type="text" placeholder="second name" onChange={handleChange} value={formData.second_name} required />
            <input name="email" type="email" placeholder="email" onChange={handleChange} value={formData.email} required />
            <input name="phone_number" type="tel" placeholder="phone" onChange={handleChange} value={formData.phone_number} required />
            <input name="apartment_id" type="number" placeholder="apartment id" onChange={handleChange} value={formData.apartment_id ?? ''} required />
            <input name="password" type="password" placeholder="password" onChange={handleChange} value={formData.password} required />
            <button type="submit">Sign up</button>
            {error && <p style={{ color: 'red' }}>{error}</p>}
        </form>
    )
}
