export default function StarkTag({ visible }) {
  return (
    <div
      aria-hidden="true"
      style={{
        transition: 'opacity 400ms ease, transform 400ms ease',
        boxShadow: '0 0 18px rgba(34, 211, 238, 0.35), 0 0 40px rgba(34, 211, 238, 0.12)',
      }}
      className={[
        'fixed bottom-20 md:bottom-6 left-1/2 -translate-x-1/2 z-50',
        'font-mono text-[11px] text-bone-50/60',
        'bg-ink-950/80 backdrop-blur-sm px-4 py-2 rounded-full',
        'border border-cyan-400/20 pointer-events-none select-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      ].join(' ')}
    >
      Designed &amp; built by Stark aka CHIRAG
    </div>
  )
}
