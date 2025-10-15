'use client'

import React, { useState } from 'react'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer, toast } from 'react-toastify'

import styles from './add-news.module.css'

type AddNewsProps = {
    onNewsAdded: () => void
}

export const AddNews = ({ onNewsAdded }: AddNewsProps) => {
    const [title, setTitle] = useState('')
    const [message, setMessage] = useState('')
    const id = 1

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, message, id }),
            })

            if (!res.ok) throw new Error()

            await res.json()
            toast.success('News posted successfully!')
            setTitle('')
            setMessage('')

            onNewsAdded()
        } catch {
            toast.error('Failed to post news.')
        }
    }

    return (
        <div className={styles.wrapper}>
            <ToastContainer />
            <h2>ADD NEWS</h2>
            <form onSubmit={handleSubmit}>
                <input
                    placeholder="Title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                />
                <input type="submit" value="POST" />
            </form>
        </div>
    )
}
