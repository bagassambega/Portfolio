export type SearchContentType =
  | "page"
  | "project"
  | "work-experience"
  | "organization-experience"
  | "education"
  | "publication"

export type SearchItem = {
  id: string
  title: string
  href: string
  contentType: SearchContentType
  typeLabel: string
  subtype?: string
  date?: string | null
  endDate?: string | null
  excerpt?: string
  imageUrl?: string | null
  imageAlt?: string | null
  tags: string[]
  searchText: string
}

export type SearchFilters = {
  query: string
  contentType: "all" | SearchContentType
  subtype: string
  tag: string
  from: string
  to: string
  sort: "relevance" | "newest" | "oldest" | "title"
}

export function getSearchScore(item: SearchItem, rawQuery: string) {
  const query = rawQuery.trim().toLowerCase()
  if (!query) return 1

  const terms = query.split(/\s+/).filter(Boolean)
  const title = item.title.toLowerCase()
  const subtype = item.subtype?.toLowerCase() ?? ""
  const tags = item.tags.join(" ").toLowerCase()
  const text = item.searchText.toLowerCase()

  return terms.reduce((score, term) => {
    if (title === term) return score + 80
    if (title.includes(term)) score += 40
    if (subtype.includes(term)) score += 20
    if (tags.includes(term)) score += 16
    if (text.includes(term)) score += 8
    return score
  }, 0)
}

export function filterSearchItems(items: SearchItem[], filters: SearchFilters) {
  const query = filters.query.trim()

  return items
    .map((item) => ({ item, score: getSearchScore(item, query) }))
    .filter(({ item, score }) => {
      if (query && score <= 0) return false
      if (
        filters.contentType !== "all" &&
        item.contentType !== filters.contentType
      ) {
        return false
      }
      if (filters.subtype && item.subtype !== filters.subtype) return false
      if (filters.tag && !item.tags.includes(filters.tag)) return false
      const itemTime = item.date ? new Date(item.date).getTime() : null
      if (filters.from) {
        const fromTime = new Date(filters.from).getTime()
        if (itemTime === null || itemTime < fromTime) return false
      }
      if (filters.to) {
        const toTime = new Date(filters.to).getTime()
        if (itemTime === null || itemTime > toTime) return false
      }
      return true
    })
    .sort((a, b) => {
      if (filters.sort === "title") {
        return a.item.title.localeCompare(b.item.title)
      }

      const aTime = a.item.date ? new Date(a.item.date).getTime() : 0
      const bTime = b.item.date ? new Date(b.item.date).getTime() : 0

      if (filters.sort === "newest") return bTime - aTime
      if (filters.sort === "oldest") return aTime - bTime

      return b.score - a.score || bTime - aTime
    })
    .map(({ item }) => item)
}

export function getContentTypeLabel(type: SearchContentType) {
  const labels: Record<SearchContentType, string> = {
    page: "Page",
    project: "Project",
    "work-experience": "Work Experience",
    "organization-experience": "Organization Experience",
    education: "Education",
    publication: "Publication",
  }

  return labels[type]
}
