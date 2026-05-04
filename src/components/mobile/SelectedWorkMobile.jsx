import { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence, useMotionValue, useTransform, animate } from 'framer-motion'
import showcase from '../../data/showcase'
import { SectionHeading } from '../SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

// ─── CardVisual ────────────────────────────────────────────────────────────────
// Self-contained dark-tone card surface (ink-950 light / bone-50 dark) so the
// card always reads as a cinematic poster regardless of page theme.
function CardVisual({ item, active }) {
  const [imageFailed, setImageFailed] = useState(false)

  return (
    <article
      className={`w-full h-full rounded-3xl overflow-hidden flex flex-col border bg-ink-950 dark:bg-bone-50 ${active ? '' : 'pointer-events-none'}`}
      style={{
        borderColor: 'rgba(34,211,238,0.18)',
        boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)',
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
}

// ─── PeekCard ──────────────────────────────────────────────────────────────────
// Off-stage neighbour card that partially enters the frame during drag.
function PeekCard({ item, side, dragX, containerWidth }) {
  const x = useTransform(dragX, (dx) => {
    const base = side === 'right' ? containerWidth : -containerWidth
    return base + dx * 0.3
  })
  const opacity = useTransform(dragX, (dx) => {
    if (side === 'right') return Math.min(1, Math.max(0, -dx / 80))
    return Math.min(1, Math.max(0, dx / 80))
  })

  return (
    <motion.div
      className="absolute inset-0 pointer-events-none"
      style={{ x, opacity, zIndex: 0 }}
      aria-hidden
    >
      <CardVisual item={item} active={false} />
    </motion.div>
  )
}

// ─── SwipeHint ─────────────────────────────────────────────────────────────────
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
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, 0] }}
        transition={{ duration: 2, times: [0, 0.2, 0.7, 1] }}
        className="absolute bottom-10 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400"
      >
        drag to rotate
      </motion.span>
    </motion.div>
  )
}

// ─── PipIndicator ──────────────────────────────────────────────────────────────
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

// ─── Stage ────────────────────────────────────────────────────────────────────
// AnimatePresence manages the center-card enter/exit transitions.
// dragX (updated via onDrag) drives the peek cards' positions separately.
function Stage({
  showcase, activeIndex, dragX, onNext, onPrev,
  dismissHint, reducedMotion, hintVisible, hintCycleCount,
}) {
  const total = showcase.length
  const containerRef = useRef(null)
  const [containerWidth, setContainerWidth] = useState(380)
  const [commitDir, setCommitDir] = useState('left') // 'left' = next, 'right' = prev

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const ro = new ResizeObserver(([entry]) => setContainerWidth(entry.contentRect.width))
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  const SWIPE_DISTANCE = 60
  const SWIPE_VELOCITY = 400

  const handleDragEnd = (_, info) => {
    dismissHint()
    dragX.set(0)
    const dx = info.offset.x
    const vx = info.velocity.x
    const isHorizontal = Math.abs(dx) > Math.abs(info.offset.y) * 1.2
    const isCommit = isHorizontal && (Math.abs(dx) > SWIPE_DISTANCE || Math.abs(vx) > SWIPE_VELOCITY)
    if (isCommit) {
      if (dx < 0) { setCommitDir('left'); onNext() }
      else { setCommitDir('right'); onPrev() }
    } else {
      // snap-back handled automatically by dragConstraints spring
    }
  }

  const slideVariants = {
    enter: (dir) => ({
      x: dir === 'left' ? '100%' : '-100%',
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 280, damping: 30 },
    },
    exit: (dir) => ({
      x: dir === 'left' ? '-100%' : '100%',
      opacity: 0,
      transition: { duration: 0.22, ease: 'easeIn' },
    }),
  }

  const prevIdx = (activeIndex - 1 + total) % total
  const nextIdx = (activeIndex + 1) % total

  return (
    <div
      ref={containerRef}
      className="relative w-full mx-auto overflow-hidden"
      style={{ height: 'min(70vh, 540px)', maxWidth: '380px', touchAction: 'pan-y' }}
      aria-label="Featured projects rotating carousel"
      aria-roledescription="carousel"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === 'ArrowLeft') { e.preventDefault(); setCommitDir('right'); onPrev() }
        if (e.key === 'ArrowRight') { e.preventDefault(); setCommitDir('left'); onNext() }
      }}
    >
      {/* Peek cards (hidden off-stage, revealed during drag) */}
      {!reducedMotion && (
        <>
          <PeekCard
            item={showcase[prevIdx]}
            side="left"
            dragX={dragX}
            containerWidth={containerWidth}
          />
          <PeekCard
            item={showcase[nextIdx]}
            side="right"
            dragX={dragX}
            containerWidth={containerWidth}
          />
        </>
      )}

      {/* Center card with enter/exit animation */}
      <AnimatePresence initial={false} custom={commitDir}>
        <motion.div
          key={activeIndex}
          custom={commitDir}
          variants={reducedMotion ? {} : slideVariants}
          initial={reducedMotion ? false : 'enter'}
          animate={reducedMotion ? {} : 'center'}
          exit={reducedMotion ? {} : 'exit'}
          drag={reducedMotion ? false : 'x'}
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.18}
          dragMomentum={false}
          className="absolute inset-0 cursor-grab active:cursor-grabbing"
          style={{ touchAction: 'none', zIndex: 1 }}
          onDrag={(_, info) => dragX.set(info.offset.x)}
          onDragStart={dismissHint}
          onDragEnd={handleDragEnd}
          aria-label={`${showcase[activeIndex].title} — drag to see more`}
          role="group"
        >
          <CardVisual item={showcase[activeIndex]} active={true} />
        </motion.div>
      </AnimatePresence>

      {hintVisible && !reducedMotion && <SwipeHint cycle={hintCycleCount} />}
    </div>
  )
}

// ─── SelectedWorkMobile ────────────────────────────────────────────────────────
export default function SelectedWorkMobile() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintCycleCount, setHintCycleCount] = useState(0)
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

  const goNext = () => { dismissHint(); setActiveIndex(i => (i + 1) % total) }
  const goPrev = () => { dismissHint(); setActiveIndex(i => (i - 1 + total) % total) }

  return (
    <section
      id="selected-work"
      className="section relative px-5 py-20 flex flex-col gap-8"
      aria-labelledby="selected-work-heading-mobile"
    >
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
      />

      <PipIndicator total={total} active={activeIndex} />

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
  )
}
