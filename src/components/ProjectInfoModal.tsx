import { useEffect, useState, useRef, useLayoutEffect } from 'react'
import gsap from 'gsap'
import {
  ExternalLink,
  Play,
  Pause,
  Volume2,
  VolumeX,
  X,
  Layers,
  Box,
  Cpu,
  Gamepad2,
  Palette,
  Boxes,
  Zap,
  Code2,
  Radio,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

export interface ProjectDetail {
  id: string
  number: string
  title: string
  subtitle: string
  client: string
  metric: string
  year: string
  color: string
  secondaryColor: string
  videoUrl: string
  exploreUrl?: string
  description: string
  role?: string
  tags: string[]
  highlights?: string[]
}

interface ProjectInfoModalProps {
  project: ProjectDetail | null
  onClose: () => void
}

function TechCircleBadge({ tag, brandColor }: { tag: string; brandColor: string }) {
  const normalized = tag.toLowerCase()

  const renderIcon = () => {
    if (normalized.includes('react three') || normalized.includes('r3f')) {
      return <Box className="w-5 h-5 sm:w-6 sm:h-6 text-[#38bdf8] group-hover:rotate-12 transition-transform" />
    }
    if (normalized.includes('react')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#00d8ff] group-hover:rotate-180 transition-transform duration-700" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
          <circle cx="0" cy="0" r="2.05" fill="currentColor" />
          <g stroke="currentColor" strokeWidth="1" fill="none">
            <ellipse rx="11" ry="4.2" />
            <ellipse rx="11" ry="4.2" transform="rotate(60)" />
            <ellipse rx="11" ry="4.2" transform="rotate(120)" />
          </g>
        </svg>
      )
    }
    if (normalized.includes('typescript') || normalized.includes('ts')) {
      return <span className="font-mono font-black text-xs sm:text-sm text-[#3178c6] tracking-tight">TS</span>
    }
    if (normalized.includes('three')) {
      return <Boxes className="w-5 h-5 sm:w-6 sm:h-6 text-white group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('tailwind')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#38bdf8] group-hover:scale-110 transition-transform" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C9.337,13.382,7.976,12,6.001,12z" />
        </svg>
      )
    }
    if (normalized.includes('gsap') || normalized.includes('motion')) {
      return <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#88ce02] group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('vite')) {
      return <Zap className="w-5 h-5 sm:w-6 sm:h-6 text-[#bd34fe] group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('webgl')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ef4444] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      )
    }
    if (normalized.includes('shader') || normalized.includes('pbr')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#f59e0b] group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="6 3 18 3 22 9 12 22 2 9" />
          <line x1="2" y1="9" x2="22" y2="9" />
          <line x1="12" y1="22" x2="6" y2="9" />
          <line x1="12" y1="22" x2="18" y2="9" />
        </svg>
      )
    }
    if (normalized.includes('audio') || normalized.includes('synth') || normalized.includes('sound')) {
      return <Radio className="w-5 h-5 sm:w-6 sm:h-6 text-[#ef4444] group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('retro') || normalized.includes('pixel') || normalized.includes('game')) {
      return <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-[#f59e0b] group-hover:-rotate-12 transition-transform" />
    }
    if (normalized.includes('canvas')) {
      return <Palette className="w-5 h-5 sm:w-6 sm:h-6 text-[#ec4899] group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('bento') || normalized.includes('grid')) {
      return <Layers className="w-5 h-5 sm:w-6 sm:h-6 text-[#a855f7] group-hover:scale-110 transition-transform" />
    }
    if (normalized.includes('vercel')) {
      return (
        <svg className="w-4 h-4 sm:w-5 sm:h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 1L24 22H0L12 1Z" />
        </svg>
      )
    }
    return <Cpu className="w-5 h-5 sm:w-6 sm:h-6 text-slate-300" />
  }

  return (
    <div className="relative group flex flex-col items-center">
      {/* Floating Tooltip Label di Atas Lingkaran */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-[#0e1222]/95 border border-white/20 text-white text-[11px] sm:text-xs font-mono font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none z-30 shadow-2xl backdrop-blur-md flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandColor }} />
        <span>{tag}</span>
        {/* Tooltip Down Arrow */}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0e1222] border-r border-b border-white/20 rotate-45" />
      </div>

      {/* Lingkaran Bulat Bundar Icon Badge */}
      <div
        className="w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-white/[0.06] hover:bg-white/15 border border-white/15 hover:border-white/40 transition-all duration-300 shadow-xl group-hover:scale-110 group-active:scale-95 cursor-pointer backdrop-blur-md"
        style={{
          boxShadow: `0 8px 25px -6px rgba(0,0,0,0.5)`,
        }}
      >
        {renderIcon()}
      </div>

      {/* Label Nama Kecil di Bawah Icon */}
      <span className="mt-2 text-[10px] sm:text-[11px] font-mono text-slate-400 group-hover:text-white transition-colors text-center max-w-[70px] truncate select-none">
        {tag}
      </span>
    </div>
  )
}

export default function ProjectInfoModal({ project, onClose }: ProjectInfoModalProps) {
  const { t } = useLanguage()
  const [activeProject, setActiveProject] = useState<ProjectDetail | null>(project)
  const [isPlaying, setIsPlaying] = useState(true)
  const [isMuted, setIsMuted] = useState(true)
  const videoRef = useRef<HTMLVideoElement | null>(null)
  
  const backdropRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const leftColRef = useRef<HTMLDivElement | null>(null)
  const rightColRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (project) {
      setActiveProject(project)
      setIsPlaying(true)
      setIsMuted(true)
    }
  }, [project])

  const handleClose = () => {
    if (!modalRef.current || !backdropRef.current) {
      onClose()
      return
    }

    gsap.killTweensOf([
      backdropRef.current,
      modalRef.current,
      leftColRef.current,
      rightColRef.current,
    ])

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.inOut',
    })

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 15,
      duration: 0.3,
      ease: 'power2.inOut',
      onComplete: () => {
        setActiveProject(null)
        onClose()
      },
    })
  }

  useLayoutEffect(() => {
    if (!activeProject || !modalRef.current || !backdropRef.current) return

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    gsap.killTweensOf([
      backdropRef.current,
      modalRef.current,
      leftColRef.current,
      rightColRef.current,
    ])

    // Initial state
    gsap.set(backdropRef.current, { opacity: 0 })
    gsap.set(modalRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 20,
    })

    if (leftColRef.current && rightColRef.current) {
      gsap.set(leftColRef.current, { opacity: 0, y: 15 })
      gsap.set(rightColRef.current, { opacity: 0, y: 15, scale: 0.98 })
    }

    // Fade in backdrop
    gsap.to(backdropRef.current, {
      opacity: 1,
      duration: 0.35,
      ease: 'power2.out',
    })

    // Zoom & fade in modal
    gsap.to(modalRef.current, {
      opacity: 1,
      scale: 1,
      y: 0,
      duration: 0.4,
      ease: 'power3.out',
    })

    // Content stagger
    if (leftColRef.current && rightColRef.current) {
      gsap.to(leftColRef.current, {
        opacity: 1,
        y: 0,
        duration: 0.4,
        delay: 0.08,
        ease: 'power2.out',
      })
      gsap.to(rightColRef.current, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.45,
        delay: 0.12,
        ease: 'power2.out',
      })
    }
  }, [activeProject])

  useEffect(() => {
    if (!activeProject) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)

    return () => {
      document.body.style.overflow = ''
      document.documentElement.style.overflow = ''
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeProject])

  const togglePlay = () => {
    if (!videoRef.current) return
    if (videoRef.current.paused) {
      videoRef.current.play()
      setIsPlaying(true)
    } else {
      videoRef.current.pause()
      setIsPlaying(false)
    }
  }

  const toggleMute = () => {
    if (!videoRef.current) return
    const nextMuted = !videoRef.current.muted
    videoRef.current.muted = nextMuted
    setIsMuted(nextMuted)
  }

  if (!activeProject) return null

  const displayProject = activeProject
  const localizedInfo = t.projects[displayProject.id]
  const currentSubtitle = localizedInfo?.subtitle || displayProject.subtitle
  const currentDescription = localizedInfo?.description || displayProject.description

  return (
    <div
      ref={backdropRef}
      style={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-2xl overflow-hidden flex items-center justify-center pointer-events-auto"
    >
      <div
        ref={modalRef}
        style={{ opacity: 0 }}
        className="project-detail-view w-full h-full bg-[#070913]/90 backdrop-blur-3xl overflow-y-auto overflow-x-hidden font-outfit text-slate-100 flex flex-col justify-between"
      >
        {/* 0. Fullscreen Atmospheric Ambient Glow Orbs */}
        <div
          className="fixed top-[-15%] right-[-10%] w-[900px] h-[900px] rounded-full blur-[220px] pointer-events-none opacity-40 -z-10 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${displayProject.color} 0%, ${displayProject.secondaryColor} 60%, transparent 80%)`,
          }}
        />
        <div
          className="fixed bottom-[-15%] left-[-10%] w-[750px] h-[750px] rounded-full blur-[200px] pointer-events-none opacity-25 -z-10 transition-colors duration-1000"
          style={{
            background: `radial-gradient(circle, ${displayProject.secondaryColor} 0%, ${displayProject.color} 60%, transparent 80%)`,
          }}
        />

        {/* Grid Pattern Background subtle */}
        <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none -z-10" />

        {/* 1. FLOATING CLOSE (X) BUTTON IN TOP-RIGHT CORNER */}
        <button
          type="button"
          onClick={handleClose}
          className="fixed top-6 right-6 sm:top-8 sm:right-10 z-50 p-3 sm:p-3.5 rounded-full bg-white/10 hover:bg-white/20 active:scale-90 border border-white/15 text-white/80 hover:text-white transition-all backdrop-blur-xl shadow-2xl cursor-pointer group flex items-center justify-center"
          title="Close (ESC)"
          aria-label="Close modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* 2. MINIMALIST CLEAN PRESENTATION CONTENT */}
        <main className="max-w-[1700px] mx-auto w-full px-6 sm:px-10 md:px-14 pt-10 sm:pt-14 pb-8 my-auto flex-1 flex flex-col justify-center">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Kolom Kiri: Title, Subtitle, Deskripsi Ringkas, & Teknologi */}
            <div
              ref={leftColRef}
              className="lg:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 will-change-transform"
            >
              <div className="space-y-2.5">
                {/* Title Besar & Megah */}
                <h1 className="font-syne font-extrabold text-4xl sm:text-5xl lg:text-6xl xl:text-7xl text-white tracking-tight leading-[1.02] drop-shadow-md">
                  {displayProject.title}
                </h1>

                {/* Tanggal / Tahun di bawah Title tanpa dibungkus card */}
                <div className="text-slate-400 font-mono text-sm sm:text-base font-normal tracking-wider">
                  {displayProject.year}
                </div>

                {/* Subtitle Ringkas */}
                <p className="text-slate-300 font-outfit text-xl sm:text-2xl font-medium tracking-wide pt-1">
                  {currentSubtitle}
                </p>
              </div>

              {/* Deskripsi Teks Proyek (Bersih & Elegan) */}
              <div className="space-y-2 pt-1">
                <p className="text-slate-300 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
                  {currentDescription}
                </p>
              </div>

              {/* Tombol Aksi Explore Live */}
              {displayProject.exploreUrl && (
                <div className="pt-2">
                  <a
                    href={displayProject.exploreUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-3 px-8 py-4 rounded-2xl bg-white text-slate-950 font-syne font-extrabold text-sm sm:text-base tracking-tight hover:bg-slate-200 transition-all shadow-2xl shadow-white/25 active:scale-95 cursor-pointer group no-underline"
                  >
                    <span>{t.projectModal.exploreLive}</span>
                    <ExternalLink className="w-4.5 h-4.5 stroke-[2.8] group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              )}
            </div>

            {/* Kolom Kanan: Layar Video Showcase Proyek */}
            <div
              ref={rightColRef}
              className="lg:col-span-6 relative will-change-transform"
            >
              <div
                className="relative w-full aspect-[16/10] rounded-3xl overflow-hidden bg-black/90 border border-white/20 shadow-2xl group select-none"
                style={{
                  boxShadow: `0 25px 60px -15px ${displayProject.color}45`,
                  borderColor: `${displayProject.color}60`,
                }}
              >
                <video
                  ref={videoRef}
                  src={displayProject.videoUrl}
                  autoPlay
                  loop
                  muted={isMuted}
                  playsInline
                  className="w-full h-full object-cover"
                />

                {/* Video Gradient Shade */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />

                {/* Floating Media Controls Bar */}
                <div className="absolute bottom-4 left-4 right-4 z-20 flex items-center justify-between px-4 py-2.5 rounded-2xl bg-black/70 backdrop-blur-xl border border-white/15">
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={togglePlay}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                      title={isPlaying ? t.projectModal.pause : t.projectModal.play}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 fill-current ml-0.5" />}
                    </button>

                    <button
                      type="button"
                      onClick={toggleMute}
                      className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-all active:scale-90 cursor-pointer"
                      title={isMuted ? t.projectModal.unmute : t.projectModal.mute}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4 text-slate-400" /> : <Volume2 className="w-4 h-4 text-cyan-400" />}
                    </button>

                    <span className="text-xs font-mono text-slate-300 font-semibold">
                      {displayProject.title}
                    </span>
                  </div>

                  <span
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-mono font-bold tracking-wider text-white bg-black/60 border border-white/10"
                    style={{ color: displayProject.color }}
                  >
                    {t.projectModal.livePreview}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* 3. TECHNOLOGIES USED - PALING BAWAH (CIRCULAR ICON BADGES) */}
          {displayProject.tags && displayProject.tags.length > 0 && (
            <div className="mt-10 sm:mt-14 pt-7 sm:pt-8 border-t border-white/[0.08] flex flex-col items-center justify-center space-y-4">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/10 text-xs font-mono text-slate-300">
                <Code2 className="w-3.5 h-3.5" style={{ color: displayProject.color }} />
                <span className="uppercase tracking-wider font-semibold text-[11px]">{t.projectModal.technologiesUsed}</span>
              </div>

              {/* Barisan Icon Bundar-Bundar */}
              <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6 pt-0.5">
                {displayProject.tags.map((tag, idx) => (
                  <TechCircleBadge
                    key={idx}
                    tag={tag}
                    brandColor={displayProject.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* 4. SUBTLE FOOTER (DENGAN JARAK PAS) */}
          <footer className="mt-8 sm:mt-10 pt-2 pb-4 text-center text-xs font-mono text-slate-500">
            {t.projectModal.footerEsc}
          </footer>
        </main>
      </div>
    </div>
  )
}
