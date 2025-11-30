'use client'

import React, { useState } from 'react'
import { PrevTasks } from "@/components/user/tasks/prev-tasks";
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css';
import styles from './add-task.module.css'

export const AddTask = () => {
    const [title, setTitle] = useState('')
    const [type, setType] = useState('Select Type')
    const [description, setDescription] = useState('')
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!title || type === 'Select Type' || !description) {
            toast.error('Please fill all fields')
            return
        }

        setLoading(true)
        try {
            const res = await fetch('/api/reports', {
                method: 'POST',
                credentials: 'include',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ title, type, description })
            })

            if (!res.ok) {
                const data = await res.json()
                throw new Error(data?.error || 'Failed to add report')
            }

            toast.success('Report added successfully!')
            setTitle('')
            setType('Select Type')
            setDescription('')

        } catch (err: any) {
            toast.error(err.message)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className={styles.wrapper}>
            <ToastContainer position="top-right" autoClose={3000} />
            <form className={styles.formWrapper} onSubmit={handleSubmit}>
                <h2 className={styles.title}>Add Task</h2>

                <label className={styles.label}>
                    Title
                    <input
                        className={styles.input}
                        type="text"
                        placeholder="Task title"
                        value={title}
                        onChange={e => setTitle(e.target.value)}
                        disabled={loading}
                    />
                </label>

                <label className={styles.label}>
                    Type
                    <select
                        className={styles.select}
                        value={type}
                        onChange={e => setType(e.target.value)}
                        disabled={loading}
                    >
                        <option value="Select Type" disabled>Select report type</option>
                        <option value="maintenance">Maintenance Issue</option>
                        <option value="cleaning">Cleaning Request</option>
                        <option value="noise">Noise Complaint</option>
                        <option value="parking">Parking Issue</option>
                        <option value="security">Security Concern</option>
                        <option value="neighbors">Neighbor Dispute</option>
                        <option value="renovation">Renovation Request</option>
                        <option value="lighting">Lighting Problem</option>
                        <option value="plumbing">Plumbing Issue</option>
                        <option value="other">Other</option>
                    </select>
                </label>

                <label className={styles.label}>
                    Description
                    <textarea
                        className={styles.textarea}
                        placeholder="Task description"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        disabled={loading}
                    />
                </label>

                <button className={styles.button} type="submit" disabled={loading}>
                    {loading ? 'Dodawanie...' : 'Add Task'}
                </button>
            </form>

            <div className={styles.prevTasksWrapper}>
                <PrevTasks />
            </div>
        </div>
    )
}
