import { useState } from 'react'

function ImageWithFallback({ src, alt, className }) {
  const [error, setError] = useState(false)
  if (error) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-lg p-4 text-center">
        {alt}
      </div>
    )
  }
  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      className={className}
      onError={() => setError(true)}
    />
  )
}

export default function ProjectCardMobile({ project, variant }) {
  const href = project.demo || project.github || '#'
  const ariaLabel = `${project.title} — ${project.description} (opens in new tab)`

  const visibleTech = project.tech.slice(0, 4)
  const extraCount = project.tech.length - 4

  const cardBase =
    'rounded-3xl overflow-hidden border border-ink-950/[0.08] dark:border-bone-50/[0.08] bg-ink-950/[0.02] dark:bg-bone-50/[0.02]'
  const shadow = { boxShadow: '0 8px 24px -8px rgba(0,0,0,0.15)' }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={ariaLabel}
      className="block active:scale-[0.98] transition"
    >
      {variant === 'featured' ? (
        <div className={cardBase} style={shadow}>
          <div className="aspect-[4/3] w-full overflow-hidden relative">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none"
              style={{ background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.85))' }}
            />
            <div className="absolute bottom-0 left-0 right-0 p-5">
              <h3 className="font-serif text-2xl text-bone-50">{project.title}</h3>
              <p className="font-sans text-sm text-bone-50/85 mt-1 line-clamp-2">{project.description}</p>
              <div className="flex flex-wrap gap-1.5 mt-3">
                {visibleTech.map(t => (
                  <span
                    key={t}
                    className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full text-bone-50"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    {t}
                  </span>
                ))}
                {extraCount > 0 && (
                  <span
                    className="font-mono text-[9px] uppercase tracking-wider px-2 py-0.5 rounded-full text-bone-50"
                    style={{
                      background: 'rgba(255,255,255,0.1)',
                      border: '1px solid rgba(255,255,255,0.18)',
                    }}
                  >
                    +{extraCount} more
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className={cardBase} style={shadow}>
          <div className="aspect-[4/3] overflow-hidden">
            <ImageWithFallback
              src={project.image}
              alt={project.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-4">
            <h3 className="font-serif text-base text-ink-950 dark:text-bone-50">
              {project.title}
            </h3>
            <p className="font-mono text-[11px] opacity-65 mt-1 line-clamp-2">
              {project.description}
            </p>
          </div>
        </div>
      )}
    </a>
  )
}
