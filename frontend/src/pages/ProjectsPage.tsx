import { ArrowRight, FolderKanban, Plus, Trash2 } from 'lucide-react'
import type { Project } from '../lib/api'
import { projectProgress } from '../utils'

type ProjectsPageProps = {
  projects: Project[]
  onCreateProject: () => void
  onDeleteProject: (project: Project) => void
  onOpenProject: (projectId: number) => void
}

/** Página "Projetos": cards com progresso, exclusão e atalho para as tarefas. */
export function ProjectsPage({ projects, onCreateProject, onDeleteProject, onOpenProject }: ProjectsPageProps) {
  return (
    <>
      <section className="welcome-row">
        <div>
          <h1>Projetos</h1>
          <p className="muted">Cada projeto agrupa suas tarefas e mostra quanto já foi feito.</p>
        </div>
        <button className="button button-primary" onClick={onCreateProject}>
          <Plus size={17} /> Novo projeto
        </button>
      </section>

      <section className="project-cards-grid">
        {projects.map((project, index) => (
          <article className="project-card" key={project.id}>
            <div className="project-card-top">
              <span className={`project-symbol large-symbol color-${index % 4}`}>
                <FolderKanban size={20} />
              </span>
              <button className="icon-button" aria-label={`Excluir ${project.name}`} onClick={() => onDeleteProject(project)}>
                <Trash2 size={16} />
              </button>
            </div>
            <h3>{project.name}</h3>
            <p>{project.description || 'Sem descrição adicionada.'}</p>
            <div className="project-card-stats">
              <span>{project.task_count} tarefas</span>
              <strong>{projectProgress(project)}% concluído</strong>
            </div>
            <div className="mini-progress full-progress">
              <i style={{ width: `${projectProgress(project)}%` }} />
            </div>
            <button className="project-card-link" onClick={() => onOpenProject(project.id)}>
              Ver tarefas <ArrowRight size={15} />
            </button>
          </article>
        ))}

        {/* Card para criar um novo projeto */}
        <button className="new-project-card" onClick={onCreateProject}>
          <span className="new-project-icon"><Plus size={22} /></span>
          <strong>Criar novo projeto</strong>
          <span>Agrupe tarefas por objetivo.</span>
        </button>
      </section>

      {!projects.length && (
        <div className="empty-state big-empty">
          <span className="empty-icon"><FolderKanban size={24} /></span>
          <h3>Seu primeiro projeto começa aqui</h3>
          <p>Crie um projeto para agrupar tarefas e acompanhar seu progresso.</p>
          <button className="button button-primary" onClick={onCreateProject}>
            <Plus size={16} /> Criar projeto
          </button>
        </div>
      )}
    </>
  )
}
