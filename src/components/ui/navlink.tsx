"use client"

import Link from "next/link"
import { ReactNode } from "react"
import { usePathname } from "next/navigation"

export type NavLinkType = {
  href: string
  children: ReactNode
  activeClass: string
  inactiveClass?: string | null
}

export default function NavLink(props: NavLinkType) {
  const url = usePathname();
  const active = (url === props.href || url.trim().startsWith("/" + props.href));
  return (
    <Link
      href={props.href}
      className={`hover:-translate-y-0.5 rounded-md dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300 ${active ? props.activeClass : props.inactiveClass}`}
    >
      {props.children}
    </Link>
  )
}
