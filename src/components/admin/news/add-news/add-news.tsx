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
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title.trim() || !message.trim()) {
            toast.error('Please fill in all fields')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/news', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'include', // ✅ include httpOnly cookie
                body: JSON.stringify({ title, message }),
            })

            if (!res.ok) {
                const errData = await res.json().catch(() => ({}))
                throw new Error(errData.error || 'Failed to post news')
            }

            toast.success('News posted successfully!')
            setTitle('')
            setMessage('')
            onNewsAdded()
        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
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
                    disabled={loading}
                />
                <textarea
                    placeholder="Message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    disabled={loading}
                />
                <input type="submit" value={loading ? 'Posting...' : 'POST'} disabled={loading} />
            </form>
        </div>
    )
}
