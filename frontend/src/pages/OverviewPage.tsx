import { FolderKanban, Plus } from 'lucide-react'
import type { Project, Task } from '../lib/api'
import { EmptyProjects } from '../components/EmptyProjects'
import { Tally } from '../components/Tally'
import { TaskList } from '../components/TaskList'
import type { Stats, StatusFilter, TaskActions } from '../types'
import { projectProgress } from '../utils'

type OverviewPageProps = TaskActions & {
  displayName: string
  stats: Stats
  projects: Project[]
  tasks: Task[] // já filtradas
  statusFilter: StatusFilter
  loading: boolean
  onStatusFilter: (filter: StatusFilter) => void
  onNewTask: () => void
  onSeeAll: () => void
  onCreateProject: () => void
  onOpenProject: (projectId: number) => void
}

/** Abas de filtro exibidas no painel de tarefas. */
const taskTabs: { value: StatusFilter; label: string }[] = [
  { value: 'all', label: 'Todas' },
  { value: 'todo', label: 'A fazer' },
  { value: 'in_progress', label: 'Em andamento' },
]

/** Saudação conforme o horário. */
function greeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Bom dia'
  if (hour < 18) return 'Boa tarde'
  return 'Boa noite'
}

/** Página "Visão geral": saudação, contagem das tarefas, lista recente e projetos. */
export function OverviewPage({
  displayName, stats, projects, tasks, statusFilter, loading,
  onStatusFilter, onNewTask, onSeeAll, onCreateProject, onOpenProject,
  onStatus, onEdit, onDelete,
}: OverviewPageProps) {
  const summary = stats.total
    ? `Você concluiu ${stats.done} de ${stats.total} ${stats.total === 1 ? 'tarefa' : 'tarefas'}.`
    : projects.length
      ? 'Adicione sua primeira tarefa para começar.'
      : 'Crie um projeto e adicione sua primeira tarefa.'

  return (
    <>
      <section className="welcome-row">
        <div>
          <h1>{displayName ? `${greeting()}, ${displayName}` : greeting()}</h1>
          <p className="muted">{summary}</p>
        </div>
        <button className="button button-primary" onClick={onNewTask}>
          <Plus size={17} /> Nova tarefa
        </button>
      </section>

      <section className="tally-section">
        <Tally stats={stats} />
      </section>

      <section className="overview-grid">
        {/* Lista resumida de tarefas (até 5) */}
        <div className="panel">
          <div className="panel-header">
            <h2>Suas tarefas</h2>
            <button className="text-button" onClick={onSeeAll}>Ver todas</button>
          </div>
          <div className="task-tabs">
            {taskTabs.map((tab) => (
              <button
                key={tab.value}
                className={statusFilter === tab.value ? 'task-tab active' : 'task-tab'}
                onClick={() => onStatusFilter(tab.value)}
              >
                {tab.label} {tab.value === 'all' && <span>{stats.total}</span>}
              </button>
            ))}
          </div>
          <TaskList
            tasks={tasks.slice(0, 5)}
            onStatus={onStatus}
            onEdit={onEdit}
            onDelete={onDelete}
            onCreate={onNewTask}
            loading={loading}
          />
        </div>

        {/* Projetos e quanto de cada um já foi feito (até 4) */}
        <aside className="projects-aside">
          <div className="aside-header">
            <h2>Projetos</h2>
            <button className="icon-button tiny" aria-label="Adicionar projeto" onClick={onCreateProject}>
              <Plus size={17} />
            </button>
          </div>
          {projects.slice(0, 4).map((project, index) => (
            <button className="project-progress-item" key={project.id} onClick={() => onOpenProject(project.id)}>
              <span className={`project-symbol color-${index % 4}`}><FolderKanban size={16} /></span>
              <span className="project-progress-copy">
                <span className="project-progress-name">{project.name}</span>
                <span className="project-progress-meta">
                  {project.completed_count} de {project.task_count} tarefas
                </span>
                <span className="mini-progress">
                  <i style={{ width: `${projectProgress(project)}%` }} />
                </span>
              </span>
              <strong>{projectProgress(project)}%</strong>
            </button>
          ))}
          {!projects.length && <EmptyProjects onCreate={onCreateProject} />}
        </aside>
      </section>
    </>
  )
}
