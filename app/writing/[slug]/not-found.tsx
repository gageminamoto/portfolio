import Link from "next/link"

export default function ArticleNotFound() {
  return <main id="main-content" className="mx-auto max-w-xl px-6 py-16 md:py-24"><h1 className="text-2xl font-semibold tracking-tight">Article not found</h1><p className="mt-4 text-sm text-muted-foreground">This article may have moved or is no longer published.</p><Link href="/writing" className="mt-6 inline-block text-sm text-muted-foreground underline decoration-dashed decoration-2 underline-offset-4 hover:text-foreground">Back to writing</Link></main>
}
