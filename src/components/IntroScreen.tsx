import { useState, useEffect, useRef } from 'react'

interface IntroScreenProps {
  onComplete: () => void
}

// Koordinat Poligon 16 Kepingan Kaca 3D Menutupi 100% Layar
const SHARDS = [
  { id: 1, clip: 'polygon(0% 0%, 25% 0%, 35% 30%, 0% 25%)', tx: -350, ty: -350, tz: 300, rx: -45, ry: -30, rz: -25 },
  { id: 2, clip: 'polygon(25% 0%, 60% 0%, 50% 35%, 35% 30%)', tx: 0, ty: -400, tz: 400, rx: -60, ry: 10, rz: 15 },
  { id: 3, clip: 'polygon(60% 0%, 100% 0%, 100% 25%, 65% 35%)', tx: 380, ty: -350, tz: 350, rx: -45, ry: 40, rz: 20 },
  { id: 4, clip: 'polygon(50% 0%, 65% 35%, 50% 50%, 50% 35%)', tx: 100, ty: -200, tz: 500, rx: -30, ry: 20, rz: -10 },
  
  { id: 5, clip: 'polygon(0% 25%, 35% 30%, 30% 55%, 0% 50%)', tx: -420, ty: -50, tz: 350, rx: 10, ry: -50, rz: -30 },
  { id: 6, clip: 'polygon(35% 30%, 50% 35%, 50% 50%, 30% 55%)', tx: -120, ty: -80, tz: 650, rx: -20, ry: -25, rz: 35 },
  { id: 7, clip: 'polygon(50% 50%, 65% 35%, 75% 55%, 55% 65%)', tx: 150, ty: 50, tz: 600, rx: 30, ry: 35, rz: -25 },
  { id: 8, clip: 'polygon(65% 35%, 100% 25%, 100% 60%, 75% 55%)', tx: 420, ty: 0, tz: 380, rx: 15, ry: 55, rz: 30 },
  
  { id: 9, clip: 'polygon(0% 50%, 30% 55%, 25% 80%, 0% 75%)', tx: -400, ty: 200, tz: 320, rx: 35, ry: -40, rz: 20 },
  { id: 10, clip: 'polygon(30% 55%, 50% 50%, 45% 75%, 25% 80%)', tx: -100, ty: 180, tz: 550, rx: 40, ry: -15, rz: -35 },
  { id: 11, clip: 'polygon(50% 50%, 55% 65%, 45% 75%, 50% 70%)', tx: 50, ty: 120, tz: 700, rx: 25, ry: 10, rz: 45 },
  { id: 12, clip: 'polygon(55% 65%, 75% 55%, 70% 85%, 50% 70%)', tx: 180, ty: 220, tz: 480, rx: 45, ry: 30, rz: -15 },
  { id: 13, clip: 'polygon(75% 55%, 100% 60%, 100% 85%, 70% 85%)', tx: 390, ty: 250, tz: 340, rx: 30, ry: 45, rz: -20 },
  
  { id: 14, clip: 'polygon(0% 75%, 25% 80%, 35% 100%, 0% 100%)', tx: -320, ty: 400, tz: 280, rx: 50, ry: -30, rz: -15 },
  { id: 15, clip: 'polygon(25% 80%, 70% 85%, 65% 100%, 35% 100%)', tx: 0, ty: 420, tz: 420, rx: 60, ry: 0, rz: 25 },
  { id: 16, clip: 'polygon(70% 85%, 100% 85%, 100% 100%, 65% 100%)', tx: 350, ty: 390, tz: 300, rx: 45, ry: 35, rz: 15 },
]

export default function IntroScreen({ onComplete }: IntroScreenProps) {
  const [progress, setProgress] = useState(0)
  const [isShattered, setIsShattered] = useState(false)
  const soundPlayedRef = useRef(false)
  const audioCtxRef = useRef<AudioContext | null>(null)
  const audioBufferRef = useRef<AudioBuffer | null>(null)
  const audioElemRef = useRef<HTMLAudioElement | null>(null)

  const playSound = () => {
    if (soundPlayedRef.current) return
    soundPlayedRef.current = true

    if (audioCtxRef.current) {
      if (audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {})
      }
      if (audioBufferRef.current) {
        try {
          const src = audioCtxRef.current.createBufferSource()
          src.buffer = audioBufferRef.current
          src.connect(audioCtxRef.current.destination)
          src.start(0)
          return
        } catch (_) {}
      }
    }

    if (audioElemRef.current) {
      audioElemRef.current.currentTime = 0
      audioElemRef.current.volume = 1.0
      audioElemRef.current.play().catch(() => {})
    }
  }

  useEffect(() => {
    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'
    window.scrollTo(0, 0)

    // Siapkan audio
    const audioElem = new Audio('/audio/codebycraft.WAV')
    audioElem.preload = 'auto'
    audioElem.volume = 1.0
    audioElemRef.current = audioElem

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    if (AudioCtx) {
      try {
        const ctx = new AudioCtx()
        audioCtxRef.current = ctx

        fetch('/audio/codebycraft.WAV')
          .then((res) => res.arrayBuffer())
          .then((buf) => ctx.decodeAudioData(buf))
          .then((decoded) => {
            audioBufferRef.current = decoded
          })
          .catch(() => {})
      } catch (_) {}
    }

    const autoUnlock = () => {
      if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
        audioCtxRef.current.resume().catch(() => {})
      }
    }

    window.addEventListener('mousemove', autoUnlock, { passive: true })
    window.addEventListener('pointerdown', autoUnlock, { passive: true })
    window.addEventListener('keydown', autoUnlock, { passive: true })
    window.addEventListener('touchstart', autoUnlock, { passive: true })

    // Otomatis jalankan loading tanpa perlu klik
    const startTime = performance.now()
    const totalDuration = 2600 // 2.6 detik durasi loading

    const updateLoader = (now: number) => {
      const elapsed = now - startTime
      const currentProgress = Math.min(100, Math.floor((elapsed / totalDuration) * 100))
      setProgress(currentProgress)

      // Mainkan suara tepat saat progress mencapai 50%
      if (currentProgress >= 50 && !soundPlayedRef.current) {
        playSound()
      }

      if (currentProgress < 100) {
        requestAnimationFrame(updateLoader)
      } else {
        // TAHAP KACA PECAH 3D (3D GLASS SHATTER & EXPLOSION)
        setIsShattered(true)
        document.body.style.overflow = ''
        document.documentElement.style.overflow = ''

        // Selesai setelah serpihan meledak keluar
        setTimeout(() => {
          onComplete()
        }, 950)
      }
    }

    requestAnimationFrame(updateLoader)

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('mousemove', autoUnlock)
      window.removeEventListener('pointerdown', autoUnlock)
      window.removeEventListener('keydown', autoUnlock)
      window.removeEventListener('touchstart', autoUnlock)
      if (audioElemRef.current) {
        audioElemRef.current.pause()
        audioElemRef.current = null
      }
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {})
      }
    }
  }, [onComplete])

  // Parameter SVG lingkaran
  const size = 220
  const strokeWidth = 4.5
  const center = size / 2
  const radius = (size - strokeWidth * 2) / 2
  const circumference = 2 * Math.PI * radius
  const strokeDashoffset = circumference - (progress / 100) * circumference

  return (
    <div
      className={`fixed inset-0 z-[99999] flex items-center justify-center pointer-events-none select-none overflow-hidden perspective-[1200px] ${
        isShattered ? 'pointer-events-none' : 'bg-black'
      }`}
    >
      {/* 1. KEPINGAN-KEPINGAN KACA 3D (3D SHATTERED GLASS PIECES) */}
      <div className="absolute inset-0 pointer-events-none" style={{ transformStyle: 'preserve-3d' }}>
        {SHARDS.map((shard) => {
          const transform = isShattered
            ? `translate3d(${shard.tx * 1.5}px, ${shard.ty * 1.5}px, ${shard.tz * 1.8}px) rotateX(${shard.rx * 2}deg) rotateY(${shard.ry * 2}deg) rotateZ(${shard.rz * 2}deg) scale(0.6)`
            : 'translate3d(0px, 0px, 0px) rotateX(0deg) rotateY(0deg) rotateZ(0deg) scale(1)'

          return (
            <div
              key={shard.id}
              className={`absolute inset-0 bg-[#06070c] transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                isShattered
                  ? 'opacity-0 border border-cyan-400/60 shadow-[0_0_25px_rgba(56,189,248,0.5)] filter blur-[1px]'
                  : 'opacity-100 border-none'
              }`}
              style={{
                clipPath: shard.clip,
                WebkitClipPath: shard.clip,
                transform,
                transformStyle: 'preserve-3d',
                backfaceVisibility: 'hidden',
              }}
            >
              {/* Kilau pantulan cahaya di permukaan kaca saat pecah */}
              {isShattered && (
                <div className="absolute inset-0 bg-gradient-to-tr from-cyan-400/20 via-white/30 to-transparent" />
              )}
            </div>
          )
        })}
      </div>

      {/* 2. FLASH LEDAKAN CAHAYA PUTIH-CYAN SAAT PECAH */}
      {isShattered && (
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-40">
          <div className="w-[300px] h-[300px] rounded-full bg-cyan-300/50 blur-3xl animate-[ping_0.8s_cubic-bezier(0,0,0.2,1)_forwards]" />
          <div className="w-[200px] h-[200px] rounded-full bg-white blur-2xl animate-[ping_0.6s_cubic-bezier(0,0,0.2,1)_forwards]" />
        </div>
      )}

      {/* 3. LINGKARAN LOADING MINIMALIS DI TENGAH */}
      <div
        className={`relative z-50 flex flex-col items-center justify-center transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) ${
          isShattered ? 'scale-150 opacity-0 filter blur-sm' : 'scale-100 opacity-100'
        }`}
      >
        <div className="relative flex items-center justify-center">
          <svg width={size} height={size} className="rotate-[-90deg]">
            {/* Track lingkaran redup */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="rgba(255, 255, 255, 0.12)"
              strokeWidth={strokeWidth}
              fill="transparent"
            />
            {/* Progress lingkaran putih menyala tebal */}
            <circle
              cx={center}
              cy={center}
              r={radius}
              stroke="#ffffff"
              strokeWidth={strokeWidth}
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-75 ease-out shadow-[0_0_30px_rgba(255,255,255,0.9)]"
            />
          </svg>

          {/* Angka persentase besar dan jelas di tengah */}
          <div className="absolute inset-0 flex items-center justify-center font-mono text-2xl sm:text-3xl tracking-widest text-white font-bold drop-shadow-md">
            {progress}%
          </div>
        </div>
      </div>
    </div>
  )
}
