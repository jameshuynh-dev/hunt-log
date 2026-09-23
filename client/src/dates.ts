// Helpers for the "YYYY-MM-DD" date strings the API uses.

// Why not new Date("2026-09-20")? JavaScript reads that as midnight UTC, which
// is still Sept 19 in US time zones, so dates would show one day early.
// Splitting the string avoids time zones entirely.
export function formatDate(isoDate: string | null): string {
  if (!isoDate) return '—'
  const [year, month, day] = isoDate.split('-').map(Number)
  return new Date(year, month - 1, day).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

// Today's LOCAL date as "YYYY-MM-DD". Strings in this format sort
// correctly, so "2026-09-20" <= "2026-09-23" works for date comparison.
export function todayIso(): string {
  const now = new Date()
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`
}
