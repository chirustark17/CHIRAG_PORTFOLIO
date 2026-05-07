import StarkTag from './StarkTag'

export function Footer() {
  return (
    <footer className="border-t border-current/10 py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-4">
        <span className="font-serif text-xl">Chirag K S</span>
        <StarkTag />
        <span className="font-mono text-xs opacity-60">© 2026 · All rights reserved</span>
        <span className="font-mono text-xs opacity-60 text-center">
          Designed and built with React, Tailwind, Framer Motion
        </span>
      </div>
    </footer>
  )
}

export default Footer
