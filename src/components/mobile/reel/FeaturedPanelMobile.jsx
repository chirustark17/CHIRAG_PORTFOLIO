import { useContext, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { ReelScrollContext } from '../ReelDeckMobile'

export default function FeaturedPanelMobile({ slide, active }) {
  const reducedMotion = usePrefersReducedMotion()
  const [imgError, setImgError] = useState(false)
  const articleRef = useRef(null)
  const scrollContainerRef = useContext(ReelScrollContext)

  const { scrollYProgress } = useScroll({
    target: articleRef,
    container: scrollContainerRef,
    offset: ['start end', 'end start'],
  })
  const parallaxY = useTransform(scrollYProgress, [0, 1], [-25, 25])

  return (
    <article ref={articleRef} className="w-full max-w-md flex flex-col gap-4">
      <header>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3">
          {slide.eyebrow}
        </span>
        <h2
          id={active ? 'reel-mobile-active-title' : undefined}
          className="font-serif text-3xl text-bone-50 leading-tight"
        >
          {slide.title}
        </h2>
      </header>

      <div className="relative rounded-2xl overflow-hidden h-[260px]">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-xl text-bone-50 p-6 text-center">
            {slide.title}
          </div>
        ) : reducedMotion ? (
          <img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        ) : (
          <motion.img
            src={slide.image}
            alt={slide.title}
            loading="lazy"
            decoding="async"
            className="absolute inset-0 w-full h-[110%] object-cover"
            style={{ y: parallaxY }}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      <p className="font-sans text-base text-bone-50/80 leading-relaxed">
        {slide.caption}
      </p>
    </article>
  )
}
