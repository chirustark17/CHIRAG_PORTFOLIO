import { useState } from 'react'
import { Link } from 'react-scroll'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../hooks/usePrefersReducedMotion'

const FOCUS_RING =
  'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950'

function ProfilePhoto() {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="w-full h-full bg-linear-to-br from-cyan-400/20 to-amber-500/20 flex items-center justify-center">
        <span className="font-serif text-7xl">CK</span>
      </div>
    )
  }
  return (
    <img
      src="/images/profile.jpg"
      alt="Chirag K S"
      className="w-full h-full object-cover"
      loading="eager"
      fetchpriority="high"
      decoding="async"
      onError={() => setError(true)}
    />
  )
}

export default function HeroMobile() {
  const reducedMotion = usePrefersReducedMotion()

  return (
    <section
      id="home"
      className="section relative px-5 pt-28 pb-16"
      aria-label="Introduction"
    >
      <motion.div
        className="flex flex-col gap-5"
        {...(!reducedMotion && {
          initial: { opacity: 0, y: 16 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
        })}
      >
        {/* Block 1: Eyebrow chip */}
        <div
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.2em] text-cyan-400"
          style={{
            background: 'rgba(34,211,238,0.08)',
            border: '1px solid rgba(34,211,238,0.3)',
          }}
        >
          <span
            aria-hidden="true"
            className={`w-1 h-1 rounded-full bg-cyan-400${reducedMotion ? '' : ' animate-pulse'}`}
          />
          available for full-time roles
        </div>

        {/* Block 2: Headline + subtitle */}
        <div className="flex flex-col gap-3">
          <h1 className="font-serif font-normal text-[clamp(2.5rem,12vw,4rem)] leading-[0.95] text-ink-950 dark:text-bone-50">
            Chirag K S
          </h1>
          <p className="font-serif text-[clamp(1.5rem,6vw,2rem)] leading-tight opacity-85">
            Data Science + Cloud. Shipping intelligent systems.
          </p>
        </div>

        {/* Block 3: Profile photo card */}
        <div
          className="relative w-full aspect-square rounded-3xl overflow-hidden"
          style={{
            border: '1px solid rgba(34,211,238,0.18)',
            boxShadow:
              '0 20px 50px -15px rgba(0,0,0,0.4), 0 0 30px -15px rgba(34,211,238,0.25)',
          }}
        >
          <ProfilePhoto />
          <div
            aria-hidden="true"
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'linear-gradient(180deg, transparent 50%, rgba(0,0,0,0.25) 100%)',
            }}
          />
        </div>

        {/* Block 4: Bento credentials row */}
        <div className="grid grid-cols-2 gap-3">
          {/* Card 1: AZ-900 */}
          <div className="rounded-2xl p-4 flex flex-col gap-1 bg-ink-950/[0.04] dark:bg-bone-50/[0.025] border border-ink-950/[0.06] dark:border-bone-50/[0.08]">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
              Certified
            </span>
            <span className="font-serif text-2xl">AZ-900</span>
            <span className="font-mono text-[10px] opacity-60">
              Azure Fundamentals · 2026
            </span>
          </div>

          {/* Card 2: Top 30 — amber accent strip on left edge */}
          <div className="relative rounded-2xl p-4 flex flex-col gap-1 bg-ink-950/[0.04] dark:bg-bone-50/[0.025] border border-ink-950/[0.06] dark:border-bone-50/[0.08] overflow-hidden">
            <div
              aria-hidden="true"
              className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-3/5 rounded-r-full bg-amber-500/40"
            />
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] opacity-60">
              National Rank
            </span>
            <span className="font-serif text-2xl text-amber-500">
              Top 30 / 450+
            </span>
            <span className="font-mono text-[10px] opacity-60">
              Namma Suraksha
            </span>
          </div>
        </div>

        {/* Block 5: About narrative card */}
        <div className="rounded-2xl p-5 bg-ink-950/[0.04] dark:bg-bone-50/[0.025] border border-ink-950/[0.06] dark:border-bone-50/[0.08]">
          <p className="font-sans text-[15px] leading-relaxed opacity-85">
            Computer Science final-year at Presidency University, Bengaluru.
            Microsoft Azure certified (AZ-900). I build data and ML systems
            that translate messy real-world signals into decisions — from
            national-scale crime analytics to NLP for public policy.
          </p>
        </div>

        {/* Block 6: Status pill */}
        <div
          className="inline-flex items-center gap-2 self-start px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-wider text-amber-500"
          style={{
            border: '1px solid rgba(245,158,11,0.4)',
            background: 'rgba(245,158,11,0.06)',
          }}
        >
          <span
            aria-hidden="true"
            className={`w-1 h-1 rounded-full bg-amber-500${reducedMotion ? '' : ' animate-pulse'}`}
          />
          currently: shipping production ML systems
        </div>

        {/* Block 7: CTA stack */}
        <div className="flex flex-col gap-3 mt-2">
          <Link
            to="selected-work"
            smooth
            duration={500}
            offset={-80}
            className={`w-full text-center bg-cyan-400 text-ink-950 rounded-full px-6 py-3.5 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-cyan-300 active:scale-[0.98] transition cursor-pointer ${FOCUS_RING}`}
            style={{
              boxShadow:
                '0 8px 24px -8px rgba(34,211,238,0.5), 0 4px 12px -4px rgba(0,0,0,0.15)',
            }}
          >
            View Selected Work
          </Link>
          <Link
            to="contact"
            smooth
            duration={500}
            offset={-80}
            className={`w-full text-center rounded-full px-6 py-3.5 font-mono text-xs uppercase tracking-wider border border-current/30 hover:border-cyan-400 hover:text-cyan-400 active:scale-[0.98] transition cursor-pointer ${FOCUS_RING}`}
          >
            Get in touch
          </Link>
        </div>
      </motion.div>
    </section>
  )
}
