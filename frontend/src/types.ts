/** Tipos compartilhados entre App, páginas e componentes. */

import type { Priority, Task, TaskStatus } from './lib/api'

/** Mensagem temporária exibida no canto da tela. */
export type Toast = { kind: 'success' | 'error'; message: string }

/** Estado do formulário de tarefa. `due_date` é 'YYYY-MM-DD' ou '' (sem prazo). */
export type TaskDraft = {
  title: string
  description: string
  project: number
  status: TaskStatus
  priority: Priority
  due_date: string
}

/** Páginas disponíveis depois do login. */
export type Page = 'overview' | 'tasks' | 'projects'

/** Filtro de status da lista de tarefas. */
export type StatusFilter = 'all' | TaskStatus

/** Filtro de projeto: id do projeto ou 'all' para todos. */
export type ProjectFilter = number | 'all'

/** Contagens de tarefas por status. */
export type Stats = { total: number; done: number; progress: number; todo: number }

/** Ações disponíveis em cada tarefa (usadas por TaskList e pelas páginas). */
export type TaskActions = {
  onStatus: (task: Task, status: TaskStatus) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}
