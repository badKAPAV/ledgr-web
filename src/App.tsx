import { Routes, Route } from "react-router-dom"
import { RootLayout } from "./components/layout/RootLayout"
import { DocsLayout } from "./components/layout/DocsLayout"

import { Home } from "./pages/Home"
import { Docs } from "./pages/Docs"
import { Tech } from "./pages/Tech"
import { Support } from "./pages/Support"
import { Privacy } from "./pages/Privacy"
import { About } from "./pages/About"

function App() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        <Route path="/" element={<Home />} />
        
        {/* Docs & Tech share the DocsLayout */}
        <Route element={<DocsLayout />}>
          <Route path="/docs" element={<Docs />} />
          <Route path="/tech" element={<Tech />} />
        </Route>
        
        <Route path="/support" element={<Support />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/about" element={<About />} />
      </Route>
    </Routes>
  )
}

export default App
