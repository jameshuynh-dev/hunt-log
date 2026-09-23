import type { Application, ApplicationInput } from './types'

// All HTTP calls live in this one file, so components never build URLs
// themselves. If the API moves, change it here (or set VITE_API_URL in client/.env).
const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5041'

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, init)

  if (!response.ok) {
    throw new Error(await describeError(response))
  }

  // 204 No Content has no body to parse (e.g. after DELETE).
  if (response.status === 204) {
    return undefined as T
  }

  return (await response.json()) as T
}

// ASP.NET returns errors as "ProblemDetails" JSON, e.g.
// { "title": "...", "errors": { "Company": ["The Company field is required."] } }
async function describeError(response: Response): Promise<string> {
  try {
    const problem: { title?: string; errors?: Record<string, string[]> } = await response.json()
    if (problem.errors) return Object.values(problem.errors).flat().join(' ')
    if (problem.title) return problem.title
  } catch {
    // The body wasn't JSON. Fall through to the generic message.
  }
  return `Request failed (${response.status})`
}

function jsonBody(method: string, data: unknown): RequestInit {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  }
}

export const api = {
  getApplications: () => request<Application[]>('/api/applications'),

  createApplication: (input: ApplicationInput) =>
    request<Application>('/api/applications', jsonBody('POST', input)),
}
