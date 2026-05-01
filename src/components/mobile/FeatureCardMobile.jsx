import { useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

function ImageWithFallback({ src, alt, className, style, motionProps }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="absolute inset-0 flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-xl p-6 text-center text-ink-950 dark:text-bone-50">
        {alt}
      </div>
    )
  }
  return (
    <motion.img
      src={src}
      alt={alt}
      className={className}
      style={style}
      loading="lazy"
      decoding="async"
      onError={() => setError(true)}
      {...motionProps}
    />
  )
}

export default function FeatureCardMobile({ item, index }) {
  const reducedMotion = usePrefersReducedMotion()
  const articleRef = useRef(null)

  const { scrollYProgress } = useScroll({
    target: articleRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-30, 30])

  const entranceProps = reducedMotion
    ? {}
    : {
        initial: { opacity: 0, y: 30 },
        whileInView: { opacity: 1, y: 0 },
        viewport: { once: true, margin: '-80px' },
        transition: { duration: 0.6, delay: index * 0.08, ease: [0.22, 1, 0.36, 1] },
      }

  const tapProps = reducedMotion ? {} : { whileTap: { scale: 0.99 } }

  return (
    <a
      href={item.href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={`${item.title} — opens in new tab`}
      className="block"
    >
      <motion.article
        ref={articleRef}
        className="relative rounded-3xl overflow-hidden border border-ink-950/[0.08] dark:border-bone-50/[0.08] bg-ink-950/[0.02] dark:bg-bone-50/[0.02]"
        style={{ boxShadow: '0 16px 40px -16px rgba(0,0,0,0.25)' }}
        {...entranceProps}
        {...tapProps}
      >
        {/* Image area with parallax */}
        <div className="relative h-[360px] overflow-hidden">
          <ImageWithFallback
            src={item.image}
            alt={item.title + ' featured screenshot'}
            className="absolute inset-0 w-full h-[110%] object-cover"
            style={reducedMotion ? {} : { y: parallaxY }}
          />
        </div>

        {/* Content below image */}
        <div className="p-5 flex flex-col gap-3">
          {/* Year */}
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85">
            {item.year}
          </span>

          {/* Title */}
          <h3 className="font-serif text-2xl leading-tight text-ink-950 dark:text-bone-50">
            {item.title}
          </h3>

          {/* Subtitle */}
          <p className="font-sans text-base opacity-80 leading-relaxed">
            {item.subtitle}
          </p>

          {/* Stack chips */}
          <div className="flex flex-wrap gap-1.5">
            {item.stack.map(t => (
              <span
                key={t}
                className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full bg-ink-950/[0.06] dark:bg-bone-50/[0.06] border border-ink-950/[0.1] dark:border-bone-50/[0.12]"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Explore link cue */}
          <div className="flex items-center gap-2 mt-2 font-mono text-xs uppercase tracking-wider text-cyan-400">
            <ArrowUpRight size={14} aria-hidden="true" />
            Explore project
          </div>
        </div>
      </motion.article>
    </a>
  )
}
