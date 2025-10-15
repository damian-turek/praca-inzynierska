'use client'

import { AboutUs, Footer, Header, Hero, Services, Stats } from '@/components'

import '@/styles/global.css'

export default function UsersPage() {

    return (
        <>
            <Header/>
            <main>
                <Hero/>
                <Services/>
                <AboutUs/>
                <Stats/>
            </main>
            <Footer/>
        </>
    )
}
