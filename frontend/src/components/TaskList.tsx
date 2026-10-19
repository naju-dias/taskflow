import { CalendarDays, Check, ListTodo, MoreHorizontal, Plus, Trash2 } from 'lucide-react'
import type { Task, TaskStatus } from '../lib/api'
import { priorityLabels, statusLabels } from '../constants'
import type { TaskActions } from '../types'
import { dateLabel } from '../utils'

type TaskListProps = TaskActions & {
  tasks: Task[]
  onCreate: () => void
  loading: boolean
}

/**
 * Lista de tarefas com estados de carregamento e vazio.
 * Ações por linha: concluir/reabrir, editar, excluir e mudar status.
 */
export function TaskList({ tasks, onStatus, onEdit, onDelete, onCreate, loading }: TaskListProps) {
  // Estado: carregando
  if (loading) {
    return <div className="list-loading"><span className="spinner" /> Carregando suas tarefas...</div>
  }

  // Estado: vazio
  if (!tasks.length) {
    return (
      <div className="empty-state">
        <span className="empty-icon"><ListTodo size={23} /></span>
        <h3>Nenhuma tarefa por aqui</h3>
        <p>Crie sua primeira tarefa para começar a acompanhar o progresso.</p>
        <button className="button button-primary button-small" onClick={onCreate}>
          <Plus size={15} /> Adicionar tarefa
        </button>
      </div>
    )
  }

  // Estado: com tarefas
  return (
    <div className="task-list">
      {tasks.map((task) => {
        const isDone = task.status === 'done'
        return (
          <article className={`task-row ${isDone ? 'task-complete' : ''}`} key={task.id}>
            {/* Checkbox: alterna entre concluída e a fazer */}
            <button
              className={`task-check ${isDone ? 'checked' : ''}`}
              aria-label={isDone ? 'Marcar como a fazer' : 'Marcar como concluída'}
              onClick={() => onStatus(task, isDone ? 'todo' : 'done')}
            >
              {isDone && <Check size={13} />}
            </button>

            {/* Título e subtítulo (clicar abre a edição) */}
            <button className="task-main" onClick={() => onEdit(task)}>
              <span className="task-title">{task.title}</span>
              <span className="task-subtitle">
                <span className="task-project-dot" />
                {task.project_name}
                <span className="task-sub-separator">·</span>
                <span className={`status-text status-${task.status}`}>{statusLabels[task.status]}</span>
              </span>
            </button>

            <span className={`priority-pill priority-${task.priority}`}>
              <i />
              {priorityLabels[task.priority]}
            </span>
            <span className="task-due">
              <CalendarDays size={13} />
              {dateLabel(task.due_date)}
            </span>

            {/* Ações da linha */}
            <div className="task-actions">
              <button className="icon-button tiny" aria-label="Editar tarefa" onClick={() => onEdit(task)}>
                <MoreHorizontal size={17} />
              </button>
              <button className="icon-button tiny delete-action" aria-label="Excluir tarefa" onClick={() => onDelete(task)}>
                <Trash2 size={15} />
              </button>
              <select
                className="quick-status"
                aria-label="Alterar status"
                value={task.status}
                onChange={(e) => onStatus(task, e.target.value as TaskStatus)}
              >
                {Object.entries(statusLabels).map(([value, label]) => (
                  <option key={value} value={value}>{label}</option>
                ))}
              </select>
            </div>
          </article>
        )
      })}
    </div>
  )
}
