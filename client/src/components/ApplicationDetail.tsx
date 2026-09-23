import { useEffect, useState } from 'react'
import { api } from '../api'
import { formatDate } from '../dates'
import { secondaryButtonClass } from '../styles'
import type { Application, Contact, ContactInput } from '../types'
import { ConfirmDialog } from './ConfirmDialog'
import { ContactForm } from './ContactForm'
import { StatusBadge } from './StatusBadge'

interface ApplicationDetailProps {
  application: Application
  onBack: () => void
  onEdit: (app: Application) => void
}

// Only allow http(s) links. A value like "javascript:alert(1)" becomes
// "https://javascript:alert(1)", a harmless broken link, instead of running code.
function safeUrl(url: string): string {
  return /^https?:\/\//i.test(url) ? url : `https://${url}`
}

// Detail page for one application, with its contacts.
// Unlike the table, this component fetches its own data (contacts). They're
// only needed here, so App doesn't have to know about them.
export function ApplicationDetail({ application, onBack, onEdit }: ApplicationDetailProps) {
  const [contacts, setContacts] = useState<Contact[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deleting, setDeleting] = useState<Contact | null>(null)

  // Load contacts when the component appears. App renders this component with
  // key={application.id}, so each application gets a FRESH component whose
  // state starts at loading=true. No manual reset is needed.
  useEffect(() => {
    // If a response arrives after we've moved on (unmounted), ignore it
    // instead of setting state on a component that's gone.
    let ignore = false
    api
      .getContacts(application.id)
      .then((data) => !ignore && setContacts(data))
      .catch(() => !ignore && setError('Could not load contacts.'))
      .finally(() => !ignore && setLoading(false))
    return () => {
      ignore = true // cleanup runs before the next effect or on unmount
    }
  }, [application.id])

  async function handleAddContact(input: ContactInput) {
    const created = await api.createContact(application.id, input)
    setContacts((prev) => [...prev, created].sort((a, b) => a.name.localeCompare(b.name)))
  }

  async function handleDeleteContact(contact: Contact) {
    try {
      await api.deleteContact(contact.id)
      setContacts((prev) => prev.filter((c) => c.id !== contact.id))
    } catch {
      setError('Could not delete contact.')
    } finally {
      setDeleting(null)
    }
  }

  const details: { label: string; value: string }[] = [
    { label: 'Date applied', value: formatDate(application.dateApplied) },
    { label: 'Deadline', value: formatDate(application.deadline) },
    { label: 'Follow-up', value: formatDate(application.followUpDate) },
  ]

  return (
    <div className="space-y-6">
      <button type="button" onClick={onBack} className="text-sm font-semibold text-action hover:text-action-hover">
        ← Back to dashboard
      </button>

      <section className="rounded-3xl bg-white p-6 shadow-[0_1px_3px_rgba(14,90,107,0.08)]">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-2xl font-bold text-primary">{application.company}</h2>
              <StatusBadge status={application.status} />
            </div>
            <p className="mt-1 text-muted">{application.role}</p>
          </div>
          <button type="button" onClick={() => onEdit(application)} className={secondaryButtonClass}>
            Edit application
          </button>
        </div>

        <dl className="mt-6 grid gap-4 sm:grid-cols-3">
          {details.map((d) => (
            <div key={d.label} className="rounded-2xl bg-canvas px-4 py-3">
              <dt className="text-xs font-semibold tracking-wide text-muted uppercase">{d.label}</dt>
              <dd className="mt-1 font-semibold text-primary">{d.value}</dd>
            </div>
          ))}
        </dl>

        {application.notes && (
          <div className="mt-6">
            <h3 className="text-xs font-semibold tracking-wide text-muted uppercase">Notes</h3>
            {/* whitespace-pre-wrap keeps the line breaks you typed */}
            <p className="mt-1 text-sm whitespace-pre-wrap text-slate-600">{application.notes}</p>
          </div>
        )}
      </section>

      <section className="rounded-3xl bg-white p-6 shadow-[0_1px_3px_rgba(14,90,107,0.08)]">
        <h3 className="text-lg font-semibold text-primary">
          Contacts <span className="text-sm font-normal text-muted">({contacts.length})</span>
        </h3>

        {error && <p className="mt-3 text-sm text-rejected-text">{error}</p>}

        {loading ? (
          <p className="py-6 text-sm text-muted">Loading contacts…</p>
        ) : contacts.length === 0 ? (
          <p className="py-6 text-sm text-muted">No contacts yet. Add someone you met below.</p>
        ) : (
          <ul className="mt-4 grid gap-3 sm:grid-cols-2">
            {contacts.map((c) => (
              <li key={c.id} className="rounded-2xl border border-line p-4">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="font-semibold text-primary">{c.name}</div>
                    {c.title && <div className="text-sm text-muted">{c.title}</div>}
                  </div>
                  <button
                    type="button"
                    onClick={() => setDeleting(c)}
                    className="rounded-full px-2.5 py-1 text-xs font-semibold text-rejected-text hover:bg-rejected-bg"
                  >
                    Remove
                  </button>
                </div>
                <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-sm">
                  {c.email && (
                    <a href={`mailto:${c.email}`} className="text-action hover:underline">
                      {c.email}
                    </a>
                  )}
                  {c.linkedIn && (
                    <a href={safeUrl(c.linkedIn)} target="_blank" rel="noreferrer" className="text-action hover:underline">
                      LinkedIn ↗
                    </a>
                  )}
                </div>
                {c.notes && <p className="mt-2 text-sm whitespace-pre-wrap text-slate-600">{c.notes}</p>}
              </li>
            ))}
          </ul>
        )}

        <div className="mt-6 border-t border-line pt-6">
          <h4 className="mb-4 text-sm font-semibold text-primary">Add a contact</h4>
          <ContactForm onSubmit={handleAddContact} />
        </div>
      </section>

      {deleting && (
        <ConfirmDialog
          title="Remove contact?"
          message={`This removes ${deleting.name} from ${application.company}.`}
          confirmLabel="Remove"
          onConfirm={() => handleDeleteContact(deleting)}
          onCancel={() => setDeleting(null)}
        />
      )}
    </div>
  )
}
