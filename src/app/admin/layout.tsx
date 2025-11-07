import { Sidebar } from '@/components'

import styles from './layout.module.css'

import '@/styles/global.css'


import { RiNewsLine } from 'react-icons/ri'
import { GrTask } from 'react-icons/gr'
import { CgGames } from 'react-icons/cg'
import { HiOutlineUserAdd } from 'react-icons/hi'
import { MdOutlineSpaceDashboard } from 'react-icons/md'
import {Link} from "../../../types/sidebar"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const links: Link[] =  [
        { href: 'dashboard', label: 'dashboard', icon: <MdOutlineSpaceDashboard />},
        { href: 'news', label: 'news', icon: <RiNewsLine />},
        { href: 'tasks', label: 'taskStatus', icon: <GrTask />},
        { href: 'shared-space', label: 'sharedSpace', icon: <CgGames />},
        { href: 'add-user', label: 'addUser', icon: <HiOutlineUserAdd />},
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