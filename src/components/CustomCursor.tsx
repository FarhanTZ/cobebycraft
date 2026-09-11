import { useEffect, useRef } from 'react'

interface CustomCursorProps {
  color?: string
}

export default function CustomCursor({ color = '#38bdf8' }: CustomCursorProps) {
  const cursorBubbleRef = useRef<HTMLDivElement>(null!)
  const cursorGlowRef = useRef<HTMLDivElement>(null!)

  useEffect(() => {
    const bubble = cursorBubbleRef.current
    const glow = cursorGlowRef.current

    if (!bubble || !glow) return

    // Posisi target langsung dari mouse (0 delay)
    let mouseX = window.innerWidth / 2
    let mouseY = window.innerHeight / 2
    let prevX = mouseX
    let prevY = mouseY

    // Posisi glow luar dengan lerp halus
    let glowX = mouseX
    let glowY = mouseY

    // Variabel deformasi elastis cairan
    let scaleX = 1
    let scaleY = 1
    let angle = 0
    let hoverScale = 1

    let animationFrameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY
    }

    // Render loop 120FPS real-time (Zero Latency & 100% Center Origin)
    const updateCursor = () => {
      // Hitung kecepatan instan
      const deltaX = mouseX - prevX
      const deltaY = mouseY - prevY
      const speed = Math.hypot(deltaX, deltaY)

      if (speed > 0.5) {
        angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
        // Peregangan dinamis cairan saat gerak
        const targetStretch = 1 + Math.min(speed / 40, 0.5)
        const targetSqueeze = 1 - Math.min(speed / 80, 0.25)
        scaleX += (targetStretch - scaleX) * 0.4
        scaleY += (targetSqueeze - scaleY) * 0.4
      } else {
        // Kembali bulat saat berhenti (Spring back)
        scaleX += (1 - scaleX) * 0.25
        scaleY += (1 - scaleY) * 0.25
      }

      prevX = mouseX
      prevY = mouseY

      // Glow luar mengikuti dengan sedikit trailing lembut
      glowX += (mouseX - glowX) * 0.15
      glowY += (mouseY - glowY) * 0.15

      // Posisi 100% Pas di Pusat Kursor Mouse
      bubble.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX * hoverScale}, ${scaleY * hoverScale})`
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    // Interaksi saat kursor melayang di atas elemen interaktif
    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest(
        'button, a, input, [role="button"], .cursor-pointer, video'
      )

      if (isInteractive) {
        hoverScale = 1.55
        bubble.style.borderColor = 'rgba(255, 255, 255, 0.85)'
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.12)'
      } else {
        hoverScale = 1
        bubble.style.borderColor = 'rgba(255, 255, 255, 0.35)'
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.05)'
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* 1. Fluid Ambient Glow Halo */}
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 w-32 h-32 rounded-full blur-2xl opacity-25 transition-colors duration-700 pointer-events-none will-change-transform"
        style={{
          background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
          transformOrigin: 'center center',
        }}
      />

      {/* 2. Zero-Latency Liquid Elastic Bubble (100% Pas di Tengah) */}
      <div
        ref={cursorBubbleRef}
        className="fixed top-0 left-0 w-10 h-10 rounded-full border border-white/40 bg-white/[0.05] backdrop-blur-[3px] shadow-[0_0_20px_rgba(255,255,255,0.15),inset_0_0_10px_rgba(255,255,255,0.12)] pointer-events-none will-change-transform transition-[border-color,background-color] duration-200"
        style={{
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}
