import { useState, useRef, useEffect } from 'react'
import { Bell, Music, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null)
  const gainNodeRef = useRef<GainNode | null>(null)

  useEffect(() => {
    const AudioCtx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext

    if (AudioCtx) {
      try {
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        const gain = ctx.createGain()
        gain.gain.setValueAtTime(0.35, ctx.currentTime)
        gain.connect(ctx.destination)
        gainNodeRef.current = gain

        // In-memory prefetch untuk mencegah browser / IDM mengira ini file download
        fetch('/audio/ambient_bgm.data')
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current = decoded
          })
          .catch(() => {})
      } catch (_) {}
    }

    return () => {
      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
        } catch (_) {}
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [])

  const toggleMusic = async () => {
    const ctx = audioCtxRef.current
    if (!ctx) return

    if (ctx.state === 'suspended') {
      try {
        await ctx.resume()
      } catch (_) {}
    }

    if (isPlayingMusic) {
      // Fade out halus saat di-pause
      if (gainNodeRef.current) {
        gainNodeRef.current.gain.linearRampToValueAtTime(0.001, ctx.currentTime + 0.3)
      }
      setTimeout(() => {
        if (sourceNodeRef.current) {
          try {
            sourceNodeRef.current.stop()
            sourceNodeRef.current.disconnect()
            sourceNodeRef.current = null
          } catch (_) {}
        }
        setIsPlayingMusic(false)
      }, 300)
    } else {
      // Putar musik secara in-memory
      if (!audioBufferRef.current) {
        try {
          const res = await fetch('/audio/ambient_bgm.data')
          const buf = await res.arrayBuffer()
          audioBufferRef.current = await ctx.decodeAudioData(buf)
        } catch (_) {
          return
        }
      }

      if (sourceNodeRef.current) {
        try {
          sourceNodeRef.current.stop()
        } catch (_) {}
      }

      const source = ctx.createBufferSource()
      source.buffer = audioBufferRef.current
      source.loop = true

      if (gainNodeRef.current) {
        gainNodeRef.current.gain.setValueAtTime(0.001, ctx.currentTime)
        gainNodeRef.current.gain.linearRampToValueAtTime(0.35, ctx.currentTime + 0.4)
        source.connect(gainNodeRef.current)
      } else {
        source.connect(ctx.destination)
      }

      source.start(0)
      sourceNodeRef.current = source
      setIsPlayingMusic(true)
    }
  }

  return (
    <header className="fixed top-2 sm:top-4 md:top-5 left-0 right-0 w-full z-50 bg-transparent transition-all">
      <div className="w-full flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 sm:py-5">
        {/* Title Brand - Samping Paling Kiri (Dikecilkan Dikit) */}
        <div className="flex items-center">
          <span className="font-syne font-bold text-xl sm:text-2xl tracking-tight text-white select-none hover:text-cyan-400 transition-colors cursor-pointer drop-shadow-sm">
            CodebyCraft
          </span>
        </div>

        {/* Right Menu Items - Samping Paling Kanan */}
        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-7 text-xs sm:text-sm font-semibold">
          {/* Lonceng Icon (Notification - Tanpa Titik Biru) */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer group"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
          </button>

          {/* About Link */}
          <button
            type="button"
            className="text-slate-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all text-xs sm:text-[13px] font-semibold tracking-normal cursor-pointer"
          >
            About
          </button>

          {/* Music Interactive BGM Toggle */}
          <button
            type="button"
            onClick={toggleMusic}
            className={`p-2 rounded-full transition-all cursor-pointer relative group flex items-center justify-center ${
              isPlayingMusic
                ? 'bg-cyan-500/20 text-cyan-300 ring-1 ring-cyan-400/50 shadow-[0_0_16px_rgba(56,189,248,0.4)]'
                : 'hover:bg-white/10 text-slate-200 hover:text-white'
            }`}
            title={isPlayingMusic ? 'Pause Background Music' : 'Play Background Music (Royalty-Free Lofi)'}
          >
            {isPlayingMusic ? (
              <div className="flex items-end space-x-0.5 h-4 w-4.5 justify-center py-0.5">
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_1.1s_ease-in-out_infinite] h-3/4" />
                <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-full" />
                <span className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_0.9s_ease-in-out_infinite] h-1/2" />
              </div>
            ) : (
              <Music className="w-4.5 h-4.5 stroke-[2] group-hover:scale-110 transition-transform text-cyan-400" />
            )}
          </button>

          {/* Have a project? Button (Diberi Jarak Ekstra & Transparan dengan Garis Tepi Putih) */}
          <button
            type="button"
            className="ml-2 sm:ml-3 inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-transparent text-white border border-white/60 hover:border-white hover:bg-white/10 font-syne font-bold text-xs sm:text-[13px] tracking-tight transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer group"
          >
            <span>Have a project?</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  )
}
