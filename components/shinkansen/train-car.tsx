"use client"

import { forwardRef, useEffect, useMemo, useState } from "react"
import * as THREE from "three"
import { buildBodyGeometry } from "./body-geometry"
import { liveryTextures, paintLivery } from "./livery-texture"
import type { Series } from "./series"

const GAUGE = 1.435
const WHEEL_R = 0.43
const AXLE_SPACING = 2.5

const wheelGeometry = new THREE.CylinderGeometry(WHEEL_R, WHEEL_R, 0.14, 28)
wheelGeometry.rotateX(Math.PI / 2)
const darkMetal = new THREE.MeshStandardMaterial({ color: "#2b2e33", roughness: 0.55, metalness: 0.6 })
const wheelMetal = new THREE.MeshStandardMaterial({ color: "#5b5f66", roughness: 0.35, metalness: 0.85 })
const underMat = new THREE.MeshStandardMaterial({ color: "#34373c", roughness: 0.8 })

function Bogie({ x, exposed }: { x: number; exposed: boolean }) {
  return (
    <group position={[x, 0, 0]}>
      {[-AXLE_SPACING / 2, AXLE_SPACING / 2].map((ax) => (
        <group key={ax} position={[ax, WHEEL_R, 0]}>
          <mesh geometry={wheelGeometry} material={wheelMetal} position={[0, 0, GAUGE / 2]} castShadow />
          <mesh geometry={wheelGeometry} material={wheelMetal} position={[0, 0, -GAUGE / 2]} castShadow />
          <mesh material={darkMetal} rotation={[Math.PI / 2, 0, 0]}>
            <cylinderGeometry args={[0.08, 0.08, GAUGE, 10]} />
          </mesh>
        </group>
      ))}
      {exposed &&
        [1, -1].map((side) => (
          <group key={side} position={[0, 0, side * (GAUGE / 2 + 0.16)]}>
            {/* Side frame with axle boxes and coil springs. */}
            <mesh material={darkMetal} position={[0, 0.62, 0]} castShadow>
              <boxGeometry args={[AXLE_SPACING + 0.9, 0.24, 0.16]} />
            </mesh>
            {[-AXLE_SPACING / 2, AXLE_SPACING / 2].map((ax) => (
              <mesh key={ax} material={darkMetal} position={[ax, WHEEL_R, 0]}>
                <boxGeometry args={[0.42, 0.3, 0.2]} />
              </mesh>
            ))}
            <mesh material={darkMetal} position={[0, 0.8, 0]}>
              <boxGeometry args={[0.7, 0.14, 0.2]} />
            </mesh>
          </group>
        ))}
    </group>
  )
}

type Textures = ReturnType<typeof liveryTextures>

/** One lead car. Local frame: nose tip at the origin, body along +x. */
export const TrainCar = forwardRef<THREE.Group, { series: Series; onReady?: () => void }>(
  function TrainCar({ series, onReady }, ref) {
    const geometry = useMemo(() => buildBodyGeometry(series.profile), [series])
    const [textures, setTextures] = useState<Textures | null>(null)

    useEffect(() => {
      const signal = { cancelled: false }
      let made: Textures | null = null
      paintLivery(series, signal)
        .then((pixels) => {
          if (signal.cancelled) return
          made = liveryTextures(pixels)
          setTextures(made)
          onReady?.()
        })
        .catch(() => {})
      return () => {
        signal.cancelled = true
        if (made) Object.values(made).forEach((t) => t.dispose())
      }
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [series])

    useEffect(() => () => geometry.dispose(), [geometry])

    const { length } = series.profile
    const [front, rear] = series.bogies

    return (
      <group ref={ref}>
        <mesh geometry={geometry} castShadow receiveShadow visible={textures !== null}>
          {textures && (
            <meshPhysicalMaterial
              map={textures.map}
              roughnessMap={textures.roughnessMap}
              emissiveMap={textures.emissiveMap}
              emissive="#ffffff"
              emissiveIntensity={1.4}
              roughness={1}
              metalness={0.05}
              clearcoat={0.7}
              clearcoatRoughness={0.12}
            />
          )}
        </mesh>
        <Bogie x={front} exposed={series.exposedBogies} />
        <Bogie x={rear} exposed={series.exposedBogies} />
        {series.exposedBogies && (
          // Underfloor equipment between the bogies.
          <mesh material={underMat} position={[(front + rear) / 2, 0.72, 0]}>
            <boxGeometry args={[rear - front - 4, 0.42, 2.5]} />
          </mesh>
        )}
        {/* Gangway bellows at the coupling end. */}
        <mesh material={underMat} position={[length + 0.15, 2.0, 0]}>
          <boxGeometry args={[0.3, 2.1, 1.3]} />
        </mesh>
      </group>
    )
  },
)
