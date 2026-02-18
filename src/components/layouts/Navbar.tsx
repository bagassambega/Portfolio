import SearchBar from "./SearchBar"
import { ThemeToggle } from "./ThemeToggle"
import NavLink from "../ui/navlink"

export default function Navbar() {
  const navLinks = [
    {
      title: "Home",
      url: "/",
    },
    {
      title: "Projects",
      url: "/projects",
    },
    {
      title: "Experiences",
      url: "/experiences",
    },
  ]
  return (
    <div className="relative flex items-center justify-end px-8 py-4">
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-10">
        {navLinks.map((link) => (
          <NavLink
            key={link.url}
            href={link.url}
            activeClass="dark:text-blue-400 text-blue-600 underline underline-offset-10 decoration-[3px] py-1 px-6 -translate-y-px"
            inactiveClass="dark:text-gray-300 dark:hover:text-white text-gray-700 hover:text-black py-1 px-4"
          >
            {link.title}
          </NavLink>
        ))}
      </div>

      <div className="flex gap-4">
        <ThemeToggle />
        <SearchBar />
      </div>
    </div>
  )
}
