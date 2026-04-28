export function NowStrip() {
  return (
    <section id="now-strip" aria-label="Key stats" className="w-full border-y border-current/10 bg-ink-900/2 dark:bg-bone-50/2 relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-10">
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">certified</span>
            <span className="font-serif text-2xl md:text-3xl">Azure AZ-900</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">national rank</span>
            <span className="font-serif text-2xl md:text-3xl text-amber-500">Top 30 / 450+</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">shipped</span>
            <span className="font-serif text-2xl md:text-3xl">7 projects</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="font-mono text-[10px] uppercase tracking-[0.25em] opacity-60">cgpa</span>
            <span className="font-serif text-2xl md:text-3xl">8.66 / 10</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default NowStrip
