import React from 'react'

import { Sidebar } from '@/components'
import { GrTask } from 'react-icons/gr'
import { CgGames } from 'react-icons/cg'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import type {ReactElement} from "react"

import '@/styles/global.css'

import styles from './layout.module.css'

type Link = {
    href: string
    label: string
    icon: ReactElement
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const links: Link[] =  [
        { href: 'dashboard', label: 'dashboard', icon: <MdOutlineSpaceDashboard />},
        { href: 'tasks', label: 'taskStatus', icon: <GrTask />},
        { href: 'shared-space', label: 'sharedSpace', icon: <CgGames />},
    ]
    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <Sidebar links={links} />
            </aside>
            <main className={styles.main}>{children}</main>
        </div>
    )
}