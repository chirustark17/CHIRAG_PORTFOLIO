import { useState, useEffect, useRef } from 'react'
import {
  motion,
  useMotionValue,
  useTransform,
  animate,
} from 'framer-motion'
import showcase from '../../data/showcase'
import { SectionHeading } from '../SectionHeading'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

function CardVisual({ item, compact = false }) {
  const [imageFailed, setImageFailed] = useState(false)

  if (compact) {
    return (
      <article
        className="w-full h-full rounded-3xl overflow-hidden relative bg-ink-950 dark:bg-bone-50 border"
        style={{
          borderColor: 'rgba(34,211,238,0.18)',
          boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)',
        }}
      >
        <div className="w-full h-full overflow-hidden bg-ink-950/6">
          {!imageFailed && item.image ? (
            <img
              src={item.image}
              alt=""
              aria-hidden="true"
              className="w-full h-full object-cover"
              loading="lazy"
              decoding="async"
              onError={() => setImageFailed(true)}
            />
          ) : (
            <div
              className="w-full h-full flex items-center justify-center font-serif text-2xl text-bone-50/70"
              style={{
                background: 'linear-gradient(135deg, rgba(34,211,238,0.18), rgba(124,58,237,0.18))',
              }}
            />
          )}
        </div>
      </article>
    )
  }

  return (
    <article
      className="w-full h-full rounded-3xl overflow-hidden relative border bg-ink-950 dark:bg-bone-50"
      style={{
        borderColor: 'rgba(34,211,238,0.18)',
        boxShadow: '0 24px 60px -20px rgba(0,0,0,0.4)',
      }}
    >
      <div className="relative w-full h-[60%] overflow-hidden bg-ink-950/[0.06]">
        {!imageFailed && item.image ? (
          <img
            src={item.image}
            alt={item.title}
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

      <div className="p-5 flex flex-col gap-2">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85">
          {item.year || 'featured'}
        </span>
        <h3 className="font-serif text-2xl leading-tight text-ink-950 dark:text-bone-50">
          {item.title}
        </h3>
        <p className="font-sans text-sm opacity-80 leading-relaxed line-clamp-2">
          {item.subtitle}
        </p>
        <div className="flex flex-wrap gap-1.5 mt-1">
          {(item.stack || []).slice(0, 4).map((tech) => (
            <span
              key={tech}
              className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full
                         bg-ink-950/[0.06] dark:bg-bone-50/[0.06]
                         border border-ink-950/[0.1] dark:border-bone-50/[0.12]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>
    </article>
  )
}

function BehindCard({ item, offset, reducedMotion }) {
  const scale = offset === 1 ? 0.92 : 0.84
  const yOffset = offset === 1 ? -14 : -24
  const rotate = offset === 1 ? -3 : 3
  const opacity = offset === 1 ? 0.6 : 0.3

  const transition = reducedMotion
    ? { duration: 0 }
    : { type: 'spring', stiffness: 220, damping: 26 }

  return (
    <motion.div
      initial={{ scale: scale * 0.92, y: yOffset - 8, opacity: 0 }}
      animate={{ scale, y: yOffset, rotate, opacity }}
      transition={transition}
      className="absolute inset-0 mx-auto"
      style={{ width: 'min(100%, 360px)' }}
      aria-hidden="true"
    >
      <CardVisual item={item} compact={true} />
    </motion.div>
  )
}

function SwipeHint({ cycle }) {
  return (
    <motion.div
      key={cycle}
      aria-hidden
      className="absolute inset-0 rounded-3xl pointer-events-none flex items-center justify-center"
    >
      {/* Finger ghost: appears on right, slides left to hint swipe-left = next */}
      <motion.div
        initial={{ x: -60, opacity: 0, scale: 0.8 }}
        animate={{
          x: [60, 60, -60, -60, 60],
          opacity: [0, 1, 1, 0, 0],
          scale: [0.8, 1, 1, 0.8, 0.8],
        }}
        transition={{ duration: 2, times: [0, 0.15, 0.7, 0.85, 1], ease: 'easeInOut' }}
        className="w-12 h-12 rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(34,211,238,0.6), transparent 70%)',
          boxShadow: '0 0 30px 8px rgba(34,211,238,0.5)',
        }}
      />
      <motion.span
        initial={{ opacity: 0, y: 10 }}
        animate={{
          opacity: [0, 1, 1, 0],
          y: [10, 0, 0, 0],
        }}
        transition={{ duration: 2, times: [0, 0.2, 0.7, 1] }}
        className="absolute bottom-12 font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400"
      >
        swipe to explore
      </motion.span>
    </motion.div>
  )
}

function TopCard({
  item, onSwipe, exitDirection, reducedMotion,
  hintVisible, hintCycleCount, onInteraction,
}) {
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const isDraggingRef = useRef(false)

  const rotate = useTransform(x, [-200, 0, 200], [-12, 0, 12])
  const cardOpacity = useTransform(
    [x, y],
    ([latestX, latestY]) => {
      const distance = Math.sqrt(latestX * latestX + latestY * latestY)
      return Math.max(0, 1 - distance / 400)
    }
  )

  const cyanTintOpacity = useTransform(x, [-150, 0], [0.45, 0])
  const violetTintOpacity = useTransform(x, [0, 150], [0, 0.45])
  const amberTintOpacity = useTransform(y, [-150, 0], [0.35, 0])
  const edgeGlow = useTransform(x, [-150, 0, 150], [0.6, 0, 0.6])

  useEffect(() => {
    if (!exitDirection) return
    const targetX = exitDirection === 'left' ? -window.innerWidth * 1.2
                  : exitDirection === 'right' ? window.innerWidth * 1.2
                  : 0
    const targetY = exitDirection === 'up' ? -window.innerHeight * 0.8 : 0
    animate(x, targetX, { duration: 0.38, ease: [0.22, 1, 0.36, 1] })
    animate(y, targetY, { duration: 0.38, ease: [0.22, 1, 0.36, 1] })
  }, [exitDirection, x, y])

  const SWIPE_DISTANCE = 100
  const SWIPE_VELOCITY = 500

  const handleDragStart = () => {
    isDraggingRef.current = true
    onInteraction()
  }

  const handleDragEnd = (_event, info) => {
    isDraggingRef.current = false
    const dx = info.offset.x
    const dy = info.offset.y
    const vx = info.velocity.x
    const vy = info.velocity.y

    const horizontalCommit = Math.abs(dx) > SWIPE_DISTANCE || Math.abs(vx) > SWIPE_VELOCITY
    const verticalUpCommit = dy < -SWIPE_DISTANCE || vy < -SWIPE_VELOCITY

    if (verticalUpCommit && Math.abs(dy) > Math.abs(dx) * 1.2) {
      onSwipe('next')
      return
    }

    if (horizontalCommit && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) onSwipe('next')
      else onSwipe('prev')
      return
    }

    animate(x, 0, { type: 'spring', stiffness: 380, damping: 26 })
    animate(y, 0, { type: 'spring', stiffness: 380, damping: 26 })
  }

  return (
    <motion.div
      drag={reducedMotion ? false : true}
      dragElastic={0.25}
      dragMomentum={false}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
      whileTap={reducedMotion ? {} : { scale: 1.02 }}
      style={{
        x, y, rotate, opacity: cardOpacity,
        width: 'min(100%, 360px)',
        touchAction: 'none',
      }}
      className="absolute inset-0 mx-auto cursor-grab active:cursor-grabbing"
      aria-label={`${item.title} — swipe to see more`}
      role="group"
    >
      <div className="relative w-full h-full">
        <CardVisual item={item} />

        {/* Cyan tint — swipe left (next) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            opacity: reducedMotion ? 0 : cyanTintOpacity,
            background: 'linear-gradient(135deg, rgba(34,211,238,0.4), transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Violet tint — swipe right (prev) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            opacity: reducedMotion ? 0 : violetTintOpacity,
            background: 'linear-gradient(225deg, rgba(124,58,237,0.4), transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Amber tint — swipe up (next alt) */}
        <motion.div
          aria-hidden
          className="absolute inset-0 rounded-3xl pointer-events-none"
          style={{
            opacity: reducedMotion ? 0 : amberTintOpacity,
            background: 'linear-gradient(0deg, rgba(245,158,11,0.35), transparent 70%)',
            mixBlendMode: 'screen',
          }}
        />
        {/* Edge glow halo */}
        <motion.div
          aria-hidden
          className="absolute -inset-2 rounded-3xl pointer-events-none"
          style={{
            opacity: reducedMotion ? 0 : edgeGlow,
            boxShadow: '0 0 40px 8px rgba(34,211,238,0.4)',
            filter: 'blur(8px)',
          }}
        />

        {hintVisible && !reducedMotion && (
          <SwipeHint cycle={hintCycleCount} />
        )}
      </div>
    </motion.div>
  )
}

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
            animate={{
              width: isActive ? 24 : 6,
              opacity: isActive ? 1 : 0.35,
            }}
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

export default function SelectedWorkMobile() {
  const [activeIndex, setActiveIndex] = useState(0)
  const [exitDirection, setExitDirection] = useState(null)
  const [hintVisible, setHintVisible] = useState(false)
  const [hintCycleCount, setHintCycleCount] = useState(0)
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    try {
      if (localStorage.getItem('selectedWorkHintDismissed') === 'true') return
    } catch {}
    const t = setTimeout(() => setHintVisible(true), 800)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!hintVisible) return
    if (hintCycleCount >= 3) {
      setHintVisible(false)
      return
    }
    const t = setTimeout(() => {
      setHintCycleCount(c => c + 1)
    }, 2400)
    return () => clearTimeout(t)
  }, [hintVisible, hintCycleCount])

  const dismissHint = () => {
    setHintVisible(false)
    try { localStorage.setItem('selectedWorkHintDismissed', 'true') } catch {}
  }

  const advance = (direction) => {
    dismissHint()
    setExitDirection(direction === 'next' ? 'left' : 'right')
    setTimeout(() => {
      setActiveIndex(prev =>
        direction === 'next'
          ? (prev + 1) % showcase.length
          : (prev - 1 + showcase.length) % showcase.length
      )
      setExitDirection(null)
    }, 380)
  }

  const visibleCards = [0, 1, 2].map((offset) => ({
    item: showcase[(activeIndex + offset) % showcase.length],
    offset,
    key: `${(activeIndex + offset) % showcase.length}-${activeIndex}`,
  }))

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

      <div
        className="relative w-full h-[480px] flex items-center justify-center"
        style={{ touchAction: 'pan-y' }}
        aria-label="Featured projects swipe deck"
        aria-roledescription="carousel"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'ArrowLeft') advance('prev')
          if (e.key === 'ArrowRight') advance('next')
        }}
      >
        {/* Behind cards rendered first so top card is on top in DOM */}
        {visibleCards.slice().reverse().map((card) =>
          card.offset === 0 ? (
            <TopCard
              key={card.key}
              item={card.item}
              onSwipe={advance}
              exitDirection={exitDirection}
              reducedMotion={reducedMotion}
              hintVisible={hintVisible}
              hintCycleCount={hintCycleCount}
              onInteraction={dismissHint}
            />
          ) : (
            <BehindCard
              key={card.key}
              item={card.item}
              offset={card.offset}
              reducedMotion={reducedMotion}
            />
          )
        )}
      </div>

      <PipIndicator total={showcase.length} active={activeIndex} />

      {reducedMotion && (
        <div className="flex justify-center gap-3 mt-2">
          <button
            onClick={() => advance('prev')}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-current/30"
          >
            Previous
          </button>
          <button
            onClick={() => advance('next')}
            className="font-mono text-xs uppercase tracking-wider px-4 py-2 rounded-full border border-current/30"
          >
            Next
          </button>
        </div>
      )}
    </section>
  )
}
