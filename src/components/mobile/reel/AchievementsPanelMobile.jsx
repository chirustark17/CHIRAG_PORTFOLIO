import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Trophy } from 'lucide-react'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

export default function AchievementsPanelMobile({ slide, active }) {
  const reducedMotion = usePrefersReducedMotion()
  const [animKey, setAnimKey] = useState(0)

  useEffect(() => {
    if (active) setAnimKey(k => k + 1)
  }, [active])

  return (
    <article className="w-full max-w-md flex flex-col gap-4">
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

      <motion.div
        key={animKey}
        initial={reducedMotion ? { scale: 1, rotate: 0, opacity: 1 } : { scale: 0, rotate: -20, opacity: 0 }}
        animate={{ scale: 1, rotate: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.2 }}
        className="self-start"
        aria-hidden="true"
      >
        <Trophy size={40} className="text-amber-500" />
      </motion.div>

      <div key={`cards-${animKey}`} className="flex flex-col gap-3">
        {slide.items.map((item, i) => (
          <motion.div
            key={item.title}
            initial={reducedMotion ? false : { opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + i * 0.15 }}
            className="rounded-2xl p-4 flex flex-col gap-2"
            style={{
              background: 'rgba(250,250,247,0.04)',
              border: '1px solid rgba(250,250,247,0.1)',
            }}
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-amber-500 bg-amber-500/15 rounded-full px-2 py-0.5">
                {item.rank}
              </span>
              <span className="font-mono text-[10px] text-bone-50/50 uppercase tracking-wider">
                {item.rankOf}
              </span>
            </div>
            <h3 className="font-serif text-lg text-bone-50 leading-snug">{item.title}</h3>
            <p className="font-sans text-sm text-bone-50/70 leading-relaxed">{item.description}</p>
          </motion.div>
        ))}
      </div>
    </article>
  )
}
