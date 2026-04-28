import { useEffect, useState } from 'react'
import { ArrowUpRight } from 'lucide-react'

const FOCUS_RING = 'focus:outline-none focus-visible:ring-2 focus-visible:ring-cyan-400 focus-visible:ring-offset-2 focus-visible:ring-offset-bone-50 dark:focus-visible:ring-offset-ink-950'

function getPositionStyle(position) {
  switch (position) {
    case 'center':
      return {
        transform: 'translateX(0) scale(1) rotateY(0deg)',
        opacity: 1,
        zIndex: 30,
        pointerEvents: 'auto',
        cursor: 'default',
      }
    case 'left':
      return {
        transform: 'translateX(-65%) scale(0.75) rotateY(25deg)',
        opacity: 0.5,
        zIndex: 20,
        pointerEvents: 'auto',
        cursor: 'pointer',
      }
    case 'right':
      return {
        transform: 'translateX(65%) scale(0.75) rotateY(-25deg)',
        opacity: 0.5,
        zIndex: 20,
        pointerEvents: 'auto',
        cursor: 'pointer',
      }
    case 'hidden':
    default:
      return {
        transform: 'translateX(0) scale(0.5) rotateY(0deg)',
        opacity: 0,
        zIndex: 10,
        pointerEvents: 'none',
      }
  }
}

export function ShowcaseSlide({ slug, title, subtitle, year, stack, image, href, index, position, onClick }) {
  const [imgError, setImgError] = useState(false)

  useEffect(() => {
    setImgError(false)
  }, [image])

  const posStyle = getPositionStyle(position)
  const isCenter = position === 'center'
  const isSide = position === 'left' || position === 'right'

  function handleClick() {
    if (isSide) onClick()
  }

  function handleKeyDown(e) {
    if (isSide && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onClick()
    }
  }

  return (
    <div
      role="group"
      aria-roledescription="slide"
      aria-label={`Project ${index + 1} of 4: ${title}`}
      aria-current={isCenter ? 'true' : undefined}
      aria-hidden={position === 'hidden'}
      tabIndex={isSide ? 0 : undefined}
      style={posStyle}
      className={`w-full md:w-[70%] lg:w-[55%] transition-all duration-700 ease-out group ${isSide ? FOCUS_RING : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
    >
      {/* Image block */}
      <div className={`aspect-16/10 rounded-3xl overflow-hidden ring-1 bg-current/5 transition-all duration-500 ${
        isCenter
          ? 'ring-cyan-400/40 shadow-[0_0_60px_-15px_rgba(34,211,238,0.4)] group-hover:ring-cyan-400/60'
          : 'ring-current/10'
      }`}>
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-cyan-400/20 to-amber-500/20 font-serif text-3xl p-8 text-center">
            {title}
          </div>
        ) : (
          <img
            src={image}
            alt={title}
            loading="lazy"
            decoding="async"
            className={`w-full h-full object-cover transition-transform duration-500 ${isCenter ? 'group-hover:scale-[1.03]' : ''}`}
            onError={() => setImgError(true)}
          />
        )}
      </div>

      {/* Text block */}
      <div className="mt-5 px-1">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
          {year} · project {index + 1} of 4
        </p>
        <h3 className="font-serif font-normal text-3xl md:text-4xl leading-tight mt-3">
          {title}
        </h3>
        <p className="font-sans text-sm opacity-75 mt-3 leading-relaxed line-clamp-2">
          {subtitle}
        </p>
        <div className={`mt-4 flex flex-wrap gap-2 transition-opacity duration-300 ${isCenter ? 'opacity-70 group-hover:opacity-100' : 'opacity-70'}`}>
          {stack.map((s) => (
            <span
              key={s}
              className="font-mono text-[10px] uppercase tracking-wider px-2 py-1 border border-current/20 rounded"
            >
              {s}
            </span>
          ))}
        </div>
        {isCenter && (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 mt-5 font-mono text-sm text-cyan-400 border-b border-cyan-400/30 pb-1 self-start hover:border-cyan-400 transition ${FOCUS_RING} rounded`}
          >
            Explore project <ArrowUpRight size={14} />
          </a>
        )}
      </div>
    </div>
  )
}

export default ShowcaseSlide
