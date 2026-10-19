"use client"

import { useDialKit } from "dialkit"

export const DEFAULT_SECTION_GAP_PX = 64

/** Shared across pages so one DialKit slider tunes every page stack. */
export function useSectionGap() {
  return useDialKit(
    "Section gap",
    {
      gap: [DEFAULT_SECTION_GAP_PX, 32, 160, 8],
    },
    {
      id: "section-gap",
      persist: true,
    }
  )
}
