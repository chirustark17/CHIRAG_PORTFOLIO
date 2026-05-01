import { createContext, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { X } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'
import slides from '../../data/reel'
import PanelRouter from './reel/PanelRouter'

export const ReelScrollContext = createContext(null)

function StarLayer() {
  const stars = useMemo(() =>
    Array.from({ length: 40 }, (_, i) => ({
      id: i,
      top: `${(i * 13.7 + 3) % 100}%`,
      left: `${(i * 27.3 + 7) % 100}%`,
      opacity: ((i * 0.17) % 0.4) + 0.1,
      size: i % 5 === 0 ? 2 : 1,
    })),
  [])

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden="true">
      {stars.map(s => (
        <div
          key={s.id}
          className="absolute rounded-full bg-bone-50"
          style={{ top: s.top, left: s.left, opacity: s.opacity, width: s.size, height: s.size }}
        />
      ))}
    </div>
  )
}

function ProgressBar({ total, active }) {
  return (
    <div
      role="progressbar"
      aria-valuenow={active + 1}
      aria-valuemin={1}
      aria-valuemax={total}
      aria-label={`Slide ${active + 1} of ${total}`}
      className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-1.5 z-20 pointer-events-none"
    >
      {Array.from({ length: total }, (_, i) => (
        <div
          key={i}
          className={`rounded-full transition-all duration-300 ${
            i === active ? 'w-1.5 h-4 bg-cyan-400' : 'w-1.5 h-1.5 bg-bone-50/30'
          }`}
        />
      ))}
    </div>
  )
}

export default function ReelDeckMobile({ open, onClose }) {
  const reducedMotion = usePrefersReducedMotion()
  const scrollRef = useRef(null)
  const panelRefs = useRef([])
  const [activeIndex, setActiveIndex] = useState(0)
  const [gyroEnabled, setGyroEnabled] = useState(false)
  const pushedState = useRef(false)

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Reset to first panel on reopen
  useEffect(() => {
    if (open) {
      setActiveIndex(0)
      setGyroEnabled(false)
      const t = setTimeout(() => {
        if (scrollRef.current) scrollRef.current.scrollTop = 0
      }, 50)
      return () => clearTimeout(t)
    }
  }, [open])

  // Android/browser back button via history
  useEffect(() => {
    if (!open) return
    history.pushState({ reelOpen: true }, '')
    pushedState.current = true

    const handlePop = () => {
      pushedState.current = false
      onClose()
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [open]) // eslint-disable-line

  const handleClose = useCallback(() => {
    if (pushedState.current) {
      pushedState.current = false
      history.back()
    } else {
      onClose()
    }
  }, [onClose])

  // Keyboard navigation
  useEffect(() => {
    if (!open) return
    const handleKey = (e) => {
      if (e.key === 'Escape') { handleClose(); return }
      if (e.key === 'ArrowDown') {
        const next = Math.min(activeIndex + 1, slides.length - 1)
        panelRefs.current[next]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
      if (e.key === 'ArrowUp') {
        const prev = Math.max(activeIndex - 1, 0)
        panelRefs.current[prev]?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open, activeIndex, handleClose])

  // IntersectionObserver — tracks which panel is ≥50% visible
  useEffect(() => {
    if (!open || !scrollRef.current) return
    const root = scrollRef.current
    const visible = new Set()

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          const idx = parseInt(entry.target.dataset.panelIndex, 10)
          if (entry.isIntersecting) visible.add(idx)
          else visible.delete(idx)
        })
        if (visible.size > 0) setActiveIndex(Math.min(...visible))
      },
      { root, threshold: 0.5 }
    )

    panelRefs.current.forEach(el => { if (el) observer.observe(el) })
    return () => observer.disconnect()
  }, [open])

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 bg-ink-950"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reducedMotion ? 0.15 : 0.3 }}
          role="dialog"
          aria-modal="true"
          aria-labelledby="reel-mobile-active-title"
        >
          <StarLayer />

          <button
            onClick={handleClose}
            className="absolute top-4 right-4 z-30 p-2 rounded-full text-bone-50/70 hover:text-bone-50 transition-colors"
            style={{ background: 'rgba(250,250,247,0.08)' }}
            aria-label="Close highlight reel"
          >
            <X size={20} />
          </button>

          <ProgressBar total={slides.length} active={activeIndex} />

          <ReelScrollContext.Provider value={scrollRef}>
            <div
              ref={scrollRef}
              className="h-full overflow-y-scroll"
              style={{ scrollSnapType: 'y mandatory' }}
            >
              {slides.map((slide, i) => (
                <div
                  key={slide.id}
                  ref={el => { panelRefs.current[i] = el }}
                  data-panel-index={i}
                  className="h-dvh flex items-center justify-center px-6 py-16"
                  style={{ scrollSnapAlign: 'start', scrollSnapStop: 'always' }}
                >
                  <PanelRouter
                    slide={slide}
                    active={activeIndex === i}
                    gyroEnabled={gyroEnabled}
                    onEnableGyro={() => setGyroEnabled(true)}
                  />
                </div>
              ))}
            </div>
          </ReelScrollContext.Provider>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
