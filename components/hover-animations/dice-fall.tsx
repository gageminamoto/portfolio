"use client"

import { useRef, useState, useMemo, useEffect } from "react"
import { Canvas, useFrame, useThree } from "@react-three/fiber"
import { useReducedMotion } from "framer-motion"
import { Dice3D } from "./dice-3d"

function FallingDie({
  startPos,
  delay,
}: {
  startPos: [number, number, number]
  delay: number
}) {
  const meshRef = useRef<THREE.Group>(null)
  const [started, setStarted] = useState(false)
  const [landed, setLanded] = useState(false)
  const startedRef = useRef(false)
  const elapsedRef = useRef(0)

  const velocityY = useRef(0)
  const velocityZ = useRef(0.05 + Math.random() * 0.05)

  const rotationSpeed = useRef([
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
    (Math.random() - 0.5) * 0.2,
  ])

  const initialRotation = useMemo(
    () =>
      [
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
        Math.random() * Math.PI * 2,
      ] as [number, number, number],
    []
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

    if (meshRef.current && !landed) {
      if (meshRef.current.position.z >= 0) {
        setLanded(true)
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
    return Array.from({ length: count }).map((_, i) => ({
      id: i,
      x: (Math.random() - 0.5) * viewport.width * 0.8,
      y: viewport.height / 2 + 3 + Math.random(),
      z: -5 - Math.random() * 5,
      delay: Math.random() * 500,
    }))
  }, [viewport.width, viewport.height, count])

  return (
    <>
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 5]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} />
      {dice.map((die) => (
        <FallingDie
          key={die.id}
          startPos={[die.x, die.y, die.z]}
          delay={die.delay}
        />
      ))}
    </>
  )
}

export function DiceFallAnimation({ isHovered }: { isHovered: boolean }) {
  const reducedMotion = useReducedMotion()
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (isHovered) {
      setKey((k) => k + 1)
    }
  }, [isHovered])

  if (reducedMotion || !isHovered) return null

  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden rounded-xl">
      <Canvas
        key={key}
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
