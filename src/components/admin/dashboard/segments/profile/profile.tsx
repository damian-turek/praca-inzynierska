'use client'

import React, { FC } from 'react'
import styles from './profile.module.css'

type User = {
    id: string
    first_name: string
    second_name: string
    email: string
    phone_number?: string
    apartment_id?: string
    role: string
    created_at?: string
}

export const Profile: FC<User> = ({
                                      first_name,
                                      second_name,
                                      email,
                                      phone_number,
                                      apartment_id,
                                      role,
                                      created_at
                                  }) => {
    return (
        <section className={styles.wrapper}>
            <div className={styles.row}>
                <div className={styles.item}>
                    <p className={styles.label}>Name</p>
                    <span className={styles.value}>{first_name} {second_name}</span>
                </div>
                <div className={styles.item}>
                    <p className={styles.label}>Email</p>
                    <span className={styles.value}>{email}</span>
                </div>
                <div className={styles.item}>
                    <p className={styles.label}>Role</p>
                    <span className={styles.value}>{role}</span>
                </div>
                <div className={styles.item}>
                    <p className={styles.label}>Phone</p>
                    <span className={styles.value}>{phone_number || '-'}</span>
                </div>
                <div className={styles.item}>
                    <p className={styles.label}>Apartment</p>
                    <span className={styles.value}>{apartment_id || '-'}</span>
                </div>
                <div className={styles.item}>
                    <p className={styles.label}>Member since</p>
                    <span className={styles.value}>
                        {created_at ? new Date(created_at).toLocaleDateString().replace(/\//g, '.') : '-'}
                    </span>
                </div>
            </div>
        </section>
    )
}
