import { useContext, useRef, useState } from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import { ReelScrollContext } from '../ReelDeckMobile'
import projectsData from '../../../data/projects'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

export default function FeaturedPanelMobile({ slide, active }) {
  const reducedMotion = usePrefersReducedMotion()
  const [imgError, setImgError] = useState(false)
  const articleRef = useRef(null)
  const scrollContainerRef = useContext(ReelScrollContext)
  const github = projectsData.find(p => p.slug === 'tableau-dashboards')?.github

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

      <div className="relative rounded-2xl overflow-hidden h-65">
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
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Tableau Dashboards on GitHub"
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 z-10 hover:scale-110 transition-transform"
            style={{ background: 'rgba(10,8,16,0.85)', border: '1px solid rgba(34,211,238,0.3)' }}
          >
            <GitHubIcon />
          </a>
        )}
      </div>

      <p className="font-sans text-base text-bone-50/80 leading-relaxed">
        {slide.caption}
      </p>
    </article>
  )
}
