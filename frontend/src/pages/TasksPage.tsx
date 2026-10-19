import { Plus, Search } from 'lucide-react'
import type { Project, Task } from '../lib/api'
import { TaskList } from '../components/TaskList'
import type { ProjectFilter, StatusFilter, TaskActions } from '../types'

type TasksPageProps = TaskActions & {
  tasks: Task[] // já filtradas
  projects: Project[]
  selectedProject?: Project
  activeProject: ProjectFilter
  statusFilter: StatusFilter
  search: string
  loading: boolean
  onSearch: (value: string) => void
  onStatusFilter: (filter: StatusFilter) => void
  onProjectFilter: (filter: ProjectFilter) => void
  onNewTask: () => void
}

/** Página "Tarefas": busca, filtros e lista completa. */
export function TasksPage({
  tasks, projects, selectedProject, activeProject, statusFilter, search, loading,
  onSearch, onStatusFilter, onProjectFilter, onNewTask,
  onStatus, onEdit, onDelete,
}: TasksPageProps) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <h1>{selectedProject?.name || 'Todas as tarefas'}</h1>
          <p className="muted">Busque, filtre e acompanhe cada entrega.</p>
        </div>
        <button className="button button-primary" onClick={onNewTask}>
          <Plus size={17} /> Nova tarefa
        </button>
      </section>

      <section className="panel all-tasks-panel">
        {/* Barra de busca e filtros */}
        <div className="list-toolbar">
          <div className="search-box">
            <Search size={17} />
            <input value={search} onChange={(e) => onSearch(e.target.value)} placeholder="Buscar tarefa ou projeto..." />
          </div>
          <select
            aria-label="Filtrar por status"
            value={statusFilter}
            onChange={(e) => onStatusFilter(e.target.value as StatusFilter)}
          >
            <option value="all">Todos os status</option>
            <option value="todo">A fazer</option>
            <option value="in_progress">Em andamento</option>
            <option value="done">Concluídas</option>
          </select>
          <select
            aria-label="Filtrar por projeto"
            value={activeProject}
            onChange={(e) => onProjectFilter(e.target.value === 'all' ? 'all' : Number(e.target.value))}
          >
            <option value="all">Todos os projetos</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>{project.name}</option>
            ))}
          </select>
        </div>
        <TaskList
          tasks={tasks}
          onStatus={onStatus}
          onEdit={onEdit}
          onDelete={onDelete}
          onCreate={onNewTask}
          loading={loading}
        />
      </section>
    </>
  )
}
