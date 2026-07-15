import { Link } from "react-router-dom"
import { ShieldCheck, Lifebuoy, Code, BookOpen, User } from "@phosphor-icons/react"
import logo from "../../assets/ledgr_logo.png"

export function Footer() {
  const currentYear = new Date().getFullYear()

  const links = [
    { name: "How It Works", path: "/docs", icon: BookOpen },
    { name: "Developer Tech", path: "/tech", icon: Code },
    { name: "Support", path: "/support", icon: Lifebuoy },
    { name: "Privacy Policy", path: "/privacy", icon: ShieldCheck },
    { name: "About me", path: "/about", icon: User },
  ]

  return (
    <footer className="bg-cardBackground border-t border-white/5 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-8 mb-12">

          <div className="md:col-span-4 lg:col-span-5">
            <Link to="/" className="flex items-center gap-3 mb-6">
              <img src={logo} alt="Ledgr Logo" className="w-8 h-8 object-contain opacity-90" />
              <span className="text-xl font-bold tracking-tight text-white font-ledgr">ledgr</span>
            </Link>
            <p className="text-white/60 text-sm leading-relaxed max-w-sm mb-6">
              A privacy-first, offline-capable expense tracker that automatically parses your banking notifications entirely on-device. No cloud databases, no servers.
            </p>
          </div>

          <div className="md:col-span-8 lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-8">
            <div>
              <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Resources</h3>
              <ul className="space-y-3">
                {links.slice(0, 2).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-white/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                      <link.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div>
              <h3 className="text-white font-semibold mb-4 text-sm tracking-wide uppercase">Legal & Help</h3>
              <ul className="space-y-3">
                {links.slice(2).map((link) => (
                  <li key={link.name}>
                    <Link to={link.path} className="text-white/60 hover:text-primary transition-colors text-sm flex items-center gap-2 group">
                      <link.icon className="w-4 h-4 text-white/40 group-hover:text-primary transition-colors" />
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/40 text-sm text-center md:text-left">
            &copy; {currentYear} Ledgr. All rights reserved.
          </p>
          <div className="flex items-center gap-2 text-white/40 text-sm">
            <span>Built with</span>
            <span className="text-primary font-medium tracking-wider">Privacy First</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
