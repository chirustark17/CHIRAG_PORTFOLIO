import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { ExternalLink } from 'lucide-react'

function GithubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.374 0 0 5.373 0 12c0 5.302 3.438 9.8 8.207 11.387.6.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23A11.509 11.509 0 0 1 12 5.803c1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576C20.566 21.797 24 17.3 24 12c0-6.627-5.373-12-12-12z" />
    </svg>
  )
}

export function ProjectCard({ slug, title, description, tech, github, demo, image }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [image])

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5 }}
      className="group rounded-2xl border border-current/10 overflow-hidden hover:border-cyan-400/50 hover:shadow-[0_0_40px_-15px_rgba(34,211,238,0.35)] hover:-translate-y-1 transition-all duration-300 flex flex-col"
    >
      <div className="relative aspect-video overflow-hidden bg-current/5">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-2xl p-6 text-center">
            {title}
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-t from-cyan-400/10 to-transparent opacity-0 group-hover:opacity-100 transition pointer-events-none" />
      </div>

      <div className="p-6 flex flex-col flex-1">
        <h3 className="font-serif text-2xl">{title}</h3>
        <p className="font-sans text-sm opacity-70 mt-2 leading-relaxed">{description}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {tech.map((t) => (
            <span
              key={t}
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 rounded border border-current/20"
            >
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-5 flex gap-4 items-center">
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${title} on GitHub`}
            className="opacity-60 hover:opacity-100 hover:text-cyan-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
          >
            <GithubIcon />
          </a>
          {demo && (
            <a
              href={demo}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`${title} live demo`}
              className="opacity-60 hover:opacity-100 hover:text-cyan-400 transition focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950 rounded"
            >
              <ExternalLink size={20} />
            </a>
          )}
        </div>
      </div>
    </motion.article>
  )
}

export default ProjectCard
