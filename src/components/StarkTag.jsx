// Floating copy — visible only when mode === "floating"
export default function StarkTag({ mode }) {
  const show = mode === 'floating'
  return (
    <div
      aria-hidden="true"
      style={{
        boxShadow: '0 0 18px rgba(34, 211, 238, 0.35), 0 0 40px rgba(34, 211, 238, 0.12)',
        opacity: show ? 1 : 0,
        pointerEvents: show ? 'auto' : 'none',
        transform: `translateX(-50%) translateY(${show ? '0px' : '8px'})`,
        transition: 'opacity 0.2s ease, transform 0.2s ease',
        whiteSpace: 'nowrap',
      }}
      className="fixed bottom-20 md:bottom-8 left-1/2 z-50 font-mono text-[11px] text-bone-50/60 bg-ink-950/80 backdrop-blur-sm px-4 py-2 rounded-full border border-cyan-400/20 select-none"
    >
      Designed &amp; built by Stark aka CHIRAG
    </div>
  )
}
