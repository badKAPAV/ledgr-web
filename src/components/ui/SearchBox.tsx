import { MagnifyingGlass } from "@phosphor-icons/react"
import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { cn } from "../../lib/utils"
import { searchIndex } from "../../data/searchIndex"

export function SearchBox({ className, placeholder = "Search..." }: { className?: string, placeholder?: string }) {
  const [isFocused, setIsFocused] = useState(false)
  const [query, setQuery] = useState("")
  const navigate = useNavigate()
  const wrapperRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const results = query.length > 1 
    ? searchIndex.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) || 
        item.content.toLowerCase().includes(query.toLowerCase())
      )
    : []

  const handleSelect = (url: string) => {
    setQuery("")
    setIsFocused(false)
    navigate(url)
    
    // Slight delay to ensure the DOM has updated before scrolling if navigating to a hash on the same page
    setTimeout(() => {
      const hash = url.split('#')[1]
      if (hash) {
        const element = document.getElementById(hash)
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' })
        }
      }
    }, 100)
  }

  return (
    <div ref={wrapperRef} className={cn("relative w-full max-w-md", className)}>
      <div
        className={cn(
          "relative flex items-center w-full transition-all duration-300 rounded-lg p-[1px]",
          isFocused ? "ring-2 ring-primary ring-offset-2 ring-offset-background" : "ring-1 ring-white/10"
        )}
      >
        <MagnifyingGlass
          weight="bold"
          className={cn("absolute left-4 w-5 h-5 transition-colors", isFocused ? "text-primary" : "text-white/40")}
        />
        <input
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          className="w-full py-2.5 pl-12 pr-4 bg-cardBackground rounded-lg text-sm text-textPrimary placeholder:text-white/40 focus:outline-none"
        />
      </div>

      {/* Dropdown Results */}
      {isFocused && query.length > 1 && (
        <div className="absolute top-[calc(100%+0.5rem)] left-0 right-0 bg-[#0A0B0E] border border-white/20 rounded-lg shadow-[0_10px_40px_-10px_rgba(0,0,0,0.8)] overflow-hidden z-[999] max-h-80 overflow-y-auto">
          {results.length > 0 ? (
            <ul className="py-2">
              {results.map((result, i) => (
                <li key={i}>
                  <button
                    onClick={() => handleSelect(result.url)}
                    className="w-full text-left px-4 py-3 hover:bg-white/10 transition-colors focus:bg-white/10 focus:outline-none"
                  >
                    <div className="text-white font-medium text-sm mb-1">{result.title}</div>
                    <div className="text-white/50 text-xs line-clamp-2">{result.content}</div>
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <div className="px-4 py-6 text-center text-sm text-white/50">
              No results found for "{query}"
            </div>
          )}
        </div>
      )}
    </div>
  )
}
