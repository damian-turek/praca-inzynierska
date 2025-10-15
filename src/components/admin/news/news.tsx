'use client'

import React, { useEffect, useState } from 'react'
import { AddNews } from '@/components/admin/news/add-news'
import { PrevNews } from '@/components/admin/news/prev-news'

import styles from './news.module.css'

type NewsItem = {
    id: number
    title: string
    created_at: string
}

export const News = () => {
    const [newsList, setNewsList] = useState<NewsItem[]>([])

    const fetchNews = async () => {
        const res = await fetch('/api/news')
        const data = await res.json()
        setNewsList(data)
    }

    useEffect(() => {
        fetchNews()
    }, [])

    return (
        <section className={styles.newsWrapper}>
            <AddNews onNewsAdded={fetchNews} />
            <PrevNews newsList={newsList} />
        </section>
    )
}
