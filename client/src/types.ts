// These types mirror the C# classes in /api. TypeScript checks at build time
// that we use the API's data correctly (e.g. no typo like app.compnay).

// "as const" + typeof gives a union type 'Saved' | 'Applied' | ... and also a
// real array we can loop over for dropdowns. They must match the C# enum.
export const STATUSES = ['Saved', 'Applied', 'Interviewing', 'Offer', 'Rejected'] as const
export type ApplicationStatus = (typeof STATUSES)[number]

export interface Application {
  id: number
  company: string
  role: string
  status: ApplicationStatus
  dateApplied: string | null // "YYYY-MM-DD" (C# DateOnly)
  deadline: string | null
  followUpDate: string | null
  notes: string | null
  createdAt: string // ISO timestamp in UTC
}

// What we send on create/update: same as Application minus server-owned
// fields. Matches ApplicationInput.cs on the backend.
export type ApplicationInput = Omit<Application, 'id' | 'createdAt'>

// Copy the editable fields out of an Application. Used for PUT, which needs the full object.
export function toInput(app: Application): ApplicationInput {
  return {
    company: app.company,
    role: app.role,
    status: app.status,
    dateApplied: app.dateApplied,
    deadline: app.deadline,
    followUpDate: app.followUpDate,
    notes: app.notes,
  }
}
