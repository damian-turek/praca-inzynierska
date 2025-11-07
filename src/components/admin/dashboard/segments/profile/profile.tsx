'use client'

import React, { FC } from 'react'
import { User } from '../../../../types/user'

import styles from './profile.module.css'

export const Profile: FC<User> = ({ id, first_name, second_name, email, phone_number, apartment_id, role, created_at}) => {
    return (
        <section className={styles.wrapper}>
            <p>Email: <span>{email}</span></p>
            <p>Name: <span>{first_name}</span></p>
            <p>Surname: <span>{second_name}</span></p>
            <p>Role: <span>{role}</span></p>
            <p>Member since: <span>{created_at ? new Date(created_at).toLocaleDateString().replace(/\//g, '.') : '-'}</span></p>
            <p>Phone number: <span>{phone_number || '-'}</span></p>
            <p>Apartment: <span>{apartment_id || '-'}</span></p>
        </section>
    )
}
