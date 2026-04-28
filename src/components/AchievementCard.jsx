import { ChevronRight, ArrowUpRight } from 'lucide-react'

export function AchievementCard({ title, org, date, rank, rankOf, points, url, isLast }) {
  return (
    <article className="relative flex gap-6">
      {/* Left rail */}
      <div className="w-6 shrink-0 relative">
        {isLast ? (
          <div className="absolute left-2.75 top-3 h-3 w-px bg-current/20" />
        ) : (
          <div className="absolute left-2.75 top-3 bottom-0 w-px bg-current/20" />
        )}
        <div className="absolute left-2 top-2 w-3 h-3 rounded-full bg-cyan-400 ring-4 ring-bone-50 dark:ring-ink-950" />
      </div>

      {/* Right card */}
      <div className="flex-1 rounded-2xl border border-current/10 p-6 hover:border-cyan-400/30 transition mb-2">
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <h3 className="font-serif text-2xl">{title}</h3>
            <p className="font-mono text-xs uppercase tracking-wider opacity-60 mt-1">
              {org} · {date}
            </p>
          </div>
          {rank && (
            <div className="bg-amber-500/10 text-amber-500 border border-amber-500/30 rounded-full px-4 py-2 font-mono text-xs uppercase tracking-wider whitespace-nowrap">
              Top {rank} / {rankOf}+
            </div>
          )}
        </div>

        <div className="mt-5 space-y-2">
          {points.map((point, i) => (
            <div key={i} className="flex items-start gap-2 font-sans text-sm opacity-85">
              <ChevronRight size={14} className="text-cyan-400 mt-0.5 shrink-0" />
              <span>{point}</span>
            </div>
          ))}
        </div>

        <div className="mt-5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 font-mono text-xs text-cyan-400 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
          >
            View post <ArrowUpRight size={12} />
          </a>
        </div>
      </div>
    </article>
  )
}

export default AchievementCard
