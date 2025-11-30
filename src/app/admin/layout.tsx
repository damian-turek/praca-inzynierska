import { Sidebar } from '@/components'

import styles from './layout.module.css'

import '@/styles/global.css'


import { RiNewsLine } from 'react-icons/ri'
import { GrTask } from 'react-icons/gr'
import { CgGames } from 'react-icons/cg'
import { HiOutlineUserAdd } from 'react-icons/hi'
import {MdOutlineSpaceDashboard, MdPayment} from 'react-icons/md'
import React, {type ReactElement} from "react";
import Chatbot from "@/components/chatbot/ChatBot";
import { ToastContainer } from "react-toastify";

type Link = {
    href: string
    label: string
    icon: ReactElement
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const links: Link[] =  [
        { href: 'dashboard', label: 'dashboard', icon: <MdOutlineSpaceDashboard />},
        { href: 'news', label: 'news', icon: <RiNewsLine />},
        { href: 'tasks', label: 'taskStatus', icon: <GrTask />},
        { href: 'shared-space', label: 'sharedSpace', icon: <CgGames />},
        { href: 'add-user', label: 'addUser', icon: <HiOutlineUserAdd />},
        { href: 'document-pdf', label: 'documentPdf', icon: <MdPayment />},
    ]
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Sidebar links={links} />
            </aside>
            <main className={styles.main}>{children}
                <Chatbot /></main>
            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    )
}