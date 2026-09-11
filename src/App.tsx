import { useState, useRef, useEffect } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight } from 'lucide-react'
import Navbar from './components/Navbar'
import VideoScreen3D from './components/VideoScreen3D'
import CustomCursor from './components/CustomCursor'

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
}

const PROJECTS: Project[] = [
  {
    id: 'aura-ai',
    number: '01',
    title: 'Aura AI Engine',
    subtitle: 'Autonomous Neural Workflow',
    client: 'Aura Research Labs',
    metric: '4.8x Faster Inference',
    year: '2026',
    color: '#38bdf8',
    secondaryColor: '#818cf8',
    videoUrl: '/video/grab_video.mp4',
  },
  {
    id: 'nexus-spatial',
    number: '02',
    title: 'Nexus Spatial OS',
    subtitle: 'Next-Gen 3D Web Canvas',
    client: 'Nexus Foundation',
    metric: '60 FPS WebGL Engine',
    year: '2026',
    color: '#a855f7',
    secondaryColor: '#ec4899',
    videoUrl: 'https://assets.mixkit.co/videos/preview/mixkit-circuit-board-technology-animation-41525-large.mp4',
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
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
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

  // Setup GSAP ScrollTrigger for seamless scrolling between sections
  useGSAP(
    () => {
      sectionsRef.current.forEach((section, index) => {
        if (!section) return

        const title = section.querySelector('.project-title')
        const button = section.querySelector('.explore-button')

        // Parallax and entrance/exit animation for text on scroll
        gsap.fromTo(
          [title, button],
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
          if (screenWrapperRef.current) {
            const rotationY = -18 + self.progress * 8
            const rotationX = 3 + Math.sin(self.progress * Math.PI * 4) * 4
            gsap.to(screenWrapperRef.current, {
              rotateY: rotationY,
              rotateX: rotationX,
              overwrite: 'auto',
              duration: 0.5,
            })
          }
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
      <CustomCursor
        color={currentProject.color}
        secondaryColor={currentProject.secondaryColor}
      />

      {/* FIXED PINNED 3D TILTED VIDEO SCREEN (Sisi Kanan Menetap & Interaktif) */}
      <div className="fixed top-0 right-0 w-full h-screen pointer-events-none z-30 flex items-center justify-end px-6 sm:px-10 md:px-14 overflow-hidden">
        <div className="w-full max-w-[1850px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-5 hidden lg:block" />
          
          <div className="lg:col-span-7 flex items-center justify-end relative perspective-[1800px] -ml-16 sm:-ml-28 lg:-ml-48 -mr-6 sm:-mr-10 lg:-mr-16 pointer-events-auto">
            {/* Massive Tilted Video Screen */}
            <div
              ref={screenWrapperRef}
              className="relative w-full aspect-[16/10] min-h-[480px] sm:min-h-[580px] lg:min-h-[680px] xl:min-h-[760px] max-w-[1350px] rounded-3xl transition-all duration-700 ease-out pointer-events-auto"
              style={{
                transformStyle: 'preserve-3d',
                transform: 'rotateY(-18deg) rotateX(3deg)',
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

      {/* FLOATING VERTICAL SCROLL PROGRESS INDICATORS */}
      <div
        className={`fixed right-6 sm:right-8 top-1/2 -translate-y-1/2 z-40 flex flex-col space-y-3.5 transition-all duration-500 ease-out ${
          isScrolling
            ? 'opacity-100 translate-x-0 pointer-events-auto'
            : 'opacity-0 translate-x-4 pointer-events-none'
        }`}
      >
        {PROJECTS.map((proj, idx) => {
          const isActive = idx === activeProjectIndex
          return (
            <button
              key={proj.id}
              onClick={() => scrollToSection(idx)}
              className="group flex items-center space-x-3 cursor-pointer py-1"
              title={proj.title}
            >
              <span
                className={`text-[11px] font-mono transition-all duration-300 ${
                  isActive
                    ? 'text-white font-bold translate-x-0 opacity-100'
                    : 'text-slate-500 translate-x-2 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                }`}
              >
                {proj.number}
              </span>
              <span
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? 'w-8 bg-cyan-400 shadow-lg shadow-cyan-400/50'
                    : 'w-2 bg-white/20 group-hover:bg-white/50'
                }`}
              />
            </button>
          )
        })}
      </div>

      {/* SEAMLESS SCROLLABLE SECTIONS (5 Project Sections) */}
      <div className="relative z-20 w-full max-w-[1850px] mx-auto px-6 sm:px-10 md:px-14 pointer-events-none">
        {PROJECTS.map((project, index) => (
          <section
            key={project.id}
            ref={(el) => {
              sectionsRef.current[index] = el
            }}
            className="min-h-screen flex items-center relative py-28 pointer-events-none"
          >
            <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
              {/* KOLOM KIRI: Title Gede & Tombol Explore */}
              <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center space-y-8 z-30 pointer-events-auto">
                {/* Title Besar, Tebal, dan Megah */}
                <h2 className="project-title font-syne font-extrabold text-5xl sm:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white leading-[0.95] select-none drop-shadow-[0_10px_30px_rgba(0,0,0,0.8)]">
                  {project.title}
                </h2>

                {/* Tombol Explore */}
                <div className="explore-button flex items-center space-x-4 pt-2">
                  <button
                    type="button"
                    className="inline-flex items-center space-x-2.5 px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-white text-slate-950 font-syne font-extrabold text-sm sm:text-base tracking-tight hover:bg-slate-200 transition-all shadow-2xl shadow-white/20 active:scale-95 cursor-pointer group"
                  >
                    <span>Explore</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.8] group-hover:translate-x-1 transition-transform" />
                  </button>
                </div>
              </div>

              {/* Empty placeholder on the right for spatial alignment with fixed 3D screen */}
              <div className="lg:col-span-7 hidden lg:block pointer-events-none" />
            </div>
          </section>
        ))}
      </div>
    </div>
  )
}
