import { LoginForm } from './login-form'

import styles from './login.module.css'

export const Login = () => (
    <section className={styles.loginPage}>
        <LoginForm />
    </section>
)