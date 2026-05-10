"use client"

import { useState } from "react"
import Link from "next/link"
import { FileText } from "lucide-react"

import type { NotionWritingPost } from "@/lib/notion"

interface ArticleFooterProps {
  prevPost: NotionWritingPost | null
  nextPost: NotionWritingPost | null
}

export function ArticleFooter({ prevPost, nextPost }: ArticleFooterProps) {
  const hasBoth = prevPost && nextPost
  const defaultDirection = nextPost ? "next" : "prev"
  const [active, setActive] = useState<"prev" | "next">(defaultDirection)

  const activePost = active === "next" ? nextPost : prevPost

  if (!prevPost && !nextPost) return null

  return (
    <footer className="mt-20 mx-auto max-w-xl">
      <div className="flex flex-col gap-4">
        {/* Direction labels */}
        <div className="relative z-10 flex items-center justify-between px-6 md:px-0">
          {hasBoth ? (
            <>
              <Link
                href={`/writing/${prevPost!.slug}`}
                onMouseEnter={() => setActive("prev")}
                className={`text-sm transition-[color,background-color,transform] duration-150 ease px-2.5 py-1.5 -mx-2.5 -my-1.5 rounded-lg hover:bg-muted active:scale-[0.97] ${
                  active === "prev"
                    ? "text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                Prior post
              </Link>
              <Link
                href={`/writing/${nextPost!.slug}`}
                onMouseEnter={() => setActive("next")}
                className={`text-sm transition-[color,background-color,transform] duration-150 ease px-2.5 py-1.5 -mx-2.5 -my-1.5 rounded-lg hover:bg-muted active:scale-[0.97] ${
                  active === "next"
                    ? "text-foreground"
                    : "text-muted-foreground/40 hover:text-muted-foreground"
                }`}
              >
                Next post
              </Link>
            </>
          ) : (
            <>
              <span />
              <Link
                href={`/writing/${activePost!.slug}`}
                className="text-sm text-foreground px-2.5 py-1.5 -mx-2.5 -my-1.5 rounded-lg transition-[color,background-color,transform] duration-150 ease hover:bg-muted active:scale-[0.97]"
              >
                {defaultDirection === "next" ? "Next post" : "Prior post"}
              </Link>
            </>
          )}
        </div>

        {/* Peeking page card */}
        {activePost && (
          <div className="h-[170px] overflow-hidden pt-[30px] -mt-[30px] -mx-8 px-8">
            <Link
              href={`/writing/${activePost.slug}`}
              className="group block rounded-t-2xl border border-b-0 border-border bg-card shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.08)] dark:shadow-[0_-4px_24px_-4px_rgba(0,0,0,0.3)] transition-[border-color,box-shadow] duration-200 ease-out hover:border-foreground/20 hover:shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.12)] dark:hover:shadow-[0_-8px_32px_-4px_rgba(0,0,0,0.4)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              <div className="relative px-8 pt-6 pb-4">
                {/* Cross-fade between posts */}
                {hasBoth ? (
                  <>
                    <div
                      className={`flex flex-col gap-3 transition-opacity duration-200 ease-out ${
                        active === "next" ? "opacity-100" : "opacity-0 absolute inset-x-8 top-6"
                      }`}
                    >
                      <FileText
                        className="h-4 w-4 text-muted-foreground/50"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="text-base font-semibold text-foreground">
                        {nextPost!.title}
                      </h3>
                    </div>
                    <div
                      className={`flex flex-col gap-3 transition-opacity duration-200 ease-out ${
                        active === "prev" ? "opacity-100" : "opacity-0 absolute inset-x-8 top-6"
                      }`}
                    >
                      <FileText
                        className="h-4 w-4 text-muted-foreground/50"
                        strokeWidth={1.5}
                        aria-hidden="true"
                      />
                      <h3 className="text-base font-semibold text-foreground">
                        {prevPost!.title}
                      </h3>
                    </div>
                  </>
                ) : (
                  <div className="flex flex-col gap-3">
                    <FileText
                      className="h-4 w-4 text-muted-foreground/50"
                      strokeWidth={1.5}
                      aria-hidden="true"
                    />
                    <h3 className="text-base font-semibold text-foreground">
                      {activePost.title}
                    </h3>
                  </div>
                )}
              </div>

              <div
                className="px-8 flex flex-col gap-2.5"
                aria-hidden="true"
              >
                <div className="h-[5px] w-full rounded-full bg-muted/70" />
                <div className="h-[5px] w-[94%] rounded-full bg-muted/70" />
                <div className="h-[5px] w-[82%] rounded-full bg-muted/50" />
                <div className="h-[5px] w-full rounded-full bg-muted/50" />
                <div className="h-[5px] w-[76%] rounded-full bg-muted/30" />
              </div>
            </Link>
          </div>
        )}
      </div>
    </footer>
  )
}
