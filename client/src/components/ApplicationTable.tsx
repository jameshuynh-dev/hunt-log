import { formatDate } from '../dates'
import { STATUSES, type Application, type ApplicationStatus } from '../types'
import { BADGE_CLASSES } from '../styles'

interface ApplicationTableProps {
  applications: Application[]
  emptyMessage: string
  onOpen: (app: Application) => void
  onStatusChange: (app: Application, status: ApplicationStatus) => void
  onEdit: (app: Application) => void
  onDelete: (app: Application) => void
}

// A "presentational" component: it displays the data it's given (props) and
// reports clicks back up through callbacks. It never calls the API itself.
export function ApplicationTable({ applications, emptyMessage, onOpen, onStatusChange, onEdit, onDelete }: ApplicationTableProps) {
  if (applications.length === 0) {
    return <p className="py-12 text-center text-sm text-muted">{emptyMessage}</p>
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
            <th className="px-4 py-3 text-right font-semibold">Actions</th>
          </tr>
        </thead>
        <tbody>
          {/* key helps React match rows between renders, so it only updates what changed */}
          {applications.map((app) => (
            <tr key={app.id} className="border-b border-line transition last:border-0 hover:bg-canvas/60">
              <td className="px-4 py-3">
                {/* Company name opens the detail view (with contacts) */}
                <button
                  type="button"
                  onClick={() => onOpen(app)}
                  className="text-left font-semibold text-primary hover:text-action hover:underline"
                >
                  {app.company}
                </button>
              </td>
              <td className="px-4 py-3">{app.role}</td>
              <td className="px-4 py-3">
                {/* A dropdown styled like the status pill: quick status change without opening the form */}
                <select
                  aria-label={`Status for ${app.company}`}
                  value={app.status}
                  onChange={(e) => onStatusChange(app, e.target.value as ApplicationStatus)}
                  className={`cursor-pointer rounded-full border-0 py-0.5 pr-7 pl-2.5 text-xs font-semibold focus:ring-2 focus:ring-action/30 focus:outline-none ${BADGE_CLASSES[app.status]}`}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>
                      {status}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(app.dateApplied)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(app.deadline)}</td>
              <td className="px-4 py-3 whitespace-nowrap text-muted">{formatDate(app.followUpDate)}</td>
              <td className="px-4 py-3 text-right whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => onEdit(app)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-action hover:bg-applied-bg"
                >
                  Edit
                </button>
                <button
                  type="button"
                  onClick={() => onDelete(app)}
                  className="rounded-full px-3 py-1 text-xs font-semibold text-rejected-text hover:bg-rejected-bg"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
