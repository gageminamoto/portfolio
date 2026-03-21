"use client"

import { useMemo } from "react"
import { RoundedBox } from "@react-three/drei"

const pipSize = 0.1
const pipOffset = 0.505
const d = 0.25

function Pip({ pos }: { pos: [number, number, number] }) {
  return (
    <mesh position={pos}>
      <circleGeometry args={[pipSize, 16]} />
      <meshStandardMaterial color="black" />
    </mesh>
  )
}

export function Dice3D() {
  const faces = useMemo(() => {
    return [
      // Face 1 (Front, z+)
      <group key="f1" rotation={[0, 0, 0]}>
        <Pip pos={[0, 0, pipOffset]} />
      </group>,
      // Face 6 (Back, z-)
      <group key="f6" rotation={[0, Math.PI, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[-d, 0, pipOffset]} />
        <Pip pos={[d, 0, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      // Face 2 (Top, y+)
      <group key="f2" rotation={[-Math.PI / 2, 0, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      // Face 5 (Bottom, y-)
      <group key="f5" rotation={[Math.PI / 2, 0, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[0, 0, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      // Face 3 (Right, x+)
      <group key="f3" rotation={[0, Math.PI / 2, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[0, 0, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
      // Face 4 (Left, x-)
      <group key="f4" rotation={[0, -Math.PI / 2, 0]}>
        <Pip pos={[-d, d, pipOffset]} />
        <Pip pos={[d, d, pipOffset]} />
        <Pip pos={[-d, -d, pipOffset]} />
        <Pip pos={[d, -d, pipOffset]} />
      </group>,
    ]
  }, [])

  return (
    <group>
      <RoundedBox args={[1, 1, 1]} radius={0.1} smoothness={4}>
        <meshStandardMaterial color="white" roughness={0.5} />
      </RoundedBox>
      {faces}
    </group>
  )
}
