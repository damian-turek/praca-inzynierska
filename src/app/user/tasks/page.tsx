import {AddTask} from "@/components/user/tasks/add-task/add-task";
import styles from "@/components/header/header.module.css";
import React from "react";


export default function UserTasks() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <AddTask />
        </>
    );
}
