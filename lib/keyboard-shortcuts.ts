import type { ProjectItem } from "@/lib/portfolio-data"

/**
 * Assigns a unique single-letter keyboard shortcut to each project with a URL.
 * For each project, tries the first letter of its name (lowercase), then subsequent
 * letters if that key is already taken.
 */
export function assignShortcutKeys(projects: ProjectItem[]): Map<string, string> {
  const assigned = new Map<string, string>()
  const usedKeys = new Set<string>()

  for (const project of projects) {
    if (!project.url) continue

    const name = project.name.toLowerCase()

    for (const char of name) {
      if (!/[a-z]/.test(char)) continue
      if (!usedKeys.has(char)) {
        usedKeys.add(char)
        assigned.set(project.name, char)
        break
      }
    }
  }

  return assigned
}
