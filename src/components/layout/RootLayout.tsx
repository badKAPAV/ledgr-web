import { Outlet } from "react-router-dom"
import { Navbar } from "./Navbar"
import { Footer } from "./Footer"

export function RootLayout() {
  return (
    <div className="flex flex-col min-h-screen selection:bg-primary/30 selection:text-white">
      <Navbar />
      <main className="flex-1 pt-16 sm:pt-20">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
