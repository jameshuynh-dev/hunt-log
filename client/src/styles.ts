import type { ApplicationStatus } from './types'

// Shared Tailwind class strings. The colors themselves are defined once in
// the @theme block in index.css. These just combine them into reusable looks.

export const inputClass =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-action focus:ring-2 focus:ring-action/20 focus:outline-none'

// Pill-shaped (rounded-full) buttons.
export const primaryButtonClass =
  'rounded-full bg-action px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-action-hover disabled:opacity-60'

export const secondaryButtonClass =
  'rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-muted transition hover:bg-canvas'

export const dangerButtonClass =
  'rounded-full bg-rejected-text px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:opacity-90 disabled:opacity-60'

// Record<ApplicationStatus, string> forces an entry for EVERY status.
// Add a status to the union and forget it here, and TypeScript errors.
export const BADGE_CLASSES: Record<ApplicationStatus, string> = {
  Saved: 'bg-saved-bg text-saved-text',
  Applied: 'bg-applied-bg text-applied-text',
  Interviewing: 'bg-interviewing-bg text-interviewing-text',
  Offer: 'bg-offer-bg text-offer-text',
  Rejected: 'bg-rejected-bg text-rejected-text',
}
