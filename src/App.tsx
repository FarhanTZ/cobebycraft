import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import Navbar from './components/Navbar'
import VideoScreen3D from './components/VideoScreen3D'
import CustomCursor from './components/CustomCursor'
import IntroScreen from './components/IntroScreen'

gsap.registerPlugin(ScrollTrigger, useGSAP)

interface Project {
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
}

const PROJECTS: Project[] = [
  {
    id: 'grab-interactive',
    number: '01',
    title: 'Grab Interactive',
    subtitle: 'Everyday SuperApp Platform',
    client: 'Grab Holdings',
    metric: '4.8x Faster Inference',
    year: '2026',
    color: '#00b14f',
    secondaryColor: '#38bdf8',
    videoUrl: '/video/grab_video.mp4',
    exploreUrl: 'https://grab-interactive-landing.vercel.app/',
  },
  {
    id: 'pixar-characters',
    number: '02',
    title: 'Pixar Characters',
    subtitle: 'Interactive 3D Universe',
    client: 'Pixar Animation Studios',
    metric: 'Realtime 3D Canvas',
    year: '2026',
    color: '#38bdf8',
    secondaryColor: '#f59e0b',
    videoUrl: '/video/pixar_video.mp4',
    exploreUrl: 'https://pixar-character.vercel.app/',
  },
  {
    id: 'kroma-studio',
    number: '03',
    title: 'Kroma Studio',
    subtitle: 'Immersive Motion Identity',
    client: 'Kroma Creative Media',
    metric: 'AOTD Winner 2025',
    year: '2025',
    color: '#10b981',
    secondaryColor: '#06b6d4',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fluid-particles-in-motion-41528-large.mp4',
  },
  {
    id: 'hyperion-finance',
    number: '04',
    title: 'Hyperion Terminal',
    subtitle: 'Realtime Liquidity Protocol',
    client: 'Hyperion Capital',
    metric: '$1.2B Volume Tracked',
    year: '2025',
    color: '#f59e0b',
    secondaryColor: '#ef4444',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-tunnel-of-futuristic-neon-lights-41551-large.mp4',
  },
  {
    id: 'veloce-motors',
    number: '05',
    title: 'Veloce Digital',
    subtitle: 'Luxury 3D Configurator',
    client: 'Veloce Automotive',
    metric: 'PBR Material Shader',
    year: '2025',
    color: '#f43f5e',
    secondaryColor: '#fb923c',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-abstract-laser-lights-background-animation-41538-large.mp4',
  },
]

export default function App() {
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [hoveredProjectIndex, setHoveredProjectIndex] = useState<number | null>(null)
  const [isHoveringIndicators, setIsHoveringIndicators] = useState(false)
  const [isNearRightEdge, setIsNearRightEdge] = useState(false)
  const [isScrolling, setIsScrolling] = useState(false)
  const scrollTimeoutRef = useRef<number | null>(null)

  const containerRef = useRef<HTMLDivElement>(null!)
  const screenWrapperRef = useRef<HTMLDivElement>(null!)
  const sectionsRef = useRef<(HTMLElement | null)[]>([])

  const currentProject = PROJECTS[activeProjectIndex]

  // Detect active scrolling to show/hide the floating indicators
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolling(true)

      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }

      scrollTimeoutRef.current = window.setTimeout(() => {
        setIsScrolling(false)
      }, 1200)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollTimeoutRef.current) {
        window.clearTimeout(scrollTimeoutRef.current)
      }
    }
  }, [])

  // Detect cursor approaching the right edge of the screen to expand the indicator
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const isRight = window.innerWidth - e.clientX <= 220
      setIsNearRightEdge(isRight)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [])

  const isIndicatorExpanded = isScrolling || isNearRightEdge || isHoveringIndicators || hoveredProjectIndex !== null

  // Ref untuk mengontrol pergerakan dinamis 3D layar saat kursor didekatkan
  const scrollProgressRef = useRef(0)

  // Dynamic 3D screen tilt & proximity animation loop
  useEffect(() => {
    let animationFrameId: number

    let targetMouseRotX = 0
    let targetMouseRotY = 0
    let targetTransX = 0
    let targetTransY = 0
    let targetTransZ = 0
    let targetScale = 1

    let currentRotX = 3
    let currentRotY = -18
    let currentTransX = 0
    let currentTransY = 0
    let currentTransZ = 0
    let currentScale = 1

    const handleMouseMove = (e: MouseEvent) => {
      if (!screenWrapperRef.current) return
      const rect = screenWrapperRef.current.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      const deltaX = e.clientX - centerX
      const deltaY = e.clientY - centerY
      const distance = Math.hypot(deltaX, deltaY)

      // Radius pengaruh saat kursor mendekat ke layar (1000px)
      const proximityRadius = Math.max(rect.width, rect.height) * 1.1
      const isInside =
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom

      if (distance < proximityRadius || isInside) {
        const proximity = isInside ? 1 : Math.max(0, 1 - (distance - rect.width / 2) / (proximityRadius - rect.width / 2))
        const normalizedX = Math.max(-1.5, Math.min(1.5, deltaX / (rect.width / 2)))
        const normalizedY = Math.max(-1.5, Math.min(1.5, deltaY / (rect.height / 2)))

        // Tilt magnetik dinamis mengikuti posisi kursor saat mendekat
        targetMouseRotY = normalizedX * (isInside ? 16 : 12 * proximity)
        targetMouseRotX = -normalizedY * (isInside ? 14 : 10 * proximity)
        targetTransX = normalizedX * 22 * proximity
        targetTransY = normalizedY * 20 * proximity
        targetTransZ = isInside ? 50 : 25 * proximity
        targetScale = isInside ? 1.035 : 1 + 0.02 * proximity
      } else {
        // Kembali ke posisi natural bila kursor jauh
        targetMouseRotX = 0
        targetMouseRotY = 0
        targetTransX = 0
        targetTransY = 0
        targetTransZ = 0
        targetScale = 1
      }
    }

    const render = () => {
      const scrollProgress = scrollProgressRef.current
      const baseScrollRotY = -18 + scrollProgress * 8
      const baseScrollRotX = 3 + Math.sin(scrollProgress * Math.PI * 4) * 4

      const desiredRotY = baseScrollRotY + targetMouseRotY
      const desiredRotX = baseScrollRotX + targetMouseRotX

      // Interpolasi halus (lerp 60-120fps)
      currentRotY += (desiredRotY - currentRotY) * 0.08
      currentRotX += (desiredRotX - currentRotX) * 0.08
      currentTransX += (targetTransX - currentTransX) * 0.08
      currentTransY += (targetTransY - currentTransY) * 0.08
      currentTransZ += (targetTransZ - currentTransZ) * 0.08
      currentScale += (targetScale - currentScale) * 0.08

      if (screenWrapperRef.current) {
        screenWrapperRef.current.style.transform = `translate3d(${currentTransX.toFixed(2)}px, ${currentTransY.toFixed(2)}px, ${currentTransZ.toFixed(2)}px) rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`
      }

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  // Setup GSAP ScrollTrigger for seamless scrolling between sections
  useGSAP(
    () => {
      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        const title = section.querySelector('.project-title')
        const subtitle = section.querySelector('.project-subtitle')
        const button = section.querySelector('.explore-button')

        // Parallax and entrance/exit animation for text on scroll
        gsap.fromTo(
          [title, subtitle, button],
          {
            opacity: 0.15,
            y: 60,
          },
          {
            opacity: 1,
            y: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: section,
              start: 'top 70%',
              end: 'bottom 30%',
              toggleActions: 'play reverse play reverse',
              onEnter: () => setActiveProjectIndex(index),
              onEnterBack: () => setActiveProjectIndex(index),
            },
          }
        )
      })

      // Continuous 3D tilt reaction on global page scroll
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1.2,
        onUpdate: (self) => {
          scrollProgressRef.current = self.progress
        },
      })
    },
    { scope: containerRef }
  )

  const scrollToSection = (index: number) => {
    sectionsRef.current[index]?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#06070c] text-slate-100 selection:bg-cyan-500/30 font-outfit"
    >
      {/* 0. Cinematic Opening Splash Intro */}
      {!isIntroComplete && (
        <IntroScreen onComplete={() => setIsIntroComplete(true)} />
      )}

      {/* 1. Dynamic Full Viewport Atmospheric Color Gradient */}
      <div
        className="fixed inset-0 pointer-events-none transition-all duration-1000 ease-out z-0"
        style={{
          background: `radial-gradient(130% 130% at 75% 45%, ${currentProject.color}18 0%, ${currentProject.secondaryColor}0a 45%, #06070c 85%)`,
        }}
      />

      {/* 2. Primary Ambilight Glow Orb (Sisi Kanan di belakang Video Screen) */}
      <div
        className="fixed top-1/4 right-1/6 w-[850px] h-[850px] rounded-full blur-[180px] pointer-events-none transition-all duration-1000 ease-out opacity-50 z-0"
        style={{
          background: `radial-gradient(circle, ${currentProject.color} 0%, ${currentProject.secondaryColor} 60%, transparent 85%)`,
        }}
      />

      {/* 3. Secondary Subtle Ambient Orb (Sisi Kiri di belakang Teks) */}
      <div
        className="fixed bottom-1/4 left-[-100px] w-[600px] h-[600px] rounded-full blur-[170px] pointer-events-none transition-all duration-1000 ease-out opacity-20 z-0"
        style={{
          background: `radial-gradient(circle, ${currentProject.secondaryColor} 0%, ${currentProject.color} 50%, transparent 80%)`,
        }}
      />

      {/* 4. Grid Pattern Background subtle */}
      <div className="fixed inset-0 bg-[linear-gradient(to_right,#ffffff05_1px,transparent_1px),linear-gradient(to_bottom,#ffffff05_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)] pointer-events-none z-0" />

      {/* Seamless Fixed Navbar */}
      <Navbar />

      {/* Fluid Liquid Bubble Custom Cursor */}
      {isIntroComplete && (
        <CustomCursor
          color={currentProject.color}
          secondaryColor={currentProject.secondaryColor}
          hidden={isIndicatorExpanded}
        />
      )}

      {/* FIXED PINNED 3D TILTED VIDEO SCREEN (Sisi Kanan Menetap - Layer Belakang Teks) */}
      <div className="fixed top-0 right-0 w-full h-screen pointer-events-none z-20 flex items-center justify-end px-6 sm:px-10 md:px-14 overflow-hidden">
        <div className="w-full max-w-[1850px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-5 hidden lg:block" />
          
          <div className="lg:col-span-7 flex items-center justify-end relative perspective-[1800px] -ml-16 sm:-ml-28 lg:-ml-48 -mr-6 sm:-mr-10 lg:-mr-16 pointer-events-auto">
            {/* Massive Tilted Video Screen */}
            <div
              ref={screenWrapperRef}
              className="relative w-full aspect-[16/10] min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] xl:min-h-[760px] max-w-[1350px] rounded-3xl will-change-transform pointer-events-auto"
              style={{
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Outer Ambilight Glow Halo */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl opacity-70 transition-colors duration-1000 -z-10"
                style={{
                  background: `radial-gradient(circle, ${currentProject.color} 0%, transparent 75%)`,
                }}
              />

              {/* Interactive Video Screen Component */}
              <VideoScreen3D
                videoUrl={currentProject.videoUrl}
                color={currentProject.color}
                secondaryColor={currentProject.secondaryColor}
                title={currentProject.title}
                client={currentProject.client}
                year={currentProject.year}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 5. Smooth Black Gradient Shadow on Right Side when Indicators are Expanded */}
      <div
        className={`fixed top-0 right-0 h-full w-72 sm:w-96 md:w-[440px] pointer-events-none z-30 bg-gradient-to-l from-black/85 via-black/40 to-transparent transition-opacity duration-500 ease-out ${
          isIndicatorExpanded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* FLOATING VERTICAL SCROLL PROGRESS INDICATORS WITH MINI VIDEO HOVER PREVIEWS */}
      <div
        onMouseEnter={() => setIsHoveringIndicators(true)}
        onMouseLeave={() => {
          setIsHoveringIndicators(false)
          setHoveredProjectIndex(null)
        }}
        className={`fixed right-3 sm:right-6 top-1/2 -translate-y-1/2 z-40 p-4 flex flex-col space-y-4 transition-all duration-300 ease-out origin-right pointer-events-auto select-none ${
          isIndicatorExpanded
            ? 'scale-110 sm:scale-120 opacity-100 translate-x-0'
            : 'scale-100 opacity-75 translate-x-0 hover:opacity-100 hover:scale-110'
        }`}
      >
        {PROJECTS.map((proj, idx) => {
          const isActive = idx === activeProjectIndex
          const isHovered = hoveredProjectIndex === idx

          return (
            <div
              key={proj.id}
              className="relative flex items-center justify-end"
            >
              {/* MINI VIDEO PREVIEW (Langsung Kotak Video dengan Judul di Atasnya) */}
              <div
                className={`absolute right-full mr-5 pointer-events-none transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) flex flex-col items-start origin-right gap-1.5 ${
                  isHovered
                    ? 'opacity-100 translate-x-0 scale-100'
                    : 'opacity-0 translate-x-4 scale-90 pointer-events-none'
                }`}
              >
                {/* Teks Nama Judul Project di Atas Video */}
                <div className="flex items-center space-x-2 px-1 select-none">
                  <span
                    className="text-[11px] font-mono font-bold"
                    style={{ color: proj.color }}
                  >
                    {proj.number}
                  </span>
                  <span className="text-[13px] font-bold font-syne text-white tracking-tight drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] truncate max-w-[200px]">
                    {proj.title}
                  </span>
                </div>

                {/* Kotak Video Langsung */}
                <div
                  className="w-52 sm:w-60 aspect-[16/10] rounded-xl overflow-hidden bg-black/90 border shadow-2xl relative"
                  style={{
                    boxShadow: `0 10px 30px -5px ${proj.color}55`,
                    borderColor: `${proj.color}90`,
                  }}
                >
                  <video
                    src={proj.videoUrl}
                    autoPlay
                    loop
                    muted
                    playsInline
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>

              {/* TOMBOL INDIKATOR SCROLL (Dot & Bar) */}
              <button
                onClick={() => scrollToSection(idx)}
                onMouseEnter={() => setHoveredProjectIndex(idx)}
                onMouseLeave={() => setHoveredProjectIndex(null)}
                className="group flex items-center space-x-3.5 cursor-pointer py-1.5 focus:outline-none"
                title={proj.title}
              >
                {/* Nomor Proyek */}
                <span
                  className={`text-[11px] font-mono transition-all duration-300 ${
                    isActive || isHovered || isIndicatorExpanded
                      ? 'text-white font-bold translate-x-0 opacity-100'
                      : 'text-slate-500 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                  style={{
                    color: isHovered ? proj.color : isActive ? '#ffffff' : undefined,
                  }}
                >
                  {proj.number}
                </span>

                {/* Dot / Bar Dinamis */}
                <span
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? isIndicatorExpanded
                        ? 'w-10 bg-cyan-400 shadow-lg shadow-cyan-400/60'
                        : 'w-8 bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : isHovered
                      ? 'w-6 bg-white shadow-md shadow-white/40'
                      : isIndicatorExpanded
                      ? 'w-3.5 bg-white/40 group-hover:bg-white/70'
                      : 'w-2 bg-white/30 group-hover:bg-white/70'
                  }`}
                  style={{
                    backgroundColor: isActive ? proj.color : isHovered ? '#ffffff' : undefined,
                    boxShadow: isActive ? `0 0 16px ${proj.color}` : undefined,
                  }}
                />
              </button>
            </div>
          )
        })}
      </div>

      {/* SEAMLESS SCROLLABLE SECTIONS (Layer Depan - Title Tampil di Atas Layar Video) */}
      <div className="relative z-30 w-full max-w-[1850px] mx-auto px-6 sm:px-10 md:px-14 pointer-events-none">
        {PROJECTS.map((project, index) => (
          <section
            key={project.id}
            ref={(el) => {
              sectionsRef.current[index] = el
            }}
            className="min-h-screen flex items-center relative py-28 pointer-events-none"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* KOLOM KIRI: Title Gede, Subtitle & Tombol Explore (Berada di Layer Depan) */}
              <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-6 sm:space-y-8 z-30 pointer-events-auto relative">
                {/* Container Title & Subtitle */}
                <div className="space-y-3 relative z-30">
                  {/* Title Besar, Tebal, dan Megah di Depan Layar */}
                  <h2 className="project-title font-syne font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white leading-[0.95] select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] max-w-2xl lg:max-w-3xl">
                    {project.title}
                  </h2>

                  {/* Subtitle Ringkas (2-3 kata) di bawah Title */}
                  <p className="project-subtitle text-slate-300 font-outfit text-lg sm:text-xl lg:text-2xl font-medium tracking-wide drop-shadow-md select-none">
                    {project.subtitle}
                  </p>
                </div>

                {/* Tombol Explore */}
                <div className="explore-button flex items-center space-x-4 pt-1 relative z-30">
                  <a
                    href={project.exploreUrl || '#'}
                    target={project.exploreUrl ? '_blank' : undefined}
                    rel={project.exploreUrl ? 'noopener noreferrer' : undefined}
                    className="inline-flex items-center space-x-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-950 font-syne font-extrabold text-sm sm:text-base tracking-tight hover:bg-slate-200 transition-all shadow-2xl shadow-white/20 active:scale-95 cursor-pointer group no-underline"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.8] group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>

              {/* Empty placeholder on the right for spatial alignment with fixed 3D screen */}
              <div className="lg:col-span-6 hidden lg:block pointer-events-none" />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
