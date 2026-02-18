"use client"

import SearchBar from "./SearchBar"
import { ThemeToggle } from "./ThemeToggle"

export default function Navbar() {
  

  return (
    <div className="relative flex items-center justify-end px-8 py-4">
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-10">
        <a 
          href="#" 
          className="py-1 px-4 hover:-translate-y-0.5 rounded-md dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300"
        >
          Home
        </a>
        <a 
          href="#" 
          className="py-1 px-4 hover:-translate-y-0.5 rounded-md dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300"
        >
          Projects
        </a>
        <a 
          href="#" 
          className="py-1 px-4 hover:-translate-y-0.5 rounded-md dark:hover:bg-gray-800 hover:bg-gray-100 transition-all duration-300"
        >
          Experiences
        </a>
      </div>

      <div className="flex gap-4">
        <ThemeToggle />
        <SearchBar />
      </div>
    </div>
  )
}
