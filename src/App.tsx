import { useState, useRef, useEffect, lazy, Suspense } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { useGSAP } from '@gsap/react'
import { ArrowRight, Info } from 'lucide-react'
import Navbar from './components/Navbar'
import VideoScreen3D from './components/VideoScreen3D'
import CustomCursor from './components/CustomCursor'
import IntroScreen from './components/IntroScreen'
import { useLanguage } from './context/LanguageContext'
import type { ProjectDetail } from './components/ProjectInfoModal'

const ProjectInfoModal = lazy(() => import('./components/ProjectInfoModal'))
const AboutModal = lazy(() => import('./components/AboutModal'))

gsap.registerPlugin(ScrollTrigger, useGSAP)

const PROJECTS: ProjectDetail[] = [
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
    role: 'Creative Development & 3D Web Experience',
    description:
      'Eksplorasi landing page interaktif generasi baru untuk ekosistem Grab. Menghadirkan visualisasi 3D real-time yang dinamis untuk layanan transportasi, pesan-antar makanan, dan pembayaran digital dengan interaksi mikro yang responsif dan performa tinggi.',
    highlights: [
      'Visualisasi armada 3D interaktif real-time',
      'Micro-interactions & simulasi fisika spasial',
      'Optimasi rendering 60FPS fluid di semua layar',
      'Integrasi seamless ekosistem multi-layanan SuperApp',
    ],
    tags: ['React', 'TypeScript', 'Three.js', 'GSAP Motion', 'Tailwind CSS', 'WebGL Shaders'],
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
    role: '3D Web Developer & Technical Artist',
    description:
      'Pengalaman web interaktif 3D imersif yang menampilkan karakter animasi legendaris Pixar. Memanfaatkan rendering PBR (Physically Based Rendering), pencahayaan studio dinamis, dan kontrol kamera orbit bebas untuk menghidupkan animasi di browser.',
    highlights: [
      'Rendering material PBR fotorealistik',
      'Kontrol orbit & zoom kamera 360 derajat',
      'Pencahayaan studio dinamis & ambient occlusion',
      'Asset streaming terkompresi dengan performa instan',
    ],
    tags: ['Three.js', 'React Three Fiber', 'GLTF/GLB PBR', 'Custom Shaders', 'Vite', 'GSAP'],
  },
  {
    id: 'executive-portfolio',
    number: '03',
    title: 'Executive Portfolio',
    subtitle: 'Curated Design & Code',
    client: 'FarhanTZ Showcase',
    metric: 'Bento Grid & 3D Motion',
    year: '2026',
    color: '#8b5cf6',
    secondaryColor: '#ec4899',
    videoUrl: '/video/Portofolio_Video.mp4',
    exploreUrl: 'https://farhantz-five.vercel.app/',
    role: 'Fullstack UI/UX & Lead Frontend Engineer',
    description:
      'Showcase portofolio berstandar eksekutif dengan struktur Bento Grid modular yang modern. Menggabungkan tipografi kuat, animasi transisi sinematik, serta showcase proyek rekayasa perangkat lunak dan desain interaktif tingkat lanjut.',
    highlights: [
      'Arsitektur layout Bento Grid adaptif dan modular',
      'Estetika Velvet Dark Glassmorphism',
      'Integrasi live demo interaktif tanpa reload',
      'Skor Lighthouse performa & aksesibilitas 98+',
    ],
    tags: ['React', 'TypeScript', 'Bento Grid System', 'Framer Motion', 'Tailwind CSS', 'Vercel'],
  },
  {
    id: 'gameboy-design',
    number: '04',
    title: 'Gameboy Design',
    subtitle: 'Nostalgic Retro Interactive',
    client: 'Farhan Triputra Ramadhan',
    metric: 'Pixel Shader & Audio Synth',
    year: '2026',
    color: '#f59e0b',
    secondaryColor: '#ef4444',
    videoUrl: '/video/Gameboy_video.mp4',
    exploreUrl: 'https://portofolio-farhan-triputra-ramadhan.vercel.app/',
    role: 'Creative Developer & Sound Synthesist',
    description:
      'Eksplorasi retro gaming interaktif penghormatan bagi konsol Gameboy. Dilengkapi shader scanline layar CRT, simulator letupan efek audio sintetis 8-bit prosedural Web Audio API, dan tombol kontrol konsol fisik yang dapat dioperasikan langsung.',
    highlights: [
      'Generator efek suara retro 8-bit prosedural Web Audio API',
      'Shader filter visual garis pindai CRT autentik',
      'D-Pad & tombol kontrol fisik interaktif responsif',
      'Estetika pixel art nostalgia dengan sentuhan modern',
    ],
    tags: ['Retro Pixel Art', 'Web Audio API Synth', 'CRT Shaders', 'React', 'Canvas API'],
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
    role: '3D Web Graphics Engineer',
    description:
      'Aplikasi konfigurator kendaraan digital 3D berstandar otomotif mewah. Memungkinkan pengguna mengganti warna cat mobil berpartikel metalik, desain velg alloy, material interior serat karbon, dan pencahayaan studio secara real-time.',
    highlights: [
      'Simulasi pantulan cat mobil metalik multi-layer',
      'Tampilan 360 derajat interaktif beresolusi tinggi',
      'Latensi penggantian material instan tanpa jeda',
      'Shader refleksi kaca dan interior fotorealistik',
    ],
    tags: ['WebGL', 'PBR Material Shaders', 'Three.js', 'High-Poly Optimization', 'React'],
  },
]

export default function App() {
  const { t } = useLanguage()
  const [isIntroComplete, setIsIntroComplete] = useState(false)
  const [activeProjectIndex, setActiveProjectIndex] = useState(0)
  const [selectedInfoProject, setSelectedInfoProject] = useState<ProjectDetail | null>(null)
  const [isAboutOpen, setIsAboutOpen] = useState(false)
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

  // Detect cursor approaching specifically the floating indicator area on the right
  useEffect(() => {
    const handleGlobalMouseMove = (e: MouseEvent) => {
      const isNearIndicatorVertically = Math.abs(e.clientY - window.innerHeight / 2) < 240
      const isNearIndicatorHorizontally = window.innerWidth - e.clientX <= 110
      setIsNearRightEdge(isNearIndicatorVertically && isNearIndicatorHorizontally)
    }

    window.addEventListener('mousemove', handleGlobalMouseMove, { passive: true })
    return () => {
      window.removeEventListener('mousemove', handleGlobalMouseMove)
    }
  }, [])

  const isIndicatorHovered = isNearRightEdge || isHoveringIndicators || hoveredProjectIndex !== null
  const isIndicatorVisible = isScrolling || isIndicatorHovered

  // Ref untuk mengontrol pergerakan dinamis 3D layar saat kursor didekatkan
  const scrollProgressRef = useRef(0)

  // Dynamic 3D screen tilt & proximity animation loop (Optimized for 60-144 FPS)
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

    let mouseClientX = -9999
    let mouseClientY = -9999
    let cachedRect: DOMRect | null = null
    let lastRectTime = 0

    const updateCachedRect = () => {
      if (screenWrapperRef.current) {
        cachedRect = screenWrapperRef.current.getBoundingClientRect()
      }
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseClientX = e.clientX
      mouseClientY = e.clientY
    }

    const render = (now: number) => {
      if (!screenWrapperRef.current) {
        animationFrameId = requestAnimationFrame(render)
        return
      }

      // Update cached bounding rect at most once every 300ms or when missing
      if (!cachedRect || now - lastRectTime > 300) {
        cachedRect = screenWrapperRef.current.getBoundingClientRect()
        lastRectTime = now
      }

      if (cachedRect && mouseClientX > -9000) {
        const centerX = cachedRect.left + cachedRect.width / 2
        const centerY = cachedRect.top + cachedRect.height / 2

        const deltaX = mouseClientX - centerX
        const deltaY = mouseClientY - centerY
        const distance = Math.hypot(deltaX, deltaY)

        const proximityRadius = Math.max(cachedRect.width, cachedRect.height) * 1.1
        const isInside =
          mouseClientX >= cachedRect.left &&
          mouseClientX <= cachedRect.right &&
          mouseClientY >= cachedRect.top &&
          mouseClientY <= cachedRect.bottom

        if (distance < proximityRadius || isInside) {
          const proximity = isInside
            ? 1
            : Math.max(0, 1 - (distance - cachedRect.width / 2) / (proximityRadius - cachedRect.width / 2))
          const normalizedX = Math.max(-1.5, Math.min(1.5, deltaX / (cachedRect.width / 2)))
          const normalizedY = Math.max(-1.5, Math.min(1.5, deltaY / (cachedRect.height / 2)))

          targetMouseRotY = normalizedX * (isInside ? 16 : 12 * proximity)
          targetMouseRotX = -normalizedY * (isInside ? 14 : 10 * proximity)
          targetTransX = normalizedX * 22 * proximity
          targetTransY = normalizedY * 20 * proximity
          targetTransZ = isInside ? 50 : 25 * proximity
          targetScale = isInside ? 1.035 : 1 + 0.02 * proximity
        } else {
          targetMouseRotX = 0
          targetMouseRotY = 0
          targetTransX = 0
          targetTransY = 0
          targetTransZ = 0
          targetScale = 1
        }
      }

      const scrollProgress = scrollProgressRef.current
      const baseScrollRotY = -18 + scrollProgress * 8
      const baseScrollRotX = 3 + Math.sin(scrollProgress * Math.PI * 4) * 4

      const desiredRotY = baseScrollRotY + targetMouseRotY
      const desiredRotX = baseScrollRotX + targetMouseRotX

      // Smooth interpolation (lerp)
      currentRotY += (desiredRotY - currentRotY) * 0.08
      currentRotX += (desiredRotX - currentRotX) * 0.08
      currentTransX += (targetTransX - currentTransX) * 0.08
      currentTransY += (targetTransY - currentTransY) * 0.08
      currentTransZ += (targetTransZ - currentTransZ) * 0.08
      currentScale += (targetScale - currentScale) * 0.08

      screenWrapperRef.current.style.transform = `translate3d(${currentTransX.toFixed(2)}px, ${currentTransY.toFixed(2)}px, ${currentTransZ.toFixed(2)}px) rotateY(${currentRotY.toFixed(2)}deg) rotateX(${currentRotX.toFixed(2)}deg) scale(${currentScale.toFixed(4)})`

      animationFrameId = requestAnimationFrame(render)
    }

    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    window.addEventListener('resize', updateCachedRect, { passive: true })
    window.addEventListener('scroll', updateCachedRect, { passive: true })
    animationFrameId = requestAnimationFrame(render)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('resize', updateCachedRect)
      window.removeEventListener('scroll', updateCachedRect)
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
      <Navbar onOpenAbout={() => setIsAboutOpen(true)} />

      {/* Fluid Liquid Bubble Custom Cursor */}
      {isIntroComplete && (
        <CustomCursor
          color={currentProject.color}
          secondaryColor={currentProject.secondaryColor}
          hidden={isHoveringIndicators || hoveredProjectIndex !== null || selectedInfoProject !== null || isAboutOpen}
        />
      )}

      {/* FIXED PINNED 3D TILTED VIDEO SCREEN (Sisi Kanan Menetap - Layer Belakang Teks) */}
      <div className="fixed top-0 right-0 w-full h-screen pointer-events-none z-10 lg:z-20 flex items-center justify-center lg:justify-end px-4 sm:px-8 md:px-10 lg:px-14 overflow-hidden">
        <div className="w-full max-w-[1850px] mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center h-full">
          <div className="lg:col-span-5 hidden lg:block" />
          
          <div className="lg:col-span-7 flex items-center justify-center lg:justify-end relative perspective-[1800px] lg:-ml-28 pointer-events-auto">
            {/* Tilted Video Screen (Optimized Responsive Sizing) */}
            <div
              ref={screenWrapperRef}
              className="relative w-full aspect-[16/10] max-h-[65vh] sm:max-h-[75vh] min-h-[220px] sm:min-h-[340px] md:min-h-[440px] lg:min-h-[560px] xl:min-h-[640px] max-w-[92vw] sm:max-w-[85vw] md:max-w-[720px] lg:max-w-[1050px] xl:max-w-[1180px] rounded-2xl sm:rounded-3xl will-change-transform pointer-events-auto opacity-35 sm:opacity-50 md:opacity-75 lg:opacity-100 transition-opacity duration-500"
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

      {/* 5. Smooth Black Gradient Shadow on Right Side when Indicators are Visible */}
      <div
        className={`fixed top-0 right-0 h-full w-48 sm:w-72 md:w-96 lg:w-[440px] pointer-events-none z-30 bg-gradient-to-l from-black/85 via-black/40 to-transparent transition-opacity duration-500 ease-out ${
          isIndicatorVisible ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* FLOATING VERTICAL SCROLL PROGRESS INDICATORS WITH MINI VIDEO HOVER PREVIEWS */}
      <div
        onMouseEnter={() => setIsHoveringIndicators(true)}
        onMouseLeave={() => {
          setIsHoveringIndicators(false)
          setHoveredProjectIndex(null)
        }}
        className={`fixed right-2 sm:right-4 md:right-6 top-1/2 -translate-y-1/2 z-40 p-2 sm:p-4 flex flex-col space-y-3 sm:space-y-4 transition-all duration-500 cubic-bezier(0.16, 1, 0.3, 1) origin-right select-none ${
          isIndicatorHovered
            ? 'scale-105 sm:scale-115 opacity-100 translate-x-0 pointer-events-auto'
            : isIndicatorVisible
            ? 'scale-100 opacity-90 translate-x-0 pointer-events-auto'
            : 'scale-95 opacity-0 translate-x-8 pointer-events-none'
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
                className={`absolute right-full mr-3 sm:mr-5 pointer-events-none transition-all duration-300 cubic-bezier(0.16, 1, 0.3, 1) hidden sm:flex flex-col items-start origin-right gap-1.5 ${
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
                  className="w-48 sm:w-60 aspect-[16/10] rounded-xl overflow-hidden bg-black/90 border shadow-2xl relative"
                  style={{
                    boxShadow: `0 10px 30px -5px ${proj.color}55`,
                    borderColor: `${proj.color}90`,
                  }}
                >
                  {isHovered && (
                    <video
                      src={proj.videoUrl}
                      autoPlay
                      loop
                      muted
                      playsInline
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
              </div>

              {/* TOMBOL INDIKATOR SCROLL (Dot & Bar) */}
              <button
                onClick={() => scrollToSection(idx)}
                onMouseEnter={() => setHoveredProjectIndex(idx)}
                onMouseLeave={() => setHoveredProjectIndex(null)}
                className="group flex items-center space-x-2 sm:space-x-3.5 cursor-pointer py-1 sm:py-1.5 focus:outline-none"
                title={proj.title}
              >
                {/* Nomor Proyek */}
                <span
                  className={`text-[10px] sm:text-[11px] font-mono transition-all duration-300 ${
                    isActive || isHovered || isIndicatorHovered
                      ? 'text-white font-bold translate-x-0 opacity-100'
                      : 'text-slate-400 translate-x-1 opacity-0 group-hover:opacity-100 group-hover:translate-x-0'
                  }`}
                  style={{
                    color: isHovered ? proj.color : isActive ? '#ffffff' : undefined,
                  }}
                >
                  {proj.number}
                </span>

                {/* Dot / Bar Dinamis */}
                <span
                  className={`h-2 sm:h-2.5 rounded-full transition-all duration-300 ${
                    isActive
                      ? isIndicatorHovered
                        ? 'w-8 sm:w-10 bg-cyan-400 shadow-lg shadow-cyan-400/60'
                        : 'w-6 sm:w-8 bg-cyan-400 shadow-lg shadow-cyan-400/50'
                      : isHovered
                      ? 'w-5 sm:w-6 bg-white shadow-md shadow-white/40'
                      : isIndicatorHovered
                      ? 'w-3 sm:w-3.5 bg-white/40 group-hover:bg-white/70'
                      : 'w-1.5 sm:w-2 bg-white/30 group-hover:bg-white/70'
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
      <div className="relative z-30 w-full max-w-[1850px] mx-auto px-4 sm:px-8 md:px-12 lg:px-14 pointer-events-none">
        {PROJECTS.map((project, index) => {
          const projectSubtitle = t.projects[project.id]?.subtitle || project.subtitle

          return (
            <section
              key={project.id}
              ref={(el) => {
                sectionsRef.current[index] = el
              }}
              className="min-h-screen flex items-center relative py-20 sm:py-28 pointer-events-none"
            >
              <div className="w-full grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-center">
                {/* KOLOM KIRI: Title Gede, Subtitle & Tombol Explore (Berada di Layer Depan) */}
                <div className="lg:col-span-6 xl:col-span-6 flex flex-col justify-center space-y-4 sm:space-y-6 md:space-y-8 z-30 pointer-events-auto relative">
                  {/* Container Title & Subtitle */}
                  <div className="space-y-2 sm:space-y-3 relative z-30">
                    {/* Title Besar, Tebal, dan Megah di Depan Layar */}
                    <h2 className="project-title font-syne font-extrabold text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl tracking-tight text-white leading-[1.04] sm:leading-[0.95] select-none drop-shadow-[0_15px_35px_rgba(0,0,0,0.9)] max-w-full lg:max-w-3xl break-words">
                      {project.title}
                    </h2>

                    {/* Subtitle Ringkas (2-3 kata) di bawah Title */}
                    <p className="project-subtitle text-slate-300 font-outfit text-base sm:text-lg md:text-xl lg:text-2xl font-medium tracking-wide drop-shadow-md select-none">
                      {projectSubtitle}
                    </p>
                  </div>

                  {/* Tombol Explore & Info */}
                  <div className="explore-button flex flex-wrap items-center gap-2.5 sm:gap-4 pt-1 relative z-30">
                    {/* Tombol Explore */}
                    <a
                      href={project.exploreUrl || '#'}
                      target={project.exploreUrl ? '_blank' : undefined}
                      rel={project.exploreUrl ? 'noopener noreferrer' : undefined}
                      className="inline-flex items-center space-x-2 sm:space-x-2.5 px-5 sm:px-8 py-3 sm:py-4 rounded-2xl bg-white text-slate-950 font-syne font-extrabold text-xs sm:text-sm md:text-base tracking-tight hover:bg-slate-200 transition-all shadow-2xl shadow-white/20 active:scale-95 cursor-pointer group no-underline"
                    >
                      <span>{t.hero.explore}</span>
                      <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.8] group-hover:translate-x-1 transition-transform" />
                    </a>

                    {/* Tombol Info Project */}
                    <button
                      type="button"
                      onClick={() => setSelectedInfoProject(project)}
                      className="inline-flex items-center space-x-2 px-4 sm:px-7 py-3 sm:py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-syne font-bold text-xs sm:text-sm md:text-base tracking-tight border border-white/20 hover:border-white/40 transition-all backdrop-blur-md shadow-lg shadow-black/40 active:scale-95 cursor-pointer group"
                    >
                      <Info className="w-4 h-4 sm:w-4.5 sm:h-4.5 stroke-[2.5] text-cyan-400 group-hover:rotate-12 transition-transform" />
                      <span>{t.hero.info}</span>
                    </button>
                  </div>
                </div>

                {/* Empty placeholder on the right for spatial alignment with fixed 3D screen */}
                <div className="lg:col-span-6 hidden lg:block pointer-events-none" />
              </div>
            </section>
          )
        })}
      </div>

      {/* 6. Interactive Project Detail Info Modal (Lazy Loaded) */}
      {selectedInfoProject && (
        <Suspense fallback={null}>
          <ProjectInfoModal
            project={selectedInfoProject}
            onClose={() => setSelectedInfoProject(null)}
          />
        </Suspense>
      )}

      {/* 7. Interactive About CodebyCraft Modal (Lazy Loaded) */}
      {isAboutOpen && (
        <Suspense fallback={null}>
          <AboutModal
            isOpen={isAboutOpen}
            onClose={() => setIsAboutOpen(false)}
          />
        </Suspense>
      )}
    </div>
  )
}
