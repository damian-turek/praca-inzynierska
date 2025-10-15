import type { ReactElement } from 'react'

export type Link = {
    href: string
    label: string
    icon: ReactElement
}

export type SideBarProps = {
    links: Link[]
}