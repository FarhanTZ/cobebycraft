import { useState, useRef, useEffect } from 'react'
import { Bell, Music, ArrowUpRight, Menu, X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext'

interface NavbarProps {
  onOpenAbout?: () => void
}

export default function Navbar({ onOpenAbout }: NavbarProps) {
  const { language, toggleLanguage, t } = useLanguage()
  const [isPlayingMusic, setIsPlayingMusic] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
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

  const handleMobileAboutClick = () => {
    setIsMobileMenuOpen(false)
    if (onOpenAbout) {
      onOpenAbout()
    }
  }

  return (
    <>
      <header className="fixed top-1 sm:top-3 md:top-5 left-0 right-0 w-full z-50 bg-transparent transition-all">
        <div className="w-full flex items-center justify-between px-4 sm:px-8 md:px-12 lg:px-14 py-2.5 sm:py-4 md:py-5">
          {/* Title Brand - Samping Paling Kiri */}
          <div className="flex items-center">
            <button
              type="button"
              onClick={onOpenAbout}
              className="font-syne font-bold text-lg sm:text-xl md:text-2xl tracking-tight text-white select-none hover:text-cyan-400 transition-colors cursor-pointer drop-shadow-sm focus:outline-none"
            >
              CodebyCraft
            </button>
          </div>

          {/* DESKTOP & TABLET MENU ITEMS (Tampil di Layar md: ke atas) */}
          <div className="hidden md:flex items-center space-x-3 sm:space-x-5 lg:space-x-6 text-xs sm:text-sm font-semibold">
            {/* Lonceng Icon (Notification) */}
            <button
              type="button"
              className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer group"
              title={t.nav.notifications}
            >
              <Bell className="w-4.5 h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
            </button>

            {/* Language Switcher Pill (ID | EN) */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/[0.06] hover:bg-white/15 border border-white/15 text-xs font-mono font-bold tracking-wider transition-all cursor-pointer active:scale-95 text-slate-300 hover:text-white shadow-sm"
              title={language === 'id' ? 'Switch to English' : 'Ganti ke Bahasa Indonesia'}
            >
              <span className={language === 'id' ? 'text-cyan-400 font-black' : 'text-slate-400 opacity-60'}>ID</span>
              <span className="text-slate-600 text-[10px]">/</span>
              <span className={language === 'en' ? 'text-cyan-400 font-black' : 'text-slate-400 opacity-60'}>EN</span>
            </button>

            {/* About Link */}
            <button
              type="button"
              onClick={onOpenAbout}
              className="text-slate-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all text-xs sm:text-[13px] font-semibold tracking-normal cursor-pointer active:scale-95"
            >
              {t.nav.about}
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
              title={isPlayingMusic ? t.nav.pauseMusic : t.nav.playMusic}
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

            {/* Have a project? Link */}
            <a
              href="https://www.instagram.com/codebycraft/"
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 sm:ml-2 inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-transparent text-white border border-white/60 hover:border-white hover:bg-white/10 font-syne font-bold text-xs sm:text-[13px] tracking-tight transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer group no-underline"
            >
              <span>{t.nav.haveProject}</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </a>
          </div>

          {/* MOBILE MENU CONTROLS (Tampil di Layar HP < 768px) */}
          <div className="flex md:hidden items-center space-x-2">
            {/* Language Switcher Pill di HP */}
            <button
              type="button"
              onClick={toggleLanguage}
              className="flex items-center space-x-1 px-2.5 py-1 rounded-full bg-white/[0.08] active:bg-white/20 border border-white/15 text-[11px] font-mono font-bold tracking-wider text-slate-200 shadow-sm"
              title="Switch Language"
            >
              <span className={language === 'id' ? 'text-cyan-400 font-black' : 'text-slate-400 opacity-60'}>ID</span>
              <span className="text-slate-600 text-[9px]">/</span>
              <span className={language === 'en' ? 'text-cyan-400 font-black' : 'text-slate-400 opacity-60'}>EN</span>
            </button>

            {/* Music Button di HP */}
            <button
              type="button"
              onClick={toggleMusic}
              className={`p-2 rounded-full border transition-all ${
                isPlayingMusic
                  ? 'bg-cyan-500/20 text-cyan-300 border-cyan-400/50 shadow-[0_0_12px_rgba(56,189,248,0.4)]'
                  : 'bg-white/[0.08] text-slate-200 border-white/15 active:bg-white/20'
              }`}
              title={isPlayingMusic ? t.nav.pauseMusic : t.nav.playMusic}
            >
              {isPlayingMusic ? (
                <div className="flex items-end space-x-0.5 h-3.5 w-3.5 justify-center py-0.5">
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.8s_ease-in-out_infinite] h-full" />
                  <span className="w-0.5 bg-cyan-300 rounded-full animate-[bounce_1.1s_ease-in-out_infinite] h-3/4" />
                  <span className="w-0.5 bg-cyan-400 rounded-full animate-[bounce_0.7s_ease-in-out_infinite] h-full" />
                </div>
              ) : (
                <Music className="w-4 h-4 stroke-[2] text-cyan-400" />
              )}
            </button>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-full bg-white/[0.08] active:bg-white/20 border border-white/15 text-white transition-all shadow-sm flex items-center justify-center"
              aria-label="Toggle navigation menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-4.5 h-4.5 stroke-[2.5] text-cyan-400" />
              ) : (
                <Menu className="w-4.5 h-4.5 stroke-[2.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* MOBILE DROPDOWN DRAWER MODAL */}
      {isMobileMenuOpen && (
        <div
          onClick={() => setIsMobileMenuOpen(false)}
          className="fixed inset-0 z-40 bg-black/75 backdrop-blur-xl md:hidden flex flex-col justify-start pt-20 px-5 animate-in fade-in duration-200"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="w-full bg-[#0a0d18]/95 border border-white/15 rounded-3xl p-6 shadow-2xl space-y-4 backdrop-blur-2xl"
          >
            {/* About Button in Mobile Drawer */}
            <button
              type="button"
              onClick={handleMobileAboutClick}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-white/[0.06] active:bg-white/15 border border-white/10 text-white font-syne font-bold text-base transition-all"
            >
              <span>{t.nav.about} CodebyCraft</span>
              <span className="text-cyan-400 text-xs font-mono">→</span>
            </button>

            {/* Have a project? Direct Instagram Link Button */}
            <a
              href="https://www.instagram.com/codebycraft/"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gradient-to-r from-cyan-500/20 via-sky-500/20 to-purple-500/20 active:opacity-90 border border-cyan-400/30 text-white font-syne font-bold text-base transition-all shadow-lg"
            >
              <div className="flex items-center space-x-2.5">
                <svg className="w-5 h-5 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                  <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                  <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                </svg>
                <span>{t.nav.haveProject}</span>
              </div>
              <ArrowUpRight className="w-4.5 h-4.5 text-cyan-400 stroke-[2.5]" />
            </a>

            {/* Instagram Profile Footer in Drawer */}
            <div className="pt-2 text-center text-xs font-mono text-slate-400">
              Direct Inquiries: <a href="https://www.instagram.com/codebycraft/" target="_blank" rel="noopener noreferrer" className="text-cyan-400 underline">@codebycraft</a>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
