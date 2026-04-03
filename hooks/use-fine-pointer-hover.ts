"use client"

import { useState, useEffect } from "react"

/**
 * Returns `true` only when the device has a fine pointer (mouse/trackpad)
 * and supports hover — i.e. not touch-only devices.
 */
export function useFinePointerHover() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)")
    const update = () => setFine(mq.matches)
    update()
    mq.addEventListener("change", update)
    return () => mq.removeEventListener("change", update)
  }, [])
  return fine
}
