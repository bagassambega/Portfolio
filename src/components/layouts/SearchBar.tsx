"use client"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import {
  ArrowRight,
  Briefcase,
  FileText,
  FolderKanban,
  GraduationCap,
  Home,
  Search,
  SlidersHorizontal,
  Users,
} from "lucide-react"
import { type ComponentType, useMemo, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "../ui/button"
import { cn } from "@/lib/utils"
import {
  filterSearchItems,
  getContentTypeLabel,
  type SearchContentType,
  type SearchItem,
} from "@/lib/search"

type SearchBarProps = {
  className?: string
  searchItems: SearchItem[]
}

const iconByType: Record<SearchContentType, ComponentType<{ className?: string }>> = {
  page: Home,
  project: FolderKanban,
  "work-experience": Briefcase,
  "organization-experience": Users,
  education: GraduationCap,
  publication: FileText,
}

export default function SearchBar({ className, searchItems }: SearchBarProps) {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState("")
  const router = useRouter()

  const suggestions = useMemo(
    () =>
      filterSearchItems(searchItems, {
        query,
        contentType: "all",
        subtype: "",
        tag: "",
        from: "",
        to: "",
        sort: "relevance",
      }).slice(0, 8),
    [query, searchItems]
  )

  const openResult = (href: string) => {
    setOpen(false)
    setQuery("")
    router.push(href)
  }

  const openAdvancedSearch = () => {
    const params = new URLSearchParams()
    if (query.trim()) params.set("q", query.trim())

    setOpen(false)
    router.push(`/search${params.toString() ? `?${params}` : ""}`)
  }

  return (
    <>
      <Button
        onClick={() => setOpen(true)}
        variant="ghost"
        size="icon"
        className={cn(
          "inline-flex items-center cursor-pointer rounded-full",
          className
        )}
      >
        <Search className="h-5 w-5" />
        <span className="hidden md:inline">Search</span>
      </Button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput
          value={query}
          onValueChange={setQuery}
          placeholder="Search content, pages, tech stack..."
        />
        <CommandList className="max-h-[420px]">
          <CommandEmpty>No quick results found.</CommandEmpty>
          <CommandGroup heading="Suggestions">
            {suggestions.map((item) => {
              const Icon = iconByType[item.contentType]
              return (
                <CommandItem
                  key={item.id}
                  value={[
                    item.title,
                    item.typeLabel,
                    item.subtype,
                    ...item.tags,
                    item.searchText,
                  ].join(" ")}
                  onSelect={() => openResult(item.href)}
                  className="items-start gap-3"
                >
                  <Icon className="mt-0.5 h-4 w-4" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="truncate font-medium">{item.title}</span>
                    <span className="line-clamp-1 text-xs text-muted-foreground">
                      {getContentTypeLabel(item.contentType)}
                      {item.subtype ? ` / ${item.subtype}` : ""}
                      {item.tags.length > 0 ? ` / ${item.tags.slice(0, 3).join(", ")}` : ""}
                    </span>
                  </span>
                  <ArrowRight className="mt-0.5 h-4 w-4 opacity-45" />
                </CommandItem>
              )
            })}
          </CommandGroup>
          <CommandSeparator />
          <CommandGroup>
            <CommandItem
              forceMount
              value="advanced search filters content type project experience education publication tech stack date sort"
              onSelect={openAdvancedSearch}
              className="items-center gap-3"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="flex flex-1 flex-col gap-1">
                <span className="font-medium">Advanced Search</span>
                <span className="text-xs text-muted-foreground">
                  Filter by content type, subtype, tech stack, and date
                </span>
              </span>
              <ArrowRight className="h-4 w-4 opacity-45" />
            </CommandItem>
          </CommandGroup>
        </CommandList>
      </CommandDialog>
    </>
  )
}
