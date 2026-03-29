"use client"

import { useCallback } from "react"
import { useGradientWord } from "@/components/gradient-word-context"

export function useClickSound() {
  const { soundEnabled } = useGradientWord()

  const playClick = useCallback(() => {
    if (!soundEnabled) return
    try {
      const ctx = new AudioContext()
      const t = ctx.currentTime

      // Sharp attack click — short noise burst
      const bufferSize = Math.ceil(ctx.sampleRate * 0.012)
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate)
      const data = buffer.getChannelData(0)
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 8)
      }
      const noise = ctx.createBufferSource()
      noise.buffer = buffer

      // Bandpass to shape the click tone
      const filter = ctx.createBiquadFilter()
      filter.type = "bandpass"
      filter.frequency.value = 3000
      filter.Q.value = 1.5

      const noiseGain = ctx.createGain()
      noiseGain.gain.setValueAtTime(0.25, t)
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.012)

      noise.connect(filter)
      filter.connect(noiseGain)
      noiseGain.connect(ctx.destination)
      noise.start(t)

      // Subtle tonal body
      const osc = ctx.createOscillator()
      const oscGain = ctx.createGain()
      osc.type = "sine"
      osc.frequency.setValueAtTime(1800, t)
      osc.frequency.exponentialRampToValueAtTime(600, t + 0.025)
      oscGain.gain.setValueAtTime(0.06, t)
      oscGain.gain.exponentialRampToValueAtTime(0.001, t + 0.025)
      osc.connect(oscGain)
      oscGain.connect(ctx.destination)
      osc.start(t)
      osc.stop(t + 0.03)

      osc.onended = () => ctx.close()
    } catch {}
  }, [soundEnabled])

  return playClick
}
