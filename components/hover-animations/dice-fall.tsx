"use client"

import { useRef, useMemo, useState } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import type { Group } from "three"
import { Dice3D } from "./dice-3d"

function pseudoRandom(seed: number) {
  const value = Math.sin(seed * 9999.91) * 10000
  return value - Math.floor(value)
}

function FallingDie({
  startPos,
  delay,
  seed,
}: {
  startPos: [number, number, number]
  delay: number
  seed: number
}) {
  const meshRef = useRef<Group>(null)
  const [started, setStarted] = useState(false)
  const startedRef = useRef(false)
  const landedRef = useRef(false)
  const elapsedRef = useRef(0)

  const velocityY = useRef(0)
  const velocityZ = useRef(0.05 + pseudoRandom(seed + 1) * 0.05)
  const rotationSpeed = useRef<[number, number, number]>([
    (pseudoRandom(seed + 2) - 0.5) * 0.2,
    (pseudoRandom(seed + 3) - 0.5) * 0.2,
    (pseudoRandom(seed + 4) - 0.5) * 0.2,
  ])

  const initialRotation = useMemo(
    () =>
      [
        pseudoRandom(seed + 5) * Math.PI * 2,
        pseudoRandom(seed + 6) * Math.PI * 2,
        pseudoRandom(seed + 7) * Math.PI * 2,
      ] as [number, number, number],
    [seed]
  )

  useFrame((_, delta) => {
    if (!startedRef.current) {
      elapsedRef.current += delta * 1000
      if (elapsedRef.current >= delay) {
        startedRef.current = true
        setStarted(true)
      }
      return
    }

    if (meshRef.current && !landedRef.current) {
      if (meshRef.current.position.z >= 0) {
        landedRef.current = true
        meshRef.current.position.z = 0
        return
      }

      velocityY.current += 0.01
      meshRef.current.position.y -= velocityY.current
      meshRef.current.position.z += velocityZ.current

      meshRef.current.rotation.x += rotationSpeed.current[0]
      meshRef.current.rotation.y += rotationSpeed.current[1]
      meshRef.current.rotation.z += rotationSpeed.current[2]
    }
  })

  return (
    <group
      ref={meshRef}
      position={startPos}
      rotation={initialRotation}
      visible={started}
    >
      <Dice3D />
    </group>
  )
}

function Scene({ count = 5 }: { count?: number }) {
  const { viewport } = useThree()

  const dice = useMemo(() => {
    return Array.from({ length: count }).map((_, i) => {
      const base = i + count * 100 + viewport.width * 10 + viewport.height * 100
      return {
        id: i,
        seed: base,
        x: (pseudoRandom(base + 1) - 0.5) * viewport.width * 0.8,
        y: viewport.height / 2 + 3 + pseudoRandom(base + 2),
        z: -5 - pseudoRandom(base + 3) * 5,
        delay: pseudoRandom(base + 4) * 500,
      }
    })
  }, [viewport.width, viewport.height, count])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      {dice.map((die) => (
        <FallingDie
          key={die.id}
          seed={die.seed}
          startPos={[die.x, die.y, die.z]}
          delay={die.delay}
        />
      ))}
    </>
  )
}

export function DiceFallAnimation({ isHovered }: { isHovered: boolean }) {
  const reducedMotion = useReducedMotion()

  if (reducedMotion || !isHovered) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      <Canvas
        camera={{ position: [0, 0, 10], fov: 50 }}
        dpr={[1, 2]}
        gl={{ alpha: true, antialias: true }}
        style={{ pointerEvents: "none" }}
      >
        <Scene count={5} />
      </Canvas>
    </div>
  )
}
