export function SectionHeading({ eyebrow, title, subtitle, align = 'left' }) {
  const isCenter = align === 'center'

  return (
    <div className={`mb-16 ${isCenter ? 'text-center' : 'text-left'}`}>
      <div className={`flex items-center gap-2 ${isCenter ? 'justify-center' : ''}`}>
        <span className="w-2 h-2 bg-cyan-400 inline-block" />
        <span className="font-mono text-xs uppercase tracking-[0.3em] text-cyan-400">
          {eyebrow}
        </span>
      </div>

      <h2 className="font-serif font-normal text-5xl md:text-6xl mt-4">{title}</h2>

      <div className={`w-16 h-px bg-amber-500 mt-5 ${isCenter ? 'mx-auto' : ''}`} />

      {subtitle && (
        <p className={`font-sans text-base opacity-70 mt-5 max-w-xl ${isCenter ? 'mx-auto' : ''}`}>
          {subtitle}
        </p>
      )}
    </div>
  )
}

export default SectionHeading
