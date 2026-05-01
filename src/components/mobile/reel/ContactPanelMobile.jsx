import { useCallback, useState } from 'react'
import { Copy, Check, ExternalLink } from 'lucide-react'

function CopyButton({ value }) {
  const [copied, setCopied] = useState(false)

  const handleCopy = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(value)
      setCopied(true)
      setTimeout(() => setCopied(false), 1500)
    } catch {
      // clipboard not available
    }
  }, [value])

  return (
    <button
      onClick={handleCopy}
      className="p-2 rounded-lg text-bone-50/50 hover:text-cyan-400 transition-colors"
      aria-label={copied ? 'Copied' : 'Copy to clipboard'}
    >
      {copied
        ? <Check size={14} className="text-cyan-400" />
        : <Copy size={14} />}
    </button>
  )
}

export default function ContactPanelMobile({ slide, active }) {
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

      <p className="font-mono text-sm text-bone-50/60">{slide.tagline}</p>

      <div
        className="self-start flex items-center gap-2 rounded-full px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-cyan-400"
        style={{ background: 'rgba(34,211,238,0.1)', border: '1px solid rgba(34,211,238,0.3)' }}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" aria-hidden="true" />
        Open to opportunities
      </div>

      <div className="flex flex-col gap-2 mt-1">
        {slide.links.map(link => (
          <div
            key={link.label}
            className="flex items-center justify-between rounded-xl px-4 py-3"
            style={{
              background: 'rgba(250,250,247,0.04)',
              border: '1px solid rgba(250,250,247,0.08)',
            }}
          >
            <div className="flex flex-col gap-0.5 min-w-0 flex-1 mr-2">
              <span className="font-mono text-[10px] uppercase tracking-wider text-bone-50/45">
                {link.label}
              </span>
              <span className="font-sans text-sm text-bone-50/85 truncate">{link.value}</span>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {link.copyable && <CopyButton value={link.value} />}
              <a
                href={link.href}
                target={link.href.startsWith('mailto') ? '_self' : '_blank'}
                rel="noopener noreferrer"
                className="p-2 rounded-lg text-bone-50/50 hover:text-cyan-400 transition-colors"
                aria-label={`Open ${link.label}`}
              >
                <ExternalLink size={14} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </article>
  )
}
