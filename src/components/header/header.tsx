import Link from 'next/link'

import styles from './header.module.css'

export const Header = () => {
    return (
        <header className={styles.header}>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <div className={styles.login}>
                <Link href='/login' className={styles.button}>Login</Link>
                <Link href='/register' className={styles.button}>Register</Link>
            </div>
        </header>
    )
}