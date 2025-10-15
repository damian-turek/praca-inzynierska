'use client'

import React, {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'


import { Profile } from './segments'

import styles from './dashboard.module.css'
import { User } from '../../../../types/user'

export const AdminInfo = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 200 },
        { name: 'Apr', value: 278 },
    ]

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

    return (
        <div className={styles.wrapper}>
            <div className={`${styles.adminInfo} ${styles.item}`}>
                {userData && <Profile {...userData} />}
            </div>
            <div className={`${styles.chart} ${styles.item}`}>
                <ResponsiveContainer width="100%">
                    <BarChart data={data}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Bar dataKey="value" fill="#8884d8" />
                    </BarChart>
                </ResponsiveContainer>
            </div>
            <div className={`${styles.item2} ${styles.item}`}>
            New tasks
            </div>
        </div>
    )
}