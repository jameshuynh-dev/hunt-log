import { useEffect, useState } from 'react'
import { api } from './api'
import { ApplicationDetail } from './components/ApplicationDetail'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationTable } from './components/ApplicationTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { FollowUpPanel } from './components/FollowUpPanel'
import { Header } from './components/Header'
import { Modal } from './components/Modal'
import { StatCards, type StatusFilter } from './components/StatCards'
import { countByStatus, dueForFollowUp } from './dashboard'
import { todayIso } from './dates'
import { STATUSES, toInput, type Application, type ApplicationInput, type ApplicationStatus } from './types'

const FILTERS: StatusFilter[] = ['All', ...STATUSES]

// App owns the list of applications (the "state"). Child components receive
// data through props and report user actions back through callback props.
// This is called "lifting state up".
export default function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)
  const [filter, setFilter] = useState<StatusFilter>('All')

  // Which application's detail view is showing (null = dashboard).
  // A tiny app doesn't need a router library: one piece of state picks the view.
  // We store only the id and look up the object, so edits show up immediately.
  const [selectedId, setSelectedId] = useState<number | null>(null)

  // Which dialog is open (false/null = closed).
  const [adding, setAdding] = useState(false)
  const [editing, setEditing] = useState<Application | null>(null)
  const [deleting, setDeleting] = useState<Application | null>(null)

  // useEffect with [] runs once after the first render: load data from the API.
  useEffect(() => {
    api
      .getApplications()
      .then(setApplications)
      .catch(() => setLoadError('Could not reach the API. Is it running on http://localhost:5041?'))
      .finally(() => setLoading(false))
  }, [])

  // DERIVED data: computed from `applications` on every render instead of
  // stored in its own state, so it can never be out of sync with the list.
  const today = todayIso()
  const counts = countByStatus(applications)
  const due = dueForFollowUp(applications, today)
  const visible = filter === 'All' ? applications : applications.filter((a) => a.status === filter)
  const selected = applications.find((a) => a.id === selectedId) ?? null

  function openDetail(app: Application) {
    setSelectedId(app.id)
    window.scrollTo({ top: 0 })
  }

  // Swap one updated item into the list. We build a NEW array (map) instead
  // of mutating the old one, so React notices the change and re-renders.
  function replaceInList(updated: Application) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  async function handleCreate(input: ApplicationInput) {
    const created = await api.createApplication(input)
    setApplications((prev) => [created, ...prev])
    setAdding(false)
  }

  async function handleUpdate(id: number, input: ApplicationInput) {
    replaceInList(await api.updateApplication(id, input))
    setEditing(null)
  }

  async function handleStatusChange(app: Application, status: ApplicationStatus) {
    setActionError(null)
    try {
      // PUT needs every field, so copy the current values and change only status.
      replaceInList(await api.updateApplication(app.id, { ...toInput(app), status }))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not update status.')
    }
  }

  async function handleDelete(app: Application) {
    setActionError(null)
    try {
      await api.deleteApplication(app.id)
      setApplications((prev) => prev.filter((a) => a.id !== app.id))
    } catch (err) {
      setActionError(err instanceof Error ? err.message : 'Could not delete.')
    } finally {
      setDeleting(null)
    }
  }

  return (
    <div className="min-h-screen">
      <Header onAddClick={() => setAdding(true)} />

      <main className="mx-auto max-w-6xl space-y-8 px-4 py-8">
        {loading && <p className="py-16 text-center text-sm text-muted">Loading…</p>}
        {loadError && (
          <p className="rounded-2xl bg-rejected-bg px-4 py-3 text-sm text-rejected-text">{loadError}</p>
        )}

        {!loading && !loadError && selected && (
          <ApplicationDetail key={selected.id} application={selected} onBack={() => setSelectedId(null)} onEdit={setEditing} />
        )}

        {!loading && !loadError && !selected && (
          <>
            <StatCards total={applications.length} counts={counts} active={filter} onSelect={setFilter} />

            <FollowUpPanel due={due} today={today} onOpen={openDetail} />

            {actionError && (
              <p className="rounded-2xl bg-rejected-bg px-4 py-3 text-sm text-rejected-text">{actionError}</p>
            )}

            <section className="rounded-3xl bg-white p-4 shadow-[0_1px_3px_rgba(14,90,107,0.08)] sm:p-6">
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3 px-2">
                <h2 className="text-lg font-semibold text-primary">Applications</h2>
                {/* Filter nav. The active item uses the purple accent. */}
                <nav aria-label="Filter by status" className="flex flex-wrap gap-1 rounded-2xl bg-canvas p-1 sm:rounded-full">
                  {FILTERS.map((f) => (
                    <button
                      key={f}
                      type="button"
                      onClick={() => setFilter(f)}
                      aria-current={filter === f ? 'page' : undefined}
                      className={`rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                        filter === f ? 'bg-accent text-white shadow-sm' : 'text-muted hover:text-primary'
                      }`}
                    >
                      {f}
                    </button>
                  ))}
                </nav>
              </div>
              <ApplicationTable
                applications={visible}
                emptyMessage={
                  applications.length === 0
                    ? 'No applications yet. Click "+ Add application" to log your first one.'
                    : `No applications with status "${filter}".`
                }
                onOpen={openDetail}
                onStatusChange={handleStatusChange}
                onEdit={setEditing}
                onDelete={setDeleting}
              />
            </section>
          </>
        )}
      </main>

      {/* Dialogs render only while open. "key" gives each application a fresh form. */}
      {adding && (
        <Modal title="Add an application" onClose={() => setAdding(false)}>
          <ApplicationForm submitLabel="Add application" onSubmit={handleCreate} onCancel={() => setAdding(false)} />
        </Modal>
      )}

      {editing && (
        <Modal title={`Edit ${editing.company}`} onClose={() => setEditing(null)}>
          <ApplicationForm
            key={editing.id}
            initialValues={toInput(editing)}
            submitLabel="Save changes"
            onSubmit={(input) => handleUpdate(editing.id, input)}
            onCancel={() => setEditing(null)}
          />
        </Modal>
      )}

      {deleting && (
        <ConfirmDialog
          title="Delete application?"
          message={`This permanently removes ${deleting.role} at ${deleting.company}, along with its contacts. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
