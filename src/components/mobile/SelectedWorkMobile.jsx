import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, animate } from 'framer-motion'
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
}
@keyframes shimmer-pulse {
  0%, 100% { opacity: 0.85; }
  50%       { opacity: 1.0; }
}`

const CARD_COUNT = 4

// Fixed slot positions — cards animate between these, slots themselves never move
const SLOTS = {
  hidden_left:  { x: -280, rotate: -20, scale: 0.72, opacity: 0   },
  left:         { x: -95,  rotate: -12, scale: 0.85, opacity: 0.8 },
  center:       { x: 0,    rotate: 0,   scale: 1.0,  opacity: 1   },
  right:        { x: 95,   rotate: 12,  scale: 0.85, opacity: 0.8 },
  hidden_right: { x: 280,  rotate: 20,  scale: 0.72, opacity: 0   },
}

// zIndex is kept separate — snaps immediately on slot change, never tweened
const SLOT_Z = { hidden_left: 1, left: 2, center: 4, right: 2, hidden_right: 1 }

// Circular slot assignment: rel offset 0→center, 1→right, 2→hidden_right, 3→left
const SLOT_ORDER = ['center', 'right', 'hidden_right', 'left']

function getSlot(cardIndex, activeIndex) {
  const rel = ((cardIndex - activeIndex) % CARD_COUNT + CARD_COUNT) % CARD_COUNT
  return SLOT_ORDER[rel]
}

// ─── CardVisual ───────────────────────────────────────────────────────────────
function CardVisual({ item, active }) {
  const [imageFailed, setImageFailed] = useState(false)

  const article = (
    <article
      className={`w-full h-full rounded-3xl overflow-hidden flex flex-col border bg-ink-950 dark:bg-bone-50 ${active ? '' : 'pointer-events-none'}`}
      style={{
        position: 'relative',
        zIndex: 1,
        borderColor: active ? 'transparent' : 'rgba(34,211,238,0.18)',
        boxShadow: active ? undefined : '0 24px 60px -20px rgba(0,0,0,0.4)',
        borderRadius: active ? 'calc(1.5rem - 7px)' : undefined,
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
            style={{ background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(124,58,237,0.18))' }}
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

  if (!active) return article

  // Active card — wrapped in shimmer border
  return (
    <div
      className="relative w-full h-full rounded-3xl overflow-hidden"
      style={{ padding: '7px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)' }}
    >
      <div
        aria-hidden
        style={{
          position: 'absolute',
          inset: '-100%',
          background: 'conic-gradient(from 0deg, transparent 0deg, rgba(34,211,238,0.0) 20deg, rgba(34,211,238,1.0) 60deg, rgba(139,92,246,1.0) 100deg, rgba(34,211,238,0.8) 140deg, rgba(34,211,238,0.2) 180deg, transparent 220deg, transparent 360deg)',
          animation: 'shimmer-spin 2.2s linear infinite, shimmer-pulse 1.1s ease-in-out infinite',
        }}
      />
      {article}
    </div>
  )
}

// ─── SlotCard ─────────────────────────────────────────────────────────────────
// Pure declarative: animates to its slot whenever slotName changes.
// No motionValues, no useTransform — Framer springs from old slot to new.
function SlotCard({ item, slotName, isCenter, onTap, reducedMotion }) {
  const target = reducedMotion
    ? { x: SLOTS[slotName].x, rotate: 0, scale: SLOTS[slotName].scale, opacity: SLOTS[slotName].opacity }
    : SLOTS[slotName]

  return (
    <motion.div
      className="absolute inset-0 cursor-pointer"
      style={{ zIndex: SLOT_Z[slotName] }}
      animate={target}
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
      onClick={onTap}
    >
      <CardVisual item={item} active={isCenter} />
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
  showcase, activeIndex, setActiveIndex,
  dismissHint, reducedMotion, hintVisible, hintCycleCount,
  onFirstDrag,
}) {
  // Subtle tactile pan shift of the whole stage during drag — springs back on release
  const panX = useMotionValue(0)

  const didDragRef = useRef(false)
  const isDraggingRef = useRef(false)
  const pointerStartRef = useRef(null)
  const lastDxRef = useRef(0)
  const velocityHistoryRef = useRef([])

  function handlePointerDown(e) {
    didDragRef.current = false
    isDraggingRef.current = false
    lastDxRef.current = 0
    velocityHistoryRef.current = []
    pointerStartRef.current = { x: e.clientX, y: e.clientY }
    e.currentTarget.setPointerCapture(e.pointerId)
  }

  function handlePointerMove(e) {
    if (!pointerStartRef.current) return
    const dx = e.clientX - pointerStartRef.current.x
    const dy = e.clientY - pointerStartRef.current.y
    if (!isDraggingRef.current) {
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      if (Math.abs(dy) > Math.abs(dx) * 1.5) {
        pointerStartRef.current = null
        return
      }
      isDraggingRef.current = true
      didDragRef.current = true
      dismissHint()
      onFirstDrag()
    }
    lastDxRef.current = dx
    // Subtle whole-stage shift gives tactile connection to finger
    panX.set(dx * 0.15)
    const now = Date.now()
    velocityHistoryRef.current.push({ x: e.clientX, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter(p => now - p.t < 100)
  }

  function handlePointerUp() {
    if (!pointerStartRef.current) return
    pointerStartRef.current = null
    // Always spring pan back to rest
    animate(panX, 0, { type: 'spring', stiffness: 500, damping: 25 })
    if (!isDraggingRef.current) { isDraggingRef.current = false; return }
    isDraggingRef.current = false

    const history = velocityHistoryRef.current
    const velocityX = history.length >= 2
      ? (history[history.length - 1].x - history[0].x) /
        Math.max(1, history[history.length - 1].t - history[0].t) * 1000
      : 0
    velocityHistoryRef.current = []
    const dx = lastDxRef.current
    lastDxRef.current = 0

    // Velocity takes priority; displacement is fallback
    let advance = 0
    if      (velocityX < -300 || dx < -50) advance =  1
    else if (velocityX >  300 || dx >  50) advance = -1
    if (advance !== 0) {
      setActiveIndex(i => (i + advance + CARD_COUNT) % CARD_COUNT)
    }
  }

  return (
    <div
      className="relative w-full mx-auto"
      style={{
        height: 'min(65vh, 500px)',
        maxWidth: '380px',
        touchAction: 'pan-y',
        perspective: '800px',
      }}
      onPointerDown={reducedMotion ? undefined : handlePointerDown}
      onPointerMove={reducedMotion ? undefined : handlePointerMove}
      onPointerUp={reducedMotion ? undefined : handlePointerUp}
      onPointerCancel={reducedMotion ? undefined : handlePointerUp}
      aria-label="Featured projects carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (reducedMotion) return
        if (e.key === 'ArrowLeft')  { e.preventDefault(); setActiveIndex(i => (i + 1) % CARD_COUNT) }
        if (e.key === 'ArrowRight') { e.preventDefault(); setActiveIndex(i => (i - 1 + CARD_COUNT) % CARD_COUNT) }
      }}
    >
      {/* Ambient cyan glow — fixed at center */}
      {!reducedMotion && (
        <div
          aria-hidden
          className="absolute pointer-events-none rounded-full"
          style={{
            width: 380,
            height: 380,
            top: 'calc(50% - 190px)',
            left: 'calc(50% - 190px)',
            background: 'radial-gradient(circle, rgba(34,211,238,0.55) 0%, rgba(34,211,238,0.12) 45%, transparent 70%)',
            filter: 'blur(24px)',
            opacity: 0.65,
            zIndex: 0,
          }}
        />
      )}

      {/* Pan wrapper — applies subtle whole-stage shift during drag */}
      <motion.div className="absolute inset-0" style={{ x: panX }}>
        {showcase.map((item, i) => {
          const slotName = getSlot(i, activeIndex)
          const isCenter = slotName === 'center'
          return (
            <SlotCard
              key={i}
              item={item}
              slotName={slotName}
              isCenter={isCenter}
              reducedMotion={reducedMotion}
              onTap={() => {
                if (didDragRef.current) return
                if (isCenter) {
                  const href = showcase[i]?.href
                  if (href) window.open(href, '_blank', 'noopener,noreferrer')
                } else if (slotName === 'left') {
                  setActiveIndex(i => (i - 1 + CARD_COUNT) % CARD_COUNT)
                } else if (slotName === 'right') {
                  setActiveIndex(i => (i + 1) % CARD_COUNT)
                }
              }}
            />
          )
        })}
      </motion.div>

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
        setActiveIndex={setActiveIndex}
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
          swipe between projects
        </p>
      )}

      {reducedMotion && (
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={() => setActiveIndex(i => (i - 1 + total) % total)}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2
                       rounded-full border border-current/30
                       hover:border-cyan-400 hover:text-cyan-400 transition"
          >
            Previous
          </button>
          <button
            onClick={() => setActiveIndex(i => (i + 1) % total)}
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
