import { formatDate } from '../dates'
import type { Application } from '../types'
import { StatusBadge } from './StatusBadge'

interface ApplicationTableProps {
  applications: Application[]
}

// A "presentational" component: it only displays the data it's given (props).
// Fetching and state live in App.tsx.
export function ApplicationTable({ applications }: ApplicationTableProps) {
  if (applications.length === 0) {
    return <p className="py-10 text-center text-sm text-muted">No applications yet. Add your first one above.</p>
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-line text-xs tracking-wide text-muted uppercase">
            <th className="px-4 py-3 font-semibold">Company</th>
            <th className="px-4 py-3 font-semibold">Role</th>
            <th className="px-4 py-3 font-semibold">Status</th>
            <th className="px-4 py-3 font-semibold">Applied</th>
            <th className="px-4 py-3 font-semibold">Deadline</th>
            <th className="px-4 py-3 font-semibold">Follow-up</th>
          </tr>
        </thead>
        <tbody>
          {/* key helps React match rows between renders, so it only updates what changed */}
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-line last:border-0">
              <td className="px-4 py-3 font-semibold text-primary">{app.company}</td>
              <td className="px-4 py-3">{app.role}</td>
              <td className="px-4 py-3">
                <StatusBadge status={app.status} />
              </td>
              <td className="px-4 py-3 text-muted">{formatDate(app.dateApplied)}</td>
              <td className="px-4 py-3 text-muted">{formatDate(app.deadline)}</td>
              <td className="px-4 py-3 text-muted">{formatDate(app.followUpDate)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
