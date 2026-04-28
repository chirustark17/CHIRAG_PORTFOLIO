import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-scroll'
import { motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950'

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
}

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6 } },
}

function Counter({ target, duration }) {
  const reducedMotion = usePrefersReducedMotion()
  const [count, setCount] = useState(reducedMotion ? target : 0)
  const rafRef = useRef(null)

  useEffect(() => {
    if (reducedMotion) { setCount(target); return }
    const start = performance.now()
    function tick(now) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      setCount(Math.floor(progress * target))
      if (progress < 1) rafRef.current = requestAnimationFrame(tick)
    }
    rafRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(rafRef.current)
  }, [target, duration, reducedMotion])

  return <>{count}</>
}

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
      fetchpriority="high"
      decoding="async"
      className="w-full h-full object-cover"
      onError={() => setError(true)}
    />
  )
}

export function Hero() {
  return (
    <section id="home" aria-label="Introduction" className="section pt-32 pb-16 overflow-x-hidden">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 lg:grid-cols-12 gap-12"
      >
        {/* Left column */}
        <div className="lg:col-span-7 flex flex-col">
          <motion.div variants={itemVariants} className="flex items-center gap-2 font-mono text-xs uppercase tracking-[0.2em] opacity-70">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
            <span>available for full-time roles</span>
          </motion.div>

          <motion.h1 variants={itemVariants} className="font-serif font-normal text-5xl sm:text-6xl md:text-8xl leading-[0.95] mt-6">
            Chirag K S
          </motion.h1>

          <motion.h2 variants={itemVariants} className="font-sans font-light text-2xl md:text-3xl opacity-80 mt-6">
            Data Science + Cloud. Shipping intelligent systems.
          </motion.h2>

          <motion.p variants={itemVariants} className="font-sans text-base md:text-lg opacity-75 max-w-xl mt-6 leading-relaxed">
            Computer Science final-year at Presidency University, Bengaluru.
            Microsoft Azure certified (AZ-900). I build data and ML systems
            that translate messy real-world signals into decisions — from
            national-scale crime analytics to NLP for public policy.
          </motion.p>

          <motion.div variants={itemVariants} className="inline-flex items-center gap-2 mt-8 px-4 py-2 rounded-full border border-current/20 font-mono text-xs w-fit">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>currently: shipping production ML systems</span>
          </motion.div>

          <motion.div variants={itemVariants} className="mt-8 flex flex-wrap gap-4">
            <Link
              to="selected-work"
              smooth
              duration={600}
              offset={-80}
              className={`bg-cyan-400 text-ink-950 font-medium px-6 py-3 rounded-full hover:bg-cyan-300 transition cursor-pointer ${FOCUS_RING}`}
            >
              View Selected Work
            </Link>
            <Link
              to="contact"
              smooth
              duration={600}
              offset={-80}
              className={`border border-current/30 px-6 py-3 rounded-full hover:border-cyan-400 hover:text-cyan-400 transition cursor-pointer ${FOCUS_RING}`}
            >
              Get in touch
            </Link>
          </motion.div>
        </div>

        {/* Right column */}
        <motion.div variants={itemVariants} className="lg:col-span-5 flex flex-col gap-6">
          {/* Credential card */}
          <div className="rounded-3xl border border-current/15 p-8 bg-ink-900/2 dark:bg-bone-50/2">
            <div>
              <p className="font-mono text-xs uppercase tracking-widest opacity-60">microsoft certified</p>
              <p className="font-serif text-5xl leading-none mt-2">AZ-900</p>
              <p className="font-mono text-sm opacity-70 mt-2">Azure Fundamentals · 2026</p>
            </div>

            <div className="border-t border-current/10 pt-6 mt-6">
              <p className="font-mono text-xs uppercase tracking-widest opacity-60">national hackathon</p>
              <p className="font-serif text-6xl md:text-7xl leading-none mt-2">
                Top <Counter target={30} duration={1200} />
              </p>
              <p className="font-mono text-sm opacity-70 mt-2">of 450+ teams · Namma Suraksha</p>
            </div>
          </div>

          {/* Profile photo */}
          <div className="aspect-square rounded-2xl overflow-hidden ring-1 ring-cyan-400/30">
            <ProfilePhoto />
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Hero
