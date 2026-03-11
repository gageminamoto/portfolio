let ctx: AudioContext | null = null

function getContext() {
  if (!ctx) ctx = new AudioContext()
  return ctx
}

function playTone(ac: AudioContext, freq: number, startTime: number, duration: number, volume: number) {
  const osc = ac.createOscillator()
  osc.type = "square"
  osc.frequency.setValueAtTime(freq, startTime)

  const gain = ac.createGain()
  gain.gain.setValueAtTime(0, startTime)
  gain.gain.linearRampToValueAtTime(volume, startTime + 0.01)
  gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration)

  osc.connect(gain).connect(ac.destination)
  osc.start(startTime)
  osc.stop(startTime + duration)
}

/** Retro 3-note chiptune success sound. */
export function playChime() {
  const ac = getContext()
  const now = ac.currentTime

  // Square wave 3-note ascending arpeggio — classic chiptune feel
  playTone(ac, 330, now,        0.08, 0.08)
  playTone(ac, 494, now + 0.07, 0.08, 0.08)
  playTone(ac, 659, now + 0.14, 0.14, 0.09)
}
