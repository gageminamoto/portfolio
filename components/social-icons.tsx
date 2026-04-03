import type { SocialLink } from "@/lib/portfolio-data"
import { Icon } from "@iconify/react"
import { Copy, ExternalLink } from "lucide-react"
import { useState } from "react"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

function TwitterIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

export function GitHubIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

function LinkedInIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  )
}

const iconMap: Record<string, React.FC<{ className?: string }>> = {
  twitter: TwitterIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
}

export function SocialIcons({
  socials,
  size = "md",
  email,
}: {
  socials: SocialLink[]
  size?: "sm" | "md"
  email?: string
}) {
  const [copied, setCopied] = useState(false)
  const sizeClass = size === "sm" ? "h-4 w-4" : "h-5 w-5"

  const handleCopyEmail = () => {
    if (email) {
      navigator.clipboard.writeText(email)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <div className="flex items-center gap-4">
      {socials.map((social) => {
        const Icon = iconMap[social.platform]
        if (!Icon) return null
        return (
          <a
            key={social.platform}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className="text-muted-foreground transition-[color,transform] duration-150 ease-out hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
            aria-label={social.label}
          >
            <Icon className={sizeClass} />
          </a>
        )
      })}
      {email && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <button
              className="flex cursor-pointer items-center gap-1.5 text-muted-foreground transition-[color,transform] duration-150 ease hover:text-foreground active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
              aria-label="Email options"
              title={email}
              suppressHydrationWarning
            >
              <span className="relative" style={{ width: "1.25rem", height: "1.25rem" }}>
                <Icon
                  icon="solar:plain-bold"
                  className={`${sizeClass} absolute inset-0 transition-opacity duration-200 motion-reduce:transition-none ${copied ? "opacity-0" : "opacity-100"}`}
                />
                <Icon
                  icon="solar:letter-opened-bold"
                  className={`${sizeClass} absolute inset-0 transition-opacity duration-200 motion-reduce:transition-none ${copied ? "opacity-100 animate-mail-shake motion-reduce:animate-none" : "opacity-0"}`}
                />
              </span>
              {copied && (
                <span
                  className="text-sm animate-in fade-in slide-in-from-left-1 duration-200"
                  aria-live="polite"
                >
                  Email Copied!
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" side="bottom" sideOffset={8}>
            <DropdownMenuItem onSelect={handleCopyEmail}>
              <Copy className="size-4" />
              Copy email
            </DropdownMenuItem>
            <DropdownMenuItem onSelect={() => window.open(`mailto:${email}`, "_self")}>
              <ExternalLink className="size-4" />
              Open in email client
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  )
}
