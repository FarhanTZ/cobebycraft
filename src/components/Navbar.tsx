import { Bell, Music, ArrowUpRight } from 'lucide-react'

export default function Navbar() {
  return (
    <header className="fixed top-0 left-0 right-0 w-full z-50 bg-transparent">
      <div className="w-full flex items-center justify-between px-6 sm:px-10 md:px-12 py-5 sm:py-6">
        {/* Title Brand - Samping Paling Kiri */}
        <div className="flex items-center">
          <span className="font-syne font-bold text-lg sm:text-xl tracking-tight text-white select-none hover:text-slate-300 transition-colors cursor-pointer">
            CodebyCraft
          </span>
        </div>

        {/* Right Menu Items - Samping Paling Kanan */}
        <div className="flex items-center space-x-3 sm:space-x-5 text-xs sm:text-sm font-semibold">
          {/* Lonceng Icon (Notification) */}
          <button
            type="button"
            className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer relative group"
            title="Notifications"
          >
            <Bell className="w-4 h-4 stroke-[2] group-hover:scale-110 transition-transform" />
            <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-cyan-400 ring-2 ring-[#07080d]" />
          </button>

          {/* About Link */}
          <button
            type="button"
            className="text-slate-300 hover:text-white px-2 py-1 transition-colors text-xs sm:text-[13px] font-semibold tracking-normal"
          >
            About
          </button>

          {/* Music Icon */}
          <button
            type="button"
            className="p-2 text-slate-300 hover:text-white transition-colors cursor-pointer group"
            title="Music"
          >
            <Music className="w-4 h-4 stroke-[2] group-hover:scale-110 transition-transform text-cyan-400" />
          </button>

          {/* Have a project? Button */}
          <button
            type="button"
            className="inline-flex items-center space-x-1 px-3.5 py-2 rounded-full bg-white text-slate-950 font-bold text-xs tracking-tight hover:bg-slate-200 transition-all shadow-sm active:scale-95"
          >
            <span>Have a project?</span>
            <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </button>
        </div>
      </div>
    </header>
  )
}
