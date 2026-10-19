import type { ReactNode } from 'react'
import { FolderKanban, LayoutDashboard, ListTodo, LogOut, Plus, X } from 'lucide-react'
import type { Project } from '../lib/api'
import { Brand } from './Brand'
import type { Page, ProjectFilter, Stats } from '../types'

type SidebarProps = {
  page: Page
  open: boolean // menu aberto no mobile
  stats: Stats
  projects: Project[]
  activeProject: ProjectFilter
  displayName: string
  avatarInitial: string
  onNavigate: (page: Page) => void
  onOpenProject: (projectId: ProjectFilter) => void
  onCreateProject: () => void
  onClose: () => void
  onLogout: () => void
}

/** Menu lateral: navegação, atalhos de projetos e perfil do usuário. */
export function Sidebar({
  page, open, stats, projects, activeProject, displayName, avatarInitial,
  onNavigate, onOpenProject, onCreateProject, onClose, onLogout,
}: SidebarProps) {
  const navItems: { page: Page; label: string; icon: ReactNode; count?: number }[] = [
    { page: 'overview', label: 'Visão geral', icon: <LayoutDashboard size={18} /> },
    { page: 'tasks', label: 'Todas as tarefas', icon: <ListTodo size={18} />, count: stats.total },
    { page: 'projects', label: 'Projetos', icon: <FolderKanban size={18} />, count: projects.length },
  ]

  return (
    <aside className={`sidebar ${open ? 'sidebar-open' : ''}`}>
      <div className="sidebar-top">
        <Brand />
        <button className="icon-button mobile-close" onClick={onClose} aria-label="Fechar menu">
          <X size={19} />
        </button>
      </div>

      {/* Navegação principal */}
      <nav className="main-nav">
        {navItems.map((item) => (
          <button
            key={item.page}
            className={page === item.page ? 'nav-item active' : 'nav-item'}
            onClick={() => onNavigate(item.page)}
          >
            {item.icon} {item.label}
            {item.count !== undefined && <span className="nav-count">{item.count}</span>}
          </button>
        ))}
      </nav>

      {/* Atalhos de projetos */}
      <div className="project-heading">
        <span className="nav-label">Seus projetos</span>
        <button className="icon-button tiny" aria-label="Criar projeto" onClick={onCreateProject}>
          <Plus size={16} />
        </button>
      </div>
      <div className="project-nav">
        <button
          className={`project-nav-item ${page === 'tasks' && activeProject === 'all' ? 'selected' : ''}`}
          onClick={() => onOpenProject('all')}
        >
          <span className="project-color all-color" />
          Todos
        </button>
        {projects.map((project, index) => (
          <button
            key={project.id}
            className={`project-nav-item ${page === 'tasks' && activeProject === project.id ? 'selected' : ''}`}
            onClick={() => onOpenProject(project.id)}
          >
            <span className={`project-color color-${index % 4}`} />
            <span className="project-name">{project.name}</span>
            <span className="project-task-count">{project.task_count}</span>
          </button>
        ))}
        {!projects.length && <p className="sidebar-empty">Nenhum projeto ainda.</p>}
      </div>

      {/* Perfil e sair */}
      <div className="sidebar-bottom">
        <div className="profile-row">
          <span className="profile-avatar">{avatarInitial}</span>
          <span className="profile-copy">
            <strong>{displayName || 'Sua conta'}</strong>
          </span>
          <button className="icon-button" onClick={onLogout} title="Sair" aria-label="Sair">
            <LogOut size={17} />
          </button>
        </div>
      </div>
    </aside>
  )
}
