import * as THREE from "three"

/**
 * Lead-car body built as a loft: a rounded cross-section swept along the
 * car's length (x, nose tip at 0), whose size and shape change through the
 * nose. Units are meters; y is height above the rail head, z is across.
 */
export type BodyProfile = {
  length: number
  /** Distance from the tip to where the body reaches full section. */
  noseLength: number
  /** Roof height at the sides of the crown (centerline = top - groove). */
  top: (x: number) => number
  /** Underside height. */
  bottom: (x: number) => number
  /** Half the body width. */
  halfWidth: (x: number) => number
  /** Superellipse exponent of the upper half (2 = round, higher = boxier). */
  upperShape: (x: number) => number
  /** Superellipse exponent of the lower half. */
  lowerShape: (x: number) => number
  /** How far the lower sides lean in toward the skirt (0–0.2). */
  tuck: (x: number) => number
  /** Height of the widest point as a 0–1 fraction of the section. */
  waist: (x: number) => number
  /** Depth of a centerline valley (positive) or ridge (negative) on the crown. */
  groove: (x: number) => number
}

/** Monotone cubic interpolation through [x, y] points (Fritsch–Carlson). */
export function spline(points: [number, number][]) {
  const n = points.length
  const xs = points.map((p) => p[0])
  const ys = points.map((p) => p[1])
  const d: number[] = []
  const m: number[] = []
  for (let i = 0; i < n - 1; i++) d.push((ys[i + 1] - ys[i]) / (xs[i + 1] - xs[i]))
  m.push(d[0])
  for (let i = 1; i < n - 1; i++) m.push(d[i - 1] * d[i] <= 0 ? 0 : (d[i - 1] + d[i]) / 2)
  m.push(d[n - 2])
  for (let i = 0; i < n - 1; i++) {
    if (d[i] === 0) {
      m[i] = 0
      m[i + 1] = 0
      continue
    }
    const a = m[i] / d[i]
    const b = m[i + 1] / d[i]
    const s = a * a + b * b
    if (s > 9) {
      const t = 3 / Math.sqrt(s)
      m[i] = t * a * d[i]
      m[i + 1] = t * b * d[i]
    }
  }
  return (x: number) => {
    if (x <= xs[0]) return ys[0]
    if (x >= xs[n - 1]) return ys[n - 1]
    let i = 0
    while (x > xs[i + 1]) i++
    const h = xs[i + 1] - xs[i]
    const t = (x - xs[i]) / h
    const t2 = t * t
    const t3 = t2 * t
    return (
      (2 * t3 - 3 * t2 + 1) * ys[i] +
      (t3 - 2 * t2 + t) * h * m[i] +
      (-2 * t3 + 3 * t2) * ys[i + 1] +
      (t3 - t2) * h * m[i + 1]
    )
  }
}

export const constant = (v: number) => () => v

export function smoothstep(a: number, b: number, x: number) {
  const t = THREE.MathUtils.clamp((x - a) / (b - a), 0, 1)
  return t * t * (3 - 2 * t)
}

export function bump(x: number, center: number, width: number) {
  const d = (x - center) / width
  return Math.exp(-d * d)
}

export type Section = {
  x: number
  top: number
  bottom: number
  half: number
  up: number
  low: number
  tuck: number
  waistY: number
  groove: number
}

const REAR_ROUND = 0.3

export function sectionAt(profile: BodyProfile, x: number): Section {
  let top = profile.top(x)
  let bottom = profile.bottom(x)
  let half = profile.halfWidth(x)
  let groove = profile.groove(x)
  const { length } = profile
  if (x > length - REAR_ROUND) {
    const k = Math.min(1, (x - (length - REAR_ROUND)) / REAR_ROUND)
    const shrink = 1 - 0.05 * (1 - Math.sqrt(1 - k * k))
    const mid = (top + bottom) / 2
    top = mid + (top - mid) * shrink
    bottom = mid + (bottom - mid) * shrink
    half *= shrink
  }
  if (x <= 0) {
    const mid = (top + bottom) / 2
    top = mid
    bottom = mid
    half = 0
    groove = 0
  }
  const waistY = bottom + (top - bottom) * profile.waist(x)
  return {
    x,
    top,
    bottom,
    half,
    up: profile.upperShape(x),
    low: profile.lowerShape(x),
    tuck: profile.tuck(x),
    waistY,
    groove,
  }
}

export type SurfacePoint = {
  y: number
  z: number
  /** Normalized across-position, -1..1 (sides at ±1). */
  sx: number
  /** Normalized height in the section, -1 (underside) .. 1 (crown). */
  sy: number
}

/** Point on a section at angle a (0 = +z side, π/2 = crown, 3π/2 = underside). */
export function pointAt(sec: Section, a: number): SurfacePoint {
  const c = Math.cos(a)
  const s = Math.sin(a)
  const upper = s >= 0
  const n = upper ? sec.up : sec.low
  const sx = Math.sign(c) * Math.pow(Math.abs(c), 2 / n)
  const sy = Math.sign(s) * Math.pow(Math.abs(s), 2 / n)
  let z = sx * sec.half
  let y: number
  if (upper) {
    y = sec.waistY + sy * (sec.top - sec.waistY)
    const w = 1 - sx * sx
    y -= sec.groove * w * w * Math.min(1, sy * 3)
  } else {
    y = sec.waistY + sy * (sec.waistY - sec.bottom)
    z *= 1 - sec.tuck * sy * sy
  }
  return { y, z, sx, sy }
}

const ARC_SAMPLES = 256

/**
 * Maps a 0..1 ring parameter to a section angle so that equal steps cover
 * equal distance around the outline. Plain superellipse angles bunch points
 * into the corners and starve the flat sides, where the stripes run.
 */
export function arcMap(sec: Section): (v: number) => number {
  const len = new Float64Array(ARC_SAMPLES + 1)
  let prev = pointAt(sec, ringAngle(0))
  for (let k = 1; k <= ARC_SAMPLES; k++) {
    const p = pointAt(sec, ringAngle(k / ARC_SAMPLES))
    len[k] = len[k - 1] + Math.hypot(p.y - prev.y, p.z - prev.z)
    prev = p
  }
  const total = len[ARC_SAMPLES]
  if (total < 1e-6) return ringAngle
  return (v) => {
    const target = (v - Math.floor(v)) * total
    let lo = 0
    let hi = ARC_SAMPLES
    while (hi - lo > 1) {
      const mid = (lo + hi) >> 1
      if (len[mid] <= target) lo = mid
      else hi = mid
    }
    const span = len[hi] - len[lo]
    const f = span > 0 ? (target - len[lo]) / span : 0
    return ringAngle((lo + f) / ARC_SAMPLES)
  }
}

/** Texture u packs the nose into more texels than the plain body. */
export const NOSE_SHARE = 0.46

export function xToU(profile: BodyProfile, x: number) {
  const { noseLength: n, length: l } = profile
  return x < n ? (x / n) * NOSE_SHARE : NOSE_SHARE + ((x - n) / (l - n)) * (1 - NOSE_SHARE)
}

export function uToX(profile: BodyProfile, u: number) {
  const { noseLength: n, length: l } = profile
  return u < NOSE_SHARE ? (u / NOSE_SHARE) * n : n + ((u - NOSE_SHARE) / (1 - NOSE_SHARE)) * (l - n)
}

export const RING = 128

/** Ring parameter 0..1 → section angle. The seam sits under the car. */
export function ringAngle(v: number) {
  return Math.PI * 1.5 + v * Math.PI * 2
}

function stations(profile: BodyProfile) {
  const { length, noseLength } = profile
  const xs: number[] = []
  const noseSteps = 170
  for (let i = 0; i <= noseSteps; i++) xs.push(noseLength * Math.pow(i / noseSteps, 1.8))
  const bodySteps = 36
  for (let i = 1; i <= bodySteps; i++) {
    xs.push(noseLength + (length - REAR_ROUND - noseLength) * (i / bodySteps))
  }
  for (let i = 1; i <= 6; i++) xs.push(length - REAR_ROUND + REAR_ROUND * (i / 6))
  return xs
}

export function buildBodyGeometry(profile: BodyProfile) {
  const xs = stations(profile)
  const { length } = profile
  const positions: number[] = []
  const uvs: number[] = []
  const indices: number[] = []

  for (const x of xs) {
    const sec = sectionAt(profile, x)
    const u = xToU(profile, x)
    const toAngle = arcMap(sec)
    for (let j = 0; j <= RING; j++) {
      const p = pointAt(sec, j === RING ? toAngle(0) : toAngle(j / RING))
      positions.push(x, p.y, p.z)
      uvs.push(u, j / RING)
    }
  }

  const stride = RING + 1
  for (let i = 0; i < xs.length - 1; i++) {
    for (let j = 0; j < RING; j++) {
      const a = i * stride + j
      const b = a + stride
      indices.push(a, b, a + 1, b, b + 1, a + 1)
    }
  }

  // Flat cap on the coupling end.
  const lastStart = (xs.length - 1) * stride
  const center = positions.length / 3
  let cy = 0
  for (let j = 0; j < RING; j++) cy += positions[(lastStart + j) * 3 + 1]
  cy /= RING
  positions.push(length, cy, 0)
  uvs.push(0.999, 0.75)
  const ringStart = center + 1
  for (let j = 0; j <= RING; j++) {
    const k = (lastStart + j) * 3
    positions.push(positions[k], positions[k + 1], positions[k + 2])
    uvs.push(0.999, 0.75)
  }
  for (let j = 0; j < RING; j++) indices.push(center, ringStart + j + 1, ringStart + j)

  const geometry = new THREE.BufferGeometry()
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(positions, 3))
  geometry.setAttribute("uv", new THREE.Float32BufferAttribute(uvs, 2))
  geometry.setIndex(indices)
  geometry.computeVertexNormals()
  return geometry
}
