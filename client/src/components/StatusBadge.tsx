import type { ApplicationStatus } from '../types'

// Record<ApplicationStatus, string> forces an entry for EVERY status.
// Add a status to the union and forget it here, and TypeScript errors.
// Colors come from the @theme block in index.css.
const BADGE_CLASSES: Record<ApplicationStatus, string> = {
  Saved: 'bg-saved-bg text-saved-text',
  Applied: 'bg-applied-bg text-applied-text',
  Interviewing: 'bg-interviewing-bg text-interviewing-text',
  Offer: 'bg-offer-bg text-offer-text',
  Rejected: 'bg-rejected-bg text-rejected-text',
}

export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_CLASSES[status]}`}
    >
      {status}
    </span>
  )
}
