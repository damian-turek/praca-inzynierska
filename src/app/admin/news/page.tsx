import React from 'react'

import { News } from '@/components/admin/news'
import styles from "@/components/header/header.module.css";

export default function DashBoardPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <News />
        </>
    )
}