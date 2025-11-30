'use client'

import React from 'react'
import styles from './prev-news.module.css'

type News = {
    id: number
    title: string
    created_at: string
}

type PrevNewsProps = {
    newsList: News[]
}

export const PrevNews = ({ newsList }: PrevNewsProps) => {
    return (
        <div className={styles.wrapper}>
            <h2 className={styles.title}>LATEST NEWS</h2>
            <div className={styles.list}>
                {newsList.map((news) => (
                    <div className={styles.item} key={news.id}>
                        <strong>{news.title}</strong>
                        <span>
                    {new Date(news.created_at).toLocaleDateString().replace(/\//g, '.')}
                </span>
                    </div>
                ))}
            </div>
        </div>

    )
}
