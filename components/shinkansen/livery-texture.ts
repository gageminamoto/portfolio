import * as THREE from "three"
import { pointAt, ringAngle, sectionAt, uToX } from "./body-geometry"
import type { Paint, Series } from "./series"

export const TEX_W = 2048
export const TEX_H = 512

const PAINT_ROUGHNESS = 0.32
const GLASS_ROUGHNESS = 0.06

export type LiveryPixels = {
  color: Uint8Array
  /** R: unused, G: roughness, B: metalness (three.js channel layout). */
  surface: Uint8Array
  light: Uint8Array
}

/**
 * Paints the livery by evaluating the series' paint function at the real 3D
 * position of every texel, so stripes follow the body's curves and features
 * like the windscreen pillar or headlight pods land where they should.
 */
export async function paintLivery(
  series: Series,
  signal?: { cancelled: boolean },
): Promise<LiveryPixels> {
  const { profile } = series
  const color = new Uint8Array(TEX_W * TEX_H * 4)
  const surface = new Uint8Array(TEX_W * TEX_H * 4)
  const light = new Uint8Array(TEX_W * TEX_H * 4)
  const tmp = { r: 0, g: 0, b: 0, rough: 0, lr: 0, lg: 0, lb: 0 }

  const sample = (u: number, v: number, sec = sectionAt(profile, uToX(profile, u))) => {
    const p = pointAt(sec, ringAngle(v))
    return series.paint({ x: sec.x, y: p.y, z: p.z, sx: p.sx, sy: p.sy, sec })
  }
  const accumulate = (out: Paint, w: number) => {
    tmp.r += out.color[0] * w
    tmp.g += out.color[1] * w
    tmp.b += out.color[2] * w
    tmp.rough += (out.glass ? GLASS_ROUGHNESS : PAINT_ROUGHNESS) * w
    if (out.light) {
      tmp.lr += out.light[0] * w
      tmp.lg += out.light[1] * w
      tmp.lb += out.light[2] * w
    }
  }
  const write = (k: number) => {
    color[k] = tmp.r
    color[k + 1] = tmp.g
    color[k + 2] = tmp.b
    color[k + 3] = 255
    surface[k] = 255
    surface[k + 1] = Math.round(tmp.rough * 255)
    surface[k + 3] = 255
    light[k] = tmp.lr
    light[k + 1] = tmp.lg
    light[k + 2] = tmp.lb
    light[k + 3] = 255
    tmp.r = tmp.g = tmp.b = tmp.rough = tmp.lr = tmp.lg = tmp.lb = 0
  }

  let sliceStart = performance.now()
  const breathe = async () => {
    // Yield to the browser every ~12ms so painting never blocks a frame.
    if (performance.now() - sliceStart > 12) {
      await new Promise((resolve) => setTimeout(resolve, 0))
      if (signal?.cancelled) throw new Error("cancelled")
      sliceStart = performance.now()
    }
  }

  // Pass 1: one sample per texel.
  for (let i = 0; i < TEX_W; i++) {
    await breathe()
    const sec = sectionAt(profile, uToX(profile, (i + 0.5) / TEX_W))
    for (let j = 0; j < TEX_H; j++) {
      accumulate(sample(0, (j + 0.5) / TEX_H, sec), 1)
      write((j * TEX_W + i) * 4)
    }
  }

  // Pass 2: re-sample texels on a color edge at 4×4 to smooth stripes.
  const edge = new Uint8Array(TEX_W * TEX_H)
  const differs = (a: number, b: number) =>
    color[a] !== color[b] || color[a + 1] !== color[b + 1] || color[a + 2] !== color[b + 2]
  for (let j = 0; j < TEX_H; j++) {
    for (let i = 0; i < TEX_W; i++) {
      const k = (j * TEX_W + i) * 4
      const right = i + 1 < TEX_W ? k + 4 : k
      const down = ((j + 1) % TEX_H) * TEX_W * 4 + i * 4
      if (differs(k, right) || differs(k, down)) {
        edge[j * TEX_W + i] = 1
        if (i + 1 < TEX_W) edge[j * TEX_W + i + 1] = 1
        edge[((j + 1) % TEX_H) * TEX_W + i] = 1
      }
    }
  }
  const N = 4
  const w = 1 / (N * N)
  for (let i = 0; i < TEX_W; i++) {
    await breathe()
    let secs: ReturnType<typeof sectionAt>[] | null = null
    for (let j = 0; j < TEX_H; j++) {
      if (!edge[j * TEX_W + i]) continue
      secs ??= Array.from({ length: N }, (_, a) =>
        sectionAt(profile, uToX(profile, (i + (a + 0.5) / N) / TEX_W)),
      )
      for (let a = 0; a < N; a++) {
        for (let b = 0; b < N; b++) {
          accumulate(sample(0, (j + (b + 0.5) / N) / TEX_H, secs[a]), w)
        }
      }
      write((j * TEX_W + i) * 4)
    }
  }
  return { color, surface, light }
}

/** Box-filters an RGBA image to half size; detail maps don't need full res. */
function half(data: Uint8Array) {
  const w = TEX_W / 2
  const h = TEX_H / 2
  const out = new Uint8Array(w * h * 4)
  for (let j = 0; j < h; j++) {
    for (let i = 0; i < w; i++) {
      const a = (2 * j * TEX_W + 2 * i) * 4
      const b = a + TEX_W * 4
      for (let c = 0; c < 4; c++) {
        out[(j * w + i) * 4 + c] = (data[a + c] + data[a + 4 + c] + data[b + c] + data[b + 4 + c]) >> 2
      }
    }
  }
  return out
}

function toTexture(data: Uint8Array, srgb: boolean, scale = 1) {
  const tex = new THREE.DataTexture(data, TEX_W * scale, TEX_H * scale, THREE.RGBAFormat)
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace
  tex.generateMipmaps = true
  tex.minFilter = THREE.LinearMipmapLinearFilter
  tex.magFilter = THREE.LinearFilter
  tex.anisotropy = 8
  tex.wrapS = THREE.ClampToEdgeWrapping
  tex.wrapT = THREE.RepeatWrapping
  tex.needsUpdate = true
  return tex
}

export function liveryTextures(pixels: LiveryPixels) {
  return {
    map: toTexture(pixels.color, true),
    roughnessMap: toTexture(half(pixels.surface), false, 0.5),
    emissiveMap: toTexture(half(pixels.light), true, 0.5),
  }
}
