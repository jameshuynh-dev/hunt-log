import { useState, type FormEvent, type ReactNode } from 'react'
import { STATUSES, type ApplicationInput, type ApplicationStatus } from '../types'

const EMPTY_FORM: ApplicationInput = {
  company: '',
  role: '',
  status: 'Saved',
  dateApplied: null,
  deadline: null,
  followUpDate: null,
  notes: null,
}

interface ApplicationFormProps {
  // Pass initialValues to edit an existing application. Leave it out to add a new one.
  initialValues?: ApplicationInput
  submitLabel: string
  onSubmit: (input: ApplicationInput) => Promise<void>
  onCancel?: () => void
}

// One form used for both "add" and "edit". Reusing it keeps the fields and
// validation identical in both places.
export function ApplicationForm({ initialValues, submitLabel, onSubmit, onCancel }: ApplicationFormProps) {
  const isEditing = initialValues !== undefined

  // A "controlled form": React state is the single source of truth for every
  // input, and each keystroke updates state, which re-renders the input.
  const [values, setValues] = useState<ApplicationInput>(initialValues ?? EMPTY_FORM)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Generic helper: update(field, value) is type-checked, so update('status', 42) won't compile.
  function update<K extends keyof ApplicationInput>(field: K, value: ApplicationInput[K]) {
    setValues((prev) => ({ ...prev, [field]: value }))
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault() // stop the browser's default full-page form submit
    setSaving(true)
    setError(null)
    try {
      await onSubmit({
        ...values,
        company: values.company.trim(),
        role: values.role.trim(),
        notes: values.notes?.trim() || null,
      })
      if (!isEditing) setValues(EMPTY_FORM) // clear the form for the next entry
    } catch (err) {
      // Show the API's validation message (see describeError in api.ts).
      setError(err instanceof Error ? err.message : 'Something went wrong.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Company">
          <input
            required
            maxLength={100}
            className={inputClass}
            value={values.company}
            onChange={(e) => update('company', e.target.value)}
            placeholder="e.g. Northwind Insurance"
          />
        </Field>
        <Field label="Role">
          <input
            required
            maxLength={100}
            className={inputClass}
            value={values.role}
            onChange={(e) => update('role', e.target.value)}
            placeholder="e.g. Software Engineering Intern"
          />
        </Field>
        <Field label="Status">
          <select
            className={inputClass}
            value={values.status}
            onChange={(e) => update('status', e.target.value as ApplicationStatus)}
          >
            {STATUSES.map((status) => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Date applied">
          <DateInput value={values.dateApplied} onChange={(v) => update('dateApplied', v)} />
        </Field>
        <Field label="Deadline">
          <DateInput value={values.deadline} onChange={(v) => update('deadline', v)} />
        </Field>
        <Field label="Follow-up date">
          <DateInput value={values.followUpDate} onChange={(v) => update('followUpDate', v)} />
        </Field>
      </div>

      <Field label="Notes">
        <textarea
          rows={3}
          maxLength={2000}
          className={inputClass}
          value={values.notes ?? ''}
          onChange={(e) => update('notes', e.target.value)}
          placeholder="Recruiter name, referral, what to prepare..."
        />
      </Field>

      {error && <p className="text-sm text-rejected-text">{error}</p>}

      <div className="flex justify-end gap-3">
        {onCancel && (
          <button type="button" onClick={onCancel} className={secondaryButtonClass}>
            Cancel
          </button>
        )}
        <button type="submit" disabled={saving} className={primaryButtonClass}>
          {saving ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  )
}

// ----- Small building blocks and shared styles -----

export const inputClass =
  'w-full rounded-xl border border-line bg-white px-3 py-2 text-sm text-slate-700 placeholder:text-slate-400 focus:border-action focus:ring-2 focus:ring-action/20 focus:outline-none'

export const primaryButtonClass =
  'rounded-full bg-action px-5 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-action-hover disabled:opacity-60'

export const secondaryButtonClass =
  'rounded-full border border-line bg-white px-5 py-2 text-sm font-semibold text-muted transition hover:bg-canvas'

export function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold tracking-wide text-muted uppercase">{label}</span>
      {children}
    </label>
  )
}

// <input type="date"> gives "" when cleared. The API expects null, so convert.
function DateInput({ value, onChange }: { value: string | null; onChange: (value: string | null) => void }) {
  return (
    <input
      type="date"
      className={inputClass}
      value={value ?? ''}
      onChange={(e) => onChange(e.target.value || null)}
    />
  )
}
