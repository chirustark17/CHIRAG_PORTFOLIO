import { useEffect, useMemo, useRef, useState } from 'react'
import { AnimatePresence, animate, motion, useMotionValue, useSpring } from 'framer-motion'
import { Check, Copy, ExternalLink, Trophy } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'
import { getTransitionVariants } from './ReelTransitions'
import { TypewriterText } from './ReelSlides/TypewriterText'
import { ParallaxCard } from './ReelSlides/ParallaxCard'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

// ─── Shared slide wrapper ─────────────────────────────────────────────────────

function SlideWrapper({ slide, children }) {
  const headlineText = slide.title || slide.headline
  return (
    <article className="w-full max-w-4xl mx-auto">
      <header className="mb-6 md:mb-8">
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3">
          {slide.eyebrow}
        </span>
        <h2
          id={`reel-slide-${slide.id}`}
          className={
            slide.kind === 'title'
              ? 'font-serif text-5xl md:text-7xl lg:text-8xl text-bone-50 leading-tight'
              : 'font-serif text-3xl md:text-5xl lg:text-6xl text-bone-50 leading-tight'
          }
        >
          {headlineText}
        </h2>
        {slide.subtitle && (
          <p className="font-sans text-lg md:text-xl text-bone-50/75 mt-3">{slide.subtitle}</p>
        )}
      </header>
      {children}
    </article>
  )
}

// ─── Title slide ─────────────────────────────────────────────────────────────

function TitleSlide({ slide }) {
  const reducedMotion = usePrefersReducedMotion()
  return (
    <article className="w-full max-w-4xl mx-auto">
      <header className="mb-6 md:mb-8">
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          {slide.eyebrow}
        </motion.span>

        <h2
          id={`reel-slide-${slide.id}`}
          className="font-serif text-5xl md:text-7xl lg:text-8xl text-bone-50 leading-tight"
        >
          <TypewriterText
            text={slide.headline}
            speed={80}
            delay={200}
            showCursor={true}
          />
        </h2>

        <p className="font-sans text-lg md:text-xl text-bone-50/75 mt-3">
          <TypewriterText
            text={slide.subtitle}
            speed={60}
            delay={1100}
            showCursor={true}
          />
        </p>
      </header>

      <motion.div
        className="h-0.5 w-16 bg-cyan-400 mb-6"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reducedMotion ? 0.3 : 0.6,
          ease: 'easeOut',
          delay: reducedMotion ? 0 : 2.56,
        }}
        style={{ transformOrigin: 'left' }}
        aria-hidden="true"
      />

      <motion.p
        className="font-mono text-sm text-bone-50/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: reducedMotion ? 0.3 : 0.5,
          delay: reducedMotion ? 0 : 3.16,
        }}
      >
        // {slide.tagline}
      </motion.p>
    </article>
  )
}

// ─── Credentials slide ────────────────────────────────────────────────────────

function AnimatedCounter({ target }) {
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(reducedMotion ? target : 0)
  const width = useMotionValue('0%')

  useEffect(() => {
    if (reducedMotion) { setCount(target); return }
    const controls = animate(0, target, {
      duration: 1.5,
      ease: 'easeOut',
      onUpdate: v => setCount(Math.floor(v)),
    })
    animate(width, '100%', { duration: 1.5, ease: 'easeOut' })
    return () => controls.stop()
  }, [target, reducedMotion]) // eslint-disable-line react-hooks/exhaustive-deps

  return <>{count}</>
}

function CredentialsSlide({ slide }) {
  return (
    <SlideWrapper slide={slide}>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-8">
        {slide.stats.map(stat => (
          <div key={stat.label} className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-50/60">
              {stat.label}
            </span>
            <span
              className={`font-serif text-3xl md:text-4xl ${
                stat.tone === 'amber' ? 'text-amber-500' : 'text-cyan-400'
              }`}
            >
              {stat.value}
            </span>
          </div>
        ))}
      </div>

      <div className="border-t border-bone-50/15 pt-6">
        <div className="font-serif text-5xl md:text-6xl lg:text-7xl text-amber-500">
          <AnimatedCounter target={slide.counterTarget} />
        </div>
        <p className="font-mono text-xs text-bone-50/65 mt-2 max-w-xl">
          {slide.counterCaption}
        </p>
      </div>
    </SlideWrapper>
  )
}

// ─── Projects slide ───────────────────────────────────────────────────────────

function ProjectsSlide({ slide }) {
  const reducedMotion = usePrefersReducedMotion()
  const [hovered, setHovered] = useState(null)
  const containerRef = useRef(null)
  const isTouch = useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(hover: none)').matches,
    []
  )

  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 150, damping: 20 })
  const sy = useSpring(my, { stiffness: 150, damping: 20 })

  function handleMouseMove(e) {
    if (isTouch || reducedMotion) return
    const rect = containerRef.current.getBoundingClientRect()
    const xNorm = ((e.clientX - rect.left) / rect.width) * 2 - 1
    const yNorm = ((e.clientY - rect.top) / rect.height) * 2 - 1
    mx.set(xNorm)
    my.set(yNorm)
  }

  function handleMouseLeave() {
    mx.set(0)
    my.set(0)
    setHovered(null)
  }

  return (
    <SlideWrapper slide={slide}>
      <div
        className="relative w-full"
        style={{ perspective: '1200px', perspectiveOrigin: '50% 50%' }}
      >
        <div
          className="grid grid-cols-1 md:grid-cols-3 gap-6"
          style={{ transformStyle: 'preserve-3d' }}
          ref={containerRef}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
        >
          {slide.projects.map((proj, i) => (
            <ParallaxCard
              key={proj.slug}
              project={proj}
              index={i}
              mouseX={sx}
              mouseY={sy}
              hoveredIndex={hovered}
              onHover={() => setHovered(i)}
              onLeave={() => setHovered(null)}
              isTouch={isTouch}
              reducedMotion={reducedMotion}
            />
          ))}
        </div>
      </div>
    </SlideWrapper>
  )
}

// ─── Featured slide ───────────────────────────────────────────────────────────

function FeaturedSlide({ slide }) {
  const [imgError, setImgError] = useState(false)
  return (
    <SlideWrapper slide={slide}>
      <div className="rounded-3xl overflow-hidden border border-current/15 w-full">
        {imgError ? (
          <div className="aspect-video w-full flex items-center justify-center bg-gradient-to-br from-cyan-400/10 to-amber-500/10 font-serif text-2xl text-bone-50/70 p-8 text-center">
            {slide.title}
          </div>
        ) : (
          <img
            src={slide.image}
            alt={`${slide.title} screenshot`}
            loading="lazy"
            decoding="async"
            className="w-full aspect-video object-cover"
            onError={() => setImgError(true)}
          />
        )}
      </div>
      <p className="font-sans text-base md:text-lg text-bone-50/80 max-w-2xl mt-6">
        {slide.caption}
      </p>
    </SlideWrapper>
  )
}

// ─── Achievements slide ───────────────────────────────────────────────────────

function AchievementsSlide({ slide }) {
  return (
    <SlideWrapper slide={slide}>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {slide.items.map((item, i) => (
          <div
            key={i}
            className="rounded-2xl border border-current/15 p-6"
            style={{ background: 'rgba(10,8,16,0.55)' }}
          >
            <div
              className="inline-flex items-center gap-2 px-3 py-1 rounded-full font-mono text-xs uppercase text-amber-500"
              style={{
                background: 'rgba(245,158,11,0.12)',
                border: '1px solid rgba(245,158,11,0.45)',
              }}
            >
              <Trophy size={12} />
              {item.rank} · {item.rankOf}
            </div>
            <h3 className="font-serif text-2xl text-bone-50 mt-4">{item.title}</h3>
            <p className="font-sans text-sm text-bone-50/70 mt-2">{item.description}</p>
          </div>
        ))}
      </div>
    </SlideWrapper>
  )
}

// ─── Contact slide ────────────────────────────────────────────────────────────

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef(null)

  function handleCopy() {
    navigator.clipboard.writeText(value).then(() => {
      setCopied(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setCopied(false), 1500)
    })
  }

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return (
    <button
      onClick={handleCopy}
      aria-label="Copy email address"
      className={`w-9 h-9 rounded-full border border-current/30 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition text-bone-50/60 ${FOCUS_RING}`}
    >
      {copied ? <Check size={14} className="text-cyan-400" /> : <Copy size={14} />}
    </button>
  )
}

function ContactSlide({ slide }) {
  return (
    <SlideWrapper slide={slide}>
      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full mb-5"
        style={{
          background: 'rgba(34,211,238,0.1)',
          border: '1px solid rgba(34,211,238,0.4)',
        }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
        <span className="font-mono text-[10px] uppercase tracking-[0.15em] text-cyan-400">
          open to full-time roles
        </span>
      </div>

      <p className="font-sans text-lg text-bone-50/80 mb-8">{slide.tagline}</p>

      <div className="flex flex-col gap-3 max-w-md">
        {slide.links.map(link => (
          <div
            key={link.label}
            className="flex items-center justify-between px-5 py-4 rounded-xl border border-current/15 transition hover:border-cyan-400/45"
            style={{ background: 'rgba(250,250,247,0.02)' }}
          >
            <div className="flex flex-col min-w-0 mr-3">
              <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-bone-50/60">
                {link.label}
              </span>
              <span
                className={`font-sans text-base truncate ${
                  link.copyable ? 'text-cyan-400' : 'text-bone-50'
                }`}
              >
                {link.value}
              </span>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              {link.copyable && <CopyButton value={link.value} />}
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Open ${link.label} in new tab`}
                className={`w-9 h-9 rounded-full border border-current/30 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition text-bone-50/60 ${FOCUS_RING}`}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </SlideWrapper>
  )
}

// ─── Kind switch ─────────────────────────────────────────────────────────────

function SlideRenderer({ slide }) {
  switch (slide.kind) {
    case 'title':        return <TitleSlide slide={slide} />
    case 'credentials':  return <CredentialsSlide slide={slide} />
    case 'projects':     return <ProjectsSlide slide={slide} />
    case 'featured':     return <FeaturedSlide slide={slide} />
    case 'achievements': return <AchievementsSlide slide={slide} />
    case 'contact':      return <ContactSlide slide={slide} />
    default:             return null
  }
}

// ─── Viewport with per-pair transition variants ───────────────────────────────

export function ReelSlideViewport({ currentSlide, direction }) {
  const reducedMotion = usePrefersReducedMotion()

  const variants = useMemo(
    () => getTransitionVariants(currentSlide.kind, direction, reducedMotion),
    [currentSlide.kind, direction, reducedMotion]
  )

  return (
    <div className="relative w-full h-full overflow-hidden">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSlide.id}
          initial={variants.initial}
          animate={variants.animate}
          exit={variants.exit}
          transition={variants.transition}
          className="absolute inset-0 flex items-center justify-center p-6 md:p-12 lg:p-16 overflow-y-auto"
        >
          <SlideRenderer slide={currentSlide} />
        </motion.div>
      </AnimatePresence>
    </div>
  )
}

export default ReelSlideViewport
