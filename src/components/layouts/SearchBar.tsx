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
    <div className="flex flex-col gap-4">
      <Button 
        onClick={() => setOpen(true)} 
        variant="outline" 
        className="w-fit inline-flex items-center gap-2 cursor-pointer dark:border-gray-800 border-gray-100 dark:hover:bg-gray-700 hover:bg-gray-100 transition-colors duration-200 dark:text-gray-400 text-gray-500 dark:hover:text-gray-400 hover:text-gray-900"
      >
        <Search />
        <span>Search or Press ⌘ K</span>
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
    </div>
  )
}
