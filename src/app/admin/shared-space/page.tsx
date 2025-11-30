import {SharedSpace} from "@/components/admin/shared-space";
import styles from "@/components/header/header.module.css";
import React from "react";

export default function AdminSharedSpacesPanel() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <SharedSpace />
        </>
    );
}
