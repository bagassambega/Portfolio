import type { Metadata } from "next"
import SearchPageClient from "@/components/pages/search/SearchPageClient"
import { getSearchIndex } from "@/lib/services/search"

export const metadata: Metadata = {
  title: "Search",
}

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>
}) {
  const [{ q }, items] = await Promise.all([searchParams, getSearchIndex()])

  return <SearchPageClient items={items} initialQuery={q ?? ""} />
}
