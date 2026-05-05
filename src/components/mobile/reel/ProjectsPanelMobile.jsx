import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'
import projectsData from '../../../data/projects'

function GitHubIcon() {
  return (
    <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z"/>
    </svg>
  )
}

function ProjectCard({ project, index, expanded, onToggle, reducedMotion, github }) {
  const isExpanded = expanded === index
  const [imgError, setImgError] = useState(false)

  if (reducedMotion) {
    return (
      <article
        className="rounded-2xl overflow-hidden border cursor-pointer"
        style={{
          background: 'rgba(250,250,247,0.04)',
          border: '1px solid rgba(250,250,247,0.1)',
        }}
        onClick={onToggle}
      >
        <div className="aspect-video w-full overflow-hidden relative">
          {imgError ? (
            <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-base text-bone-50 p-4 text-center">
              {project.title}
            </div>
          ) : (
            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover"
              onError={() => setImgError(true)}
            />
          )}
          {github && (
            <a
              href={github}
              target="_blank"
              rel="noopener noreferrer"
              onClick={e => e.stopPropagation()}
              aria-label={`${project.title} on GitHub`}
              className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 z-10 hover:scale-110 transition-transform"
              style={{ background: 'rgba(10,8,16,0.85)', border: '1px solid rgba(34,211,238,0.3)' }}
            >
              <GitHubIcon />
            </a>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-serif text-lg text-bone-50">{project.title}</h3>
          <p className="font-mono text-xs text-bone-50/65 mt-1">{project.oneLiner}</p>
        </div>
      </article>
    )
  }

  return (
    <motion.article
      layout
      className="rounded-2xl overflow-hidden cursor-pointer"
      style={{
        background: 'rgba(250,250,247,0.04)',
        border: '1px solid rgba(250,250,247,0.1)',
      }}
      onClick={onToggle}
    >
      <div className="aspect-video w-full overflow-hidden relative">
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/10 to-amber-500/10 font-serif text-base text-bone-50 p-4 text-center">
            {project.title}
          </div>
        ) : (
          <img
            src={project.image}
            alt={project.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}
        {github && (
          <a
            href={github}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            aria-label={`${project.title} on GitHub`}
            className="absolute bottom-2 right-2 w-7 h-7 rounded-full flex items-center justify-center text-cyan-400 z-10 hover:scale-110 transition-transform"
            style={{ background: 'rgba(10,8,16,0.85)', border: '1px solid rgba(34,211,238,0.3)' }}
          >
            <GitHubIcon />
          </a>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-serif text-lg text-bone-50">{project.title}</h3>
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.4 }}
              style={{ overflow: 'hidden' }}
            >
              <p className="font-mono text-xs text-bone-50/65 mt-1">{project.oneLiner}</p>
              <p className="font-mono text-[10px] text-cyan-400 mt-2 uppercase tracking-wider">
                View →
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.article>
  )
}

export default function ProjectsPanelMobile({ slide, active }) {
  const reducedMotion = usePrefersReducedMotion()
  const [expanded, setExpanded] = useState(0)

  function toggle(i) {
    setExpanded(prev => (prev === i ? null : i))
  }

  return (
    <article className="w-full max-w-md flex flex-col gap-4">
      <header>
        <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-cyan-400/85 block mb-3">
          {slide.eyebrow}
        </span>
        <h2
          id={active ? 'reel-mobile-active-title' : undefined}
          className="font-serif text-3xl text-bone-50 leading-tight"
        >
          {slide.title}
        </h2>
      </header>

      <div className="flex flex-col gap-3">
        {slide.projects.map((project, i) => {
          const fullProject = projectsData.find(p => p.slug === project.slug)
          return (
            <ProjectCard
              key={project.slug}
              project={project}
              index={i}
              expanded={expanded}
              onToggle={() => toggle(i)}
              reducedMotion={reducedMotion}
              github={fullProject?.github}
            />
          )
        })}
      </div>
    </article>
  )
}
