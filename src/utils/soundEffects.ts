// Web Audio API Procedural Bubble & Water Drop Sound Generator
// Menghasilkan efek suara bubble pop cairan yang jernih tanpa perlu file MP3 eksternal

class SoundManager {
  private ctx: AudioContext | null = null
  private lastPlayTime = 0

  private getAudioContext(): AudioContext | null {
    if (typeof window === 'undefined') return null
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
      if (AudioCtx) {
        this.ctx = new AudioCtx()
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume()
    }
    return this.ctx
  }

  // Efek suara gelembung air (Bubble Pop / Plop) saat hover - Volume Lebih Besar & Renyah
  public playBubbleHover(pitchVariation = 1.0) {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    // Throttle agar tidak bertumpuk jika mouse lewat cepat (minimal jeda 40ms)
    if (Date.now() - this.lastPlayTime < 40) return
    this.lastPlayTime = Date.now()

    // Random pitch agar terdengar organik seperti berbagai ukuran gelembung air
    const randomFactor = 0.9 + Math.random() * 0.25
    const baseFreq = (520 + Math.random() * 140) * pitchVariation * randomFactor
    const endFreq = baseFreq * (1.75 + Math.random() * 0.35)

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    // Filter bandpass dengan resonance punchy agar suara gelembung bulat dan tebal
    filter.type = 'bandpass'
    filter.frequency.setValueAtTime(baseFreq * 1.3, now)
    filter.Q.setValueAtTime(2.2, now)

    // Bentuk gelombang sinus untuk pop cairan
    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, now)
    // Pitch melesat naik cepat khas letupan air / bubble pop
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.06)

    // Volume lebih besar, punchy, dan jelas terdengar
    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.48, now + 0.01)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.11)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.12)
  }

  // Efek suara bubble pop saat tombol diklik - Volume Lebih Besar
  public playBubbleClick() {
    const ctx = this.getAudioContext()
    if (!ctx) return

    const now = ctx.currentTime
    const baseFreq = 620 + Math.random() * 120
    const endFreq = baseFreq * 2.2

    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    const filter = ctx.createBiquadFilter()

    filter.type = 'lowpass'
    filter.frequency.setValueAtTime(3200, now)

    osc.type = 'sine'
    osc.frequency.setValueAtTime(baseFreq, now)
    osc.frequency.exponentialRampToValueAtTime(endFreq, now + 0.045)

    gain.gain.setValueAtTime(0.001, now)
    gain.gain.linearRampToValueAtTime(0.65, now + 0.008)
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.12)

    osc.connect(filter)
    filter.connect(gain)
    gain.connect(ctx.destination)

    osc.start(now)
    osc.stop(now + 0.13)
  }
}

export const soundManager = new SoundManager()
