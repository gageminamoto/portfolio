import { existsSync } from "node:fs"
import { join } from "node:path"
import { MAC_APP_GROUPS, type MacAppIconImages } from "@/lib/mac-apps"

const ICON_DIR = join(process.cwd(), "public", "tools")

/**
 * Server-only: finds which tools have a real macOS icon exported to
 * `public/tools/<slug>.png`, so the client renders the image instead of the
 * drawn mock-up without probing for files that are not there.
 */
export function getMacAppIconImages(): MacAppIconImages {
  const images: MacAppIconImages = {}
  for (const group of MAC_APP_GROUPS) {
    for (const app of group.apps) {
      if (existsSync(join(ICON_DIR, `${app.slug}.png`))) {
        images[app.slug] = `/tools/${app.slug}.png`
      }
    }
  }
  return images
}
