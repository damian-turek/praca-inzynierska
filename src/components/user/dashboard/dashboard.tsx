'use client'

import React, {useState, useEffect} from 'react'


import { Profile } from './segments'

import styles from './dashboard.module.css'
import { User } from '../../../../types/user'
import {News} from "@prisma/client";

export const UserInfo = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);
    const [news, setNews] = useState<News[] | undefined>(undefined);

    useEffect(() => {
        const token = localStorage.getItem('jwt')
        fetch('/api/users', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        })
            .then(res => res.json())
            .then(data => setUserData(data))
    }, [])

    useEffect(() => {
        fetch('/api/news', {
            method: 'GET',
        })
            .then(res => res.json())
            .then(data => setNews(data))
    }, [])

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.adminInfo} ${styles.item}`}>
                {userData && <Profile {...userData} />}
            </div>
            <div className={`${styles.chart} ${styles.item}`}>
                <h2>News</h2>
                {news && news.map((item) => (
                    <div key={item.id} className={styles.newsItem}>
                        <h3>{item.title}</h3>
                        <p>{item.created_at instanceof Date ? item.created_at.toLocaleString() : new Date(item.created_at).toLocaleString()}</p>
                        <p>{item.content}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}