export function Footer() {
  return (
    <footer className="border-t border-current/10 py-10 px-6 mt-20">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col items-center md:items-start">
          <span className="font-serif text-xl">Chirag K S</span>
          <span className="font-mono text-xs opacity-60 mt-1">© 2026 · All rights reserved</span>
        </div>
        <span className="font-mono text-xs opacity-60 text-center md:text-right">
          Designed and built with React, Tailwind, Framer Motion
        </span>
      </div>
    </footer>
  )
}

export default Footer
