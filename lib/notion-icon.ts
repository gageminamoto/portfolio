/** Safely read a Notion emoji icon without assuming API version-specific shapes. */
export function getEmojiIcon(icon: unknown): string | null {
  if (!icon || typeof icon !== "object") return null
  const record = icon as Record<string, unknown>
  if (record.type !== "emoji") return null
  const emoji = record.emoji
  return typeof emoji === "string" && emoji.length > 0 ? emoji : null
}
