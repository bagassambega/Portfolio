import type { ReactNode } from "react"
import TableOfContents, { type TocItem } from "./TableOfContents"
import TocDrawer from "./TocDrawer"

interface Props {
  children: ReactNode
  tocItems: TocItem[]
}

export default function SlugPageLayout({ children, tocItems }: Props) {
  return (
    <main className="flex justify-center bg-zinc-50 dark:bg-black min-h-screen">
      {/* Overlay drawer for smaller screens */}
      <TocDrawer items={tocItems} />

      <div className="w-full max-w-6xl px-6 py-4 md:py-16 flex gap-16">
        {/* Left sidebar — visible only on xl+ */}
        <aside className="hidden xl:block w-52 shrink-0">
          <TableOfContents items={tocItems} />
        </aside>

        {/* Main content */}
        <article className="flex-1 min-w-0 font-inter">{children}</article>
      </div>
    </main>
  )
}
