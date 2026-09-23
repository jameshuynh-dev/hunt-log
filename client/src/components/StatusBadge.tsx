import { BADGE_CLASSES } from '../styles'
import type { ApplicationStatus } from '../types'

// Soft colored pill showing a status. Colors come from the theme (index.css).
export function StatusBadge({ status }: { status: ApplicationStatus }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${BADGE_CLASSES[status]}`}
    >
      {status}
    </span>
  )
}
