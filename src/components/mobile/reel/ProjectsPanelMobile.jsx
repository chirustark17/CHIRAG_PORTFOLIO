import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { usePrefersReducedMotion } from '../../../hooks/usePrefersReducedMotion'

function ProjectCard({ project, index, expanded, onToggle, reducedMotion }) {
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
        <div className="aspect-[16/9] w-full overflow-hidden">
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
      <div className="aspect-[16/9] w-full overflow-hidden">
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
        {slide.projects.map((project, i) => (
          <ProjectCard
            key={project.slug}
            project={project}
            index={i}
            expanded={expanded}
            onToggle={() => toggle(i)}
            reducedMotion={reducedMotion}
          />
        ))}
      </div>
    </article>
  )
}
