import { useEffect, useRef, useState } from 'react'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import AuroraBackground from './components/AuroraBackground'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ReelHint from './components/ReelHint'
import ReelButton from './components/ReelButton'
import ReelDeck from './components/ReelDeck'
import useReelTrigger from './hooks/useReelTrigger'
import Hero from './sections/Hero'
import About from './sections/About'
import NowStrip from './sections/NowStrip'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Achievements from './sections/Achievements'
import SelectedWork from './sections/SelectedWork'
import Contact from './sections/Contact'

function App() {
  const { showHint, dismissHint } = useReelTrigger()
  const [reelOpen, setReelOpen] = useState(false)
  const launchButtonRef = useRef(null)

  const launchReel = () => {
    dismissHint()
    setReelOpen(true)
  }

  // Clean stale Chirag Mode localStorage keys from prior builds
  useEffect(() => {
    try {
      localStorage.removeItem('chiragModeDismissed')
      localStorage.removeItem('chiragInviteDismissed')
    } catch {}
  }, [])

  return (
    <MotionConfig reducedMotion="user">
    <div className="relative min-h-screen">
      <a
        href="#home"
        className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-100 focus:px-4 focus:py-2 focus:rounded focus:bg-cyan-400 focus:text-ink-950 focus:font-mono focus:text-xs focus:uppercase focus:tracking-wider"
      >
        Skip to content
      </a>
      <AuroraBackground />
      <div className="grain" aria-hidden="true" />
      <Navbar />
      <main className="relative z-10">
        <Hero />
        <About />
        <NowStrip />
        <Projects />
        <Skills />
        <Certifications />
        <Achievements />
        <SelectedWork />
        <Contact />
      </main>
      <Footer />
      <ScrollToTop />
      <ReelButton ref={launchButtonRef} onLaunch={launchReel} />
      <ReelHint
        visible={showHint && !reelOpen}
        onLaunch={launchReel}
        onDismiss={dismissHint}
      />
      <ReelDeck
        open={reelOpen}
        onClose={() => setReelOpen(false)}
        launchButtonRef={launchButtonRef}
      />
    </div>
    </MotionConfig>
  )
}

export default App
