"use client"

import { Home, FolderKanban, Briefcase, GraduationCap } from "lucide-react"
import SearchBar from "./SearchBar"
import { ThemeToggle } from "./ThemeToggle"
import NavLink from "./Navlilnk"
import Link from "next/link"
import SocMedBar from "./SocialMediaBar"
import type { SocialMedia } from "@/lib/types/payload-types"

type NavbarProps = {
  socialMedia: (Pick<SocialMedia, "id" | "name" | "url" | "logo"> & {
    username?: string | null
  })[]
}

export default function Navbar({ socialMedia }: NavbarProps) {
  const navLinks = [
    {
      title: "About",
      url: "/",
      icon: <Home className="h-5 w-5" />,
    },
    {
      title: "Projects",
      url: "/projects",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      title: "Experiences",
      url: "/experiences",
      icon: <Briefcase className="h-5 w-5" />,
    },
    {
      title: "Educations",
      url: "/educations",
      icon: <GraduationCap className="h-5 w-5 scale-110" />,
    },
  ]

  return (
    <div className="relative flex items-center justify-center md:justify-end font-sans bg-linear-to-b from-gray-300 via-gray-50 to-zinc-50 dark:from-gray-900 dark:via-gray-950 dark:to-transparent px-8 pt-4 pb-18">
      <div className="absolute left-8 hidden md:flex items-center">
        <Link
          className="text-lg font-bold tracking-[0.3em] dark:text-gray-200 text-gray-800 select-none"
          href="/"
        >
          B . S . R
        </Link>
      </div>
      {/* Desktop nav */}
      <div className="dark:bg-gray-800 bg-white backdrop-blur-sm rounded-full p-1.5 absolute left-1/2 -translate-x-1/2 hidden md:flex flex-row gap-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.url}
            href={link.url}
            icon={link.icon}
            activeClass="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-blue-400 text-blue-600 underline underline-offset-8 decoration-[3px] py-1.5 px-4 -translate-y-px"
            inactiveClass="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:text-gray-300 text-gray-500 hover:text-gray-700 py-1.5 px-4"
          >
            {link.title}
          </NavLink>
        ))}
      </div>

      {/* Right side actions */}
      <div className="dark:bg-gray-800 bg-white backdrop-blur-sm rounded-full p-1.5 hidden md:flex items-center gap-1">
        <ThemeToggle className="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 transition-colors duration-300" />
        <SocMedBar
          socialMedia={socialMedia}
          className="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 transition-colors duration-300"
        />
        <div className="w-px h-5 dark:bg-gray-600 bg-gray-300 mx-0.5" />
        <SearchBar className="w-fit gap-2 px-3 h-9 dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700 text-sm" />
      </div>

      {/* Mobile icon nav */}
      <div className="dark:bg-gray-800 bg-white rounded-full flex md:hidden flex-row justify-center items-center gap-1 px-2">
        {navLinks.map((link) => (
          <NavLink
            key={link.url}
            href={link.url}
            icon={link.icon}
            iconOnly
            activeClass="dark:text-blue-400 text-blue-600 p-2 cursor-pointer"
            inactiveClass="dark:text-gray-400 dark:hover:text-gray-300 text-gray-500 hover:text-gray-700 p-2 cursor-pointer"
          >
            {link.title}
          </NavLink>
        ))}
        <ThemeToggle className="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 transition-colors duration-300 h-9 w-9 p-0" />
        <SocMedBar
          socialMedia={socialMedia}
          className="dark:hover:bg-gray-700 hover:bg-gray-100 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 transition-colors duration-300 h-9 w-9 p-0"
        />
        <div className="w-px h-5 dark:bg-gray-600 bg-gray-300 mx-0.5" />
        <SearchBar className="h-9 w-9 p-0 pr-0! justify-center dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700 text-sm" />
      </div>
    </div>
  )
}
