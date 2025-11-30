import styles from "@/components/header/header.module.css"
import React from "react"
import {AdminBillingCreator} from "@/components/admin/pdf-generator"

export default function TasksPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <AdminBillingCreator />
        </>
    )
}
