"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export type NavLinkType = {
  href: string
  activeHref?: string
  children: ReactNode
  icon?: ReactNode
  activeClass: string
  inactiveClass?: string | null
  onClick?: () => void
  iconOnly?: boolean
}

export default function NavLink(props: NavLinkType) {
  const url = usePathname()
  const activeHref = props.activeHref ?? props.href
  const active =
    url === activeHref ||
    (activeHref !== "/" && url.startsWith(activeHref + "/")) ||
    url === activeHref.replace(/\/$/, "")
  return (
    <Link
      href={props.href}
      onClick={props.onClick}
      className={`rounded-full transition-all duration-300 ${active ? props.activeClass : props.inactiveClass}`}
    >
      {props.iconOnly ? props.icon : props.children}
    </Link>
  )
}
