'use client'

import React from "react"
import Link from 'next/link'
import styles from './sidebar.module.css'
import { HiOutlineLogout } from 'react-icons/hi'
import type { ReactElement } from 'react'
import { useRouter } from "next/navigation"

type Link = {
    href: string
    label: string
    icon: ReactElement
}

type SideBarProps = {
    links: Link[]
}

export const Sidebar = ({ links }: SideBarProps) => {
    const router = useRouter()

    const handleLogout = () => {
        router.push('/')
    }

    return (
        <nav className={styles.navigation}>
            <div className={styles.sidebar}>
                {links.map((link, index) => (
                    <Link key={index} href={link.href}>{link.icon}</Link>
                ))}
            </div>
            <HiOutlineLogout onClick={handleLogout} />
        </nav>
    )
}
