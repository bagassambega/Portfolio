"use client"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandShortcut,
} from "@/components/ui/command"
import { useEffect, useState } from "react"
import { CreditCardIcon, SettingsIcon, UserIcon } from "lucide-react"
import { ThemeToggle } from "./ThemeToggle"

export default function Navbar() {
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
    <div className="relative flex items-center justify-end">
      <div className="absolute left-1/2 -translate-x-1/2 flex flex-row gap-12">
        <a href="#">Home</a>
        <a href="#">Projects</a>
        <a href="#">Experiences</a>
      </div>

      <div className="flex gap-2">
        <ThemeToggle />
        <div className="flex flex-col gap-4">
          <Button
            onClick={() => setOpen(true)}
            variant="outline"
            className="w-fit"
          >
            Open Menu
          </Button>
          <CommandDialog open={open} onOpenChange={setOpen}>
            <Command>
              <CommandInput placeholder="Type a command or search..." />
              <CommandList>
                <CommandEmpty>No results found.</CommandEmpty>
                <CommandGroup heading="Settings">
                  <CommandItem>
                    <UserIcon />
                    <span>Profile</span>
                    <CommandShortcut>⌘P</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <CreditCardIcon />
                    <span>Billing</span>
                    <CommandShortcut>⌘B</CommandShortcut>
                  </CommandItem>
                  <CommandItem>
                    <SettingsIcon />
                    <span>Settings</span>
                    <CommandShortcut>⌘S</CommandShortcut>
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </Command>
          </CommandDialog>
        </div>
      </div>
    </div>
  )
}
