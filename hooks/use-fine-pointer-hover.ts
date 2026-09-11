"use client"

import { useState, useEffect } from "react"

/**
 * Returns `true` only when the device has a fine pointer (mouse/trackpad)
 * and supports hover — i.e. not touch-only devices.
 */
export function useFinePointerHover({ minWidth }: { minWidth?: number } = {}) {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const query = ["(hover: hover)", "(pointer: fine)"]
    if (minWidth) query.push(`(min-width: ${minWidth}px)`)

    const mq = window.matchMedia(query.join(" and "))
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return fine
}
