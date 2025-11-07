'use client'

import React, {useState, useEffect} from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { toast } from 'react-toastify'

import { Profile } from './segments'

import styles from './dashboard.module.css'
import { User } from '../../../../types/user'
import {AdminProblemReports} from "@/components/admin/tasks";

export const AdminInfo = () => {
    const [userData, setUserData] = useState<User | undefined>(undefined);

    const data = [
        { name: 'Jan', value: 400 },
        { name: 'Feb', value: 300 },
        { name: 'Mar', value: 200 },
        { name: 'Apr', value: 278 },
    ]

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const res = await fetch('/api/users', {
                    method: 'GET',
                    credentials: 'include', // ✅ include httpOnly cookie
                });

                if (!res.ok) throw new Error('Unauthorized');
                const data = await res.json();
                setUserData(data);
            } catch (err: any) {
                toast.error(err.message);
            }
        };

        fetchUserData();
    }, []);

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
            <AdminProblemReports />
            </div>
        </div>
    )
}