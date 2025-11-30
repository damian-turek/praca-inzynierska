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
                setStatusMessage('✅ Wniosek o rejestrację został wysłany. Poczekaj na zatwierdzenie przez administratora.')
            } else {
                setError(data.errors || '❌ Wystąpił błąd.')
            }
        } catch {
            setError('❌ Coś poszło nie tak.')
        }
    }

    return (
        <form className={styles.form} onSubmit={handleSubmit}>
            <h2>Rejestracja użytkownika</h2>
            <p className={styles.welcomeBackText}>
                Podaj swoje dane, a administrator zatwierdzi Twoje konto po weryfikacji.
            </p>

            <input name="first_name" type="text" placeholder="Imię" onChange={handleChange} value={formData.first_name} required />
            <input name="second_name" type="text" placeholder="Nazwisko" onChange={handleChange} value={formData.second_name} required />
            <input name="email" type="email" placeholder="Email" onChange={handleChange} value={formData.email} required />
            <input name="phone_number" type="tel" placeholder="Telefon" onChange={handleChange} value={formData.phone_number} required />
            <input name="pesel" type="text" placeholder="PESEL" onChange={handleChange} value={formData.pesel} required maxLength={11} />

            <button type="submit">Wyślij wniosek</button>

            {statusMessage && <p style={{ color: 'green', marginTop: '10px' }}>{statusMessage}</p>}
            {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        </form>
    )
}
