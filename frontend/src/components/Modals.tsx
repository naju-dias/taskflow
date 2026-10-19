import type { FormEvent, ReactNode } from 'react'
import { Check, Plus, X } from 'lucide-react'
import type { Priority, Project, TaskStatus } from '../lib/api'
import { priorityLabels, statusLabels } from '../constants'
import type { TaskDraft } from '../types'

/** Estrutura comum dos modais: fundo (clicar fora fecha), cabeçalho e conteúdo. */
function ModalShell({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) onClose() }}>
      <section className="modal-card" role="dialog" aria-modal="true" aria-labelledby="modal-title">
        <div className="modal-header">
          <div>
            <h2 id="modal-title">{title}</h2>
          </div>
          <button className="icon-button" onClick={onClose} aria-label="Fechar">
            <X size={19} />
          </button>
        </div>
        {children}
      </section>
    </div>
  )
}

/* ------------------------------------------------------------------ */

type ProjectModalProps = {
  name: string
  description: string
  onNameChange: (value: string) => void
  onDescriptionChange: (value: string) => void
  onSubmit: (event: FormEvent) => void
  onClose: () => void
}

/** Modal de criação de projeto. */
export function ProjectModal({ name, description, onNameChange, onDescriptionChange, onSubmit, onClose }: ProjectModalProps) {
  return (
    <ModalShell title="Novo projeto" onClose={onClose}>
      <form onSubmit={onSubmit} className="modal-form">
        <label>
          Nome do projeto
          <input
            autoFocus
            value={name}
            onChange={(e) => onNameChange(e.target.value)}
            placeholder="Ex.: Redesign do site"
            required
            maxLength={120}
          />
        </label>
        <label>
          <span>Descrição <span className="optional-label">(opcional)</span></span>
          <textarea
            value={description}
            onChange={(e) => onDescriptionChange(e.target.value)}
            placeholder="Qual é o objetivo deste projeto?"
            rows={3}
          />
        </label>
        <div className="modal-actions">
          <button type="button" className="button button-quiet" onClick={onClose}>Cancelar</button>
          <button className="button button-primary"><Plus size={16} /> Criar projeto</button>
        </div>
      </form>
    </ModalShell>
  )
}

/* ------------------------------------------------------------------ */

type TaskModalProps = {
  draft: TaskDraft
  projects: Project[]
  editing: boolean // true = editando tarefa existente; false = criando
  onChange: (draft: TaskDraft) => void
  onSubmit: (event: FormEvent) => void
  onClose: () => void
}

/** Modal de criação/edição de tarefa. */
export function TaskModal({ draft, projects, editing, onChange, onSubmit, onClose }: TaskModalProps) {
  return (
    <ModalShell title={editing ? 'Editar tarefa' : 'Nova tarefa'} onClose={onClose}>
      <form onSubmit={onSubmit} className="modal-form">
        <label>
          Título da tarefa
          <input
            autoFocus
            value={draft.title}
            onChange={(e) => onChange({ ...draft, title: e.target.value })}
            placeholder="O que precisa ser feito?"
            required
            maxLength={160}
          />
        </label>
        <label>
          <span>Descrição <span className="optional-label">(opcional)</span></span>
          <textarea
            value={draft.description}
            onChange={(e) => onChange({ ...draft, description: e.target.value })}
            placeholder="Adicione detalhes importantes..."
            rows={3}
          />
        </label>
        <div className="form-row">
          <label>
            Projeto
            <select
              value={draft.project}
              onChange={(e) => onChange({ ...draft, project: Number(e.target.value) })}
              required
            >
              {projects.map((project) => (
                <option key={project.id} value={project.id}>{project.name}</option>
              ))}
            </select>
          </label>
          <label>
            Prazo
            <input
              type="date"
              value={draft.due_date}
              onChange={(e) => onChange({ ...draft, due_date: e.target.value })}
            />
          </label>
        </div>
        <div className="form-row">
          <label>
            Status
            <select
              value={draft.status}
              onChange={(e) => onChange({ ...draft, status: e.target.value as TaskStatus })}
            >
              {Object.entries(statusLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
          <label>
            Prioridade
            <select
              value={draft.priority}
              onChange={(e) => onChange({ ...draft, priority: e.target.value as Priority })}
            >
              {Object.entries(priorityLabels).map(([value, label]) => (
                <option key={value} value={value}>{label}</option>
              ))}
            </select>
          </label>
        </div>
        <div className="modal-actions">
          <button type="button" className="button button-quiet" onClick={onClose}>Cancelar</button>
          <button className="button button-primary">
            <Check size={16} /> {editing ? 'Salvar alterações' : 'Criar tarefa'}
          </button>
        </div>
      </form>
    </ModalShell>
  )
}
