import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Play, Sparkles, X } from 'lucide-react'
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

export function ReelHint({ visible, onLaunch, onDismiss }) {
  const reducedMotion = usePrefersReducedMotion()

  useEffect(() => {
    if (!visible) return
    function onKey(e) {
      if (e.key === 'Escape') onDismiss()
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [visible, onDismiss])

  return (
    <div className="fixed bottom-24 right-6 md:right-6 z-42 pointer-events-none">
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0, x: 50, scale: 0.92 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 30, scale: 0.95 }}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto rounded-2xl w-75 md:w-85 p-5 relative overflow-hidden"
            role="dialog"
            aria-labelledby="reel-hint-heading"
            aria-describedby="reel-hint-body"
            style={{
              background: 'linear-gradient(135deg, rgba(10,8,16,0.96), rgba(4,4,8,0.97))',
              border: '1px solid rgba(34,211,238,0.4)',
              boxShadow: '0 20px 60px -15px rgba(0,0,0,0.6), 0 0 40px -10px rgba(34,211,238,0.4)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Border pulse */}
            {!reducedMotion && (
              <motion.div
                className="absolute inset-0 rounded-2xl pointer-events-none"
                style={{ border: '2px solid rgba(34,211,238,0.3)' }}
                animate={{ opacity: [0, 0.4, 0], scale: [1, 1.02, 1.04] }}
                transition={{ duration: 2.4, repeat: Infinity, ease: 'easeOut', repeatDelay: 1.2 }}
                aria-hidden="true"
              />
            )}

            {/* Header row */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Sparkles size={14} className="text-cyan-400" />
                <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400">
                  highlight reel
                </span>
              </div>
              <button
                onClick={onDismiss}
                aria-label="Dismiss"
                className={`w-6 h-6 rounded-full border border-bone-50/20 flex items-center justify-center hover:border-cyan-400 hover:text-cyan-400 transition text-bone-50/60 ${FOCUS_RING}`}
              >
                <X size={12} />
              </button>
            </div>

            <h3
              id="reel-hint-heading"
              className="font-serif text-xl text-bone-50 leading-tight mb-2"
            >
              You&apos;ve made it to the end.
            </h3>

            <p
              id="reel-hint-body"
              className="font-sans text-sm text-bone-50/75 leading-relaxed mb-4"
            >
              Want a 30-second highlight reel? Six slides, your call when to advance.
            </p>

            <button
              onClick={onLaunch}
              className={`w-full bg-cyan-400 text-ink-950 rounded-full px-4 py-2.5 font-mono text-xs uppercase tracking-wider font-semibold hover:bg-cyan-300 transition flex items-center justify-center gap-2 ${FOCUS_RING}`}
              style={{
                boxShadow: '0 0 30px -8px rgba(34,211,238,0.5), 0 4px 12px -4px rgba(0,0,0,0.3)',
              }}
            >
              <Play size={14} />
              Open the reel
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ReelHint
