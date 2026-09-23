import { daysBetween } from '../dashboard'
import type { Application } from '../types'
import { StatusBadge } from './StatusBadge'

interface FollowUpPanelProps {
  due: Application[]
  today: string
  onOpen: (app: Application) => void
}

function dueLabel(followUpDate: string, today: string): string {
  const days = daysBetween(followUpDate, today)
  if (days === 0) return 'Due today'
  return days === 1 ? '1 day overdue' : `${days} days overdue`
}

// Purple accent panel: applications whose follow-up date is today or earlier.
export function FollowUpPanel({ due, today, onOpen }: FollowUpPanelProps) {
  return (
    <section className="rounded-3xl border border-accent/15 bg-accent-soft p-6">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-accent text-sm font-bold text-white">
          {due.length}
        </span>
        <div>
          <h2 className="text-lg font-semibold text-primary">Follow up today</h2>
          <p className="text-xs text-muted">Follow-up date is today or earlier</p>
        </div>
      </div>

      {due.length === 0 ? (
        <p className="text-sm text-muted">You're all caught up. Nice work.</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {due.map((app) => (
            <li key={app.id}>
              <button
                type="button"
                onClick={() => onOpen(app)}
                className="w-full rounded-2xl bg-white p-4 text-left shadow-sm transition hover:shadow-md"
              >
                <div className="flex items-start justify-between gap-2">
                  <span className="font-semibold text-primary">{app.company}</span>
                  <StatusBadge status={app.status} />
                </div>
                <div className="mt-0.5 text-sm text-muted">{app.role}</div>
                <div className="mt-3 text-xs font-semibold text-accent">{dueLabel(app.followUpDate!, today)}</div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </section>
  )
}
