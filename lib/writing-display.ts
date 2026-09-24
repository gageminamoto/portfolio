/** Strip mistaken markdown bold markers from Notion title plain_text (slug uses slugify separately). */
export function displayWritingTitle(raw: string): string {
  const trimmed = raw.trim()
  if (trimmed.length > 4 && trimmed.startsWith("**") && trimmed.endsWith("**")) {
    return trimmed.slice(2, -2).trim()
  }
  return raw
}
