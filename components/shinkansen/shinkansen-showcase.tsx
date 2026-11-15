"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import { Canvas, useFrame, type ThreeEvent } from "@react-three/fiber"
import { Environment, Lightformer } from "@react-three/drei"
import { AnimatePresence, motion, useReducedMotion } from "motion/react"
import { useTheme } from "next-themes"
import * as THREE from "three"
import { SERIES } from "./series"
import { TrainCar } from "./train-car"

/* Scene layout, in meters. Cars stand side by side on parallel tracks with
 * their noses at z = 0, bodies running back along -z. */
const TRACK_SPACING = 4.6
const ROLL_BACK = 140
const laneX = (i: number) => (i - (SERIES.length - 1) / 2) * TRACK_SPACING

const OVERVIEW = {
  position: new THREE.Vector3(-9.6, 4.4, 15.2),
  target: new THREE.Vector3(1.4, 2.1, -5.5),
}

const damp = THREE.MathUtils.damp

function Rails({ x, dark }: { x: number; dark: boolean }) {
  return (
    <group position={[x, 0, -24]}>
      {[-0.7175, 0.7175].map((z) => (
        <mesh key={z} position={[z, -0.08, 0]} receiveShadow>
          <boxGeometry args={[0.07, 0.16, 70]} />
          <meshStandardMaterial color="#8d939b" roughness={0.3} metalness={0.8} />
        </mesh>
      ))}
      {/* Concrete slab track. */}
      <mesh position={[0, -0.22, 0]} receiveShadow>
        <boxGeometry args={[2.4, 0.12, 70]} />
        <meshStandardMaterial color={dark ? "#3a3c40" : "#a9aba9"} roughness={0.95} />
      </mesh>
    </group>
  )
}

function Rig({
  selected,
  reduceMotion,
  groups,
}: {
  selected: number | null
  reduceMotion: boolean
  groups: React.RefObject<(THREE.Group | null)[]>
}) {
  const look = useRef(OVERVIEW.target.clone())
  const offsets = useRef(SERIES.map(() => 0))
  const goal = useRef(new THREE.Vector3())
  const goalLook = useRef(new THREE.Vector3())

  useFrame((state, delta) => {
    const dt = Math.min(delta, 1 / 10)
    const t = state.clock.elapsedTime
    const { camera, size } = state
    const narrow = size.width < 480

    if (selected === null) {
      goal.current.copy(OVERVIEW.position)
      goalLook.current.copy(OVERVIEW.target)
      if (narrow) goal.current.lerp(OVERVIEW.target, -0.18)
    } else {
      // Slow turntable sway around the nose of the chosen car.
      const az = -0.75 + 0.42 * Math.sin(t * 0.22)
      const el = 0.2 + 0.05 * Math.sin(t * 0.17)
      const r = narrow ? 18 : 16
      const cx = laneX(selected)
      goalLook.current.set(cx, 1.5, -5.5)
      goal.current.set(
        cx + Math.sin(az) * Math.cos(el) * r,
        1.5 + Math.sin(el) * r,
        -5.5 + Math.cos(az) * Math.cos(el) * r,
      )
    }

    const k = reduceMotion ? 1000 : 2.6
    camera.position.x = damp(camera.position.x, goal.current.x, k, dt)
    camera.position.y = damp(camera.position.y, goal.current.y, k, dt)
    camera.position.z = damp(camera.position.z, goal.current.z, k, dt)
    look.current.x = damp(look.current.x, goalLook.current.x, k, dt)
    look.current.y = damp(look.current.y, goalLook.current.y, k, dt)
    look.current.z = damp(look.current.z, goalLook.current.z, k, dt)
    camera.lookAt(look.current)

    // Cars not being inspected roll back down their tracks.
    groups.current?.forEach((g, i) => {
      if (!g) return
      const want = selected === null || selected === i ? 0 : -ROLL_BACK
      // A car being called back starts just out of view, not from the far end.
      if (want === 0 && offsets.current[i] < -60) offsets.current[i] = -60
      const rollK = reduceMotion ? 1000 : want === 0 ? 2.4 : 1.4
      offsets.current[i] = damp(offsets.current[i], want, rollK, dt)
      g.position.z = offsets.current[i]
      g.visible = offsets.current[i] > -90
    })
  })
  return null
}

export function ShinkansenShowcase() {
  const reduceMotion = useReducedMotion() ?? false
  const dark = useTheme().resolvedTheme === "dark"
  const [selected, setSelected] = useState<number | null>(null)
  const [ready, setReady] = useState(0)
  const [inView, setInView] = useState(false)
  const wrapRef = useRef<HTMLDivElement>(null)
  const groups = useRef<(THREE.Group | null)[]>([])
  const gesture = useRef<{ x: number; y: number } | null>(null)
  const suppressClick = useRef(false)

  const count = SERIES.length
  const step = useCallback(
    (dir: 1 | -1) => setSelected((s) => (s === null ? s : (s + dir + count) % count)),
    [count],
  )

  useEffect(() => {
    const el = wrapRef.current
    if (!el) return
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting), {
      rootMargin: "100px",
    })
    io.observe(el)
    return () => io.disconnect()
  }, [])

  const onPointerDown = (e: React.PointerEvent) => {
    gesture.current = { x: e.clientX, y: e.clientY }
    suppressClick.current = false
  }
  const onPointerUp = (e: React.PointerEvent) => {
    const g = gesture.current
    gesture.current = null
    if (!g) return
    const dx = e.clientX - g.x
    const dy = e.clientY - g.y
    if (Math.abs(dx) > 8 || Math.abs(dy) > 8) suppressClick.current = true
    if (selected !== null && Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.4) {
      step(dx < 0 ? 1 : -1)
    }
  }

  const onKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowRight") {
      if (selected === null) setSelected(0)
      else step(1)
    } else if (e.key === "ArrowLeft") {
      if (selected === null) setSelected(count - 1)
      else step(-1)
    } else if (e.key === "Escape" && selected !== null) {
      setSelected(null)
    } else if ((e.key === "Enter" || e.key === " ") && selected === null) {
      e.preventDefault()
      setSelected(1)
    } else return
    e.preventDefault()
  }

  const pick = (i: number) => (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    if (suppressClick.current) return
    setSelected((s) => (s === null ? i : s))
  }

  const current = selected === null ? null : SERIES[selected]
  const allReady = ready >= count

  return (
    <div
      ref={wrapRef}
      className="group/shinkansen relative -mx-6 select-none sm:mx-0"
      role="region"
      aria-roledescription="carousel"
      aria-label="Shinkansen lead cars"
    >
      <div
        tabIndex={0}
        onKeyDown={onKeyDown}
        onPointerDown={onPointerDown}
        onPointerUp={onPointerUp}
        onPointerCancel={() => (gesture.current = null)}
        className="relative aspect-[16/11] w-full touch-pan-y rounded-xl outline-none focus-visible:ring-2 focus-visible:ring-foreground/20 sm:aspect-[16/10]"
        style={{ cursor: selected === null ? "pointer" : "grab" }}
        aria-label={
          current
            ? `${current.name} selected. Swipe or use arrow keys for the next train, Escape to go back.`
            : "Three Shinkansen lead cars side by side. Tap one to inspect it."
        }
      >
        <motion.div
          className="absolute inset-0"
          initial={false}
          animate={{ opacity: allReady ? 1 : 0 }}
          transition={{ duration: reduceMotion ? 0 : 0.8 }}
          style={{
            maskImage:
              "linear-gradient(to right, transparent, #000 8%, #000 92%, transparent), linear-gradient(to bottom, transparent, #000 6%, #000 88%, transparent)",
            maskComposite: "intersect",
            WebkitMaskComposite: "source-in",
          }}
        >
          <Canvas
            shadows
            dpr={[1, 2]}
            frameloop={inView ? "always" : "never"}
            camera={{ fov: 30, near: 0.5, far: 200, position: OVERVIEW.position.toArray() }}
            gl={{ antialias: true, alpha: true }}
            onPointerMissed={() => {
              if (!suppressClick.current) setSelected(null)
            }}
          >
            <hemisphereLight args={["#ffffff", "#b9b2a6", 0.9]} />
            <directionalLight
              position={[-14, 22, 12]}
              intensity={2.2}
              castShadow
              shadow-mapSize={[2048, 2048]}
              shadow-camera-left={-16}
              shadow-camera-right={16}
              shadow-camera-top={20}
              shadow-camera-bottom={-34}
              shadow-camera-near={1}
              shadow-camera-far={70}
              shadow-bias={-0.0004}
              shadow-normalBias={0.03}
            />
            <Environment resolution={256} frames={1}>
              <Lightformer form="rect" intensity={2.5} position={[0, 10, 0]} rotation-x={Math.PI / 2} scale={[40, 12, 1]} />
              <Lightformer form="rect" intensity={1.4} position={[-12, 4, 8]} rotation-y={Math.PI / 3} scale={[16, 3, 1]} />
              <Lightformer form="rect" intensity={1.0} position={[12, 3, -6]} rotation-y={-Math.PI / 2} scale={[20, 2, 1]} />
              <Lightformer form="ring" intensity={0.6} position={[0, 1, 18]} scale={6} />
            </Environment>

            {SERIES.map((series, i) => (
              <group key={series.id} position={[laneX(i), 0, 0]}>
                <Rails x={0} dark={dark} />
                <group
                  ref={(g) => {
                    groups.current[i] = g
                  }}
                >
                  {/* Rotate the car's local frame (body along +x) so it runs back along -z. */}
                  <group rotation={[0, Math.PI / 2, 0]} onClick={pick(i)}>
                    <TrainCar series={series} onReady={() => setReady((r) => r + 1)} />
                  </group>
                </group>
              </group>
            ))}

            <mesh rotation-x={-Math.PI / 2} position={[0, -0.29, -15]} receiveShadow>
              <planeGeometry args={[80, 90]} />
              <shadowMaterial transparent opacity={dark ? 0.45 : 0.18} />
            </mesh>

            <Rig selected={selected} reduceMotion={reduceMotion} groups={groups} />
          </Canvas>
        </motion.div>

        {!allReady && (
          <div className="absolute inset-0 flex items-center justify-center text-xs text-muted-foreground">
            Building trains…
          </div>
        )}

        <AnimatePresence>
          {selected !== null && (
            <motion.button
              key="close"
              type="button"
              onClick={() => setSelected(null)}
              onPointerDown={(e) => e.stopPropagation()}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="absolute top-3 right-3 flex size-8 items-center justify-center rounded-full bg-background/80 text-foreground shadow-sm ring-1 ring-foreground/10 backdrop-blur"
              aria-label="Back to all trains"
            >
              <svg viewBox="0 0 16 16" className="size-3.5" aria-hidden="true">
                <path d="M4 4l8 8M12 4l-8 8" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
              </svg>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      <div className="mt-3 flex min-h-10 items-center justify-between gap-4 px-6 sm:px-0">
        <AnimatePresence mode="wait" initial={false}>
          {current ? (
            <motion.div
              key={current.id}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.2 }}
              className="flex flex-col"
              aria-live="polite"
            >
              <span className="text-sm font-medium text-foreground">
                {current.name} <span className="text-muted-foreground">· {current.nickname}</span>
              </span>
              <span className="text-xs text-muted-foreground">
                {current.introduced} · {current.topSpeed} · {current.line}
              </span>
            </motion.div>
          ) : (
            <motion.span
              key="hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-xs text-muted-foreground"
            >
              Tap a train to inspect it
            </motion.span>
          )}
        </AnimatePresence>

        {selected !== null && (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => step(-1)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Previous train"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M10 3.5L5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <div className="flex gap-1.5" aria-hidden="true">
              {SERIES.map((s, i) => (
                <span
                  key={s.id}
                  className={`size-1.5 rounded-full transition-colors ${i === selected ? "bg-foreground" : "bg-foreground/20"}`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={() => step(1)}
              className="flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-foreground/5 hover:text-foreground"
              aria-label="Next train"
            >
              <svg viewBox="0 0 16 16" className="size-4" aria-hidden="true">
                <path d="M6 3.5L10.5 8 6 12.5" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default ShinkansenShowcase
