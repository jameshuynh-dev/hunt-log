import { useEffect, useState } from 'react'
import { api } from './api'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationTable } from './components/ApplicationTable'
import { ConfirmDialog } from './components/ConfirmDialog'
import { Modal } from './components/Modal'
import { toInput, type Application, type ApplicationInput, type ApplicationStatus } from './types'

// App owns the list of applications (the "state"). Child components receive
// data through props and report user actions back through callback props.
// This is called "lifting state up".
export default function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)
  const [actionError, setActionError] = useState<string | null>(null)

  // Which application is open in the edit / delete dialogs (null = closed).
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

  // Swap one updated item into the list. We build a NEW array (map) instead
  // of mutating the old one, so React notices the change and re-renders.
  function replaceInList(updated: Application) {
    setApplications((prev) => prev.map((a) => (a.id === updated.id ? updated : a)))
  }

  async function handleCreate(input: ApplicationInput) {
    const created = await api.createApplication(input)
    setApplications((prev) => [created, ...prev])
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
    <div className="mx-auto max-w-6xl space-y-6 px-4 py-8">
      <header>
        <h1 className="text-2xl font-bold text-primary">Hunt Log</h1>
        <p className="text-sm text-muted">Internship application tracker</p>
      </header>

      <section className="rounded-2xl bg-white p-6 shadow-sm">
        <h2 className="mb-4 text-lg font-semibold text-primary">Add an application</h2>
        <ApplicationForm submitLabel="Add application" onSubmit={handleCreate} />
      </section>

      {actionError && (
        <p className="rounded-xl bg-rejected-bg px-4 py-3 text-sm text-rejected-text">{actionError}</p>
      )}

      <section className="rounded-2xl bg-white p-2 shadow-sm">
        {loading && <p className="py-10 text-center text-sm text-muted">Loading…</p>}
        {loadError && <p className="py-10 text-center text-sm text-rejected-text">{loadError}</p>}
        {!loading && !loadError && (
          <ApplicationTable
            applications={applications}
            onStatusChange={handleStatusChange}
            onEdit={setEditing}
            onDelete={setDeleting}
          />
        )}
      </section>

      {/* Dialogs render only while open. "key" gives each application a fresh form. */}
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
          message={`This permanently removes ${deleting.role} at ${deleting.company}. This can't be undone.`}
          confirmLabel="Delete"
          onConfirm={() => handleDelete(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
