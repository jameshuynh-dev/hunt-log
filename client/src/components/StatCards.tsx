import { STATUSES, type ApplicationStatus } from '../types'

export type StatusFilter = ApplicationStatus | 'All'

// Small colored dot per status (same palette as the badges).
const DOT_CLASSES: Record<ApplicationStatus, string> = {
  Saved: 'bg-saved-text',
  Applied: 'bg-applied-text',
  Interviewing: 'bg-interviewing-text',
  Offer: 'bg-offer-text',
  Rejected: 'bg-rejected-text',
}

interface StatCardsProps {
  total: number
  counts: Record<ApplicationStatus, number>
  active: StatusFilter
  onSelect: (filter: StatusFilter) => void
}

// One card per status, plus a Total card. Clicking a card filters the table.
export function StatCards({ total, counts, active, onSelect }: StatCardsProps) {
  const cards: { key: StatusFilter; label: string; value: number }[] = [
    { key: 'All', label: 'Total', value: total },
    ...STATUSES.map((s) => ({ key: s, label: s, value: counts[s] })),
  ]

  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
      {cards.map((card) => {
        const isActive = card.key === active
        return (
          <button
            key={card.key}
            type="button"
            onClick={() => onSelect(card.key)}
            aria-pressed={isActive}
            className={`rounded-2xl bg-white p-4 text-left shadow-[0_1px_3px_rgba(14,90,107,0.08)] ring-1 transition hover:-translate-y-0.5 hover:shadow-md ${
              isActive ? 'ring-2 ring-accent' : 'ring-line'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-semibold tracking-wide text-muted uppercase">
              {card.key !== 'All' && <span className={`h-2 w-2 rounded-full ${DOT_CLASSES[card.key]}`} />}
              {card.label}
            </div>
            <div className="mt-2 text-3xl font-bold text-primary">{card.value}</div>
          </button>
        )
      })}
    </div>
  )
}
