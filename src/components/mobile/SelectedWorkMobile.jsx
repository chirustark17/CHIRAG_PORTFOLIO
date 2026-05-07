import { useState, useEffect, useRef } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'framer-motion'
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

// Fan layout constants
const CARD_COUNT = 4
const FAN_SPREAD = 38        // total degrees spread across all cards
const CARD_OFFSET_Y = 12     // px — cards further from center sit slightly lower
const CARD_SCALE_ACTIVE = 1.0
const CARD_SCALE_ADJACENT = 0.88
const CARD_SCALE_BACK = 0.78
const FAN_STEP = FAN_SPREAD / (CARD_COUNT - 1)  // ~12.67 degrees per position

// useTransform input/output ranges for drag → rotation mapping
const DRAG_RANGE = 300   // px
const ROT_RANGE  = 15    // degrees of fan shift over DRAG_RANGE
// px of drag needed to visually advance one card to front position
const DRAG_PER_STEP = FAN_STEP * DRAG_RANGE / ROT_RANGE  // ~253px

// Normalize raw relative position to the range closest to 0 for circular wrapping
function normalizeRelPos(raw) {
  let r = ((raw % CARD_COUNT) + CARD_COUNT) % CARD_COUNT
  if (r > CARD_COUNT / 2) r -= CARD_COUNT
  return r
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
        // Active card: shimmer wrapper provides the border effect; suppress the static border
        borderColor: active ? 'transparent' : 'rgba(34,211,238,0.18)',
        // Shadow lives on the wrapper for active cards (overflow:hidden would clip it otherwise)
        boxShadow: active ? undefined : '0 24px 60px -20px rgba(0,0,0,0.4)',
        // Tighten inner radius so corners look snug against the 7px shimmer gap
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
      style={{ padding: '7px', boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)' }}
    >
      {/* Oversized rotating div clipped to card shape — forms the traveling shimmer */}
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

// ─── FanCard ──────────────────────────────────────────────────────────────────
// Each card owns its useTransform calls — array-form so Framer uses its built-in
// interpolate function directly, no custom JS per frame.
function FanCard({ item, index, activeIndex, dragX, onTap, reducedMotion }) {
  const relPos = normalizeRelPos(index - activeIndex)
  const absPos = Math.abs(relPos)
  const isActive = absPos === 0
  const baseAngle = relPos * FAN_STEP
  const baseScale = isActive ? CARD_SCALE_ACTIVE : absPos === 1 ? CARD_SCALE_ADJACENT : CARD_SCALE_BACK
  // Active card slightly deflates as it drags away from rest
  const scaleAway = isActive ? CARD_SCALE_ADJACENT : baseScale

  const rot   = useTransform(dragX, [-DRAG_RANGE, 0, DRAG_RANGE], [baseAngle - ROT_RANGE, baseAngle, baseAngle + ROT_RANGE])
  const scale = useTransform(dragX, [-150, 0, 150], [scaleAway, baseScale, scaleAway])

  // Cards at abs >= 2 are hidden — opacity 0 prevents visible teleport on activeIndex change
  const opacity = absPos <= 1 ? 1 : 0
  const zIdx = CARD_COUNT - absPos
  const ty = absPos * CARD_OFFSET_Y

  return (
    <motion.div
      className="absolute inset-0"
      style={{
        rotate:      reducedMotion ? baseAngle : rot,
        scale:       reducedMotion ? baseScale : scale,
        translateY:  ty,
        opacity,
        zIndex:      zIdx,
        transformOrigin: 'center 160%',
        cursor: 'pointer',
      }}
      onClick={onTap}
    >
      <CardVisual item={item} active={isActive} />
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
  // dragX lives here — raw pixel offset from drag start, set directly with no multiplication
  const dragX = useMotionValue(0)

  const didDragRef = useRef(false)
  const isDraggingRef = useRef(false)
  const pointerStartRef = useRef(null)
  const velocityHistoryRef = useRef([])

  // Glow brightens symmetrically as drag magnitude increases (array-form)
  const glowOpacity = useTransform(dragX, [-150, 0, 150], [1.0, 0.54, 1.0])
  const glowScale   = useTransform(dragX, [-150, 0, 150], [1.0, 0.842, 1.0])

  // Animate dragX to the position where card `advance` steps away lands at front,
  // then on complete swap activeIndex and reset dragX — visually seamless because
  // the angles are identical: relPos*FAN_STEP + targetDx*(ROT_RANGE/DRAG_RANGE) = 0
  function commitAdvance(advance) {
    if (advance === 0) {
      animate(dragX, 0, { type: 'spring', stiffness: 500, damping: 22 })
      return
    }
    const targetDx  = -advance * DRAG_PER_STEP
    const newActive = (activeIndex + advance + CARD_COUNT) % CARD_COUNT
    animate(dragX, targetDx, {
      type: 'spring', stiffness: 500, damping: 22,
      onComplete: () => { setActiveIndex(newActive); dragX.set(0) },
    })
  }

  function handleCardTap(i) {
    if (didDragRef.current) return
    const r = normalizeRelPos(i - activeIndex)
    if (r === 0) {
      const href = showcase[i]?.href
      if (href) window.open(href, '_blank', 'noopener,noreferrer')
      return
    }
    // r=1 (right card) → advance 1 forward; r=-1 (left) → advance -1 (backward)
    commitAdvance(r)
  }

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
      if (Math.abs(dx) < 5 && Math.abs(dy) < 5) return
      // Cancel if gesture is primarily vertical
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
    // Raw pixels — no multiplication; useTransform in FanCard handles the mapping
    dragX.set(dx)
    const now = Date.now()
    velocityHistoryRef.current.push({ x: e.clientX, t: now })
    velocityHistoryRef.current = velocityHistoryRef.current.filter(p => now - p.t < 100)
  }

  function handlePointerUp() {
    if (!pointerStartRef.current) return
    pointerStartRef.current = null
    if (!isDraggingRef.current) { isDraggingRef.current = false; return }
    isDraggingRef.current = false
    const history = velocityHistoryRef.current
    const velocityX = history.length >= 2
      ? (history[history.length - 1].x - history[0].x) /
        Math.max(1, history[history.length - 1].t - history[0].t) * 1000
      : 0
    velocityHistoryRef.current = []
    const dx = dragX.get()
    // Velocity takes priority over displacement for flick detection
    let advance = 0
    if      (velocityX >  200) advance = -1
    else if (velocityX < -200) advance =  1
    else if (dx >  60)         advance = -1
    else if (dx < -60)         advance =  1
    commitAdvance(advance)
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
      aria-label="Featured projects fan deck"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (reducedMotion) return
        if (e.key === 'ArrowLeft')  { e.preventDefault(); handleCardTap((activeIndex + 1) % CARD_COUNT) }
        if (e.key === 'ArrowRight') { e.preventDefault(); handleCardTap((activeIndex - 1 + CARD_COUNT) % CARD_COUNT) }
      }}
    >
      {/* Ambient cyan glow — brightens with drag magnitude */}
      {!reducedMotion && (
        <motion.div
          aria-hidden
          className="absolute pointer-events-none rounded-full"
          style={{
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

      {/* All 4 cards rendered simultaneously, each driven by the shared dragX */}
      {showcase.map((item, i) => (
        <FanCard
          key={i}
          item={item}
          index={i}
          activeIndex={activeIndex}
          dragX={dragX}
          onTap={() => handleCardTap(i)}
          reducedMotion={reducedMotion}
        />
      ))}

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
          drag to spin
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
