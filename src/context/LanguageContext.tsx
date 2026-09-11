import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'

export type Language = 'id' | 'en'

export interface ProjectTranslation {
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
  role: string
  description: string
  highlights: string[]
  tags: string[]
}

interface Translations {
  nav: {
    about: string
    haveProject: string
    notifications: string
    pauseMusic: string
    playMusic: string
  }
  hero: {
    explore: string
    info: string
  }
  aboutModal: {
    title: string
    manifestoP1Strong: string
    manifestoP1Text1: string
    manifestoP1Craft: string
    manifestoP1Text2: string
    manifestoP2Text1: string
    manifestoP2Text2: string
    workHistoryTitle: string
    workHistoryP1Strong: string
    workHistoryP1Date: string
    workHistoryP1Text1: string
    workHistoryP1Text2: string
    workHistoryP2: string
    coreTechTitle: string
    footerEsc: string
  }
  projectModal: {
    exploreLive: string
    technologiesUsed: string
    livePreview: string
    footerEsc: string
    pause: string
    play: string
    mute: string
    unmute: string
  }
  projects: Record<string, {
    subtitle: string
    role: string
    description: string
    highlights: string[]
  }>
}

const TRANSLATIONS: Record<Language, Translations> = {
  id: {
    nav: {
      about: 'About',
      haveProject: 'Have a project?',
      notifications: 'Notifikasi',
      pauseMusic: 'Jeda Musik Latar',
      playMusic: 'Putar Musik Latar (Royalty-Free Lofi)',
    },
    hero: {
      explore: 'Explore',
      info: 'Info',
    },
    aboutModal: {
      title: 'About',
      manifestoP1Strong: 'CodeByCraft',
      manifestoP1Text1: ' lahir dari sebuah keyakinan bahwa rekayasa perangkat lunak bukan sekadar pekerjaan merangkai logika komputer, melainkan sebuah seni kriya (',
      manifestoP1Craft: 'craftsmanship',
      manifestoP1Text2: ') yang menuntut presisi, efisiensi, dan kepekaan estetika tinggi. Berdiri di titik temu antara arsitektur sistem yang kokoh dan desain visual interaktif, CodeByCraft berfokus menghadirkan produk digital yang tidak hanya berfungsi secara teknis, tetapi juga memberikan pengalaman penggunaan yang mulus dan berkarakter. Setiap proyek didekati dengan standar disiplin ketat, menolak solusi instan yang rapuh demi menjaga skalabilitas jangka panjang, stabilitas performa, serta keterbacaan kode yang bersih.',
      manifestoP2Text1: 'Eksplorasi CodeByCraft membentang di berbagai domain teknologi modern, mulai dari rancang bangun antarmuka web 3D yang dinamis menggunakan ekosistem React Three Fiber dan WebGL, pengembangan aplikasi multiplatform berbasis Flutter dengan Clean Architecture yang terukur, hingga fondasi sistem backend yang tangguh menggunakan Go, Laravel, dan Python. Lebih dari sekadar membangun fungsionalitas konvensional, CodeByCraft terus mendorong batas eksplorasi kreatif melalui eksperimen visi komputer, integrasi kecerdasan buatan, hingga rekayasa logika interaktif pada platform sandbox.',
      manifestoP2Text2: 'Pada akhirnya, CodeByCraft adalah manifestasi dari dedikasi terhadap kode yang elegan, sistem yang andal, dan karya digital yang dirancang dengan integritas penuh dari baris pertama hingga tahap penyempurnaan akhir.',
      workHistoryTitle: 'Work History',
      workHistoryP1Strong: 'CodeByCraft',
      workHistoryP1Date: 'September 2026',
      workHistoryP1Text1: 'Saya menandai awal resmi perjalanan ini dengan mendirikan ',
      workHistoryP1Text2: ' pada September 2026. Berawal dari dorongan kuat untuk menjembatani arsitektur sistem yang kokoh dengan pengalaman visual interaktif, inisiatif ini langsung menetapkan visi utamanya: menghadirkan produk digital kelas atas di mana presisi rekayasa bertemu dengan desain yang hidup dan terarah.',
      workHistoryP2: 'Sejak hari pertama, fokus saya tertuju pada menciptakan pengalaman digital yang mulus dan tahan uji, menolak jalan pintas demi menjaga skalabilitas jangka panjang dan stabilitas performa tanpa kompromi. Saat ini, saya memimpin CodeByCraft sebagai inisiatif mandiri, secara aktif merancang pengalaman web interaktif yang imersif, produk multiplatform yang modular, serta fondasi sistem andal yang dirancang untuk tumbuh secara presisi.',
      coreTechTitle: 'Core Technologies & Domains',
      footerEsc: 'Tekan ESC atau klik ✕ untuk kembali',
    },
    projectModal: {
      exploreLive: 'Explore Live Project',
      technologiesUsed: 'Technologies Used',
      livePreview: 'LIVE PREVIEW',
      footerEsc: 'Tekan ESC atau klik ✕ untuk kembali',
      pause: 'Jeda Video',
      play: 'Putar Video',
      mute: 'Matikan Suara',
      unmute: 'Nyalakan Suara',
    },
    projects: {
      'grab-interactive': {
        subtitle: 'Platform SuperApp Interaktif',
        role: 'Creative Development & Pengalaman Web 3D',
        description:
          'Eksplorasi landing page interaktif generasi baru untuk ekosistem Grab. Menghadirkan visualisasi 3D real-time yang dinamis untuk layanan transportasi, pesan-antar makanan, dan pembayaran digital dengan interaksi mikro yang responsif dan performa tinggi.',
        highlights: [
          'Visualisasi armada 3D interaktif real-time',
          'Micro-interactions & simulasi fisika spasial',
          'Optimasi rendering 60FPS fluid di semua layar',
          'Integrasi seamless ekosistem multi-layanan SuperApp',
        ],
      },
      'pixar-characters': {
        subtitle: 'Alam Semesta 3D Interaktif',
        role: '3D Web Developer & Technical Artist',
        description:
          'Pengalaman web interaktif 3D imersif yang menampilkan karakter animasi legendaris Pixar. Memanfaatkan rendering PBR (Physically Based Rendering), pencahayaan studio dinamis, dan kontrol kamera orbit bebas untuk menghidupkan animasi di browser.',
        highlights: [
          'Rendering material PBR fotorealistik',
          'Kontrol orbit & zoom kamera 360 derajat',
          'Pencahayaan studio dinamis & ambient occlusion',
          'Asset streaming terkompresi dengan performa instan',
        ],
      },
      'executive-portfolio': {
        subtitle: 'Kurasi Desain & Kode',
        role: 'Fullstack UI/UX & Lead Frontend Engineer',
        description:
          'Showcase portofolio berstandar eksekutif dengan struktur Bento Grid modular yang modern. Menggabungkan tipografi kuat, animasi transisi sinematik, serta showcase proyek rekayasa perangkat lunak dan desain interaktif tingkat lanjut.',
        highlights: [
          'Arsitektur layout Bento Grid adaptif dan modular',
          'Estetika Velvet Dark Glassmorphism',
          'Integrasi live demo interaktif tanpa reload',
          'Skor Lighthouse performa & aksesibilitas 98+',
        ],
      },
      'gameboy-design': {
        subtitle: 'Retro Interaktif Nostalgia',
        role: 'Creative Developer & Sound Synthesist',
        description:
          'Eksplorasi retro gaming interaktif penghormatan bagi konsol Gameboy. Dilengkapi shader scanline layar CRT, simulator letupan efek audio sintetis 8-bit prosedural Web Audio API, dan tombol kontrol konsol fisik yang dapat dioperasikan langsung.',
        highlights: [
          'Generator efek suara retro 8-bit prosedural Web Audio API',
          'Shader filter visual garis pindai CRT autentik',
          'D-Pad & tombol kontrol fisik interaktif responsif',
          'Estetika pixel art nostalgia dengan sentuhan modern',
        ],
      },
      'veloce-motors': {
        subtitle: 'Konfigurator 3D Mewah',
        role: '3D Web Graphics Engineer',
        description:
          'Aplikasi konfigurator kendaraan digital 3D berstandar otomotif mewah. Memungkinkan pengguna mengganti warna cat mobil berpartikel metalik, desain velg alloy, material interior serat karbon, dan pencahayaan studio secara real-time.',
        highlights: [
          'Simulasi pantulan cat mobil metalik multi-layer',
          'Tampilan 360 derajat interaktif beresolusi tinggi',
          'Latensi penggantian material instan tanpa jeda',
          'Shader refleksi kaca dan interior fotorealistik',
        ],
      },
    },
  },
  en: {
    nav: {
      about: 'About',
      haveProject: 'Have a project?',
      notifications: 'Notifications',
      pauseMusic: 'Pause Background Music',
      playMusic: 'Play Background Music (Royalty-Free Lofi)',
    },
    hero: {
      explore: 'Explore',
      info: 'Info',
    },
    aboutModal: {
      title: 'About',
      manifestoP1Strong: 'CodeByCraft',
      manifestoP1Text1: ' was born from the conviction that software engineering is not merely stringing together computer logic, but an art of true ',
      manifestoP1Craft: 'craftsmanship',
      manifestoP1Text2: ' demanding uncompromising precision, efficiency, and high aesthetic sensibility. Standing at the intersection of robust system architecture and interactive visual design, CodeByCraft crafts digital products that not only excel technically, but deliver seamless, characterful experiences. Every initiative adheres to rigorous discipline, rejecting fragile shortcuts to ensure long-term scalability, rock-solid stability, and pristine clean code.',
      manifestoP2Text1: 'CodeByCraft’s exploration spans cutting-edge technology domains: from dynamic 3D web interfaces powered by React Three Fiber and WebGL shaders, to scalable cross-platform apps built on Flutter with Clean Architecture, and resilient backend foundations powered by Go, Laravel, and Python. Beyond conventional functionality, CodeByCraft continually pushes creative boundaries through computer vision experiments, AI integration, and interactive sandbox engineering.',
      manifestoP2Text2: 'Ultimately, CodeByCraft is a manifestation of pure dedication to elegant code, reliable architectures, and digital craftsmanship built with integrity from the very first line to the final polish.',
      workHistoryTitle: 'Work History',
      workHistoryP1Strong: 'CodeByCraft',
      workHistoryP1Date: 'September 2026',
      workHistoryP1Text1: 'I marked the official beginning of this journey by founding ',
      workHistoryP1Text2: ' in September 2026. Driven by a passion to bridge resilient system architecture with immersive interactive visuals, this initiative set its core vision: delivering premium digital products where engineering precision meets purposeful, vivid design.',
      workHistoryP2: 'From day one, my focus has been dedicated to crafting seamless, future-proof digital experiences—rejecting shortcuts to maintain long-term scalability and uncompromised performance. Today, I lead CodeByCraft as an independent studio, actively designing immersive web experiences, modular multiplatform products, and robust system foundations engineered for precision growth.',
      coreTechTitle: 'Core Technologies & Domains',
      footerEsc: 'Press ESC or click ✕ to return',
    },
    projectModal: {
      exploreLive: 'Explore Live Project',
      technologiesUsed: 'Technologies Used',
      livePreview: 'LIVE PREVIEW',
      footerEsc: 'Press ESC or click ✕ to return',
      pause: 'Pause Video',
      play: 'Play Video',
      mute: 'Mute Audio',
      unmute: 'Unmute Audio',
    },
    projects: {
      'grab-interactive': {
        subtitle: 'Everyday SuperApp Platform',
        role: 'Creative Development & 3D Web Experience',
        description:
          'Next-generation interactive landing page exploration for the Grab ecosystem. Featuring dynamic real-time 3D visualizations for ride-hailing, food delivery, and digital payments with high-performance micro-interactions.',
        highlights: [
          'Real-time interactive 3D fleet visualization',
          'Micro-interactions & spatial physics simulations',
          'Optimized 60FPS fluid rendering across all devices',
          'Seamless integration of multi-service SuperApp ecosystem',
        ],
      },
      'pixar-characters': {
        subtitle: 'Interactive 3D Universe',
        role: '3D Web Developer & Technical Artist',
        description:
          'An immersive 3D interactive web experience showcasing Pixar’s legendary characters. Utilizing PBR (Physically Based Rendering), dynamic studio lighting, and free orbit camera controls to bring animations to life directly in the browser.',
        highlights: [
          'Photorealistic PBR material rendering',
          '360-degree interactive camera orbit and zoom controls',
          'Dynamic studio lighting & ambient occlusion',
          'Compressed asset streaming with instant performance',
        ],
      },
      'executive-portfolio': {
        subtitle: 'Curated Design & Code',
        role: 'Fullstack UI/UX & Lead Frontend Engineer',
        description:
          'Executive-standard portfolio showcase built with a modern modular Bento Grid structure. Combining bold typography, cinematic motion transitions, and cutting-edge software engineering & design case studies.',
        highlights: [
          'Adaptive and modular Bento Grid layout architecture',
          'Velvet Dark Glassmorphism aesthetic',
          'Seamless interactive live demo integration without page reloads',
          'Lighthouse 98+ performance and accessibility score',
        ],
      },
      'gameboy-design': {
        subtitle: 'Nostalgic Retro Interactive',
        role: 'Creative Developer & Sound Synthesist',
        description:
          'An interactive nostalgic retro gaming tribute to the Game Boy console. Features CRT scanline shaders, Web Audio API 8-bit procedural synth sound generator, and fully responsive tactile gamepad controls.',
        highlights: [
          'Web Audio API procedural 8-bit synth sound generator',
          'Authentic CRT monitor scanline visual shader filter',
          'Interactive, responsive tactile D-Pad & control buttons',
          'Nostalgic pixel-art aesthetic engineered with modern web tech',
        ],
      },
      'veloce-motors': {
        subtitle: 'Luxury 3D Configurator',
        role: '3D Web Graphics Engineer',
        description:
          'Luxury 3D digital vehicle configurator tailored for high-end automotive brands. Allows users to customize metallic paint flakes, alloy wheels, carbon fiber interior materials, and studio lighting in real-time.',
        highlights: [
          'Multi-layer metallic car paint reflection simulation',
          'High-resolution 360-degree interactive viewing',
          'Zero-latency instant material swapping',
          'Photorealistic glass reflection and interior shaders',
        ],
      },
    },
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  toggleLanguage: () => void
  t: Translations
}

const LanguageContext = createContext<LanguageContextType | null>(null)

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('codebycraft_lang') as Language
      if (saved === 'id' || saved === 'en') return saved
    }
    return 'en'
  })

  const setLanguage = (lang: Language) => {
    setLanguageState(lang)
    if (typeof window !== 'undefined') {
      localStorage.setItem('codebycraft_lang', lang)
    }
  }

  const toggleLanguage = () => {
    setLanguage(language === 'id' ? 'en' : 'id')
  }

  useEffect(() => {
    document.documentElement.lang = language
  }, [language])

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        toggleLanguage,
        t: TRANSLATIONS[language],
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
