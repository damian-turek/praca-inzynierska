import styles from './hero.module.css';
import Image from 'next/image'

export const Hero = () => {
    return (
        <div className={styles.hero}>
            <div className={styles.motto}>
                <h1 className={styles.slogan}>Your home, <span>our priority</span></h1>
                <Image
                    src="/icons/hero/arrow.svg"
                    alt="arrow"
                    width={450}
                    height={100}
                    className={styles.arrow}
                />
                <p className={styles.description}>We’re dedicated to creating safe, well-managed, and connected communities where every resident feels at home. With a focus on transparency, efficiency, and care, we treat your home like it’s our own.</p>
            </div>
            <video
                className={styles.video}
                src="/hero-video.mp4"
                autoPlay
                muted
                onEnded={(e) => {
                    e.currentTarget.currentTime = e.currentTarget.duration;
                    e.currentTarget.pause();
                }}
            />
        </div>
    )
}