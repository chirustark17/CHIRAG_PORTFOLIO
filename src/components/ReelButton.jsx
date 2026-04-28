import { forwardRef } from 'react'
import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-ink-950'

export const ReelButton = forwardRef(function ReelButton({ onLaunch }, ref) {
  return (
    <div className="fixed bottom-20 right-6 z-40">
      <motion.button
        ref={ref}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        onClick={onLaunch}
        aria-label="Open the highlight reel"
        aria-haspopup="dialog"
        className={`group flex items-center gap-2 rounded-full px-4 py-2.5 font-mono text-xs uppercase tracking-wider border transition ${FOCUS_RING}`}
        style={{
          background: 'rgba(10,8,16,0.85)',
          borderColor: 'rgba(34,211,238,0.45)',
          color: '#22D3EE',
          backdropFilter: 'blur(12px)',
          boxShadow: '0 8px 24px -8px rgba(0,0,0,0.4), 0 0 20px -8px rgba(34,211,238,0.4)',
          transition: 'all 0.25s ease',
        }}
        whileHover={{ scale: 1.04 }}
        whileTap={{ scale: 0.97 }}
      >
        <Sparkles size={14} />
        <span className="hidden md:inline">Reel</span>
      </motion.button>
    </div>
  )
})

export default ReelButton
