import { useEffect } from "react"
import { motion } from "framer-motion"
import { ShieldCheck } from "@phosphor-icons/react"

export function Privacy() {
  useEffect(() => {
    document.title = "Privacy Policy — Ledgr"
  }, [])

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="flex items-center gap-4 mb-8">
          <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center">
            <ShieldCheck className="w-6 h-6 text-primary" weight="fill" />
          </div>
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-white tracking-tight">Privacy Policy for Ledgr</h1>
            <p className="text-white/50 mt-1">Last updated: 07-01-2026</p>
          </div>
        </div>

        <div className="space-y-12 prose prose-invert max-w-none prose-p:text-white/70 prose-headings:text-white prose-li:text-white/70">
          
          <section>
            <h2>1. Information We Collect</h2>
            <h3 className="text-xl font-semibold mt-6 mb-3">1.1 User-Provided Information</h3>
            <p>When you submit feedback, bug reports, or feature requests through the App, we may collect:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Text entered in the feedback form</li>
              <li>Photos or screenshots voluntarily uploaded to describe an issue</li>
            </ul>

            <h3 className="text-xl font-semibold mt-6 mb-3">1.2 Camera Access</h3>
            <p>The App requests access to your device’s camera solely to allow you to capture photos for reporting bugs, sending feedback, or requesting features. We do not use the camera for any other purpose such as recording, scanning, monitoring, or biometric processing.</p>
          </section>

          <section>
            <h2>2. How We Use Your Information</h2>
            <p>Your submitted information is used only to:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Review feedback, bugs, and feature requests</li>
              <li>Improve the App’s performance, stability, and features</li>
              <li>Resolve technical issues reported by users</li>
            </ul>
            <p className="mt-4 border-l-4 border-primary pl-4 text-white/90">
              We do not use your photos or feedback content for advertising, tracking, or profiling.
            </p>
          </section>

          <section>
            <h2>3. Sharing of Information</h2>
            <p>We do not sell or share your information with third parties except:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Cloud/storage providers (e.g., Firebase) used to store submitted data securely</li>
              <li>Legal authorities if required by applicable law</li>
            </ul>
            <p className="mt-4">
              Service providers operate only according to our instructions and are bound by confidentiality.
            </p>
          </section>

          <section>
            <h2>4. Data Retention and Security</h2>
            <p>We take reasonable measures to secure your data. Feedback entries and uploaded images are:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Stored securely</li>
              <li>Accessible only to authorized personnel</li>
              <li>Retained only as long as necessary for issue resolution and app improvement</li>
            </ul>
          </section>

          <section>
            <h2>5. Your Rights and Choices</h2>
            <p>You may:</p>
            <ul className="list-disc pl-5 space-y-1">
              <li>Request deletion of your feedback or associated images</li>
              <li>Withdraw camera permission at any time via device settings</li>
              <li>Stop using the App if you disagree with this policy</li>
            </ul>
          </section>

          <section>
            <h2>6. Children’s Privacy</h2>
            <p>
              The App is not intended for children under 13. We do not knowingly collect personal information from children.
            </p>
          </section>

          <section>
            <h2>7. Changes to This Privacy Policy</h2>
            <p>
              We may update this Privacy Policy from time to time. Changes will be posted on this page with an updated “Last Updated” date.
            </p>
          </section>

          <section>
            <h2>8. Contact Us</h2>
            <p>If you have questions about this Privacy Policy or wish to request data deletion, please contact us:</p>
            <ul className="list-none space-y-2 mt-4 bg-cardBackground p-6 rounded-xl border border-white/5">
              <li><strong>Email:</strong> <a href="mailto:kapav.dev@gmail.com" className="text-primary hover:underline">kapav.dev@gmail.com</a></li>
              <li><strong>Developer:</strong> Kapav</li>
            </ul>
          </section>

        </div>
      </motion.div>
    </div>
  )
}
