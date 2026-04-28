import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import slides from '../data/reel'
import { ReelSlideViewport } from './ReelSlideViewport'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

// ─── Star layer ───────────────────────────────────────────────────────────────

function pickStarColor() {
  const r = Math.random()
  if (r < 0.55) return 'rgba(34,211,238,0.35)'
  if (r < 0.85) return 'rgba(124,58,237,0.28)'
  return 'rgba(245,158,11,0.25)'
}

const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  size: Math.random() < 0.6 ? 2 : Math.random() < 0.9 ? 3 : 4,
  color: pickStarColor(),
  duration: 2 + Math.random() * 2,
}))

function StarLayer({ reducedMotion }) {
  return (
    <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
      {STARS.map(star => (
        <motion.span
          key={star.id}
          className="absolute rounded-full"
          style={{
            top: star.top,
            left: star.left,
            width: star.size,
            height: star.size,
            backgroundColor: star.color,
          }}
          animate={reducedMotion ? {} : { opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// ─── Nav controls ─────────────────────────────────────────────────────────────

function NavControls({ index, total, onPrev, onNext, onJump }) {
  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-62 w-full px-4 pointer-events-none">
      <div className="max-w-md mx-auto pointer-events-auto">
        <p className="text-center font-mono text-[10px] uppercase tracking-[0.25em] text-bone-50/50 mb-2">
          {String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
        </p>
        <div
          className="flex items-center justify-between gap-4 rounded-full px-3 py-2"
          style={{
            background: 'rgba(10,8,16,0.85)',
            border: '1px solid rgba(34,211,238,0.3)',
            backdropFilter: 'blur(12px)',
            boxShadow: '0 10px 40px -10px rgba(0,0,0,0.5)',
          }}
        >
          {/* Prev */}
          <button
            onClick={onPrev}
            disabled={index === 0}
            aria-label="Previous slide"
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-400/10 transition text-bone-50 disabled:opacity-30 disabled:cursor-not-allowed ${FOCUS_RING}`}
          >
            <ChevronLeft size={18} />
          </button>

          {/* Dots */}
          <div className="flex items-center gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => onJump(i)}
                aria-label={`Go to slide ${i + 1}`}
                className={`h-2 rounded-full transition-all duration-300 hover:bg-bone-50/50 ${FOCUS_RING}`}
                style={
                  i === index
                    ? {
                        width: 24,
                        background: '#22D3EE',
                        boxShadow: '0 0 0 3px rgba(245,158,11,0.25), 0 0 12px rgba(34,211,238,0.5)',
                      }
                    : { width: 8, background: 'rgba(250,250,247,0.3)' }
                }
              />
            ))}
          </div>

          {/* Next */}
          <button
            onClick={onNext}
            disabled={index === total - 1}
            aria-label="Next slide"
            className={`w-10 h-10 rounded-full flex items-center justify-center hover:bg-cyan-400/10 transition text-bone-50 disabled:opacity-30 disabled:cursor-not-allowed ${FOCUS_RING}`}
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── Main deck ────────────────────────────────────────────────────────────────

export function ReelDeck({ open, onClose, launchButtonRef }) {
  const [index, setIndex] = useState(0)
  const [direction, setDirection] = useState('next')
  const reducedMotion = usePrefersReducedMotion()
  const closeButtonRef = useRef(null)
  const touchStartRef = useRef({ x: 0, y: 0 })

  // Body scroll lock
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  // Focus management on open
  useEffect(() => {
    if (open) {
      setIndex(0)
      setDirection('next')
      setTimeout(() => closeButtonRef.current?.focus(), 50)
    } else {
      launchButtonRef?.current?.focus()
    }
  }, [open]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keyboard controls
  useEffect(() => {
    if (!open) return
    function onKey(e) {
      if (e.key === 'ArrowLeft')  { e.preventDefault(); handlePrev() }
      if (e.key === 'ArrowRight') { e.preventDefault(); handleNext() }
      if (e.key === 'Escape')     { e.preventDefault(); onClose() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [open, index]) // eslint-disable-line react-hooks/exhaustive-deps

  function handlePrev() {
    if (index === 0) return
    setDirection('prev')
    setIndex(i => i - 1)
  }

  function handleNext() {
    if (index === slides.length - 1) return
    setDirection('next')
    setIndex(i => i + 1)
  }

  function handleJump(i) {
    setDirection(i > index ? 'next' : 'prev')
    setIndex(i)
  }

  // Touch swipe
  function handleTouchStart(e) {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }

  function handleTouchEnd(e) {
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const dx = endX - touchStartRef.current.x
    const dy = endY - touchStartRef.current.y
    if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
      if (dx > 0) handlePrev()
      else handleNext()
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-labelledby={`reel-slide-${slides[index].id}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4 }}
          className="fixed inset-0 z-60"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
        >
          {/* Backdrop */}
          <div
            className="absolute inset-0"
            aria-hidden="true"
            style={{
              background: 'radial-gradient(ellipse at top, #0F0820 0%, #050307 60%, #000000 100%)',
            }}
          />

          {/* Stars */}
          <StarLayer reducedMotion={reducedMotion} />

          {/* Grain */}
          <div
            className="absolute inset-0 grain mix-blend-overlay pointer-events-none"
            style={{ opacity: 0.04 }}
            aria-hidden="true"
          />

          {/* Close button */}
          <button
            ref={closeButtonRef}
            onClick={onClose}
            aria-label="Close highlight reel"
            className={`fixed top-6 right-6 z-62 w-12 h-12 rounded-full border border-bone-50/30 bg-ink-950/60 backdrop-blur flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition text-bone-50 ${FOCUS_RING}`}
          >
            <X size={20} />
          </button>

          {/* Slide area — full inset minus nav bar space */}
          <div className="absolute inset-0 pb-32">
            <ReelSlideViewport
              currentSlide={slides[index]}
              direction={direction}
            />
          </div>

          {/* Nav controls */}
          <NavControls
            index={index}
            total={slides.length}
            onPrev={handlePrev}
            onNext={handleNext}
            onJump={handleJump}
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default ReelDeck
