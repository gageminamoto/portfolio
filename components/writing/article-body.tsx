"use client"

import type { CSSProperties, ReactNode } from "react"
import { useDialKit } from "dialkit"

/** Wraps the article and exposes its body text size to paragraphs and lists.
 * Tune live in the "Article text" DialKit panel (dev only). */
export function ArticleBody({ children }: { children: ReactNode }) {
  const text = useDialKit("Article text", {
    size: [18, 14, 26, 1],
    lineHeight: [1.55, 1.2, 2, 0.05],
  })

  return (
    <article
      style={
        {
          "--article-size": `${text.size}px`,
          "--article-leading": text.lineHeight,
        } as CSSProperties
      }
    >
      {children}
    </article>
  )
}
