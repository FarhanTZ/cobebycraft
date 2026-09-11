import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import {
  X,
  Box,
  Code2,
  Zap,
  Layers,
  Palette,
  Boxes,
  Radio,
  Gamepad2,
  Cpu,
} from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface AboutModalProps {
  isOpen: boolean
  onClose: () => void
}

const ABOUT_TAGS = [
  { name: 'React Three Fiber', color: '#38bdf8' },
  { name: 'WebGL Shaders', color: '#ef4444' },
  { name: 'TypeScript', color: '#3178c6' },
  { name: 'Three.js', color: '#ffffff' },
  { name: 'Flutter', color: '#02569b' },
  { name: 'Go', color: '#00add8' },
  { name: 'Laravel', color: '#ff2d20' },
  { name: 'Python', color: '#3776ab' },
  { name: 'GSAP Motion', color: '#88ce02' },
  { name: 'Tailwind CSS', color: '#38bdf8' },
  { name: 'Vite', color: '#bd34fe' },
]

function TechCircleBadge({ tag, brandColor }: { tag: string; brandColor: string }) {
  const normalized = tag.toLowerCase()

  const renderIcon = () => {
    if (normalized.includes('react three') || normalized.includes('r3f')) {
      return <Box className="w-6 h-6 text-[#38bdf8] group-hover:rotate-12 transition-transform duration-300" />
    }
    if (normalized.includes('react')) {
      return (
        <svg className="w-6 h-6 text-[#00d8ff] group-hover:rotate-180 transition-transform duration-700" viewBox="-11.5 -10.23174 23 20.46348" fill="currentColor">
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
      return <span className="font-mono font-black text-sm text-[#3178c6] tracking-tight">TS</span>
    }
    if (normalized.includes('three')) {
      return <Boxes className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-300" />
    }
    if (normalized.includes('flutter')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#54c5f8] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14.314 0L2.3 12 6 15.7 21.684.013h-7.37zm.07 11.23l-7.46 7.458 3.699 3.698 3.76-3.76 7.37-7.396h-7.37z" />
        </svg>
      )
    }
    if (normalized.includes('go')) {
      return <span className="font-mono font-black text-sm text-[#00add8] tracking-tighter">GO</span>
    }
    if (normalized.includes('laravel')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ff2d20] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M21.2 6.5l-8.5-4.9c-.4-.2-.9-.2-1.3 0L2.8 6.5c-.5.3-.8.8-.8 1.4v9.8c0 .6.3 1.1.8 1.4l8.5 4.9c.4.2.9.2 1.3 0l8.5-4.9c.5-.3.8-.8.8-1.4V7.9c.1-.6-.2-1.1-.7-1.4zm-9.2 14.1L4.5 16.2V8.8l7.5 4.4v7.4zm1-8.5L5.4 7.7l7.5-4.3 7.5 4.3-7.4 4.4zm7.5 4.1l-6.5 3.8v-7.4l6.5-3.8v7.4z" />
        </svg>
      )
    }
    if (normalized.includes('python')) {
      return (
        <svg className="w-5 h-5 sm:w-6 sm:h-6 text-[#ffde57] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M11.914 0C5.82 0 6.2 2.656 6.2 2.656l.006 2.75h5.813v.825H3.84S0 5.79 0 11.906c0 6.117 3.344 5.918 3.344 5.918h1.996v-2.8c0-3.218 2.72-3.218 2.72-3.218h5.707s2.625.04 2.625-2.586V2.656S16.78 0 11.914 0zm-3.27 1.777a1.055 1.055 0 1 1 0 2.11 1.055 1.055 0 0 1 0-2.11z" />
          <path d="M12.086 24c6.094 0 5.715-2.656 5.715-2.656l-.006-2.75h-5.813v-.825h8.179s3.84.441 3.84-5.676c0-6.117-3.344-5.918-3.344-5.918h-1.996v2.8c0 3.218-2.72 3.218-2.72 3.218H10.23s-2.625-.04-2.625 2.586v6.566s-.41 2.656 4.48 2.656zm3.27-1.777a1.055 1.055 0 1 1 0-2.11 1.055 1.055 0 0 1 0 2.11z" fill="#4584b6" />
        </svg>
      )
    }
    if (normalized.includes('tailwind')) {
      return (
        <svg className="w-6 h-6 text-[#38bdf8] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12.001,4.8c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 C13.666,10.618,15.027,12,18.001,12c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C16.337,6.182,14.976,4.8,12.001,4.8z M6.001,12c-3.2,0-5.2,1.6-6,4.8c1.2-1.6,2.6-2.2,4.2-1.8c0.913,0.228,1.565,0.89,2.288,1.624 c1.177,1.194,2.538,2.576,5.512,2.576c3.2,0,5.2-1.6,6-4.8c-1.2,1.6-2.6,2.2-4.2,1.8c-0.913-0.228-1.565-0.89-2.288-1.624 C9.337,13.382,7.976,12,6.001,12z" />
        </svg>
      )
    }
    if (normalized.includes('gsap') || normalized.includes('motion')) {
      return <Zap className="w-6 h-6 text-[#88ce02] group-hover:scale-110 transition-transform duration-300" />
    }
    if (normalized.includes('vite')) {
      return <Zap className="w-6 h-6 text-[#bd34fe] group-hover:scale-110 transition-transform duration-300" />
    }
    if (normalized.includes('webgl')) {
      return (
        <svg className="w-6 h-6 text-[#ef4444] group-hover:scale-110 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
          <polyline points="3.29 7 12 12 20.71 7" />
          <line x1="12" y1="22" x2="12" y2="12" />
        </svg>
      )
    }
    if (normalized.includes('shader') || normalized.includes('pbr')) {
      return (
        <svg className="w-6 h-6 text-[#f59e0b] group-hover:rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
          <polygon points="6 3 18 3 22 9 12 22 2 9" />
          <line x1="2" y1="9" x2="22" y2="9" />
          <line x1="12" y1="22" x2="6" y2="9" />
          <line x1="12" y1="22" x2="18" y2="9" />
        </svg>
      )
    }
    if (normalized.includes('audio') || normalized.includes('synth') || normalized.includes('sound')) {
      return <Radio className="w-6 h-6 text-[#ef4444] group-hover:scale-110 transition-transform duration-300" />
    }
    if (normalized.includes('retro') || normalized.includes('pixel') || normalized.includes('game')) {
      return <Gamepad2 className="w-6 h-6 text-[#f59e0b] group-hover:-rotate-12 transition-transform duration-300" />
    }
    if (normalized.includes('canvas')) {
      return <Palette className="w-6 h-6 text-[#ec4899] group-hover:scale-110 transition-transform duration-300" />
    }
    if (normalized.includes('bento') || normalized.includes('grid')) {
      return <Layers className="w-6 h-6 text-[#a855f7] group-hover:scale-110 transition-transform duration-300" />
    }
    return <Cpu className="w-6 h-6 text-slate-300" />
  }

  return (
    <div className="tech-badge-item relative group flex flex-col items-center">
      {/* Floating Tooltip Label */}
      <div className="absolute -top-11 left-1/2 -translate-x-1/2 px-3 py-1 rounded-xl bg-[#0e1222]/95 border border-white/20 text-white text-xs font-mono font-semibold whitespace-nowrap opacity-0 group-hover:opacity-100 group-hover:-translate-y-1 transition-all duration-200 pointer-events-none z-30 shadow-2xl backdrop-blur-md flex items-center gap-1.5">
        <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: brandColor }} />
        <span>{tag}</span>
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#0e1222] border-r border-b border-white/20 rotate-45" />
      </div>

      {/* Lingkaran Bulat Bundar Icon Badge */}
      <div
        className="w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-white/[0.05] hover:bg-white/15 border border-white/15 hover:border-white/40 transition-all duration-300 shadow-xl group-hover:scale-115 group-active:scale-95 cursor-pointer backdrop-blur-md relative overflow-hidden"
        style={{
          boxShadow: `0 10px 30px -8px rgba(0,0,0,0.6)`,
        }}
      >
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-300 rounded-full"
          style={{ backgroundColor: brandColor }}
        />
        {renderIcon()}
      </div>

      {/* Label Nama di Bawah Icon */}
      <span className="mt-2.5 text-xs font-mono text-slate-400 group-hover:text-white transition-colors text-center max-w-[80px] truncate select-none">
        {tag}
      </span>
    </div>
  )
}

export default function AboutModal({ isOpen, onClose }: AboutModalProps) {
  const { t } = useLanguage()
  const backdropRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLDivElement | null>(null)
  const heroRef = useRef<HTMLDivElement | null>(null)
  const descRef = useRef<HTMLDivElement | null>(null)
  const toolsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!isOpen) return

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    if (backdropRef.current && modalRef.current) {
      gsap.killTweensOf([
        backdropRef.current,
        modalRef.current,
        heroRef.current,
        descRef.current,
        toolsRef.current,
      ])

      // Initial states
      gsap.set(backdropRef.current, { opacity: 0 })
      gsap.set(modalRef.current, { opacity: 0, scale: 0.96, y: 20 })

      if (heroRef.current) {
        gsap.set(heroRef.current, { opacity: 0, y: 25 })
      }
      if (descRef.current) {
        gsap.set(descRef.current, { opacity: 0, y: 30 })
      }
      if (toolsRef.current) {
        gsap.set(toolsRef.current.querySelectorAll('.tech-badge-item'), { opacity: 0, y: 30, scale: 0.8 })
      }

      // Smooth Fade & Entrance Sequence
      gsap.to(backdropRef.current, {
        opacity: 1,
        duration: 0.35,
        ease: 'power2.out',
      })

      gsap.to(modalRef.current, {
        opacity: 1,
        scale: 1,
        y: 0,
        duration: 0.45,
        ease: 'power3.out',
      })

      // Staggered reveal for Title & Brand Name
      if (heroRef.current) {
        gsap.to(heroRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.5,
          delay: 0.1,
          ease: 'power2.out',
        })
      }

      // Staggered reveal for About Description
      if (descRef.current) {
        gsap.to(descRef.current, {
          opacity: 1,
          y: 0,
          duration: 0.55,
          delay: 0.22,
          ease: 'power2.out',
        })
      }

      // Staggered reveal for Core Technologies Badges
      if (toolsRef.current) {
        gsap.to(toolsRef.current.querySelectorAll('.tech-badge-item'), {
          opacity: 1,
          y: 0,
          scale: 1,
          duration: 0.45,
          stagger: 0.04,
          delay: 0.35,
          ease: 'back.out(1.7)',
        })
      }
    }

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
  }, [isOpen])

  const handleClose = () => {
    if (!backdropRef.current || !modalRef.current) {
      onClose()
      return
    }

    gsap.killTweensOf([backdropRef.current, modalRef.current])

    gsap.to(backdropRef.current, {
      opacity: 0,
      duration: 0.28,
      ease: 'power2.inOut',
    })

    gsap.to(modalRef.current, {
      opacity: 0,
      scale: 0.96,
      y: 15,
      duration: 0.28,
      ease: 'power2.inOut',
      onComplete: onClose,
    })
  }

  if (!isOpen) return null

  return (
    <div
      ref={backdropRef}
      style={{ opacity: 0 }}
      className="fixed inset-0 z-[999999] bg-black/80 backdrop-blur-2xl overflow-hidden flex items-center justify-center pointer-events-auto"
    >
      <div
        ref={modalRef}
        style={{ opacity: 0 }}
        className="project-detail-view w-full h-full bg-[#070913]/92 backdrop-blur-3xl overflow-y-auto overflow-x-hidden font-outfit text-slate-100 flex flex-col justify-between"
      >
        {/* Fullscreen Atmospheric Ambient Glow Orbs */}
        <div
          className="fixed top-[-15%] right-[-10%] w-[900px] h-[900px] rounded-full blur-[220px] pointer-events-none opacity-40 -z-10"
          style={{
            background: 'radial-gradient(circle, #38bdf8 0%, #a855f7 60%, transparent 80%)',
          }}
        />
        <div
          className="fixed bottom-[-15%] left-[-10%] w-[750px] h-[750px] rounded-full blur-[200px] pointer-events-none opacity-25 -z-10"
          style={{
            background: 'radial-gradient(circle, #a855f7 0%, #38bdf8 60%, transparent 80%)',
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
          aria-label="Close About modal"
        >
          <X className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.3] group-hover:rotate-90 transition-transform duration-300" />
        </button>

        {/* 2. FULL LEFT-ALIGNED CONTENT (TITLE ABOUT + LARGE DESCRIPTION + CORE TECHNOLOGY) */}
        <main className="max-w-6xl mx-auto w-full px-6 sm:px-12 md:px-20 pt-20 sm:pt-28 pb-16 my-auto flex-1 flex flex-col justify-center items-start text-left">
          {/* A. TITLE: ABOUT */}
          <div ref={heroRef} className="space-y-3 max-w-6xl w-full text-left">
            <h1 className="font-syne font-extrabold text-6xl sm:text-8xl md:text-9xl text-white tracking-tight leading-[0.92] drop-shadow-2xl">
              {t.aboutModal.title}
            </h1>
          </div>

          {/* B. ABOUT PENJELASAN (EXTRA LARGE & SUPER BOLD/CLEAR) */}
          <div ref={descRef} className="mt-10 sm:mt-14 max-w-6xl w-full space-y-8 sm:space-y-10 text-left">
            <p className="text-slate-100 text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-light leading-[1.6] sm:leading-[1.65] md:leading-[1.7] tracking-normal">
              <strong className="text-white font-semibold">{t.aboutModal.manifestoP1Strong}</strong>{t.aboutModal.manifestoP1Text1}<em className="text-cyan-300 not-italic font-medium">{t.aboutModal.manifestoP1Craft}</em>{t.aboutModal.manifestoP1Text2}
            </p>

            <p className="text-slate-200 text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-light leading-[1.6] sm:leading-[1.65] md:leading-[1.7] tracking-normal">
              {t.aboutModal.manifestoP2Text1}
            </p>
            <p className="text-slate-200 text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-light leading-[1.6] sm:leading-[1.65] md:leading-[1.7] tracking-normal">
              {t.aboutModal.manifestoP2Text2}
            </p>
          </div>

          {/* C. WORK HISTORY */}
          <div className="mt-14 sm:mt-20 pt-10 border-t border-white/[0.08] max-w-6xl w-full space-y-8 text-left">
            <h2 className="font-syne font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[0.98]">
              {t.aboutModal.workHistoryTitle}
            </h2>

            <div className="space-y-6 sm:space-y-8">
              <p className="text-slate-100 text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-light leading-[1.6] sm:leading-[1.65] md:leading-[1.7] tracking-normal">
                {t.aboutModal.workHistoryP1Text1}<strong className="text-white font-semibold">{t.aboutModal.workHistoryP1Strong}</strong> {t.aboutModal.workHistoryP1Text2}
              </p>

              <p className="text-slate-200 text-xl sm:text-2xl md:text-3xl lg:text-[28px] font-light leading-[1.6] sm:leading-[1.65] md:leading-[1.7] tracking-normal">
                {t.aboutModal.workHistoryP2}
              </p>
            </div>
          </div>

          {/* D. CORE TECHNOLOGIES & TOOLS */}
          <div ref={toolsRef} className="w-full mt-16 sm:mt-20 pt-10 border-t border-white/[0.08] flex flex-col items-start justify-start space-y-6">
            <div className="inline-flex items-center space-x-2.5 px-4 py-2 rounded-full bg-white/[0.04] border border-white/10 text-xs sm:text-sm font-mono text-slate-300">
              <Code2 className="w-4 h-4 text-cyan-400" />
              <span className="uppercase tracking-wider font-semibold text-xs sm:text-[13px]">{t.aboutModal.coreTechTitle}</span>
            </div>

            {/* Barisan Icon Bundar-Bundar Rata Kiri */}
            <div className="flex flex-wrap items-center justify-start gap-5 sm:gap-7 pt-2 max-w-5xl">
              {ABOUT_TAGS.map((tech, idx) => (
                <TechCircleBadge
                  key={idx}
                  tag={tech.name}
                  brandColor={tech.color}
                />
              ))}
            </div>
          </div>

          {/* E. SUBTLE FOOTER RETURN NOTE */}
          <footer className="mt-14 pt-2 text-left text-xs font-mono text-slate-500">
            {t.aboutModal.footerEsc}
          </footer>
        </main>
      </div>
    </div>
  )
}
