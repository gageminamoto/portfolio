import {
  bump,
  constant,
  smoothstep,
  spline,
  type BodyProfile,
  type Section,
} from "./body-geometry"

export type RGB = [number, number, number]

export type PaintPoint = {
  x: number
  y: number
  z: number
  /** -1..1 across the car. */
  sx: number
  /** -1 (underside) .. 1 (crown) within the section. */
  sy: number
  sec: Section
}

export type Paint = { color: RGB; glass?: boolean; light?: RGB }

export type Series = {
  id: string
  name: string
  nickname: string
  introduced: string
  topSpeed: string
  line: string
  profile: BodyProfile
  /** Bogie centers, measured from the nose tip. */
  bogies: number[]
  /** Exposed bogie frames (0 Series) vs. full skirts. */
  exposedBogies: boolean
  paint: (p: PaintPoint) => Paint
}

const hex = (h: string): RGB => {
  const n = parseInt(h.slice(1), 16)
  return [(n >> 16) & 255, (n >> 8) & 255, n & 255]
}

const GLASS = hex("#141b24")
const UNDER = hex("#2a2d31")
const DOOR_LINE = 0.018

function inRoundRect(
  x: number,
  y: number,
  x0: number,
  x1: number,
  y0: number,
  y1: number,
  r: number,
) {
  if (x < x0 || x > x1 || y < y0 || y > y1) return false
  const cx = Math.min(Math.max(x, x0 + r), x1 - r)
  const cy = Math.min(Math.max(y, y0 + r), y1 - r)
  return (x - cx) ** 2 + (y - cy) ** 2 <= r * r
}

function windowRow(
  x: number,
  y: number,
  start: number,
  end: number,
  pitch: number,
  width: number,
  y0: number,
  y1: number,
  r: number,
) {
  if (x < start || x > end) return false
  const i = Math.floor((x - start) / pitch)
  const x0 = start + i * pitch
  return inRoundRect(x, y, x0, x0 + width, y0, y1, r)
}

/** Thin outline of a plug door, drawn as a darker seam. */
function doorSeam(x: number, y: number, x0: number, x1: number, y0: number, y1: number) {
  if (!inRoundRect(x, y, x0 - DOOR_LINE, x1 + DOOR_LINE, y0 - DOOR_LINE, y1 + DOOR_LINE, 0.1))
    return false
  return !inRoundRect(x, y, x0, x1, y0, y1, 0.09)
}

const shade = (c: RGB, k: number): RGB => [c[0] * k, c[1] * k, c[2] * k]

/* ───────────────────────────── 0 Series (1964) ───────────────────────────── */

const zeroTop = spline([
  [0, 1.42],
  [0.04, 1.62],
  [0.14, 1.8],
  [0.32, 1.97],
  [0.65, 2.16],
  [1.1, 2.33],
  [1.7, 2.5],
  [2.25, 2.68],
  [2.8, 2.98],
  [3.4, 3.3],
  [4.1, 3.56],
  [4.9, 3.72],
  [5.8, 3.8],
  [6.5, 3.82],
])
const zeroHalf = spline([
  [0, 0],
  [0.04, 0.3],
  [0.14, 0.5],
  [0.35, 0.72],
  [0.8, 0.98],
  [1.5, 1.25],
  [2.4, 1.47],
  [3.4, 1.6],
  [4.5, 1.67],
  [5.5, 1.69],
])
const zeroBottom = spline([
  [0, 1.42],
  [0.08, 1.12],
  [0.22, 0.86],
  [0.45, 0.62],
  [0.8, 0.46],
  [1.6, 0.42],
  [3.6, 0.46],
  [4.3, 0.92],
  [25.15, 0.92],
])

const ZERO_IVORY = hex("#efe9d4")
const ZERO_BLUE = hex("#1d3d8c")

const zeroBandLow = spline([
  [2.05, 2.62],
  [2.6, 2.6],
  [3.6, 2.2],
  [4.8, 1.9],
  [5.6, 1.86],
])
const zeroBandHigh = spline([
  [2.05, 3.2],
  [3.0, 3.22],
  [4.0, 3.0],
  [5.2, 2.66],
  [6.0, 2.62],
])

const zeroSeries: Series = {
  id: "0",
  name: "0 Series",
  nickname: "Hikari",
  introduced: "1964",
  topSpeed: "220 km/h",
  line: "Tōkaidō",
  bogies: [7.15, 24.65 - 2.5],
  exposedBogies: true,
  profile: {
    length: 25.15,
    noseLength: 6.5,
    top: zeroTop,
    bottom: zeroBottom,
    halfWidth: zeroHalf,
    upperShape: (x) => 2.1 + 0.5 * smoothstep(1, 6, x),
    lowerShape: (x) => 2.2 + 1.6 * smoothstep(0.5, 4, x),
    tuck: (x) => 0.1 * smoothstep(1, 5, x),
    waist: (x) => 0.5 - 0.12 * smoothstep(2, 6, x),
    groove: constant(0),
  },
  paint: ({ x, y, z, sx, sy }) => {
    if (sy < -0.82 && x > 1) return { color: UNDER }
    const ax = Math.abs(z)
    // Translucent nose-light cover on the tip of the bonnet.
    if (x < 0.5 && (y - 1.42) ** 2 + z ** 2 < 0.44 ** 2) {
      const r = Math.sqrt((y - 1.42) ** 2 + z ** 2)
      if (r > 0.41) return { color: shade(ZERO_IVORY, 0.72) }
      return { color: hex("#f4f1e6"), light: r < 0.3 ? hex("#3a3628") : undefined }
    }
    // Headlight pods: blue ovals on the cheeks with twin round lamps.
    if (x < 2.2 && sy > -0.6) {
      const pz = (ax - 0.86) / 0.5
      const py = (y - 1.36) / 0.2
      if (pz * pz + py * py < 1) {
        const lamp = (lz: number) => (ax - lz) ** 2 + (y - 1.36) ** 2 < 0.115 ** 2
        if (lamp(0.66) || lamp(1.06)) return { color: hex("#fffbe8"), light: hex("#fff3c4") }
        return { color: ZERO_BLUE }
      }
    }
    // Windscreen: two flat panes in a shallow V around a center pillar.
    if (x > 2.18 && x < 3.3 && sy > 0.2) {
      const zn = ax / Math.max(0.01, zeroHalf(x))
      const yTop = 3.18
      if (zn < 0.66 && ax > 0.045 && y < yTop && y > 2.66) return { color: GLASS, glass: true }
    }
    // Side cab window.
    if (Math.abs(sx) > 0.7 && inRoundRect(x, y, 3.45, 4.45, 2.58, 3.02, 0.08))
      return { color: GLASS, glass: true }
    // Blue window band that sweeps up around the windscreen.
    let band = false
    if (x >= 5.6) band = y > 1.86 && y < 2.62
    else if (x > 2.05) band = y > zeroBandLow(x) && y < zeroBandHigh(x)
    if (band) {
      if (Math.abs(sx) > 0.6) {
        if (windowRow(x, y, 8.35, 23.4, 1.94, 1.5, 1.96, 2.52, 0.1)) return { color: GLASS, glass: true }
      }
      return { color: ZERO_BLUE }
    }
    // Skirt stripe wrapping under the headlight pods.
    if (y > 1.0 && y < 1.13 && sy > -0.75) return { color: ZERO_BLUE }
    if (Math.abs(sx) > 0.7) {
      if (doorSeam(x, y, 6.2, 6.9, 1.2, 2.95) || doorSeam(x, y, 23.75, 24.45, 1.2, 2.95))
        return { color: shade(ZERO_IVORY, 0.62) }
    }
    if (sy > 0.9 && x > 5) return { color: shade(ZERO_IVORY, 0.9) }
    return { color: ZERO_IVORY }
  },
}

/* ──────────────────────────── N700S (2020) ──────────────────────────── */

const nTop = spline([
  [0, 0.98],
  [0.05, 1.08],
  [0.2, 1.2],
  [0.6, 1.33],
  [1.4, 1.48],
  [2.6, 1.66],
  [3.8, 1.86],
  [4.9, 2.1],
  [5.8, 2.42],
  [6.6, 2.8],
  [7.4, 3.08],
  [8.3, 3.28],
  [9.3, 3.44],
  [10.3, 3.55],
  [11.2, 3.6],
])
const nHalf = spline([
  [0, 0],
  [0.04, 0.4],
  [0.15, 0.6],
  [0.5, 0.82],
  [1.3, 1.04],
  [2.6, 1.24],
  [4.2, 1.41],
  [6, 1.54],
  [8, 1.63],
  [10, 1.68],
])
const nBottom = spline([
  [0, 0.98],
  [0.1, 0.72],
  [0.35, 0.5],
  [0.8, 0.4],
  [27.35, 0.4],
])
const N_WHITE = hex("#f6f6f3")
const N_BLUE = hex("#0b4ea2")

const nBandMid = spline([
  [2.4, 1.2],
  [5, 1.42],
  [8, 1.62],
  [10.5, 1.69],
])
const nBandHalf = spline([
  [2.4, 0],
  [3.4, 0.05],
  [6, 0.13],
  [9, 0.175],
  [10.5, 0.18],
])

const n700s: Series = {
  id: "n700s",
  name: "N700S",
  nickname: "Nozomi",
  introduced: "2020",
  topSpeed: "300 km/h",
  line: "Tōkaidō · Sanyō",
  bogies: [27.35 - 3.6 - 17.5, 27.35 - 3.6],
  exposedBogies: false,
  profile: {
    length: 27.35,
    noseLength: 11.2,
    top: nTop,
    bottom: nBottom,
    halfWidth: nHalf,
    upperShape: (x) => 3.4 - 1.0 * smoothstep(2, 9, x),
    lowerShape: (x) => 2.6 + 1.4 * smoothstep(0.5, 6, x),
    tuck: (x) => 0.13 * smoothstep(1, 6, x),
    waist: (x) => 0.36 + 0.06 * smoothstep(3, 10, x),
    // "Dual Supreme Wing": a valley between the two headlight wings.
    groove: (x) => 0.13 * bump(x, 2.4, 1.6) * smoothstep(0.1, 0.9, x),
  },
  paint: ({ x, y, z, sx, sy, sec }) => {
    if (sy < -0.85 && x > 1) return { color: UNDER }
    const ax = Math.abs(z)
    const zn = ax / Math.max(0.01, sec.half)
    // Visor windscreen: teardrop in plan, pointed toward the nose.
    if (x > 6.5 && x < 9.2 && sy > 0.3) {
      const t = (x - 6.5) / 2.7
      const w = 0.64 * Math.pow(Math.sin(Math.min(1, t * 1.25) * Math.PI * 0.5), 0.75) * (1 - 0.25 * smoothstep(0.85, 1, t))
      if (zn < w) return { color: GLASS, glass: true }
    }
    // Side cab window.
    if (Math.abs(sx) > 0.72 && sy > 0 && x > 8.9 && x < 10.0 && y > 2.5 && y < 2.92) {
      if (inRoundRect(x, y, 8.9, 10.0, 2.5, 2.92 - (10 - x) * 0.12, 0.08)) return { color: GLASS, glass: true }
    }
    // Headlights: sharp slanted teardrops on the outside of each wing.
    if (x > 0.7 && x < 3.1 && zn > 0.42 && sy > -0.2) {
      const t = (x - 0.7) / 2.4
      const cy = sec.waistY + (sec.top - sec.waistY) * (0.25 + 0.15 * t)
      const hh = 0.075 * Math.sin(Math.PI * Math.pow(t, 0.6))
      if (Math.abs(y - cy) < hh) return { color: hex("#f7f8fb"), light: hex("#ffffff") }
      if (Math.abs(y - cy) < hh + 0.025) return { color: hex("#3b4048") }
    }
    // Blue belt under the windows, flicking down the nose to the lamps.
    if (x > 2.4) {
      const mid = x > 10.5 ? 1.69 : nBandMid(x)
      const hw = x > 10.5 ? 0.18 : nBandHalf(x)
      if (Math.abs(y - mid) < hw && sy > -0.6) return { color: N_BLUE }
    }
    if (x > 7.5 && y > 1.27 && y < 1.33 && Math.abs(sx) > 0.8) return { color: N_BLUE }
    if (Math.abs(sx) > 0.75) {
      if (windowRow(x, y, 12.95, 26.6, 1.04, 0.62, 1.94, 2.44, 0.07)) return { color: GLASS, glass: true }
      if (doorSeam(x, y, 11.3, 12.3, 0.95, 2.95)) return { color: shade(N_WHITE, 0.6) }
    }
    return { color: N_WHITE }
  },
}

/* ───────────────────────────── E5 Series (2011) ───────────────────────────── */

const eTop = spline([
  [0, 0.88],
  [0.05, 0.97],
  [0.25, 1.05],
  [1.0, 1.15],
  [2.5, 1.35],
  [4.5, 1.65],
  [6.4, 1.98],
  [7.8, 2.3],
  [9.0, 2.62],
  [10.4, 2.93],
  [11.8, 3.18],
  [13.2, 3.42],
  [14.4, 3.58],
  [15.2, 3.65],
])
const eHalf = spline([
  [0, 0],
  [0.04, 0.46],
  [0.15, 0.66],
  [0.5, 0.8],
  [1.6, 0.94],
  [3.5, 1.08],
  [6, 1.26],
  [8.5, 1.42],
  [11, 1.56],
  [13.5, 1.65],
  [15.2, 1.675],
])
const eBottom = spline([
  [0, 0.88],
  [0.12, 0.62],
  [0.45, 0.46],
  [1.0, 0.4],
  [26.5, 0.4],
])
const E_GREEN = hex("#00916a")
const E_WHITE = hex("#f3f4f1")
const E_PINK = hex("#ec7aa3")

/** Green/white parting line, following the nose down toward the tip. */
const eLine = spline([
  [0.15, 0.94],
  [2, 1.04],
  [5, 1.22],
  [8.5, 1.38],
  [12, 1.44],
  [15, 1.5],
])

const e5: Series = {
  id: "e5",
  name: "E5 Series",
  nickname: "Hayabusa",
  introduced: "2011",
  topSpeed: "320 km/h",
  line: "Tōhoku",
  bogies: [26.5 - 3.6 - 17.5, 26.5 - 3.6],
  exposedBogies: false,
  profile: {
    length: 26.5,
    noseLength: 15.2,
    top: eTop,
    bottom: eBottom,
    halfWidth: eHalf,
    upperShape: (x) => 2.15 + 0.3 * smoothstep(8, 15, x),
    lowerShape: (x) => 2.4 + 1.6 * smoothstep(1, 12, x),
    tuck: (x) => 0.12 * smoothstep(3, 13, x),
    waist: (x) => 0.3 + 0.12 * smoothstep(4, 15, x),
    // The cab canopy is a blister that stands proud of the nose line.
    groove: (x) => -0.2 * bump(x, 9.7, 1.5),
  },
  paint: ({ x, y, z, sx, sy, sec }) => {
    if (sy < -0.85 && x > 1) return { color: UNDER }
    const ax = Math.abs(z)
    const zn = ax / Math.max(0.01, sec.half)
    // Wraparound windscreen on the canopy blister.
    if (x > 8.0 && x < 11.1 && sy > 0.2) {
      const t = (x - 8.0) / 3.1
      const w = 0.8 * Math.pow(Math.sin(Math.min(1, t * 1.35) * Math.PI * 0.5), 0.6) * (1 - 0.3 * smoothstep(0.8, 1, t))
      if (zn < w) return { color: GLASS, glass: true }
    }
    if (Math.abs(sx) > 0.72 && sy > 0.1 && inRoundRect(x, y, 10.9, 11.7, 2.62, 2.95, 0.07))
      return { color: GLASS, glass: true }
    const line = x > 15 ? 1.5 : eLine(x)
    // Headlights: slim slanted slits just above the parting line.
    if (x > 2.2 && x < 4.0 && zn > 0.55 && sy > -0.3) {
      const t = (x - 2.2) / 1.8
      const c = line + 0.07
      const hh = 0.04 * Math.sin(Math.PI * Math.pow(t, 0.8))
      if (Math.abs(y - c) < hh) return { color: hex("#f7f8fb"), light: hex("#ffffff") }
    }
    if (y > line) {
      if (Math.abs(sx) > 0.75) {
        if (windowRow(x, y, 17.2, 26.2, 1.04, 0.6, 1.86, 2.31, 0.07)) return { color: GLASS, glass: true }
        if (doorSeam(x, y, 15.6, 16.6, 0.95, 2.95)) return { color: shade(E_GREEN, 0.6) }
      }
      return { color: E_GREEN }
    }
    const pinkW = x > 6 ? 0.075 : 0.035 + 0.04 * (x / 6)
    if (y > line - pinkW) return { color: E_PINK }
    if (Math.abs(sx) > 0.75 && doorSeam(x, y, 15.6, 16.6, 0.95, 2.95)) return { color: shade(E_WHITE, 0.62) }
    return { color: E_WHITE }
  },
}

export const SERIES: Series[] = [zeroSeries, n700s, e5]
