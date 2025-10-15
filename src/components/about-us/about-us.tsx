import Image from 'next/image'

import styles from './about-us.module.css'
import Link from 'next/link'
// TODO: move only one used components to app folder
export const AboutUs = () => (
    <div className={styles.aboutUsContainer}>
        <div>
            <h2>ABOUT US</h2>
            <p className={styles.text}>
                We’re a team of developers, property experts, and community enthusiasts who believe that managing a housing community shouldn’t be a hassle. That’s why we created a smart, user-friendly platform that brings clarity, structure, and simplicity to everyday management tasks.
            </p>
            <p className={styles.text}>
                Our mission is to empower both residents and administrators with tools that save time, reduce misunderstandings, and foster stronger communities. With our app, everyone stays informed, involved, and connected.
            </p>
            <Link href='/register' className={styles.button}>JOIN US NOW</Link>
        </div>

        <div>
            <Image
                height={180}
                width={180}
                src='/images/about-us/image1.png'
                alt='building 1'
            />
            <Image
                height={180}
                width={180}
                src='/images/about-us/image2.png'
                alt='building 2'
            />
            <Image
                height={180}
                width={180}
                src='/images/about-us/image3.png'
                alt='building 3'
            />
        </div>
    </div>
)