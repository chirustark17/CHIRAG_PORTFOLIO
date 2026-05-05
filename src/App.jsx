import { useEffect, useRef, useState } from 'react'
import StarkTag from './components/StarkTag'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import AuroraBackground from './components/AuroraBackground'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import ReelHint from './components/ReelHint'
import ReelButton from './components/ReelButton'
import ReelDeck from './components/ReelDeck'
import useReelTrigger from './hooks/useReelTrigger'
import useIsMobile from './hooks/useIsMobile'
import Hero from './sections/Hero'
import About from './sections/About'
import NowStrip from './sections/NowStrip'
import Projects from './sections/Projects'
import Skills from './sections/Skills'
import Certifications from './sections/Certifications'
import Achievements from './sections/Achievements'
import SelectedWork from './sections/SelectedWork'
import Contact from './sections/Contact'
import HeroMobile from './components/mobile/HeroMobile'
import ProjectsMobile from './components/mobile/ProjectsMobile'
import SelectedWorkMobile from './components/mobile/SelectedWorkMobile'
import ReelDeckMobile from './components/mobile/ReelDeckMobile'

function App() {
  const { showHint, dismissHint } = useReelTrigger()
  const [reelOpen, setReelOpen] = useState(false)
  const [tagVisible, setTagVisible] = useState(false)
  const launchButtonRef = useRef(null)
  const isMobile = useIsMobile()

  useEffect(() => {
    const el = document.getElementById('contact')
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => setTagVisible(entry.isIntersecting),
      { threshold: 0.1 }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

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
        {isMobile ? <HeroMobile /> : <Hero />}
        <About />
        <NowStrip />
        {isMobile ? <ProjectsMobile /> : <Projects />}
        <Skills />
        <Certifications />
        <Achievements />
        {isMobile ? <SelectedWorkMobile /> : <SelectedWork />}
        <Contact />
      </main>
      <Footer />
      <StarkTag visible={tagVisible} />
      <ScrollToTop />
      <ReelButton ref={launchButtonRef} onLaunch={launchReel} />
      <ReelHint
        visible={showHint && !reelOpen}
        onLaunch={launchReel}
        onDismiss={dismissHint}
      />
      {isMobile
        ? <ReelDeckMobile open={reelOpen} onClose={() => setReelOpen(false)} />
        : <ReelDeck open={reelOpen} onClose={() => setReelOpen(false)} launchButtonRef={launchButtonRef} />}
    </div>
    </MotionConfig>
  )
}

export default App
