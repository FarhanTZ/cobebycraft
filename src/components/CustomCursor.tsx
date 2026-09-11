import { useEffect, useRef } from 'react'

interface CustomCursorProps {
  color?: string
  secondaryColor?: string
}

interface SmokeParticle {
  x: number
  y: number
  vx: number
  vy: number
  radius: number
  maxRadius: number
  alpha: number
  life: number
  maxLife: number
  rotation: number
  rotationSpeed: number
  color: string
  secondaryColor: string
}

export default function CustomCursor({
  color = '#38bdf8',
  secondaryColor = '#818cf8',
}: CustomCursorProps) {
  const cursorBubbleRef = useRef<HTMLDivElement>(null!)
  const cursorGlowRef = useRef<HTMLDivElement>(null!)
  const canvasRef = useRef<HTMLCanvasElement>(null!)

  // Ref untuk warna agar tidak mereset posisi mouse saat ganti project/scroll
  const colorRef = useRef(color)
  const secondaryColorRef = useRef(secondaryColor)

  useEffect(() => {
    colorRef.current = color
    secondaryColorRef.current = secondaryColor
  }, [color, secondaryColor])

  useEffect(() => {
    const bubble = cursorBubbleRef.current
    const glow = cursorGlowRef.current
    const canvas = canvasRef.current

    if (!bubble || !glow || !canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas dimensions
    const resizeCanvas = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resizeCanvas()
    window.addEventListener('resize', resizeCanvas)

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

    // Pool partikel gumpalan asap tebal (Smoke Puffs)
    const particles: SmokeParticle[] = []
    let animationFrameId: number

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX
      mouseY = e.clientY

      const deltaX = mouseX - prevX
      const deltaY = mouseY - prevY
      const speed = Math.hypot(deltaX, deltaY)

      // Emisi partikel gumpalan asap mengepul saat mouse bergerak
      if (speed > 1.5 && particles.length < 65) {
        const count = Math.min(Math.floor(speed / 6) + 1, 4)
        for (let i = 0; i < count; i++) {
          const spreadAngle = Math.random() * Math.PI * 2
          const spreadDist = Math.random() * 16
          particles.push({
            x: mouseX + Math.cos(spreadAngle) * spreadDist,
            y: mouseY + Math.sin(spreadAngle) * spreadDist,
            vx: (Math.random() - 0.5) * 1.8 - (deltaX * 0.08),
            vy: (Math.random() - 0.5) * 1.8 - (deltaY * 0.08) - (0.4 + Math.random() * 0.6),
            radius: 25 + Math.random() * 20,
            maxRadius: 75 + Math.random() * 65,
            alpha: 0.45 + Math.random() * 0.25,
            life: 0,
            maxLife: 45 + Math.random() * 30,
            rotation: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.04,
            color: colorRef.current,
            secondaryColor: secondaryColorRef.current,
          })
        }
      }
    }

    // Render loop 120FPS real-time
    const updateCursor = () => {
      // 1. Update kursor utama & kecepatan
      const deltaX = mouseX - prevX
      const deltaY = mouseY - prevY
      const speed = Math.hypot(deltaX, deltaY)

      if (speed > 0.5) {
        angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI
        const targetStretch = 1 + Math.min(speed / 30, 0.6)
        const targetSqueeze = 1 - Math.min(speed / 65, 0.3)
        scaleX += (targetStretch - scaleX) * 0.4
        scaleY += (targetSqueeze - scaleY) * 0.4
      } else {
        scaleX += (1 - scaleX) * 0.25
        scaleY += (1 - scaleY) * 0.25
      }

      prevX = mouseX
      prevY = mouseY

      glowX += (mouseX - glowX) * 0.18
      glowY += (mouseY - glowY) * 0.18

      bubble.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0) translate(-50%, -50%) rotate(${angle}deg) scale(${scaleX * hoverScale}, ${scaleY * hoverScale})`
      glow.style.transform = `translate3d(${glowX}px, ${glowY}px, 0) translate(-50%, -50%)`

      // 2. Render simulasi asap dinamis pada Canvas
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'screen'

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.life++
        p.x += p.vx
        p.y += p.vy
        p.rotation += p.rotationSpeed
        p.vx *= 0.96
        p.vy *= 0.96

        const progress = p.life / p.maxLife
        const currentRadius = p.radius + (p.maxRadius - p.radius) * Math.pow(progress, 0.6)
        const currentAlpha = p.alpha * Math.pow(1 - progress, 1.4)

        if (progress >= 1 || currentAlpha <= 0.005) {
          particles.splice(i, 1)
          continue
        }

        // Gambar Gumpalan Asap Volumetrik Gradasi Halus
        const gradient = ctx.createRadialGradient(
          p.x,
          p.y,
          0,
          p.x,
          p.y,
          Math.max(currentRadius, 1)
        )
        gradient.addColorStop(0, `rgba(255, 255, 255, ${currentAlpha * 0.75})`)
        gradient.addColorStop(0.25, `${p.color}${Math.floor(currentAlpha * 220).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(0.65, `${p.secondaryColor}${Math.floor(currentAlpha * 140).toString(16).padStart(2, '0')}`)
        gradient.addColorStop(1, 'transparent')

        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rotation)
        ctx.translate(-p.x, -p.y)

        ctx.beginPath()
        ctx.arc(p.x, p.y, Math.max(currentRadius, 1), 0, Math.PI * 2)
        ctx.fillStyle = gradient
        ctx.fill()

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(updateCursor)
    }

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement
      const isInteractive = target.closest(
        'button, a, input, [role="button"], .cursor-pointer, video'
      )

      if (isInteractive) {
        hoverScale = 1.6
        bubble.style.borderColor = 'rgba(255, 255, 255, 0.9)'
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.15)'
      } else {
        hoverScale = 1
        bubble.style.borderColor = 'rgba(255, 255, 255, 0.4)'
        bubble.style.backgroundColor = 'rgba(255, 255, 255, 0.06)'
      }
    }

    window.addEventListener('mousemove', onMouseMove, { passive: true })
    window.addEventListener('mouseover', handleMouseOver, { passive: true })
    animationFrameId = requestAnimationFrame(updateCursor)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseover', handleMouseOver)
      cancelAnimationFrame(animationFrameId)
    }
  }, []) // Dependency array kosong agar posisi kursor tidak ter-reset saat scroll

  return (
    <div className="hidden md:block pointer-events-none fixed inset-0 z-[9999] overflow-hidden">
      {/* Canvas Jejak Asap / Volumetric Smoke Trail */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none z-0"
      />

      {/* 1. Fluid Ambient Glow Halo */}
      <div
        ref={cursorGlowRef}
        className="fixed top-0 left-0 w-48 h-48 rounded-full blur-3xl opacity-35 transition-colors duration-700 pointer-events-none will-change-transform z-10"
        style={{
          background: `radial-gradient(circle, ${color} 0%, ${secondaryColor} 60%, transparent 80%)`,
          transformOrigin: 'center center',
        }}
      />

      {/* 2. Zero-Latency Liquid Elastic Bubble (Pusat Kursor) */}
      <div
        ref={cursorBubbleRef}
        className="fixed top-0 left-0 w-12 h-12 rounded-full border border-white/45 bg-white/[0.07] backdrop-blur-[4px] shadow-[0_0_30px_rgba(255,255,255,0.2),inset_0_0_12px_rgba(255,255,255,0.15)] pointer-events-none will-change-transform transition-[border-color,background-color] duration-200 z-20"
        style={{
          transformOrigin: 'center center',
        }}
      />
    </div>
  )
}
