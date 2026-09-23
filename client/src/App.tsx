import { useEffect, useState } from 'react'
import { api } from './api'
import { ApplicationForm } from './components/ApplicationForm'
import { ApplicationTable } from './components/ApplicationTable'
import type { Application, ApplicationInput } from './types'

// App owns the list of applications (the "state"). Child components receive
// data through props and report user actions back through callback props.
// This is called "lifting state up".
export default function App() {
  const [applications, setApplications] = useState<Application[]>([])
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState<string | null>(null)

  // useEffect with [] runs once after the first render: load data from the API.
  useEffect(() => {
    api
      .getApplications()
      .then(setApplications)
      .catch(() => setLoadError('Could not reach the API. Is it running on http://localhost:5041?'))
      .finally(() => setLoading(false))
  }, [])

  async function handleCreate(input: ApplicationInput) {
    const created = await api.createApplication(input)
    // Never mutate state directly: build a NEW array so React notices the change.
    setApplications((prev) => [created, ...prev])
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

      <section className="rounded-2xl bg-white p-2 shadow-sm">
        {loading && <p className="py-10 text-center text-sm text-muted">Loading…</p>}
        {loadError && <p className="py-10 text-center text-sm text-rejected-text">{loadError}</p>}
        {!loading && !loadError && <ApplicationTable applications={applications} />}
      </section>
    </div>
  )
}
