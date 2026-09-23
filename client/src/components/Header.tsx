import { primaryButtonClass } from '../styles'

interface HeaderProps {
  onAddClick: () => void
}

export function Header({ onAddClick }: HeaderProps) {
  return (
    <header className="relative overflow-hidden border-b border-line bg-white">
      {/* Decorative capsule and arch shapes. aria-hidden hides them from screen readers. */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -top-16 right-24 h-44 w-20 rotate-[28deg] rounded-full bg-action/10" />
        <div className="absolute -top-10 right-6 h-36 w-16 rotate-[28deg] rounded-full bg-accent/10" />
        <div className="absolute -bottom-24 right-56 h-40 w-40 rounded-t-full border-[12px] border-b-0 border-primary/5" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-4 px-4 py-7">
        <div className="flex items-center gap-3">
          {/* Simple capsule mark (our own shape, no real-company branding) */}
          <div aria-hidden className="flex h-11 w-8 flex-col justify-center gap-1 rounded-full bg-primary px-2">
            <span className="h-1 rounded-full bg-canvas" />
            <span className="h-1 rounded-full bg-canvas" />
            <span className="h-1 w-2/3 rounded-full bg-accent" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-primary">Hunt Log</h1>
            <p className="text-sm text-muted">Track every internship application in one calm place.</p>
          </div>
        </div>
        <button type="button" onClick={onAddClick} className={primaryButtonClass}>
          + Add application
        </button>
      </div>
    </header>
  )
}
