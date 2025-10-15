'use client'

import { usePathname } from 'next/navigation'
import { Register } from './register'
import { Login } from './login'

import styles from './auth.module.css'

export const Auth = () => {
    const pathName = usePathname()
    const Component =  pathName === `/register` ? Register : Login

    return (
        <section className={styles.authPage}>
            <Component/>
        </section>
    )
}