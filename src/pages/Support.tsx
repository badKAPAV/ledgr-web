import { motion, AnimatePresence } from "framer-motion"
import { MagnifyingGlass, CaretDown, ShieldCheck } from "@phosphor-icons/react"
import { useState, useEffect } from "react"
import { cn } from "../lib/utils"

const FAQS = [
  {
    q: 'Why does the app require the "Notification Listener" permission?',
    a: "This permission is essential for automated tracking. It allows Ledgr's native Kotlin engine to capture financial transaction alerts as they hit your system tray, enabling instant parsing without requiring direct access to your personal contacts or full carrier SMS inbox."
  },
  {
    q: 'How does Ledgr protect my financial data and privacy?',
    a: "Privacy is a core architectural tenet of Ledgr. Your transaction parsing and primary ledger database function locally on your device. We use cloud systems exclusively for two reasons: securely fetching over-the-air (OTA) bank text parsing updates and validating premium features. We never sell, track, or aggregate your financial history."
  },
  {
    q: 'What is the "Deduplication Engine" and how does it prevent double entries?',
    a: "In many regions, making a digital payment triggers two instant alerts: a push notification from the wallet app (like GPay or Venmo) and an SMS from the underlying bank. Ledgr uses a 5-minute sliding-window cache to scan incoming notifications. If it catches an identical transaction amount and bank footprint within that window, it discards the second alert automatically."
  },
  {
    q: 'How do I handle accounts that don\'t send automatic alerts (like Cash)?',
    a: "You can easily create a manual 'Cash' or 'Offline Asset' account inside the app. For balance corrections, use the 'Balance Out Money' feature. Simply input your actual physical wallet total, and Ledgr will automatically calculate the difference and log a compensating system transaction to keep your net worth perfectly aligned."
  },
  {
    q: 'Why does my ICICI Bank account sync seamlessly while other apps require 4 digits?',
    a: "Different banks format transaction texts differently—HDFC typically outputs a 4-digit suffix (XX1234) while ICICI often uses a 3-digit suffix (XX123). Ledgr uses a custom length-prioritized matching engine that automatically handles both variations so you never lose tracking accuracy."
  },
  {
    q: 'How are premium \"Ledgr Max\" subscriptions managed?',
    a: "All subscription payments, plans, and tier upgrades are processed securely via RevenueCat and Google Play Billing. Your payment credentials and billing data are handled entirely through your Google Account—Ledgr never sees or stores your credit card details."
  }
]

function AccordionItem({ q, a }: { q: string, a: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border border-white/10 rounded-xl overflow-hidden bg-cardBackground transition-colors hover:border-white/20">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
      >
        <span className="text-white font-medium pr-8">{q}</span>
        <CaretDown 
          weight="bold" 
          className={cn("w-5 h-5 text-white/50 transition-transform duration-300", isOpen && "rotate-180 text-primary")} 
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-6 pb-5 pt-0 text-white/60 leading-relaxed border-t border-white/5">
              {a}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export function Support() {
  const [searchQuery, setSearchQuery] = useState("")
  
  useEffect(() => {
    document.title = "Support & FAQs — Ledgr"
  }, [])
  
  const filteredFaqs = FAQS.filter(f => 
    f.q.toLowerCase().includes(searchQuery.toLowerCase()) || 
    f.a.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-[calc(100vh-80px)]">
      {/* Support Hero */}
      <section className="bg-cardBackground/30 border-b border-white/5 py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-background to-background"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(164,0,0,0.15)]">
              <ShieldCheck className="w-8 h-8 text-primary" weight="duotone" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight mb-6">How can we help?</h1>
            
            <div className="relative max-w-2xl mx-auto mt-10 group">
              <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-focus-within:opacity-100 transition-opacity duration-500"></div>
              <div className="relative flex items-center bg-cardBackground border border-white/10 rounded-full px-6 py-4 shadow-2xl transition-all group-focus-within:border-primary/50">
                <MagnifyingGlass className="w-6 h-6 text-white/40 group-focus-within:text-primary transition-colors" />
                <input 
                  type="text" 
                  placeholder="Search for answers..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-none text-white focus:outline-none focus:ring-0 px-4 text-lg placeholder:text-white/30"
                />
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQs */}
      <section className="py-20">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="space-y-4"
          >
            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, i) => (
                <AccordionItem key={i} q={faq.q} a={faq.a} />
              ))
            ) : (
              <div className="text-center py-12 text-white/50">
                No results found for "{searchQuery}". Please try another search term.
              </div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  )
}
