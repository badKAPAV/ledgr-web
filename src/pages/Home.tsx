import { motion } from "framer-motion"
import { CloudSlash, FolderOpen, ArrowRight, GithubLogo, BellRinging, PencilSimple } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { cn } from "../lib/utils"

import logo from "../assets/ledgr_logo.png"
import mockup1 from "../assets/mobile screenshots/1.png"
import mockup2 from "../assets/mobile screenshots/2.png"


const TYPING_WORDS = ["Money", "Business", "Budget"]

export function Home() {
  const [currentWordIndex, setCurrentWordIndex] = useState(0)

  useEffect(() => {
    document.title = "Ledgr — Privacy-First Offline Expense Tracker"
    const interval = setInterval(() => {
      setCurrentWordIndex((prev) => (prev + 1) % TYPING_WORDS.length)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-20 pb-16 md:pt-36 md:pb-32 overflow-hidden">
        {/* Abstract Background Elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/20 rounded-full blur-[120px] -z-10 opacity-50" />
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
            className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tighter text-white mb-6 leading-tight"
          >
            Your <span className="text-primary inline-block min-w-[150px] sm:min-w-[200px] text-left">
              {TYPING_WORDS.map((word, i) => (
                <span
                  key={word}
                  className={cn(
                    "absolute transition-all duration-500",
                    i === currentWordIndex ? "opacity-100 transform-none" : "opacity-0 translate-y-4"
                  )}
                >
                  {word}
                </span>
              ))}
              <span className="invisible">Business</span> {/* Spacer */}
            </span>
            <br />
            Automated Offline.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-base sm:text-lg md:text-xl text-white/70 max-w-2xl mx-auto mb-8 md:mb-10 leading-relaxed px-2"
          >
            A privacy-first, offline-capable expense tracker that automatically parses your banking notifications entirely on-device. No cloud databases, no servers, and sub-100ms local processing.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-sm sm:max-w-none mx-auto px-4 sm:px-0"
          >
            <a 
              href="https://play.google.com/store/apps/details?id=com.kapav.wallzy"
              className="flex items-center justify-center gap-3 w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white text-black font-semibold hover:bg-white/90 transition-all shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:shadow-[0_0_30px_rgba(255,255,255,0.3)] transform hover:-translate-y-1"
            >
              <img src={logo} alt="Ledgr Logo" className="w-6 h-6 object-contain" />
              Download APK / Play Store
            </a>
            <a 
              href="/docs"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/5 border border-white/10 text-white font-medium hover:bg-white/10 transition-all"
            >
              Read How It Works
              <ArrowRight weight="bold" className="w-5 h-5" />
            </a>
            <a 
              href="https://github.com/badKAPAV/Ledgr"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 w-full sm:w-auto px-6 py-3.5 sm:px-8 sm:py-4 rounded-full bg-white/5 border border-white/10 text-white hover:text-white hover:bg-white/10 transition-all font-medium"
            >
              <GithubLogo weight="fill" className="w-5 h-5" />
              GitHub
            </a>
          </motion.div>
        </div>
      </section>

      {/* Feature Cards Grid */}
      <section className="py-12 md:py-20 bg-cardBackground/50 relative border-y border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10 md:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight">Unmatched Intelligence. Zero Compromise.</h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: CloudSlash,
                title: "100% Private & Offline",
                desc: "All text parsing, transaction calculations, and database records remain entirely inside the secure sandbox of your local mobile device."
              },
              {
                icon: BellRinging,
                title: "Auto-Log & Quick Save",
                desc: "Offline Kotlin listeners intercept banking notifications and instantly create ready-to-save transaction drafts with zero typing required."
              },
              {
                icon: FolderOpen,
                title: "Folders & Event Mode",
                desc: "Assign budgets and tags with dynamic warnings. Toggle Event Mode on trips to automatically route incoming transactions directly into folders."
              },
              {
                icon: PencilSimple,
                title: "Smart Balance Adjust",
                desc: "Pencil-edit your actual account balances anytime. Ledgr automatically auto-calculates the difference and logs a balancing transaction."
              }
            ].map((feature, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="bg-cardBackground border border-white/5 p-6 sm:p-8 rounded-2xl hover:border-primary/50 transition-colors group"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-primary" weight="duotone" />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-white/60 text-sm leading-relaxed">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Showcases */}
      <section className="py-16 md:py-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-20 md:space-y-32">
          
          {/* Showcase 1 */}
          <div className="flex flex-col lg:flex-row items-center gap-10 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 md:text-left tracking-tight leading-tight">The <span className="text-primary">"Folders"</span> Concept</h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6 lg:mb-8">
                Traditional personal finance apps force strict, annoying monthly budget restrictions on every single category. Ledgr introduces a folder system. Group transactions dynamically—keep your business, personal, holiday trip, and general balancing expenses completely isolated in dedicated visual compartments.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative flex justify-center"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <img src={mockup1} alt="Folders Concept Mockup" className="relative z-10 rounded-[2rem] border-[8px] border-cardBackground shadow-2xl mx-auto w-full max-w-[280px] sm:max-w-[320px]" />
            </motion.div>
          </div>

          {/* Showcase 2 */}
          <div className="flex flex-col lg:flex-row-reverse items-center gap-10 lg:gap-16">
            <motion.div 
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2"
            >
              <h2 className="text-2xl sm:text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight leading-tight">Instant Notification Parsing</h2>
              <p className="text-white/60 text-base sm:text-lg leading-relaxed mb-6 lg:mb-8">
                Ledgr doesn't connect to your bank accounts. Instead, it reads the push notifications and SMS messages sent by your bank, interpreting the data locally and instantaneously.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="w-full lg:w-1/2 relative flex justify-center"
            >
              <div className="absolute inset-0 bg-primary/20 blur-[100px] rounded-full" />
              <img src={mockup2} alt="Parsing Mockup" className="relative z-10 rounded-[2rem] border-[8px] border-cardBackground shadow-2xl mx-auto w-full max-w-[280px] sm:max-w-[320px]" />
            </motion.div>
          </div>

        </div>
      </section>

    </div>
  )
}
