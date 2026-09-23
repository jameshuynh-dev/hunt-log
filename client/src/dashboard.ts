import { STATUSES, type Application, type ApplicationStatus } from './types'

// Pure functions: same input -> same output, no API calls or React.
// That makes the dashboard logic easy to reason about and to unit test.
// App.tsx calls them during render. These numbers are DERIVED from the list,
// so we never store them in separate state that could get out of sync.

export function countByStatus(applications: Application[]): Record<ApplicationStatus, number> {
  const counts = Object.fromEntries(STATUSES.map((s) => [s, 0])) as Record<ApplicationStatus, number>
  for (const app of applications) {
    counts[app.status]++
  }
  return counts
}

// Applications whose follow-up date is today or earlier, most overdue first.
// "YYYY-MM-DD" strings compare correctly as plain text, so no Date objects are needed.
export function dueForFollowUp(applications: Application[], today: string): Application[] {
  return applications
    .filter((app) => app.followUpDate !== null && app.followUpDate <= today)
    .sort((a, b) => a.followUpDate!.localeCompare(b.followUpDate!))
}

// Whole days between two "YYYY-MM-DD" dates (later minus earlier).
export function daysBetween(earlier: string, later: string): number {
  const toUtcDays = (iso: string) => {
    const [y, m, d] = iso.split('-').map(Number)
    return Date.UTC(y, m - 1, d) / 86_400_000
  }
  return toUtcDays(later) - toUtcDays(earlier)
}
