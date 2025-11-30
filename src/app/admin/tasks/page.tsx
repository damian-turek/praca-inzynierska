import ReportsBoard from "@/components/admin/reports-board/reports-board";
import styles from "@/components/header/header.module.css";
import React from "react";

export default function TasksPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <ReportsBoard />
        </>
    );
}
