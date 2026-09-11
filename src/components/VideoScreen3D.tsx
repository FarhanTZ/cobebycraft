import { useRef, useState, useEffect } from 'react'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

interface VideoScreen3DProps {
  videoUrl: string
  color: string
  secondaryColor: string
  title: string
  client: string
  year: string
  metric?: string
}

export default function VideoScreen3D({
  videoUrl,
  color,
  secondaryColor,
  client,
  year,
}: VideoScreen3DProps) {
  const videoRef = useRef<HTMLVideoElement>(null!)
  const containerRef = useRef<HTMLDivElement>(null!)
  
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const [progress, setProgress] = useState(0)
  const [currentTimeStr, setCurrentTimeStr] = useState('00:00')
  const [durationStr, setDurationStr] = useState('00:15')
  
  // Interactive glass glare coordinates
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 })

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.currentTime = 0
      videoRef.current.play().then(() => {
        setIsPlaying(true)
      }).catch(() => {
        // Handle autoplay policy
      })
    }
  }, [videoUrl])

  const handleTimeUpdate = () => {
    if (!videoRef.current) return
    const cur = videoRef.current.currentTime
    const dur = videoRef.current.duration || 15
    setProgress((cur / dur) * 100)

    const curM = Math.floor(cur / 60)
    const curS = Math.floor(cur % 60)
    const durM = Math.floor(dur / 60)
    const durS = Math.floor(dur % 60)

    setCurrentTimeStr(`${String(curM).padStart(2, '0')}:${String(curS).padStart(2, '0')}`)
    setDurationStr(`${String(durM).padStart(2, '0')}:${String(durS).padStart(2, '0')}`)
  }

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const x = ((e.clientX - rect.left) / rect.width) * 100
    const y = ((e.clientY - rect.top) / rect.height) * 100

    setGlarePos({ x, y, opacity: 0.6 })
  }

  const handleMouseLeave = () => {
    setGlarePos((prev) => ({ ...prev, opacity: 0 }))
  }

  // Interactive scrubbing on progress bar
  const handleScrub = (e: React.MouseEvent<HTMLDivElement>) => {
    e.stopPropagation()
    if (!videoRef.current || !containerRef.current) return
    const rect = e.currentTarget.getBoundingClientRect()
    const pos = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const targetTime = pos * (videoRef.current.duration || 15)
    videoRef.current.currentTime = targetTime
    setProgress(pos * 100)
  }

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => togglePlay()}
      className="relative w-full h-full rounded-3xl overflow-hidden backdrop-blur-3xl bg-gradient-to-br from-[#0e1220]/80 via-[#090b14]/90 to-[#05060b]/98 border border-white/[0.15] shadow-2xl shadow-black group select-none cursor-pointer pointer-events-auto"
    >
      {/* 1. Header Bar Minimalis Layar */}
      <div className="absolute top-0 left-0 right-0 z-30 flex items-center justify-between px-6 py-3.5 border-b border-white/[0.08] bg-[#070913]/80 backdrop-blur-md pointer-events-none">
        <div className="flex items-center space-x-2">
          <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
        </div>

        {/* Timecode Studio HUD */}
        <div className="flex items-center space-x-2 font-mono text-[11px] text-slate-300 bg-slate-900/90 px-3.5 py-1 rounded-full border border-white/[0.08] shadow-inner">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span className="text-white font-bold">{currentTimeStr}</span>
          <span className="text-slate-600">/</span>
          <span className="text-slate-400">{durationStr}</span>
          <span className="text-slate-600">•</span>
          <span className="text-cyan-400 font-bold">4K 60FPS</span>
        </div>

        {/* Placeholder kanan */}
        <div className="w-8" />
      </div>

      {/* 2. Main HTML5 Video Player */}
      <div className="w-full h-full pt-12 pb-14 bg-black relative overflow-hidden flex items-center justify-center pointer-events-auto">
        <video
          ref={videoRef}
          src={videoUrl}
          playsInline
          autoPlay
          muted={isMuted}
          loop
          onTimeUpdate={handleTimeUpdate}
          className="w-full h-full object-cover scale-[1.02] filter contrast-[1.05] brightness-[0.98]"
        />

        {/* Play/Pause Overlay indicator on hover if paused */}
        {!isPlaying && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-xs z-10">
            <div className="w-16 h-16 rounded-full bg-white/20 border border-white/30 flex items-center justify-center backdrop-blur-md shadow-2xl">
              <Play className="w-7 h-7 text-white fill-current ml-1" />
            </div>
          </div>
        )}

        {/* Video Overlay Tint subtle */}
        <div
          className="absolute inset-0 pointer-events-none transition-colors duration-1000 opacity-20"
          style={{
            background: `linear-gradient(to top, ${color}30, transparent 60%)`,
          }}
        />
      </div>

      {/* 3. Interactive Glass Glare & Light Reflection Effect */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-300 z-20"
        style={{
          opacity: glarePos.opacity,
          background: `radial-gradient(circle 350px at ${glarePos.x}% ${glarePos.y}%, rgba(255,255,255,0.18) 0%, rgba(255,255,255,0.04) 40%, transparent 80%)`,
        }}
      />

      {/* 4. Seamless Edge Gradient Fading Masks (Menyatu dengan Background) */}
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-t from-[#07080d] via-transparent to-transparent opacity-60 z-20" />
      <div className="absolute inset-0 pointer-events-none bg-gradient-to-r from-[#07080d]/80 via-transparent to-transparent opacity-70 z-20" />
      <div className="absolute inset-0 pointer-events-none rounded-3xl ring-1 ring-inset ring-white/[0.14] z-20" />

      {/* 5. Bottom Interactive Controller & Timeline Bar */}
      <div
        onClick={(e) => e.stopPropagation()}
        className="absolute bottom-0 left-0 right-0 z-30 px-6 py-3.5 bg-[#070913]/90 backdrop-blur-md border-t border-white/[0.08] flex flex-col justify-end gap-2.5 pointer-events-auto cursor-default"
      >
        {/* Scrubbing Timeline Progress Bar */}
        <div
          onClick={handleScrub}
          className="w-full h-2 bg-white/15 hover:h-3 rounded-full overflow-hidden cursor-pointer transition-all relative group/bar"
          title="Click or drag to scrub timeline"
        >
          <div
            className="h-full rounded-full transition-all duration-100 relative"
            style={{
              width: `${progress}%`,
              background: `linear-gradient(to right, ${color}, ${secondaryColor})`,
            }}
          >
            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-white shadow-md" />
          </div>
        </div>

        {/* Video Controls & Meta */}
        <div className="flex items-center justify-between pt-0.5">
          <div className="flex items-center space-x-3">
            {/* Play / Pause Interactive Button */}
            <button
              type="button"
              onClick={togglePlay}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer shadow-sm"
              title={isPlaying ? 'Pause Video' : 'Play Video'}
            >
              {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
            </button>

            {/* Audio Mute / Unmute Interactive Button */}
            <button
              type="button"
              onClick={toggleMute}
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer shadow-sm"
              title={isMuted ? 'Unmute Audio' : 'Mute Audio'}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
            </button>

            <span className="text-xs text-slate-300 font-mono tracking-wide select-none">
              {client} • {year}
            </span>
          </div>

          <div className="text-[11px] font-mono text-slate-500 uppercase">
            {isPlaying ? 'PLAYING' : 'PAUSED'}
          </div>
        </div>
      </div>
    </div>
  )
}
