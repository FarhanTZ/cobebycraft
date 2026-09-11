import { Bell, Music, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-2 sm:top-4 md:top-5 left-0 right-0 w-full z-50 bg-transparent transition-all">
      <div className="w-full flex items-center justify-between px-6 sm:px-10 md:px-14 py-4 sm:py-5">
        {/* Title Brand - Samping Paling Kiri (Dikecilkan Dikit) */}
        <div className="flex items-center">
          <span className="font-syne font-bold text-xl sm:text-2xl tracking-tight text-white select-none hover:text-cyan-400 transition-colors cursor-pointer drop-shadow-sm">
            CodebyCraft
          </span>
        </div>

        {/* Right Menu Items - Samping Paling Kanan */}
        <div className="flex items-center space-x-4 sm:space-x-6 md:space-x-7 text-xs sm:text-sm font-semibold">
          {/* Lonceng Icon (Notification - Tanpa Titik Biru) */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer group"
            title="Notifications"
          >
            <Bell className="w-4.5 h-4.5 stroke-[2] group-hover:scale-110 transition-transform" />
          </button>

          {/* About Link */}
          <button
            type="button"
            className="text-slate-200 hover:text-white px-2.5 py-1 rounded-lg hover:bg-white/10 transition-all text-xs sm:text-[13px] font-semibold tracking-normal cursor-pointer"
          >
            About
          </button>

          {/* Music Icon */}
          <button
            type="button"
            className="p-2 rounded-full hover:bg-white/10 text-slate-200 hover:text-white transition-all cursor-pointer group"
            title="Music"
          >
            <Music className="w-4.5 h-4.5 stroke-[2] group-hover:scale-110 transition-transform text-cyan-400" />
          </button>

          {/* Have a project? Button (Diberi Jarak Ekstra & Transparan dengan Garis Tepi Putih) */}
          <button
            type="button"
            className="ml-2 sm:ml-3 inline-flex items-center space-x-1.5 px-4 sm:px-5 py-2 sm:py-2.5 rounded-full bg-transparent text-white border border-white/60 hover:border-white hover:bg-white/10 font-syne font-bold text-xs sm:text-[13px] tracking-tight transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 cursor-pointer group"
          >
            <span>Have a project?</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-white group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </header>
  )
}
