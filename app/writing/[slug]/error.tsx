"use client"

import Link from "next/link"

export default function ArticleError() {
  return <main id="main-content" className="mx-auto max-w-xl px-6 py-16 md:py-24"><h1 className="text-2xl font-semibold tracking-tight">Article unavailable</h1><p className="mt-4 text-sm text-muted-foreground">The article could not be loaded. Please try again shortly.</p><Link href="/writing" className="mt-6 inline-block text-sm text-muted-foreground underline decoration-dashed decoration-2 underline-offset-4 hover:text-foreground">Back to writing</Link></main>
}
