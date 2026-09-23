import { useState, type FormEvent } from 'react'
import { inputClass, primaryButtonClass } from '../styles'
import type { ContactInput } from '../types'
import { Field } from './ApplicationForm'

const EMPTY_CONTACT = { name: '', title: '', email: '', linkedIn: '', notes: '' }

interface ContactFormProps {
  onSubmit: (input: ContactInput) => Promise<void>
}

export function ContactForm({ onSubmit }: ContactFormProps) {
  // Plain strings while typing. Empty fields become null when we submit.
  const [values, setValues] = useState(EMPTY_CONTACT)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function update(field: keyof typeof EMPTY_CONTACT, value: string) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    setError(null)
    // The API's [EmailAddress] rule rejects "", so send null for empty fields.
    const orNull = (s: string) => s.trim() || null
    try {
      await onSubmit({
        name: values.name.trim(),
        title: orNull(values.title),
        email: orNull(values.email),
        linkedIn: orNull(values.linkedIn),
        notes: orNull(values.notes),
      })
      setValues(EMPTY_CONTACT)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not add contact.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Name">
          <input required maxLength={100} className={inputClass} value={values.name} onChange={(e) => update('name', e.target.value)} placeholder="e.g. Jordan Lee" />
        </Field>
        <Field label="Title">
          <input maxLength={100} className={inputClass} value={values.title} onChange={(e) => update('title', e.target.value)} placeholder="e.g. Campus Recruiter" />
        </Field>
        <Field label="Email">
          <input type="email" maxLength={200} className={inputClass} value={values.email} onChange={(e) => update('email', e.target.value)} placeholder="name@company.com" />
        </Field>
        <Field label="LinkedIn">
          <input maxLength={300} className={inputClass} value={values.linkedIn} onChange={(e) => update('linkedIn', e.target.value)} placeholder="linkedin.com/in/..." />
        </Field>
      </div>
      <Field label="Notes">
        <textarea rows={2} maxLength={2000} className={inputClass} value={values.notes} onChange={(e) => update('notes', e.target.value)} placeholder="Where you met, what you talked about..." />
      </Field>
      {error && <p className="text-sm text-rejected-text">{error}</p>}
      <div className="flex justify-end">
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? 'Saving…' : 'Add contact'}
        </button>
      </div>
    </form>
  )
}
