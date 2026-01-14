import styles from "@/components/header/header.module.css";
import React from "react";
import {AdminUsersList} from "@/components/admin/AdminUserList";

export default function TasksPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <AdminUsersList />
        </>
    );
}
