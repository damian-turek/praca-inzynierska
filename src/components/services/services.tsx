import Image from 'next/image'

import styles from './services.module.css'

export const Services = () => {
    const services = [
        {title: 'Property Management', image: '/icons/services-icons/property-management.svg', description: 'Full-service oversight for residential communities', width: 70, height: 70},
        {title: 'Financial Administration', image: '/icons/services-icons/financial-administration.svg', description: 'Transparent budgeting, reporting & billing', width: 70, height: 70},
        {title: 'Property Management', image: '/icons/services-icons/maintenance-coordination.svg', description: 'Reliable support for repairs and upkeep', width: 60, height: 70},
        {title: 'Community Support', image: '/icons/services-icons/community-support.svg', description: 'Communication, conflict resolution, and engagement', width: 70, height: 70}
    ]

    return (
        <section className={styles.servicesSection}>
            <h2 className={styles.subtitle}>Services</h2>
            <div className={styles.services}>
                {services.map((service, index) =>
                    <div key={index} className={styles.service}>
                        <h4>{service.title}</h4>
                        <Image
                            src={service.image}
                            alt={service.title}
                            width={service.width}
                            height={service.height}
                        />
                        <p>{service.description}</p>
                    </div>
                )}
            </div>
        </section>
    )
}