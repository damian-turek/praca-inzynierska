'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { RegisterRequest } from '../../../../../CommunityCore/shared/types/auth'

import styles from '../auth.module.css'

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
                body: JSON.stringify( formData ),
            })

            const data = await res.json()

            if (res.ok) {
                router.push('/dashboard')
            } else {
                setError(data.errors)
                console.error('Registration failed:', error);
            }

        } catch (err) {
            setError('Something went wrong');
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Join us today</h2>
            <p className={styles.welcomeBackText}>
                We’re excited to have you here &#x1F389; <br/>
                Create your account below
            </p>
            <input
                name="first_name"
                type="text"
                placeholder="first name"
                onChange={handleChange}
                value={formData.first_name}
                required
            />
            <input
                name="second_name"
                type="text"
                placeholder="second name"
                onChange={handleChange}
                value={formData.second_name}
                required
            />
            <input
                name="email"
                type="email"
                placeholder="email"
                onChange={handleChange}
                value={formData.email}
                required
            />
            <input
                name="phone_number"
                type="tel"
                placeholder="phone"
                onChange={handleChange}
                value={formData.phone_number}
                required
            />
            <input
                name="apartment_id"
                type="number"
                placeholder="apartament id"
                onChange={handleChange}
                value={formData.apartment_id ?? ''}
                required
            />
            <input
                name="password"
                type="password"
                placeholder="password"
                onChange={handleChange}
                value={formData.password}
                required
            />
            <button type="submit">Sign up</button>
        </form>
    )
}