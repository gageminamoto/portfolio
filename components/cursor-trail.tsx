"use client"

import { useEffect, useRef, useCallback } from "react"
import { useReducedMotion } from "framer-motion"
import { useGradientWord } from "@/components/gradient-word-context"
import { useTouchDevice } from "@/hooks/use-mobile"

const TRAIL_LENGTH = 8
const FADE_AFTER_IDLE_MS = 800

const HUE_MAP: Record<string, number> = {
  software: 250,
  experiences: 330,
  tools: 145,
}

interface Point {
  x: number
  y: number
}

export function CursorTrail() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const pointsRef = useRef<Point[]>([])
  const rafRef = useRef<number>(0)
  const fadeTimerRef = useRef<ReturnType<typeof setTimeout>>(null)
  const fadeRef = useRef(1)
  const fadingRef = useRef(false)
  const prefersReducedMotion = useReducedMotion()
  const { activeWord, cursorTrailActive, setCursorTrailActive, shaderEnabled } = useGradientWord()

  const isTouchDevice = useTouchDevice()

  const hue = HUE_MAP[activeWord] ?? 250

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    if (fadingRef.current) {
      fadeRef.current = Math.max(0, fadeRef.current - 0.04)
    } else {
      fadeRef.current = Math.min(1, fadeRef.current + 0.08)
    }

    const points = pointsRef.current
    for (let i = 0; i < points.length; i++) {
      const progress = i / points.length
      const alpha = (1 - progress) * 0.5 * fadeRef.current
      const radius = 3 - progress * 1.5
      if (alpha <= 0 || radius <= 0) continue
      ctx.beginPath()
      ctx.arc(points[i].x, points[i].y, radius, 0, Math.PI * 2)
      ctx.fillStyle = `oklch(0.7 0.15 ${hue} / ${alpha})`
      ctx.fill()
    }

    rafRef.current = requestAnimationFrame(draw)
  }, [hue])

  // Reset trail when effects are turned off
  useEffect(() => {
    if (!shaderEnabled && cursorTrailActive) {
      setCursorTrailActive(false)
    }
  }, [shaderEnabled, cursorTrailActive, setCursorTrailActive])

  useEffect(() => {
    if (!cursorTrailActive || !shaderEnabled || prefersReducedMotion || isTouchDevice) return

    const canvas = canvasRef.current
    if (!canvas) return

    function resize() {
      if (!canvas) return
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener("resize", resize)

    fadeRef.current = 1
    fadingRef.current = false
    rafRef.current = requestAnimationFrame(draw)

    function onPointerMove(e: PointerEvent) {
      pointsRef.current.unshift({ x: e.clientX, y: e.clientY })
      if (pointsRef.current.length > TRAIL_LENGTH) pointsRef.current.pop()

      fadingRef.current = false

      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      fadeTimerRef.current = setTimeout(() => {
        fadingRef.current = true
      }, FADE_AFTER_IDLE_MS)
    }

    window.addEventListener("pointermove", onPointerMove)

    return () => {
      window.removeEventListener("resize", resize)
      window.removeEventListener("pointermove", onPointerMove)
      if (fadeTimerRef.current) clearTimeout(fadeTimerRef.current)
      cancelAnimationFrame(rafRef.current)
    }
  }, [cursorTrailActive, prefersReducedMotion, isTouchDevice, draw])

  if (prefersReducedMotion || isTouchDevice) return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-50"
      aria-hidden="true"
    />
  )
}
