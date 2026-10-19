export const API_BASE = import.meta.env.VITE_API_BASE_URL || '/api'

export type TaskStatus = 'todo' | 'in_progress' | 'done'
export type Priority = 'low' | 'medium' | 'high'

export interface Project {
  id: number
  name: string
  description: string
  task_count: number
  completed_count: number
  created_at: string
  updated_at: string
}

export interface Task {
  id: number
  title: string
  description: string
  status: TaskStatus
  priority: Priority
  due_date: string | null
  project: number
  project_name: string
  created_at: string
  updated_at: string
}

export interface Paginated<T> { count: number; next: string | null; previous: string | null; results: T[] }

const ACCESS_KEY = 'taskflow_access'
const REFRESH_KEY = 'taskflow_refresh'

export const session = {
  get access() { return localStorage.getItem(ACCESS_KEY) },
  get refresh() { return localStorage.getItem(REFRESH_KEY) },
  setTokens(access: string, refresh: string) {
    localStorage.setItem(ACCESS_KEY, access)
    localStorage.setItem(REFRESH_KEY, refresh)
  },
  clear() {
    localStorage.removeItem(ACCESS_KEY)
    localStorage.removeItem(REFRESH_KEY)
  },
}

async function request<T>(path: string, options: RequestInit = {}, retry = true): Promise<T> {
  const headers = new Headers(options.headers)
  if (!(options.body instanceof FormData)) headers.set('Content-Type', 'application/json')
  if (session.access) headers.set('Authorization', `Bearer ${session.access}`)

  let response = await fetch(`${API_BASE}${path}`, { ...options, headers })
  if (response.status === 401 && retry && session.refresh && !path.includes('/auth/token')) {
    const refreshResponse = await fetch(`${API_BASE}/auth/token/refresh/`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refresh: session.refresh }),
    })
    if (refreshResponse.ok) {
      const tokens = await refreshResponse.json() as { access: string; refresh?: string }
      session.setTokens(tokens.access, tokens.refresh || session.refresh!)
      return request<T>(path, options, false)
    }
    session.clear()
  }

  if (!response.ok) {
    const data = await response.json().catch(() => null) as Record<string, unknown> | null
    const message = data ? Object.entries(data).map(([key, value]) => {
      const text = Array.isArray(value) ? value.join(' ') : typeof value === 'string' ? value : JSON.stringify(value)
      return key === 'detail' ? text : `${key}: ${text}`
    }).join(' · ') : `Erro ${response.status}`
    throw new Error(`${response.status}: ${message || `Erro ${response.status}`}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  async login(username: string, password: string) {
    const tokens = await request<{ access: string; refresh: string }>('/auth/token/', {
      method: 'POST', body: JSON.stringify({ username, password }),
    }, false)
    session.setTokens(tokens.access, tokens.refresh)
  },
  async register(username: string, email: string, password: string) {
    await request('/auth/register/', { method: 'POST', body: JSON.stringify({ username, email, password }) }, false)
    await api.login(username, password)
  },
  projects: () => request<Paginated<Project>>('/projects/'),
  createProject: (data: { name: string; description: string }) => request<Project>('/projects/', { method: 'POST', body: JSON.stringify(data) }),
  updateProject: (id: number, data: Partial<Pick<Project, 'name' | 'description'>>) => request<Project>(`/projects/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteProject: (id: number) => request<void>(`/projects/${id}/`, { method: 'DELETE' }),
  tasks: (params = '') => request<Paginated<Task>>(`/tasks/${params ? `?${params}` : ''}`),
  createTask: (data: { title: string; description: string; project: number; status: TaskStatus; priority: Priority; due_date: string | null }) => request<Task>('/tasks/', { method: 'POST', body: JSON.stringify(data) }),
  updateTask: (id: number, data: Partial<Pick<Task, 'title' | 'description' | 'status' | 'priority' | 'due_date' | 'project'>>) => request<Task>(`/tasks/${id}/`, { method: 'PATCH', body: JSON.stringify(data) }),
  deleteTask: (id: number) => request<void>(`/tasks/${id}/`, { method: 'DELETE' }),
}
