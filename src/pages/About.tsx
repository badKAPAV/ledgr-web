import { useEffect } from "react"
import { motion } from "framer-motion"
import { InstagramLogo, LinkedinLogo, TwitterLogo, EnvelopeSimple } from "@phosphor-icons/react"
import profileImg from "../assets/dark.png"

export function About() {
  useEffect(() => {
    document.title = "About me — Ledgr"
  }, [])

  return (
    <div className="min-h-[calc(100vh-80px)] flex items-center justify-center py-20 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-2xl w-full bg-cardBackground border border-white/10 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 left-0 w-full h-32 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/20 via-background/0 to-background/0"></div>
        
        <div className="relative z-10">
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="w-32 h-32 sm:w-40 sm:h-40 mx-auto rounded-full overflow-hidden border-4 border-cardBackground shadow-[0_0_0_2px_rgba(164,0,0,0.5)] mb-6"
          >
            <img 
              src={profileImg} 
              alt="Kapav" 
              className="w-full h-full object-cover"
            />
          </motion.div>

          <motion.h1 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl font-bold text-white tracking-tight mb-2"
          >
            Kapav
          </motion.h1>
          
          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-primary font-medium tracking-wide text-sm uppercase mb-6"
          >
            Solo Developer & Creator of Ledgr
          </motion.p>

          <motion.p 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="text-white/70 text-lg leading-relaxed max-w-lg mx-auto mb-10"
          >
            Passionate about building fast, privacy-first applications that give users complete control over their data. Ledgr is designed to be the ultimate offline expense tracker.
          </motion.p>

          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex items-center justify-center gap-6"
          >
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
              <InstagramLogo weight="duotone" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
              <LinkedinLogo weight="duotone" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="#" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
              <TwitterLogo weight="duotone" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
            <a href="mailto:kapav.dev@gmail.com" className="w-12 h-12 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-white/70 hover:text-white hover:bg-primary/20 hover:border-primary/50 transition-all group">
              <EnvelopeSimple weight="duotone" className="w-6 h-6 group-hover:scale-110 transition-transform" />
            </a>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
