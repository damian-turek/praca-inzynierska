import { SideBarProps } from '../../../../CommunityCore/apps/web/types/sidebar'
import Link from 'next/link'

import styles from './sidebar.module.css'
import { HiOutlineLogout } from 'react-icons/hi'

export const Sidebar = ({ links }: SideBarProps ) => (
    <nav className={styles.navigation}>
        <div className={styles.sidebar}>
            {links.map((link, index) => (
                <Link key={index} href={link.href}>{link.icon}</Link>
                ))}
        </div>
        <HiOutlineLogout />
    </nav>
)