"use client"

import { motion, useReducedMotion } from "framer-motion"
import { BackLink } from "@/components/back-link"
import { BlocksRenderer } from "@/components/writing/blocks-renderer"
import { TableOfContents } from "@/components/writing/table-of-contents"
import { ArticleFooter } from "@/components/writing/article-footer"
import type { NotionBlock, NotionWritingPost } from "@/lib/notion"
import { fadeUp, noMotion, stagger } from "@/lib/animations"
import { ArticleActions } from "./article-actions"

interface ArticleContentMotionProps {
  backToHome: boolean
  post: NotionWritingPost
  formattedDate: string | null
  articleBlocks: NotionBlock[]
  headings: { id: string; text: string; level: 1 | 2 | 3 }[]
  prevPost: NotionWritingPost | null
  nextPost: NotionWritingPost | null
}

export function ArticleContentMotion({
  backToHome,
  post,
  formattedDate,
  articleBlocks,
  headings,
  prevPost,
  nextPost,
}: ArticleContentMotionProps) {
  const shouldReduceMotion = useReducedMotion()
  const item = shouldReduceMotion ? noMotion : fadeUp

  return (
    <motion.div
      variants={shouldReduceMotion ? undefined : stagger}
      initial="hidden"
      animate="show"
    >
      <div
        className={`mx-auto w-full px-6 pt-16 md:pt-24 ${prevPost || nextPost ? "pb-0" : "pb-16 md:pb-24"} xl:grid xl:grid-cols-[clamp(16rem,18vw,20rem)_minmax(0,36rem)_clamp(16rem,18vw,20rem)] xl:items-start xl:justify-center`}
      >
        <div className="hidden xl:block" />
        <motion.main
          id="main-content"
          variants={item}
          className="min-w-0 max-w-xl xl:max-w-none mx-auto w-full"
        >
          <header className="mb-(--page-section-gap) flex flex-col gap-6">
            <nav className="flex items-center justify-between">
              <BackLink href={backToHome ? "/" : "/writing"}>
                {backToHome ? "Home" : "Writing"}
              </BackLink>
              <ArticleActions />
            </nav>
            <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">{post.title}</h1>
            {post.date && formattedDate && (
              <time dateTime={post.date} className="text-sm text-muted-foreground">{formattedDate}</time>
            )}
          </header>

          {headings.length > 0 && <div className="xl:hidden"><TableOfContents headings={headings} variant="collapsible" /></div>}
          {articleBlocks.length > 0 ? <article><BlocksRenderer blocks={articleBlocks} /></article> : <p className="text-sm text-muted-foreground">This article does not have any published content yet.</p>}
        </motion.main>
        <motion.aside variants={item} className="hidden xl:self-start xl:pl-10 xl:block">
          {headings.length > 0 && <TableOfContents headings={headings} variant="list" />}
        </motion.aside>
      </div>
      {(prevPost || nextPost) && (
        <motion.div variants={item} className="px-6">
          <ArticleFooter prevPost={prevPost} nextPost={nextPost} />
        </motion.div>
      )}
    </motion.div>
  )
}
