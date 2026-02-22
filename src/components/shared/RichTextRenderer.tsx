import type { ReactNode } from "react"

/**
 * Recursive Lexical JSON → React element renderer.
 *
 * Handles the core node types produced by Payload's Lexical editor:
 * paragraph, heading, list/listitem, text (with format flags), link, linebreak.
 *
 * This is a server component — no client JS is shipped for rich text rendering.
 * Using this instead of @payloadcms/richtext-lexical/react avoids pulling
 * the entire Lexical editor bundle into the client.
 */

// Lexical text format bitmask flags
const IS_BOLD = 1
const IS_ITALIC = 2
const IS_STRIKETHROUGH = 4
const IS_UNDERLINE = 8
const IS_CODE = 16

type LexicalNode = {
  type: string
  text?: string
  format?: number | string
  tag?: string
  listType?: string
  children?: LexicalNode[]
  url?: string
  target?: string
  rel?: string
  direction?: string
  indent?: number
  version?: number
  [key: string]: unknown
}

type RichTextRendererProps = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: { root: any; [k: string]: unknown }
  className?: string
}

function renderNode(node: LexicalNode, index: number): ReactNode {
  switch (node.type) {
    case "root":
      return (
        <div key={index}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </div>
      )

    case "paragraph":
      return (
        <p key={index} className="text-muted-foreground leading-7 mb-4">
          {node.children?.map((child, i) => renderNode(child, i))}
        </p>
      )

    case "heading": {
      const tag = (node.tag ?? "h2") as string
      const headingClasses: Record<string, string> = {
        h1: "text-3xl font-bold mb-6",
        h2: "text-2xl font-bold mb-4",
        h3: "text-xl font-semibold mb-3",
        h4: "text-lg font-semibold mb-2",
        h5: "text-base font-semibold mb-2",
        h6: "text-sm font-semibold mb-2",
      }
      const className = headingClasses[tag] ?? ""
      const children = node.children?.map((child, i) => renderNode(child, i))
      switch (tag) {
        case "h1":
          return (
            <h1 key={index} className={className}>
              {children}
            </h1>
          )
        case "h3":
          return (
            <h3 key={index} className={className}>
              {children}
            </h3>
          )
        case "h4":
          return (
            <h4 key={index} className={className}>
              {children}
            </h4>
          )
        case "h5":
          return (
            <h5 key={index} className={className}>
              {children}
            </h5>
          )
        case "h6":
          return (
            <h6 key={index} className={className}>
              {children}
            </h6>
          )
        default:
          return (
            <h2 key={index} className={className}>
              {children}
            </h2>
          )
      }
    }

    case "list": {
      const ListTag = node.listType === "number" ? "ol" : "ul"
      const listClass =
        node.listType === "number"
          ? "list-decimal list-inside mb-4 space-y-1 text-muted-foreground"
          : "list-disc list-inside mb-4 space-y-1 text-muted-foreground"
      return (
        <ListTag key={index} className={listClass}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </ListTag>
      )
    }

    case "listitem":
      return (
        <li key={index}>
          {node.children?.map((child, i) => renderNode(child, i))}
        </li>
      )

    case "link":
    case "autolink":
      return (
        <a
          key={index}
          href={node.url ?? "#"}
          target={node.target ?? "_blank"}
          rel={node.rel ?? "noopener noreferrer"}
          className="text-blue-400 hover:text-blue-300 underline underline-offset-4 transition-colors"
        >
          {node.children?.map((child, i) => renderNode(child, i))}
        </a>
      )

    case "linebreak":
      return <br key={index} />

    case "text": {
      const format = typeof node.format === "number" ? node.format : 0
      let element: ReactNode = <>{node.text}</>

      if (format & IS_CODE) {
        element = (
          <code className="bg-secondary px-1.5 py-0.5 rounded text-sm font-mono">
            {node.text}
          </code>
        )
      }
      if (format & IS_BOLD) {
        element = (
          <strong className="font-semibold text-foreground">{element}</strong>
        )
      }
      if (format & IS_ITALIC) {
        element = <em>{element}</em>
      }
      if (format & IS_UNDERLINE) {
        element = <u>{element}</u>
      }
      if (format & IS_STRIKETHROUGH) {
        element = <s>{element}</s>
      }

      return <span key={index}>{element}</span>
    }

    default:
      // Fallback: try to render children if they exist
      if (node.children && node.children.length > 0) {
        return (
          <div key={index}>
            {node.children.map((child, i) => renderNode(child, i))}
          </div>
        )
      }
      return null
  }
}

export default function RichTextRenderer({
  content,
  className = "",
}: RichTextRendererProps) {
  if (!content?.root) return null

  return (
    <div className={className}>
      {(content.root.children as LexicalNode[] | undefined)?.map(
        (child: LexicalNode, i: number) => renderNode(child, i)
      )}
    </div>
  )
}
