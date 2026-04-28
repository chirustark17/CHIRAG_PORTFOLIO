import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import showcase from '../data/showcase'
import { ShowcaseSlide } from '../components/ShowcaseSlide'
import { SectionHeading } from '../components/SectionHeading'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const TOTAL = showcase.length
const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950'

function getPosition(index, active, isMobile) {
  if (index === active) return 'center'
  if (isMobile) return 'hidden'
  if (index === (active - 1 + TOTAL) % TOTAL) return 'left'
  if (index === (active + 1) % TOTAL) return 'right'
  return 'hidden'
}

export function SelectedWork() {
  const [active, setActive] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [swipeHintVisible, setSwipeHintVisible] = useState(true)
  const pauseTimerRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    setIsMobile(mq.matches)
    function onChange(e) { setIsMobile(e.matches) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  useEffect(() => {
    if (isPaused || reducedMotion) return
    const id = setInterval(() => {
      setActive(a => (a + 1) % TOTAL)
    }, 5000)
    return () => clearInterval(id)
  }, [isPaused, reducedMotion])

  // Swipe hint fades after 5s
  useEffect(() => {
    const id = setTimeout(() => setSwipeHintVisible(false), 5000)
    return () => clearTimeout(id)
  }, [])

  function pauseAutoRotate() {
    setIsPaused(true)
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
    pauseTimerRef.current = setTimeout(() => setIsPaused(false), 8000)
  }

  useEffect(() => () => {
    if (pauseTimerRef.current) clearTimeout(pauseTimerRef.current)
  }, [])

  function goLeft() {
    pauseAutoRotate()
    setActive(a => (a - 1 + TOTAL) % TOTAL)
  }

  function goRight() {
    pauseAutoRotate()
    setActive(a => (a + 1) % TOTAL)
  }

  function handleKeyDown(e) {
    if (e.key === 'ArrowLeft') { e.preventDefault(); goLeft() }
    if (e.key === 'ArrowRight') { e.preventDefault(); goRight() }
  }

  function handleTouchStart(e) {
    touchStartRef.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    }
  }

  function handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - touchStartRef.current.x
    const dy = endY - touchStartRef.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      pauseAutoRotate()
      if (dx > 0) {
        setActive(a => (a - 1 + TOTAL) % TOTAL)
      } else {
        setActive(a => (a + 1) % TOTAL)
      }
    }
  }

  return (
    <section id="selected-work" aria-label="Selected Work" className="section-full overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <SectionHeading
          align="center"
          eyebrow="06 — selected work"
          title="Featured"
          subtitle="Four projects I'd put in front of anyone."
        />
      </div>

      {/* Carousel */}
      <div
        className="relative mt-20 max-w-7xl mx-auto px-6"
        style={{ perspective: '1500px' }}
        tabIndex={0}
        role="region"
        aria-roledescription="carousel"
        aria-label="Featured projects"
        onKeyDown={handleKeyDown}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {/* Cards container */}
        <div className="relative h-150 md:h-162.5 lg:h-175">
          {showcase.map((s, i) => (
            <div
              key={s.slug}
              className="absolute inset-0 flex items-center justify-center"
            >
              <ShowcaseSlide
                {...s}
                index={i}
                position={getPosition(i, active, isMobile)}
                onClick={() => {
                  pauseAutoRotate()
                  setActive(i)
                }}
              />
            </div>
          ))}
        </div>

        {/* Left arrow */}
        <button
          onClick={goLeft}
          aria-label="Previous project"
          className={`absolute left-2 lg:left-6 top-75 md:top-81.25 lg:top-87.5 -translate-y-1/2 z-40 w-14 h-14 lg:w-12 lg:h-12 rounded-full border border-current/20 bg-bone-50/80 dark:bg-ink-950/80 backdrop-blur flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] lg:shadow-none ${FOCUS_RING}`}
        >
          <ChevronLeft size={20} />
        </button>

        {/* Right arrow */}
        <button
          onClick={goRight}
          aria-label="Next project"
          className={`absolute right-2 lg:right-6 top-75 md:top-81.25 lg:top-87.5 -translate-y-1/2 z-40 w-14 h-14 lg:w-12 lg:h-12 rounded-full border border-current/20 bg-bone-50/80 dark:bg-ink-950/80 backdrop-blur flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition shadow-[0_4px_20px_-4px_rgba(0,0,0,0.3)] lg:shadow-none ${FOCUS_RING}`}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Dots */}
      <div className="mt-8 flex justify-center gap-2">
        {showcase.map((s, i) => (
          <button
            key={s.slug}
            onClick={() => { pauseAutoRotate(); setActive(i) }}
            aria-label={`Go to project ${i + 1}`}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${FOCUS_RING} ${
              i === active ? 'bg-cyan-400 scale-125' : 'bg-current/20 hover:bg-current/40'
            }`}
          />
        ))}
      </div>

      {/* Swipe hint — mobile only, fades after 5s */}
      <AnimatePresence>
        {isMobile && swipeHintVisible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="lg:hidden mt-3 text-center font-mono text-[10px] uppercase tracking-wider"
          >
            ← swipe →
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}

export default SelectedWork
