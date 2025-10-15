import styles from './statistics.module.css'

export const Stats = () => (

    // TODO: get dashboard from real data
    <div className={styles.statisticsContainer}>
        <div>Number of reported and resolved issues</div>
        <div>Amount of digital documents in circulation</div>
        <div>Response time to requests</div>
        <div>Time saved on management</div>
        <div>Reduction of administrative costs</div>
        <div>Increase in meeting attendance</div>
    </div>
)