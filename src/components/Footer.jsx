import { forwardRef } from 'react'

export const Footer = forwardRef(function Footer({ starkTagMode }, ref) {
  const parked = starkTagMode === 'parked'
  return (
    <footer ref={ref} className="border-t border-current/10 py-10 px-6 mt-20 relative">
      {/* Parked StarkTag — sits above the footer top border, no effect on footer layout */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          top: 0,
          left: '50%',
          transform: 'translateX(-50%) translateY(-100%)',
          marginTop: '-12px',
          opacity: parked ? 1 : 0,
          pointerEvents: 'none',
          transition: 'opacity 0.2s ease',
          zIndex: 50,
          boxShadow: '0 0 18px rgba(34, 211, 238, 0.35), 0 0 40px rgba(34, 211, 238, 0.12)',
          whiteSpace: 'nowrap',
        }}
        className="font-mono text-[11px] text-bone-50/60 bg-ink-950/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/20 select-none"
      >
        Designed &amp; built by Stark aka CHIRAG
      </div>

      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <span className="font-serif text-xl">Chirag K S</span>
        <span className="font-mono text-xs opacity-60">© 2026 · All rights reserved</span>
        <span className="font-mono text-xs opacity-60 text-center">
          Designed and built with React, Tailwind, Framer Motion
        </span>
      </div>
    </footer>
  )
})

export default Footer
