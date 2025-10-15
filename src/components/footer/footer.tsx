import Link from 'next/link'

import styles from './footer.module.css'
import Image from 'next/image'

export const Footer = () => (
    <footer className={styles.footer}>
        <div className={styles.description}>
            <h3 className={styles.logo}>Community<span className={styles.logoBold}>Core</span></h3>
            <p>
                Our platform is designed to simplify and improve the management of housing communities. It brings together all essential tools in one place—streamlining communication between residents and managers, automating billing, issue tracking, and voting processes. With clear workflows and real-time updates, tasks get done faster, misunderstandings are reduced, and transparency is increased. The result is a more organized, responsive, and trustworthy community where everyone feels heard and cared for.
            </p>
        </div>
        <div className={styles.contactSection}>
            <h4>Contact</h4>
            <a href='tel:+48111222333'>
                <Image
                    src='/icons/footer/phone.svg'
                    alt='phone icon'
                    width={20}
                    height={20}
                />
                +48 111 222 333
            </a>
            <a href='mailto:communitycore@support.com'>
                <Image
                    src='/icons/footer/mail.svg'
                    alt='mail icon'
                    width={20}
                    height={20}
                />
                communitycore@support.com
            </a>
            <p>
                <Image
                    src='/icons/footer/time.svg'
                    alt='time icon'
                    width={20}
                    height={20}
                />
                Monday - Friday <br/>
                8:00 am - 5:00 pm
            </p>
        </div>
        <nav>
            <Link href='#'>Services</Link>
            <Link href='#'>About Us</Link>
            <Link href='#'>WORK IN PROGRESS</Link>
        </nav>
    </footer>
)