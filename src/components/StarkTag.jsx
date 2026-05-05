export default function StarkTag({ visible }) {
  return (
    <div
      aria-hidden="true"
      style={{ transition: 'opacity 400ms ease, transform 400ms ease' }}
      className={[
        'fixed bottom-4 left-1/2 -translate-x-1/2 z-50',
        'font-mono text-[11px] text-bone-50/60',
        'bg-ink-950/80 backdrop-blur-sm px-4 py-2 rounded-full',
        'border border-cyan-400/20 pointer-events-none select-none',
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2',
      ].join(' ')}
    >
      Designed &amp; built by Stark aka Chirag
    </div>
  )
}
