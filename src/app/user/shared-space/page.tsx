
import {SharedSpaceUser} from "@/components/user/shared-space";
import styles from "@/components/header/header.module.css";
import React from "react";

export default function UserSharedSpacesPanel() {
    return (
        <>

            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <SharedSpaceUser />
        </>
    );
}
