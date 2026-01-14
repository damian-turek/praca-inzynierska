'use client'

import React, { useState } from 'react'
import styles from '../auth.module.css'

type RegisterRequest = {
    first_name: string
    second_name: string
    email: string
    phone_number: string
    pesel: string
}

export const Register = () => {
    const [formData, setFormData] = useState<RegisterRequest>({
        first_name: '',
        second_name: '',
        email: '',
        phone_number: '',
        pesel: ''
    })
    const [statusMessage, setStatusMessage] = useState('')
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setError('')
        setStatusMessage('')

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            const data = await res.json()
            if (res.ok) {
                setStatusMessage('Your registration request has been sent. Please wait for approval from the administrator.')
            } else {
                setError(data.errors || 'An error has occurred.')
            }
        } catch {
            setError('Something went wrong. Please try again later.')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>User Registration</h2>
            <p className={styles.welcomeBackText}>
                Enter your details and the administrator will approve your account after verification.
            </p>

            <input name="first_name" type="text" placeholder="First name" onChange={handleChange} value={formData.first_name} required />
            <input name="second_name" type="text" placeholder="Last name" onChange={handleChange} value={formData.second_name} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
            <input name="phone_number" type="tel" placeholder="Phone number" onChange={handleChange} value={formData.phone_number} required />
            <input name="pesel" type="text" placeholder="PESEL" onChange={handleChange} value={formData.pesel} required maxLength={11} />

            <button type="submit">Submit your application</button>

            {statusMessage && <p style={{ color: 'green', marginTop: '10px' }}>{statusMessage}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
    )
}
