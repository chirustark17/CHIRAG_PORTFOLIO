import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion, useMotionValue, animate } from 'framer-motion'
import {
  ChevronLeft,
  ChevronRight,
  Pause,
  Play,
  Sparkles,
  Volume2,
  VolumeX,
  X,
} from 'lucide-react'
import tour from '../data/chiragTour'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import ChiragEdgeLight from './ChiragEdgeLight'
import ChiragStopOverlays from './ChiragStopOverlays'

const TOTAL = tour.length

// Weighted star color pick
function pickStarColor() {
  const r = Math.random()
  if (r < 0.55) return 'rgba(34,211,238,0.35)'
  if (r < 0.85) return 'rgba(124,58,237,0.28)'
  return 'rgba(245,158,11,0.25)'
}

// Varied star sizes: 60% small, 30% medium, 10% large+blurred
function pickStarSize() {
  const r = Math.random()
  if (r < 0.60) return { px: 2, blurred: false }
  if (r < 0.90) return { px: 3, blurred: false }
  return { px: 4, blurred: true }
}

const STARS = Array.from({ length: 24 }, (_, i) => ({
  id: i,
  top: `${Math.random() * 100}%`,
  left: `${Math.random() * 100}%`,
  duration: 2 + Math.random() * 2,
  color: pickStarColor(),
  size: pickStarSize(),
}))

// Per-step dim tint (RGB triplet for outer box-shadow)
function tintForStep(stepIndex) {
  const map = [
    '8, 12, 30',    // 0 intro
    '14, 8, 24',    // 1 about
    '18, 12, 8',    // 2 credentials
    '8, 14, 24',    // 3 projects
    '10, 18, 22',   // 4 skills
    '14, 14, 22',   // 5 certifications
    '22, 14, 6',    // 6 achievements
    '16, 8, 24',    // 7 featured
    '6, 14, 22',    // 8 contact
  ]
  return map[stepIndex] ?? map[0]
}

function useIsMobile() {
  const [mobile, setMobile] = useState(
    () => typeof window !== 'undefined' && window.matchMedia('(max-width: 1023px)').matches
  )
  useEffect(() => {
    const mq = window.matchMedia('(max-width: 1023px)')
    function onChange(e) { setMobile(e.matches) }
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return mobile
}

export function ChiragModeTour({ active, onClose }) {
  const [stepIndex, setStepIndex] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [voiceOn, setVoiceOn] = useState(false)
  const [bloomPhase, setBloomPhase] = useState('idle')
  const [bloomOpacity, setBloomOpacity] = useState(1)
  const [targetRect, setTargetRect] = useState(null)
  const [scrollPausedToast, setScrollPausedToast] = useState(false)
  const [sweepKey, setSweepKey] = useState(0)
  const reducedMotion = usePrefersReducedMotion()
  const isMobile = useIsMobile()

  const advanceTimerRef = useRef(null)
  const scrollDeltaRef = useRef(0)
  const scrollToastTimerRef = useRef(null)
  const resizeMeasureTimerRef = useRef(null)
  const scrollMeasureTimerRef = useRef(null)
  const exitTimerARef = useRef(null)
  const exitTimerBRef = useRef(null)
  const isFirstStepRef = useRef(true)

  // Bloom in when active becomes true
  useEffect(() => {
    if (active) {
      setStepIndex(0)
      setIsPaused(false)
      setBloomOpacity(1)
      setBloomPhase('entering')
      isFirstStepRef.current = true
      setSweepKey(0)
      const delay = reducedMotion ? 300 : 1200
      const id = setTimeout(() => setBloomPhase('active'), delay)
      return () => clearTimeout(id)
    } else {
      setBloomPhase('idle')
    }
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  // Bloom-settle: fade layers once active so page shows through
  useEffect(() => {
    if (bloomPhase === 'active') {
      const id = setTimeout(() => setBloomOpacity(0.55), 0)
      return () => clearTimeout(id)
    }
    if (bloomPhase === 'exiting') {
      setBloomOpacity(1)
    }
  }, [bloomPhase])

  // Scene sweep on step transitions (skip first step)
  useEffect(() => {
    if (bloomPhase !== 'active') return
    if (isFirstStepRef.current) {
      isFirstStepRef.current = false
      return
    }
    setSweepKey(k => k + 1)
  }, [stepIndex, bloomPhase])

  function measureAndSetTargetRect(el) {
    const r = el.getBoundingClientRect()
    const vh = window.innerHeight
    const clampedTop = Math.max(r.top, 80)
    const clampedBottom = Math.min(r.bottom, vh - 20)
    setTargetRect({
      left: r.left,
      top: clampedTop,
      width: r.width,
      height: Math.max(120, clampedBottom - clampedTop),
      right: r.right,
      bottom: clampedBottom,
    })
  }

  // Scroll to target + measure rect
  useEffect(() => {
    if (bloomPhase !== 'active') return
    const el = document.getElementById(tour[stepIndex].targetId)
    if (!el) return
    const rect = el.getBoundingClientRect()
    const vh = window.innerHeight
    const block = rect.height > vh * 0.85 ? 'start' : 'center'
    el.scrollIntoView({ behavior: reducedMotion ? 'auto' : 'smooth', block })
    if (block === 'start') {
      if (!reducedMotion) {
        setTimeout(() => window.scrollBy({ top: -80, behavior: 'smooth' }), 50)
      } else {
        window.scrollBy({ top: -80 })
      }
    }
    const t = setTimeout(() => measureAndSetTargetRect(el), 700)
    return () => clearTimeout(t)
  }, [stepIndex, bloomPhase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Re-measure on resize
  useEffect(() => {
    if (bloomPhase !== 'active') return
    function onResize() {
      clearTimeout(resizeMeasureTimerRef.current)
      resizeMeasureTimerRef.current = setTimeout(() => {
        const el = document.getElementById(tour[stepIndex].targetId)
        if (el) measureAndSetTargetRect(el)
      }, 100)
    }
    window.addEventListener('resize', onResize)
    return () => {
      window.removeEventListener('resize', onResize)
      clearTimeout(resizeMeasureTimerRef.current)
    }
  }, [stepIndex, bloomPhase])

  // Re-measure on scroll (debounced)
  useEffect(() => {
    if (bloomPhase !== 'active') return
    function onScroll() {
      clearTimeout(scrollMeasureTimerRef.current)
      scrollMeasureTimerRef.current = setTimeout(() => {
        const el = document.getElementById(tour[stepIndex].targetId)
        if (el) measureAndSetTargetRect(el)
      }, 100)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
      clearTimeout(scrollMeasureTimerRef.current)
    }
  }, [stepIndex, bloomPhase])

  // Auto-advance
  useEffect(() => {
    if (bloomPhase !== 'active' || isPaused) return
    clearTimeout(advanceTimerRef.current)
    if (stepIndex < TOTAL - 1) {
      advanceTimerRef.current = setTimeout(() => {
        setStepIndex(i => i + 1)
      }, tour[stepIndex].advanceMs)
    } else {
      advanceTimerRef.current = setTimeout(() => handleClose(), 8000)
    }
    return () => clearTimeout(advanceTimerRef.current)
  }, [stepIndex, isPaused, bloomPhase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Voice narration
  useEffect(() => {
    if (!voiceOn || !active || bloomPhase !== 'active') return
    if (!('speechSynthesis' in window)) return
    const u = new SpeechSynthesisUtterance(tour[stepIndex].caption)
    u.rate = 1.0
    u.pitch = 1.0
    window.speechSynthesis.cancel()
    window.speechSynthesis.speak(u)
  }, [stepIndex, voiceOn, bloomPhase]) // eslint-disable-line react-hooks/exhaustive-deps

  // Cancel voice when toggled off
  useEffect(() => {
    if (!voiceOn && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel()
    }
  }, [voiceOn])

  // Keyboard controls
  useEffect(() => {
    if (!active) return
    function onKey(e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); setStepIndex(i => Math.max(0, i - 1)) }
      if (e.key === 'ArrowRight') { e.preventDefault(); setStepIndex(i => Math.min(TOTAL - 1, i + 1)) }
      if (e.key === ' ') { e.preventDefault(); setIsPaused(p => !p) }
      if (e.key === 'Escape') { e.preventDefault(); handleClose() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [active]) // eslint-disable-line react-hooks/exhaustive-deps

  // User scroll detection → pause tour
  useEffect(() => {
    if (bloomPhase !== 'active') return
    scrollDeltaRef.current = 0
    function onWheel(e) {
      scrollDeltaRef.current += Math.abs(e.deltaY)
      if (scrollDeltaRef.current > 80) {
        scrollDeltaRef.current = 0
        setIsPaused(true)
        setScrollPausedToast(true)
        clearTimeout(scrollToastTimerRef.current)
        scrollToastTimerRef.current = setTimeout(() => setScrollPausedToast(false), 4000)
      }
    }
    function onTouch() {
      scrollDeltaRef.current += 80
      if (scrollDeltaRef.current > 80) {
        scrollDeltaRef.current = 0
        setIsPaused(true)
        setScrollPausedToast(true)
        clearTimeout(scrollToastTimerRef.current)
        scrollToastTimerRef.current = setTimeout(() => setScrollPausedToast(false), 4000)
      }
    }
    window.addEventListener('wheel', onWheel, { passive: true })
    window.addEventListener('touchmove', onTouch, { passive: true })
    return () => {
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchmove', onTouch)
      clearTimeout(scrollToastTimerRef.current)
    }
  }, [bloomPhase])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel()
      clearTimeout(exitTimerARef.current)
      clearTimeout(exitTimerBRef.current)
    }
  }, [])

  function handleClose() {
    if ('speechSynthesis' in window) window.speechSynthesis.cancel()
    setBloomOpacity(1)
    clearTimeout(exitTimerARef.current)
    clearTimeout(exitTimerBRef.current)
    exitTimerARef.current = setTimeout(() => {
      setBloomPhase('exiting')
    }, reducedMotion ? 0 : 200)
    exitTimerBRef.current = setTimeout(() => {
      onClose()
      setBloomPhase('idle')
      setStepIndex(0)
    }, reducedMotion ? 300 : 1000)
  }

  if (!active && bloomPhase === 'idle') return null

  const step = tour[stepIndex]

  return (
    <>
      {/* Bloom overlay — fades to partial opacity once active */}
      <BloomOverlay bloomPhase={bloomPhase} bloomOpacity={bloomOpacity} reducedMotion={reducedMotion} />

      {/* Per-step edge light leaks */}
      {bloomPhase !== 'idle' && (
        <ChiragEdgeLight
          stepIndex={stepIndex}
          bloomOpacity={bloomOpacity}
          reducedMotion={reducedMotion}
        />
      )}

      {/* Target highlight ring */}
      {bloomPhase === 'active' && targetRect && (
        <TargetHighlight
          targetRect={targetRect}
          isMobile={isMobile}
          reducedMotion={reducedMotion}
          stepIndex={stepIndex}
        />
      )}

      {/* Stop-specific scene overlays */}
      <ChiragStopOverlays
        stepIndex={stepIndex}
        active={bloomPhase === 'active'}
        targetRect={targetRect}
        reducedMotion={reducedMotion}
      />

      {/* Scene transition sweep */}
      {!reducedMotion && bloomPhase === 'active' && sweepKey > 0 && (
        <TransitionSweep key={sweepKey} />
      )}

      {/* Controls UI */}
      {(bloomPhase === 'active' || bloomPhase === 'exiting') && (
        <div className="fixed inset-0 z-62 pointer-events-none">
          <div className="absolute bottom-8 left-8 max-w-sm pointer-events-auto">
            <AnimatePresence mode="wait">
              <motion.div
                key={stepIndex}
                role="dialog"
                aria-modal="true"
                aria-label="Chirag Mode guided tour"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.35 }}
                className="rounded-2xl backdrop-blur-xl p-5 shadow-2xl"
                style={{
                  background: 'linear-gradient(135deg, rgba(10,8,16,0.94), rgba(4,4,8,0.96))',
                  border: '1px solid rgba(34,211,238,0.3)',
                  boxShadow: '0 20px 60px -15px rgba(0,0,0,0.7), 0 0 30px -8px rgba(34,211,238,0.25), inset 0 0 20px -8px rgba(34,211,238,0.1)',
                }}
              >
                {/* Header row */}
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400"
                      style={{
                        background: 'rgba(124,58,237,0.15)',
                        border: '1px solid rgba(124,58,237,0.35)',
                      }}
                    >
                      <Sparkles size={10} className="text-amber-500" />
                      {String(stepIndex + 1).padStart(2, '0')} / {String(tour.length).padStart(2, '0')} — {step.label}
                    </span>
                    {scrollPausedToast && (
                      <p className="font-mono text-[10px] text-amber-400 mt-1.5">
                        Tour paused — press Space to resume, Esc to exit
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      className="w-8 h-8 rounded-full border border-cyan-400/30 flex items-center justify-center hover:bg-cyan-400/10 transition text-cyan-400"
                      aria-label={voiceOn ? 'Turn voice off' : 'Turn voice on'}
                      aria-pressed={voiceOn}
                      onClick={() => setVoiceOn(v => !v)}
                    >
                      {voiceOn ? <Volume2 size={14} /> : <VolumeX size={14} />}
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-cyan-400/30 flex items-center justify-center hover:bg-cyan-400/10 transition text-cyan-400"
                      aria-label={isPaused ? 'Resume tour' : 'Pause tour'}
                      onClick={() => setIsPaused(p => !p)}
                    >
                      {isPaused ? <Play size={14} /> : <Pause size={14} />}
                    </button>
                    <button
                      className="w-8 h-8 rounded-full border border-cyan-400/30 flex items-center justify-center hover:bg-cyan-400/10 transition text-cyan-400"
                      aria-label="Exit Chirag Mode"
                      onClick={handleClose}
                    >
                      <X size={14} />
                    </button>
                  </div>
                </div>

                {/* Caption */}
                <p aria-live="polite" className="font-serif text-lg text-bone-50 leading-snug mb-4">
                  {step.caption}
                </p>

                {/* Progress bar */}
                <div
                  className="w-full rounded-full overflow-hidden"
                  style={{ height: '3px', background: 'rgba(250,250,247,0.12)' }}
                >
                  <ProgressBar
                    key={`${stepIndex}-${isPaused ? 'paused' : 'running'}`}
                    durationMs={step.advanceMs}
                    isPaused={isPaused}
                  />
                </div>

                {/* Nav row */}
                <div className="flex items-center justify-between mt-4">
                  <button
                    className="flex items-center gap-1 font-mono text-xs text-cyan-400 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={stepIndex === 0}
                    onClick={() => setStepIndex(i => Math.max(0, i - 1))}
                  >
                    <ChevronLeft size={12} /> prev
                  </button>

                  {/* Dot indicators */}
                  <div className="flex items-center gap-1.5">
                    {tour.map((_, i) => (
                      <motion.button
                        key={i}
                        onClick={() => setStepIndex(i)}
                        aria-label={`Go to step ${i + 1}`}
                        animate={i === stepIndex && !reducedMotion ? { scale: [1, 1.2, 1] } : { scale: 1 }}
                        transition={i === stepIndex ? { duration: 2.2, repeat: Infinity, ease: 'easeInOut' } : {}}
                        className={`rounded-full transition-colors ${
                          i === stepIndex ? 'w-2 h-2 bg-cyan-400' : 'w-1.5 h-1.5 bg-bone-50/30 hover:bg-bone-50/60'
                        }`}
                        style={i === stepIndex ? {
                          boxShadow: '0 0 0 3px rgba(245,158,11,0.3), 0 0 12px rgba(34,211,238,0.6)',
                        } : {}}
                      />
                    ))}
                  </div>

                  <button
                    className="flex items-center gap-1 font-mono text-xs text-cyan-400 hover:underline disabled:opacity-30 disabled:cursor-not-allowed"
                    disabled={stepIndex === TOTAL - 1}
                    onClick={() => setStepIndex(i => Math.min(TOTAL - 1, i + 1))}
                  >
                    next <ChevronRight size={12} />
                  </button>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      )}
    </>
  )
}

// ─── Progress bar ────────────────────────────────────────────────────────────

function ProgressBar({ durationMs, isPaused }) {
  const width = useMotionValue('0%')

  useEffect(() => {
    if (isPaused) return
    const controls = animate(width, '100%', { duration: durationMs / 1000, ease: 'linear' })
    return () => controls.stop()
  }, [isPaused]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="h-full rounded-full"
      style={{
        width,
        background: 'linear-gradient(90deg, #22D3EE 0%, #7C3AED 100%)',
        boxShadow: '0 0 10px rgba(34,211,238,0.5)',
      }}
    />
  )
}

// ─── Bloom overlay ───────────────────────────────────────────────────────────

function BloomOverlay({ bloomPhase, bloomOpacity, reducedMotion }) {
  const visible = bloomPhase === 'entering' || bloomPhase === 'active' || bloomPhase === 'exiting'
  if (!visible) return null

  if (reducedMotion) {
    return (
      <motion.div
        className="fixed inset-0 z-60 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{ opacity: bloomPhase === 'exiting' ? 0 : bloomOpacity }}
        transition={{ duration: 0.3 }}
        style={{
          background: 'linear-gradient(180deg, #0A0618 0%, #05050A 100%)',
        }}
        aria-hidden="true"
      >
        <div
          className="absolute inset-0"
          style={{ border: '1px solid rgba(124,58,237,0.22)', boxShadow: 'inset 0 0 80px -20px rgba(34,211,238,0.2), inset 0 0 200px -40px rgba(124,58,237,0.15)' }}
        />
      </motion.div>
    )
  }

  return <ClipBloom bloomPhase={bloomPhase} bloomOpacity={bloomOpacity} reducedMotion={reducedMotion} />
}

function ClipBloom({ bloomPhase, bloomOpacity, reducedMotion }) {
  const [radius, setRadius] = useState('0vmax')

  useEffect(() => {
    if (bloomPhase === 'entering') {
      requestAnimationFrame(() => setRadius('150vmax'))
    } else if (bloomPhase === 'exiting') {
      setRadius('0vmax')
    }
  }, [bloomPhase])

  const clipTransition = bloomPhase === 'exiting'
    ? 'clip-path 800ms cubic-bezier(0.4,0,0.2,1)'
    : 'clip-path 1200ms cubic-bezier(0.4,0,0.2,1)'

  return (
    <div
      className="fixed inset-0 z-60 pointer-events-none"
      style={{ clipPath: `circle(${radius} at 3rem calc(100% - 3rem))`, transition: clipTransition }}
      aria-hidden="true"
    >
      {/* Layer A: near-black base with faint indigo lift */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: bloomOpacity }}
        transition={{ duration: 0.6 }}
        style={{ background: 'linear-gradient(180deg, #0A0618 0%, #05050A 100%)' }}
      />

      {/* Layer B: multi-color stars */}
      <motion.div
        className="absolute inset-0"
        animate={{ opacity: Math.min(1, bloomOpacity * 1.27) }}
        transition={{ duration: 0.6 }}
      >
        {STARS.map(star => (
          <motion.span
            key={star.id}
            className="absolute rounded-full"
            style={{
              top: star.top,
              left: star.left,
              width: star.size.px,
              height: star.size.px,
              backgroundColor: star.color,
              filter: star.size.blurred ? 'blur(0.5px)' : undefined,
            }}
            animate={{ opacity: [0.2, 0.8, 0.2] }}
            transition={{ duration: star.duration, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
      </motion.div>

      {/* Layer C: grain boost */}
      <motion.div
        className="absolute inset-0 grain mix-blend-overlay"
        animate={{ opacity: bloomOpacity * 0.36 }}
        transition={{ duration: 0.6 }}
        style={{ opacity: 0.05 }}
      />

      {/* Layer D: gradient border pulse */}
      <motion.div
        className="absolute inset-0"
        animate={{
          opacity: [0.25 * bloomOpacity, 0.45 * bloomOpacity, 0.25 * bloomOpacity],
        }}
        transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
        style={{
          border: '1px solid rgba(124,58,237,0.22)',
          boxShadow: 'inset 0 0 80px -20px rgba(34,211,238,0.2), inset 0 0 200px -40px rgba(124,58,237,0.15)',
        }}
      />
    </div>
  )
}

// ─── Target highlight ring ───────────────────────────────────────────────────

function TargetHighlight({ targetRect, isMobile, reducedMotion, stepIndex }) {
  const pad = 24
  const left = targetRect.left - pad
  const top = targetRect.top - pad
  const width = targetRect.width + pad * 2
  const height = targetRect.height + pad * 2

  const tint = tintForStep(stepIndex)
  const dimOuter = `0 0 0 9999px rgba(${tint}, 0.72)`
  const ringBase = isMobile
    ? '0 0 40px -10px rgba(34,211,238,0.35), inset 0 0 18px -8px rgba(34,211,238,0.12)'
    : '0 0 60px -10px rgba(34,211,238,0.35), inset 0 0 24px -8px rgba(34,211,238,0.15)'
  const ringBright = isMobile
    ? '0 0 40px -10px rgba(34,211,238,0.50), inset 0 0 18px -8px rgba(34,211,238,0.12)'
    : '0 0 60px -10px rgba(34,211,238,0.50), inset 0 0 24px -8px rgba(34,211,238,0.15)'
  const baseShadow = `${dimOuter}, ${ringBase}`
  const brightShadow = `${dimOuter}, ${ringBright}`

  // Scale "kiss" motion value — triggered on each stepIndex change
  const scale = useMotionValue(1)
  useEffect(() => {
    if (reducedMotion) return
    scale.set(1.04)
    const controls = animate(scale, 1, { duration: 0.7, ease: [0.22, 1, 0.36, 1] })
    return () => controls.stop()
  }, [stepIndex]) // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <motion.div
      className="fixed z-61 rounded-2xl pointer-events-none"
      animate={{
        left, top, width, height,
        boxShadow: reducedMotion ? baseShadow : [baseShadow, brightShadow, baseShadow],
      }}
      transition={{
        left: reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        top: reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        width: reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        height: reducedMotion ? { duration: 0 } : { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
        boxShadow: reducedMotion ? { duration: 0 } : { duration: 3.5, repeat: Infinity, ease: 'easeInOut' },
      }}
      style={{
        scale,
        border: '1px solid rgba(34,211,238,0.55)',
      }}
    />
  )
}

// ─── Scene transition sweep ──────────────────────────────────────────────────

function TransitionSweep() {
  return (
    <div className="fixed inset-0 z-62 pointer-events-none">
      <motion.div
        style={{
          position: 'absolute',
          top: '-50%',
          bottom: '-50%',
          width: '40%',
          background: 'linear-gradient(105deg, transparent 0%, rgba(34,211,238,0.08) 40%, rgba(124,58,237,0.12) 50%, rgba(34,211,238,0.08) 60%, transparent 100%)',
          filter: 'blur(20px)',
        }}
        initial={{ x: '-50vw', opacity: 0, rotate: 10 }}
        animate={{ x: '120vw', opacity: [0, 1, 0], rotate: 10 }}
        transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
      />
    </div>
  )
}

export default ChiragModeTour
