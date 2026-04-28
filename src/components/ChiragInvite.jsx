import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Sparkles, X } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

export function ChiragInvite({ visible, onEnter, onDismiss }) {
  const reducedMotion = usePrefersReducedMotion()

  // Escape key dismisses the invitation
  useEffect(() => {
    if (!visible) return
    function onKey(e) {
      if (e.key === 'Escape') { e.preventDefault(); onDismiss() }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, onDismiss])

  return (
    <AnimatePresence>
      {visible && (
        <div className="fixed bottom-24 left-6 z-41">
          {/* Text bubble */}
          <motion.div
            role="dialog"
            aria-labelledby="chirag-invite-title"
            aria-describedby="chirag-invite-desc"
            initial={{ opacity: 0, y: 30, scale: 0.85 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="relative rounded-2xl border border-cyan-400/40 bg-ink-900/95 backdrop-blur-xl shadow-2xl w-[280px] md:w-[320px] p-5 text-bone-50"
            style={{
              boxShadow: '0 0 40px -5px rgba(34,211,238,0.4), 0 10px 40px -10px rgba(0,0,0,0.5)',
            }}
          >
            {/* Subtle border-pulse attention ring */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-2xl border-2 border-cyan-400/30 pointer-events-none"
                animate={{ opacity: [0, 0.5, 0], scale: [1, 1.03, 1.05] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.2 }}
                aria-hidden="true"
              />
            )}

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                  chirag mode
                </span>
              </div>
              <button
                className="w-6 h-6 rounded-full border border-bone-50/20 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition"
                aria-label="Dismiss invitation"
                onClick={onDismiss}
              >
                <X size={12} />
              </button>
            </div>

            {/* Headline */}
            <h3 id="chirag-invite-title" className="font-serif text-xl leading-tight mb-2">
              Take the 60-second tour
            </h3>

            {/* Subtext */}
            <p id="chirag-invite-desc" className="font-sans text-sm opacity-75 leading-relaxed mb-4">
              A guided walkthrough of my work, credentials, and what I build.
              Silent by default — voice optional.
            </p>

            {/* Button row */}
            <div className="flex items-center gap-2">
              <button
                className="flex-1 bg-cyan-400 text-ink-950 rounded-full px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-cyan-300 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950"
                onClick={onEnter}
              >
                Enter tour
              </button>
              <button
                className="px-4 py-2.5 font-mono text-xs uppercase tracking-wider text-bone-50/60 hover:text-bone-50 transition focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950 rounded-full"
                onClick={onDismiss}
              >
                Not now
              </button>
            </div>
          </motion.div>

          {/* Curved arrow pointing down to orb */}
          <motion.div
            className="absolute left-6 -bottom-14"
            animate={reducedMotion ? {} : { y: [0, 4, 0] }}
            transition={{ duration: 1.4, repeat: Infinity, delay: 1.5, ease: 'easeInOut' }}
            aria-hidden="true"
          >
            <svg width="40" height="56" viewBox="0 0 40 56" fill="none">
              <motion.path
                d="M 30 2 Q 8 10, 8 54"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                className="text-cyan-400"
                fill="none"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: 1, opacity: 0.8 }}
                transition={{ duration: 1.2, ease: 'easeOut', delay: 0.3 }}
              />
              <motion.path
                d="M 2 48 L 8 54 L 14 48"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-cyan-400"
                fill="none"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.8 }}
                transition={{ duration: 0.3, delay: 1.3 }}
              />
            </svg>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

export default ChiragInvite
