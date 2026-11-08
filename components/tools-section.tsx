"use client"

import { MacAppIcon } from "@/components/mac-app-icon"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { MAC_APP_GROUPS, type MacApp, type MacAppIconImages } from "@/lib/mac-apps"

interface ToolsSectionProps {
  /** Real exported icons by slug; the rest fall back to drawn mock-ups. */
  iconImages?: MacAppIconImages
}

function AppLink({ app, image }: { app: MacApp; image?: string }) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <a
          href={app.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`${app.name} — ${app.description}`}
          className="group block size-11 rounded-xl outline-none sm:size-13 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          <MacAppIcon
            slug={app.slug}
            image={image}
            className="transition-transform duration-200 ease-out group-hover:-translate-y-0.5 group-hover:scale-105 group-focus-visible:-translate-y-0.5 motion-reduce:transition-none motion-reduce:group-hover:transform-none"
          />
        </a>
      </TooltipTrigger>
      <TooltipContent sideOffset={2}>
        <span className="font-medium">{app.name}</span>
        <span className="text-background/70"> · {app.description}</span>
      </TooltipContent>
    </Tooltip>
  )
}

/** The homepage tools row: Mac app icons grouped by what they are for. */
export function ToolsSection({ iconImages }: ToolsSectionProps) {
  return (
    <ul className="flex flex-wrap gap-x-5 gap-y-4" aria-label="Tools, grouped">
      {MAC_APP_GROUPS.map((group) => (
        <li key={group.label} className="flex flex-col gap-1">
          <ul className="-mx-1 flex" aria-label={group.label}>
            {group.apps.map((app) => (
              <li key={app.slug}>
                <AppLink app={app} image={iconImages?.[app.slug]} />
              </li>
            ))}
          </ul>
          <span className="pl-1 text-[11px] font-medium text-muted-foreground/70">
            {group.label}
          </span>
        </li>
      ))}
    </ul>
  )
}
