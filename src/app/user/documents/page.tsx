import React from 'react'
import styles from "@/components/header/header.module.css"
import Documents from "@/components/user/documents/documents"

export default function DocumentsPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <Documents />
        </>
    )
}