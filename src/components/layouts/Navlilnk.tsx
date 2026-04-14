"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export type NavLinkType = {
  href: string
  children: ReactNode
  icon?: ReactNode
  activeClass: string
  inactiveClass?: string | null
  onClick?: () => void
  iconOnly?: boolean
}

export default function NavLink(props: NavLinkType) {
  const url = usePathname()
  const active =
    url === props.href ||
    (props.href !== "/" && url.startsWith(props.href + "/")) ||
    url === props.href.replace(/\/$/, "")
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
