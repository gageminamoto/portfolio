"use client"

import { BackLink } from "@/components/back-link"
import { ListRow } from "@/components/list-row"
import { SiteFooter } from "@/components/site-footer"
import {
  earlyDesignResources,
  getResourceHost,
} from "@/lib/early-design-resources"

export function EarlyDesignPage() {
  return (
    <main
      id="main-content"
      className="mx-auto flex min-h-screen max-w-xl flex-col gap-12 px-6 py-16 md:py-24"
    >
      <header>
        <BackLink href="/">Home</BackLink>
      </header>

      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground [text-wrap:balance]">
          Early design resources
        </h1>
      </div>

      <ul className="flex flex-col">
        {earlyDesignResources.map((resource) => (
          <li key={resource.title}>
            {resource.url ? (
              <ListRow
                href={resource.url}
                external
                name={resource.title}
                meta={getResourceHost(resource.url)}
                aria-label={`${resource.title} (opens in new tab)`}
                className="focus-within:bg-transparent focus-within:px-0 focus-visible:bg-muted focus-visible:px-3"
              />
            ) : (
              <ListRow
                name={resource.title}
                className="hover:bg-transparent hover:px-0"
              />
            )}
          </li>
        ))}
      </ul>

      <SiteFooter />
    </main>
  )
}
