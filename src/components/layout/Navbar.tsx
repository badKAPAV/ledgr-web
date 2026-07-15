import { Link, useLocation } from "react-router-dom"
import { AndroidLogo, List, X } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import logo from "../../assets/ledgr_logo.png"
import { cn } from "../../lib/utils"

export function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [location.pathname])

  const navLinks = [
    { name: "How It Works", path: "/docs" },
    { name: "Developer Tech", path: "/tech" },
    { name: "Support", path: "/support" },
    { name: "About me", path: "/about" },
  ]

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-all duration-300 border-b border-transparent",
        isScrolled ? "bg-background/80 backdrop-blur-md border-white/5 shadow-xl" : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0 group">
            <img src={logo} alt="Ledgr Logo" className="w-8 h-8 sm:w-10 sm:h-10 object-contain transition-transform group-hover:scale-105" />
            <span className="text-xl sm:text-2xl font-bold tracking-tight text-white font-ledgr">ledgr</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location.pathname === link.path ? "text-primary" : "text-white/70"
                )}
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* CTA & Mobile Toggle */}
          <div className="flex items-center gap-4">
            <a
              href="https://play.google.com/store/apps/details?id=com.kapav.wallzy"
              className="hidden sm:flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary/10 text-primary border border-primary/20 hover:bg-primary hover:text-white transition-all duration-300 font-medium text-sm shadow-[0_0_15px_rgba(164,0,0,0.15)] hover:shadow-[0_0_20px_rgba(164,0,0,0.4)]"
            >
              <AndroidLogo weight="fill" className="w-5 h-5" />
              <span>Get the App</span>
            </a>
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden p-2 -mr-2 text-white/70 hover:text-white transition-colors"
            >
              {isMobileMenuOpen ? <X className="w-6 h-6" /> : <List className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-cardBackground border-b border-white/5 shadow-2xl overflow-hidden">
          <nav className="flex flex-col py-4 px-4 space-y-2">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === link.path ? "bg-primary/10 text-primary" : "text-white/70 hover:bg-white/5 hover:text-white"
                )}
              >
                {link.name}
              </Link>
            ))}
            <a
              href="https://play.google.com/store/apps/details?id=com.kapav.wallzy"
              className="mt-4 flex items-center justify-center gap-2 w-full px-5 py-3 rounded-xl bg-primary text-white font-medium shadow-[0_0_15px_rgba(164,0,0,0.3)]"
            >
              <AndroidLogo weight="fill" className="w-5 h-5" />
              <span>Download on Play Store</span>
            </a>
          </nav>
        </div>
      )}
    </header>
  )
}
