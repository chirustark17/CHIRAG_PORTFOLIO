import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { TypewriterText } from '../../ReelSlides/TypewriterText'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

// "Chirag K S" = 9 chars × 90ms = 810ms starting at 200ms → done at 1010ms
// Subtitle delay = 1010 + 190 ≈ 1200ms, "Data Science + Cloud" = 20 chars × 60ms = 1200ms → done at 2400ms
// Tagline delay = 2400 + 400 = 2800ms
// Underline delay = 2.5s

export default function TitlePanelMobile({ slide, active }) {
  const reducedMotion = usePrefersReducedMotion()
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (active) setAnimKey(k => k + 1)
  }, [active])

  return (
    <article className="w-full max-w-md flex flex-col gap-4">
      <header>
        <motion.span
          className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {slide.eyebrow}
        </motion.span>

        <h2
          id={active ? 'reel-mobile-active-title' : undefined}
          className="font-serif text-5xl text-bone-50 leading-[0.95]"
        >
          {animKey > 0 ? (
            <TypewriterText
              key={`headline-${animKey}`}
              text={slide.headline}
              speed={90}
              delay={200}
              showCursor
            />
          ) : (
            slide.headline
          )}
        </h2>

        <p className="font-serif text-2xl text-bone-50/80 leading-tight mt-3">
          {animKey > 0 ? (
            <TypewriterText
              key={`subtitle-${animKey}`}
              text={slide.subtitle}
              speed={60}
              delay={1200}
              showCursor
            />
          ) : (
            slide.subtitle
          )}
        </p>
      </header>

      <motion.div
        className="h-0.5 w-16 bg-cyan-400"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{
          duration: reducedMotion ? 0.3 : 0.6,
          ease: 'easeOut',
          delay: reducedMotion ? 0 : 2.5,
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
          delay: reducedMotion ? 0 : 2.8,
        }}
      >
        // {slide.tagline}
      </motion.p>
    </article>
  )
}
