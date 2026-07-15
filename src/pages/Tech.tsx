import { useEffect } from "react"
import { motion } from "framer-motion"
import { CodeBlock, Info } from "@phosphor-icons/react"

export function Tech() {
  useEffect(() => {
    document.title = "Developer Tech & Architecture — Ledgr"
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl"
    >
      <h1 className="text-4xl font-bold text-white tracking-tight mb-4">Developer Tech & Architecture</h1>
      <p className="text-lg text-white/60 mb-12 leading-relaxed">
        Deep dive into the advanced architecture and engineering principles behind Ledgr.
      </p>

      <div className="space-y-16">
        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            Technical Architecture Diagram
          </h2>
          
          <div className="bg-[#0A0A0A] border border-white/10 rounded-xl p-6 overflow-x-auto shadow-2xl relative group">
            <div className="absolute top-4 right-4 text-white/20 group-hover:text-white/40 transition-colors">
              <CodeBlock className="w-5 h-5" />
            </div>
            <pre className="text-primary font-mono text-sm leading-relaxed whitespace-pre font-[family-name:--font-mono]">
{`[Incoming Signal: SMS/Notification] 
       │
       ▼ (Intercepted by Native Android Sandbox)
[Kotlin NotificationListenerService]
       │
       ▼ (Sub-100ms Streaming via Platform Channel)
[Flutter Runtime Engine] ───► [Sliding-Window Deduplicator (5 Min Buffer)]
                                       │ (If Unique)
                                       ▼
                         [OTA Regex Rule Matching Engine]
                                       │ (Parsed JSON)
                                       ▼
                         [Local SharedPreferences / Local DB]`}
            </pre>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            1. The Native Android Bridge (Kotlin to Flutter)
          </h2>
          <div className="prose prose-invert max-w-none text-white/70">
            <p>
              To capture UPI and banking alerts in real time with zero UI lag, Ledgr runs a background service outside the main Dart isolate:
            </p>
            <ul className="list-disc pl-5 space-y-2 mt-4">
              <li>
                <strong className="text-white">Native Listener:</strong> Built a custom Kotlin <code>NotificationListenerService</code> that hooks directly into the system status bar.
              </li>
              <li>
                <strong className="text-white">Platform Channel Streaming:</strong> The service extracts the raw alert payload and streams it across an asynchronous method channel to the Flutter layer with <strong>sub-100ms latency</strong>.
              </li>
            </ul>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            2. Over-The-Air (OTA) Dynamic Regex Rule Engine
          </h2>
          <div className="prose prose-invert max-w-none text-white/70">
            <p>
              How does Ledgr support new banks and changing message templates without forcing you to wait for a Google Play Store update?
            </p>
            <div className="grid sm:grid-cols-2 gap-6 mt-6">
              <div className="bg-cardBackground p-5 rounded-lg border border-white/5">
                <h4 className="text-white font-medium mb-2">Admin Pipeline</h4>
                <p className="text-sm">We maintain a custom admin tool built in <strong>Python and Streamlit</strong>. When a bank changes their SMS template, we generate and test a new regex pattern in the admin tool.</p>
              </div>
              <div className="bg-cardBackground p-5 rounded-lg border border-white/5">
                <h4 className="text-white font-medium mb-2">Dynamic Synchronization</h4>
                <p className="text-sm">The verified pattern is published to Firebase. At launch, the Flutter client syncs with our Firebase schema database, updating its parsing rules instantly.</p>
              </div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-6 border-b border-white/10 pb-4">
            3. The 3-Digit Account Suffix Matcher
          </h2>
          <div className="prose prose-invert max-w-none text-white/70">
            <p>
              To support banks like ICICI that use only the last 3 digits (<code>XX123</code>) in SMS notifications alongside banks that use 4 digits (<code>XX1234</code>):
            </p>
            <div className="mt-4 bg-primary/10 border border-primary/20 rounded-lg p-5 flex gap-4">
              <Info className="w-6 h-6 text-primary shrink-0 mt-1" />
              <p className="text-sm">
                The system utilizes a double-layered match rule. It searches for an exact character-length match. 
                If not found, it falls back to cross-suffix evaluation matching 
                (<code className="bg-background px-1.5 py-0.5 rounded text-primary mx-1 font-[family-name:--font-mono]">stored.endsWith(parsed) || parsed.endsWith(stored)</code>) 
                to prevent false-negative parsing dropouts.
              </p>
            </div>
          </div>
        </section>

      </div>
    </motion.div>
  )
}
