/** Funções utilitárias puras (sem estado do React). */

import type { Project } from './lib/api'

/**
 * Formata 'YYYY-MM-DD' como "17 out". Retorna "Sem prazo" se for null.
 * Usa 12:00 para o fuso horário não mudar o dia exibido.
 */
export const dateLabel = (date: string | null) =>
  date
    ? new Intl.DateTimeFormat('pt-BR', { day: '2-digit', month: 'short' }).format(new Date(`${date}T12:00:00`))
    : 'Sem prazo'

/** Porcentagem (0–100) de tarefas concluídas de um projeto. */
export const projectProgress = (project: Project) =>
  project.task_count ? Math.round((project.completed_count / project.task_count) * 100) : 0

/** Extrai a mensagem de um erro desconhecido, com texto padrão. */
export const errorMessage = (error: unknown, fallback: string) =>
  error instanceof Error ? error.message : fallback
