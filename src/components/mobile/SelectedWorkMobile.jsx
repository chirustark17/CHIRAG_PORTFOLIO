import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import showcase from '../../data/showcase'
import { SectionHeading } from '../SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// SVG feTurbulence noise data URI — rendered once, used as grain texture
const GRAIN_SRC =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E\")"

// Shimmer border keyframes — injected once via <style> tag
const SHIMMER_CSS = `
@keyframes shimmer-spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}`

// ─── CardVisual ───────────────────────────────────────────────────────────────
function CardVisual({ item, active }) {
  const [imageFailed, setImageFailed] = useState(false)

  const article = (
    <article
      className={`w-full h-full rounded-3xl overflow-hidden flex flex-col border bg-ink-950 dark:bg-bone-50 ${active ? '' : 'pointer-events-none'}`}
      style={{
        position: 'relative',
        zIndex: 1,
        // Active card: shimmer wrapper provides the border effect; suppress the static border
        borderColor: active ? 'transparent' : 'rgba(34,211,238,0.18)',
        // Shadow lives on the wrapper for active cards (overflow:hidden would clip it otherwise)
        boxShadow: active ? undefined : '0 24px 60px -20px rgba(0,0,0,0.4)',
      }}
    >
      {/* Image area: top 55% */}
      <div
        className="relative w-full overflow-hidden"
        style={{ flex: '0 0 55%', background: 'rgba(10,10,20,0.6)' }}
      >
        {!imageFailed && item.image ? (
          <img
            src={item.image}
            alt={active ? item.title : ''}
            className="w-full h-full object-cover"
            loading="lazy"
            decoding="async"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div
            className="w-full h-full flex items-center justify-center font-serif text-2xl text-bone-50/70 p-6 text-center"
            style={{
              background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(124,58,237,0.18))',
            }}
          >
            {item.title}
          </div>
        )}
      </div>

      {/* Content area: bottom 45% */}
      <div className="flex-1 px-5 pb-5 pt-7 flex flex-col gap-2 overflow-hidden">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85">
          {item.year || 'featured'}
        </span>
        <h3 className="font-serif text-xl leading-tight text-bone-50 dark:text-ink-950">
          {item.title}
        </h3>
        <p className="font-sans text-xs opacity-80 leading-relaxed line-clamp-3 text-bone-50 dark:text-ink-950">
          {item.subtitle}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-auto">
          {(item.stack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full
                         bg-bone-50/8 dark:bg-ink-950/6
                         border border-bone-50/15 dark:border-ink-950/12
                         text-bone-50 dark:text-ink-950"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )

  // Peek cards (inactive) — plain card, no shimmer
  if (!active) return article

  // Active card — wrapped in shimmer border
  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden"
      style={{ padding: '1.5px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)' }}
    >
      {/* Oversized rotating div clipped to card shape — forms the traveling shimmer */}
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-100%',
          opacity: 0.5,
          background: 'conic-gradient(from 0deg, transparent 0%, rgba(34,211,238,1) 10%, transparent 20%)',
          animation: 'shimmer-spin 3.5s linear infinite',
        }}
      />
      {article}
    </div>
  )
}

// ─── PeekCard ─────────────────────────────────────────────────────────────────
function PeekCard({ item, side, dragX, containerWidth }) {
  const x = useTransform(dragX, (dx) => {
    const base = side === 'right' ? containerWidth : -containerWidth
    return base + dx * 0.3
  })
  const opacity = useTransform(dragX, (dx) => {
    if (side === 'right') return Math.min(1, Math.max(0, -dx / 80))
    return Math.min(1, Math.max(0, dx / 80))
  })
  const scale = useTransform(dragX, (dx) => {
    const progress = side === 'right'
      ? Math.min(1, Math.max(0, -dx / 60))
      : Math.min(1, Math.max(0, dx / 60))
    return 0.85 + progress * 0.1
  })

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x, opacity, scale, zIndex: 0 }}
      aria-hidden
    >
      <CardVisual item={item} active={false} />
    </motion.div>
  )
}

// ─── SwipeHint ────────────────────────────────────────────────────────────────
function SwipeHint({ cycle }) {
  return (
    <motion.div
      key={cycle}
      aria-hidden
      className="absolute inset-0 rounded-3xl pointer-events-none flex items-center justify-center z-5"
    >
      <motion.div
        initial={{ x: -80, opacity: 0, scale: 0.7 }}
        animate={{
          x: [80, 80, -80, -80, 80],
          opacity: [0, 0.9, 0.9, 0, 0],
          scale: [0.7, 1, 1, 0.7, 0.7],
        }}
        transition={{ duration: 2, times: [0, 0.18, 0.7, 0.85, 1], ease: 'easeInOut' }}
        className="w-12 h-12 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.6), transparent 70%)',
          boxShadow: '0 0 30px 8px rgba(34,211,238,0.5)',
        }}
      />
    </motion.div>
  )
}

// ─── PipIndicator ─────────────────────────────────────────────────────────────
function PipIndicator({ total, active }) {
  return (
    <div
      role="status"
      aria-label={`Project ${active + 1} of ${total}`}
      className="flex items-center justify-center gap-2"
    >
      {Array.from({ length: total }).map((_, i) => {
        const isActive = i === active
        return (
          <motion.span
            key={i}
            aria-hidden
            animate={{ width: isActive ? 24 : 6, opacity: isActive ? 1 : 0.35 }}
            transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="h-1.5 rounded-full bg-cyan-400 block"
            style={isActive ? {
              boxShadow: '0 0 0 3px rgba(245,158,11,0.25), 0 0 8px rgba(34,211,238,0.5)',
            } : {}}
          />
        )
      })}
    </div>
  )
}

// ─── Stage ───────────────────────────────────────────────────────────────────
function Stage({
  showcase, activeIndex, dragX, onNext, onPrev,
  dismissHint, reducedMotion, hintVisible, hintCycleCount,
  onFirstDrag,
}) {
  const total = showcase.length
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(380)
  const [commitDir, setCommitDir] = useState('left')

  // Drag state — refs to avoid stale closures and unnecessary re-renders
  const didDragRef = useRef(false)
  const isDraggingRef = useRef(false)
  const pointerStartRef = useRef(null)       // { x, y } at pointerdown
  const velocityHistoryRef = useRef([])      // [{ x, t }] sliding 100ms window

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  // ── Derived motion values ─────────────────────────────────────────────────

  // Smooth asymptotic resistance — tanh curve, no piecewise threshold jerk
  // Near-linear for small drags, gradually caps around ±140px regardless of input
  const resistedX = useTransform(dragX, (v) => {
    const max = 100
    return max * Math.tanh(v / max) * 1.4
  })

  // Glow: shifts at 0.3× speed, scales 320→380px and brightens 0.35→0.65 alpha with drag
  const glowX = useTransform(dragX, (dx) => dx * 0.3)
  const glowScale = useTransform(dragX, (v) => 0.842 + Math.min(Math.abs(v) / 60, 1) * 0.158)
  const glowOpacity = useTransform(dragX, (v) => 0.54 + Math.min(Math.abs(v) / 60, 1) * 0.46)

  // Card: subtle scale-down (1→0.96) during drag — magnetic pull-in feel
  const cardScale = useTransform(dragX, (v) => 1 - Math.min(Math.abs(v) / 120, 1) * 0.04)

  const SWIPE_DISTANCE = 60
  const SWIPE_VELOCITY = 400

  // ── Pointer handlers ──────────────────────────────────────────────────────

  function handlePointerDown(e) {
    didDragRef.current = false
    isDraggingRef.current = false
    velocityHistoryRef.current = []
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!pointerStartRef.current) return
    const dx = e.clientX - pointerStartRef.current.x
    const dy = e.clientY - pointerStartRef.current.y

    if (!isDraggingRef.current) {
      // Dead zone: ignore micro-movements
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      // Cancel horizontal tracking if gesture is primarily vertical
      if (Math.abs(dy) > Math.abs(dx) * 1.5) {
        pointerStartRef.current = null
        dragX.set(0)
        return
      }
      isDraggingRef.current = true
      didDragRef.current = true
      dismissHint()
      onFirstDrag()
    }

    dragX.set(dx)

    // Maintain a 100ms sliding window for velocity estimation
    const now = Date.now()
    velocityHistoryRef.current.push({ x: e.clientX, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter(p => now - p.t < 100)
  }

  function handlePointerUp(e) {
    if (!pointerStartRef.current) return
    pointerStartRef.current = null

    if (!isDraggingRef.current) {
      isDraggingRef.current = false
      return  // pure tap — onClick handles link opening
    }
    isDraggingRef.current = false

    const dx = dragX.get()
    const history = velocityHistoryRef.current
    const velocity = history.length >= 2
      ? (history[history.length - 1].x - history[0].x) /
        Math.max(1, history[history.length - 1].t - history[0].t) * 1000
      : 0
    velocityHistoryRef.current = []

    const isCommit = Math.abs(dx) > SWIPE_DISTANCE || Math.abs(velocity) > SWIPE_VELOCITY

    if (isCommit) {
      const goLeft = dx < 0 || velocity < -SWIPE_VELOCITY
      dragX.set(0)
      if (goLeft) { setCommitDir('left'); onNext() }
      else { setCommitDir('right'); onPrev() }
    } else {
      // Bounce: hard spring gives visible overshoot
      animate(dragX, 0, { type: 'spring', stiffness: 600, damping: 12, mass: 0.8 })
    }
  }

  // ── Slide variants ────────────────────────────────────────────────────────
  const slideVariants = {
    enter: (dir) => ({ x: dir === 'left' ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 280, damping: 30 } },
    exit: (dir) => ({ x: dir === 'left' ? '-100%' : '100%', opacity: 0, transition: { duration: 0.22, ease: 'easeIn' } }),
  }

  const prevIdx = (activeIndex - 1 + total) % total
  const nextIdx = (activeIndex + 1) % total

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto overflow-hidden"
      style={{
        height: 'min(65vh, 500px)',
        maxWidth: '380px',
        touchAction: 'pan-y',
        perspective: '600px',
      }}
      aria-label="Featured projects rotating carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); dragX.set(0); setCommitDir('right'); onPrev() }
        if (e.key === 'ArrowRight') { e.preventDefault(); dragX.set(0); setCommitDir('left'); onNext() }
      }}
    >
      {/* Ambient cyan glow — brightens and pulses outward with drag magnitude */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="absolute pointer-events-none rounded-full"
          style={{
            x: glowX,
            scale: glowScale,
            opacity: glowOpacity,
            width: 380,
            height: 380,
            top: 'calc(50% - 190px)',
            left: 'calc(50% - 190px)',
            background: 'radial-gradient(circle, rgba(34,211,238,0.65) 0%, rgba(34,211,238,0.15) 45%, transparent 70%)',
            filter: 'blur(24px)',
            zIndex: 0,
          }}
        />
      )}

      {/* Peek cards — scale up from 0.85→0.95 as user drags toward them */}
      {!reducedMotion && (
        <>
          <PeekCard item={showcase[prevIdx]} side="left" dragX={dragX} containerWidth={containerWidth} />
          <PeekCard item={showcase[nextIdx]} side="right" dragX={dragX} containerWidth={containerWidth} />
        </>
      )}

      {/* Center card:
          Outer motion.div — AnimatePresence slide-in/out (x controlled by variants)
          Inner motion.div — drag position + scale feedback (x = resistedX) */}
      <AnimatePresence initial={false} custom={commitDir}>
        <motion.div
          key={activeIndex}
          custom={commitDir}
          variants={reducedMotion ? {} : slideVariants}
          initial={reducedMotion ? false : 'enter'}
          animate={reducedMotion ? {} : 'center'}
          exit={reducedMotion ? {} : 'exit'}
          className="absolute inset-0"
          style={{ zIndex: 1 }}
        >
          <motion.div
            className="absolute inset-0 cursor-grab active:cursor-grabbing"
            style={{
              touchAction: reducedMotion ? 'auto' : 'none',
              x: reducedMotion ? 0 : resistedX,
              scale: reducedMotion ? 1 : cardScale,
            }}
            onPointerDown={reducedMotion ? undefined : handlePointerDown}
            onPointerMove={reducedMotion ? undefined : handlePointerMove}
            onPointerUp={reducedMotion ? undefined : handlePointerUp}
            onPointerCancel={reducedMotion ? undefined : handlePointerUp}
            onClick={() => {
              const href = showcase[activeIndex]?.href
              if (!didDragRef.current && href) window.open(href, '_blank', 'noopener,noreferrer')
            }}
            aria-label={`${showcase[activeIndex].title} — tap to open, drag to explore`}
            role="group"
          >
            <CardVisual item={showcase[activeIndex]} active={true} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {hintVisible && !reducedMotion && <SwipeHint cycle={hintCycleCount} />}
    </div>
  )
}

// ─── SelectedWorkMobile ───────────────────────────────────────────────────────
export default function SelectedWorkMobile() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintCycleCount, setHintCycleCount] = useState(0)
  const [hasDragged, setHasDragged] = useState(false)
  const reducedMotion = usePrefersReducedMotion()
  const dragX = useMotionValue(0)
  const total = showcase.length

  useEffect(() => {
    try {
      if (localStorage.getItem('orbitHintDismissed') === 'true') return
    } catch {}
    const t = setTimeout(() => setHintVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!hintVisible) return
    if (hintCycleCount >= 3) { setHintVisible(false); return }
    const t = setTimeout(() => setHintCycleCount(c => c + 1), 2400)
    return () => clearTimeout(t)
  }, [hintVisible, hintCycleCount])

  const dismissHint = () => {
    setHintVisible(false)
    try { localStorage.setItem('orbitHintDismissed', 'true') } catch {}
  }

  const handleFirstDrag = () => setHasDragged(true)

  const goNext = () => { dismissHint(); setActiveIndex(i => (i + 1) % total) }
  const goPrev = () => { dismissHint(); setActiveIndex(i => (i - 1 + total) % total) }

  return (
    <>
    <style>{SHIMMER_CSS}</style>
    <section
      id="selected-work"
      className="section relative px-5 pt-12 pb-14 flex flex-col gap-5"
      aria-labelledby="selected-work-heading-mobile"
    >
      {/* Grain texture overlay */}
      <div
        aria-hidden
        className="absolute inset-0 pointer-events-none"
        style={{ backgroundImage: GRAIN_SRC, opacity: 0.04, zIndex: 0 }}
      />

      <SectionHeading
        align="left"
        eyebrow="06 — selected work"
        title="Featured"
        subtitle="Four projects I'd put in front of anyone."
        id="selected-work-heading-mobile"
      />

      <Stage
        showcase={showcase}
        activeIndex={activeIndex}
        dragX={dragX}
        onNext={goNext}
        onPrev={goPrev}
        dismissHint={dismissHint}
        reducedMotion={reducedMotion}
        hintVisible={hintVisible}
        hintCycleCount={hintCycleCount}
        onFirstDrag={handleFirstDrag}
      />

      <PipIndicator total={total} active={activeIndex} />

      {/* Drag hint — visible until first interaction */}
      {!hasDragged && !reducedMotion && (
        <p
          className="font-mono text-center"
          style={{ fontSize: 11, opacity: 0.4, marginTop: -8 }}
          aria-hidden
        >
          drag to explore
        </p>
      )}

      {reducedMotion && (
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={goPrev}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2
                       rounded-full border border-current/30
                       hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            Previous
          </button>
          <button
            onClick={goNext}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2
                       rounded-full border border-current/30
                       hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            Next
          </button>
        </div>
      )}
    </section>
    </>
  )
}
