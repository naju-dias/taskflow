/** Constantes e textos fixos da interface. */

import type { Priority, TaskStatus } from './lib/api'
import type { TaskDraft } from './types'

/** Tempo que o toast fica na tela. */
export const TOAST_DURATION_MS = 3200

/** Rótulos em pt-BR para os status vindos da API. */
export const statusLabels: Record<TaskStatus, string> = {
  todo: 'A fazer',
  in_progress: 'Em andamento',
  done: 'Concluída',
}

/** Rótulos em pt-BR para as prioridades vindas da API. */
export const priorityLabels: Record<Priority, string> = {
  low: 'Baixa',
  medium: 'Média',
  high: 'Alta',
}

/** Rascunho vazio de tarefa. */
export const emptyDraft: TaskDraft = {
  title: '',
  description: '',
  project: 0,
  status: 'todo',
  priority: 'medium',
  due_date: '',
}
