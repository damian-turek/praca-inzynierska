'use client'

import React, { useState, useEffect } from 'react'
import styles from './dashboard.module.css'
import { News } from "@prisma/client"
import { Profile } from "@/components/admin/dashboard/segments"

type User = {
    id: string
    name: string
    email: string
    role: string
    first_name: string
    second_name: string
    created_at: string
    phone_number: string
}

export const UserInfo = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined)
    const [news, setNews] = useState<News[] | undefined>(undefined)

    useEffect(() => {
        const token = localStorage.getItem('jwt')
        fetch('/api/users', {
            method: 'GET',
            headers: { Authorization: `Bearer ${token}` },
        })
            .then(res => res.json())
            .then(data => setUserData(data))
    }, [])

    useEffect(() => {
        fetch('/api/news', { method: 'GET' })
            .then(res => res.json())
            .then(data => setNews(data))
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.adminInfo} ${styles.item}`}>
                {userData && <Profile {...userData} />}
            </div>

            <div className={`${styles.newsSection} ${styles.item}`}>
                <h2 className={styles.newsTitle}>Latest News</h2>
                <div className={styles.newsList}>
                    {news?.map((item) => (
                        <div key={item.id} className={styles.newsItem}>
                            <h3 className={styles.newsItemTitle}>{item.title}</h3>
                            <p className={styles.newsItemDate}>
                                {new Date(item.created_at).toLocaleString()}
                            </p>
                            <p className={styles.newsItemContent}>{item.content}</p>
                        </div>
                    ))}
                    {!news?.length && <p className={styles.noNews}>No news available</p>}
                </div>
            </div>
        </div>
    )
}
