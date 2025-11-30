import React from 'react'
import {UserInfo} from "@/components/user/dashboard";
import Chatbot from "@/components/chatbot/ChatBot"
import styles from "@/components/header/header.module.css";

export default function DashBoardPage() {
    return (
        <>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <UserInfo />
        </>
    )
}