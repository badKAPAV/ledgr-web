import { Outlet, NavLink, useLocation } from "react-router-dom"
import { cn } from "../../lib/utils"
import { SearchBox } from "../ui/SearchBox"
import { List, X } from "@phosphor-icons/react"
import { useState, useEffect } from "react"

const sidebarLinks = [
  {
    category: "The Basics",
    items: [
      { name: "Home & Dashboard", path: "/docs#home" },
      { name: "Transactions & Budgets", path: "/docs#transactions-budget" },
      { name: "My Accounts", path: "/docs#accounts" },
      { name: "Creating Transactions", path: "/docs#transaction" },
    ]
  },
  {
    category: "Advanced Features",
    items: [
      { name: "Folders & Events", path: "/docs#folders" },
      { name: "People & Debts", path: "/docs#people-debts" },
      { name: "Planning & Goals", path: "/docs#planning" },
      { name: "Quick Save & Auto Log", path: "/docs#auto-log" },
    ]
  },
  {
    category: "System",
    items: [
      { name: "Developer Tech", path: "/tech" },
    ]
  }
]

export function DocsLayout() {
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("")
  const location = useLocation()

  useEffect(() => {
    const handleScroll = () => {
      const sections = document.querySelectorAll("section[id]")
      let current = ""
      sections.forEach((section) => {
        const sectionTop = section.getBoundingClientRect().top
        // 150px offset to account for sticky header
        if (sectionTop <= 150) {
          current = section.getAttribute("id") || ""
        }
      })
      setActiveSection(current)
    }

    window.addEventListener("scroll", handleScroll)
    // Trigger immediately to set initial active state
    handleScroll()
    return () => window.removeEventListener("scroll", handleScroll)
  }, [location])

  const isLinkActive = (path: string) => {
    if (location.pathname === "/tech" && path === "/tech") return true
    if (location.pathname === "/docs" && activeSection && path === `/docs#${activeSection}`) return true
    if (location.pathname === "/docs" && !activeSection && path === "/docs#home") return true
    return false
  }

  const handleLinkClick = (path: string) => {
    setIsMobileSidebarOpen(false)
    setTimeout(() => {
      const hash = path.split('#')[1]
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 10)
  }

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row relative">
      
      {/* Mobile Sidebar Toggle */}
      <div className="lg:hidden sticky top-[64px] sm:top-[80px] z-30 bg-background/95 backdrop-blur-md py-4 border-b border-white/5 flex items-center justify-between">
        <span className="text-white font-medium">Documentation Menu</span>
        <button 
          onClick={() => setIsMobileSidebarOpen(!isMobileSidebarOpen)}
          className="p-2 -mr-2 text-white/70 hover:text-white"
        >
          {isMobileSidebarOpen ? <X className="w-5 h-5" /> : <List className="w-5 h-5" />}
        </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={cn(
          "lg:w-64 lg:shrink-0 lg:block border-r border-white/5 py-8 lg:pr-8",
          "fixed inset-0 z-40 bg-background lg:bg-transparent lg:static lg:h-[calc(100vh-80px)] lg:sticky top-[80px] overflow-y-auto pt-24 lg:pt-8",
          isMobileSidebarOpen ? "block px-6" : "hidden"
        )}
      >
        <div className="lg:hidden absolute top-4 right-4">
           <button 
            onClick={() => setIsMobileSidebarOpen(false)}
            className="p-2 text-white/70 hover:text-white bg-cardBackground rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mb-8 hidden lg:block">
          <SearchBox placeholder="Search docs..." />
        </div>
        
        <nav className="space-y-8">
          {sidebarLinks.map((group) => (
            <div key={group.category}>
              <h4 className="text-xs font-semibold text-white/40 uppercase tracking-wider mb-3">
                {group.category}
              </h4>
              <ul className="space-y-1">
                {group.items.map((item) => (
                  <li key={item.name}>
                    <NavLink
                      to={item.path}
                      onClick={() => handleLinkClick(item.path)}
                      className={() =>
                        cn(
                          "block px-3 py-2 rounded-md text-sm transition-colors",
                          isLinkActive(item.path)
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-white/70 hover:bg-white/5 hover:text-white"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 py-8 lg:py-12 lg:pl-12 min-w-0">
        <div className="lg:hidden mb-8">
          <SearchBox placeholder="Search docs..." />
        </div>
        <Outlet />
      </div>
      
    </div>
  )
}
