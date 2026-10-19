"use client"

import { useSyncExternalStore } from "react"
import { Agentation } from "agentation"
import { DialRoot } from "dialkit"

const STORAGE_KEY = "devtools-hidden"

/**
 * Development-only overlays (DialKit tuning panel and Agentation).
 * Add `?devtools=off` to any URL to hide them for the rest of the tab
 * session (handy for clean screenshots or testing on a phone/simulator);
 * `?devtools=on` brings them back.
 */
function readHidden() {
  const flag = new URLSearchParams(window.location.search).get("devtools")
  try {
    if (flag === "off") sessionStorage.setItem(STORAGE_KEY, "1")
    if (flag === "on") sessionStorage.removeItem(STORAGE_KEY)
    return sessionStorage.getItem(STORAGE_KEY) === "1"
  } catch {
    return flag === "off"
  }
}

const noSubscribe = () => () => {}

export function DevPanels({ agentation }: { agentation: boolean }) {
  // Hidden during the server render; decided from the URL on the client.
  const hidden = useSyncExternalStore(noSubscribe, readHidden, () => true)

  if (hidden) return null
  return (
    <>
      {agentation && <Agentation endpoint="http://localhost:4747" />}
      <DialRoot />
    </>
  )
}
