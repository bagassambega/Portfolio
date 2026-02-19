"use client"

import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { Search, Home } from "lucide-react"
import { Button } from "../ui/button"
import Link from "next/link"

export default function SearchBar() {
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }
    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        className="w-fit inline-flex items-center gap-2 cursor-pointer dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-300 dark:text-gray-400 text-gray-500 dark:hover:text-gray-300 hover:text-gray-700"
      >
        <Search />
        <span className="hidden md:inline">Search or Press ⌘ K</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandEmpty>No results found.</CommandEmpty>
            <CommandGroup heading="Settings">
              <CommandItem>
                <Home />
                <Link href="/">Home</Link>
              </CommandItem>
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}
