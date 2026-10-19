/**
 * Painel de tarefas e projetos.
 * Fluxo: sem sessão > AuthPage; com sessão > carrega projetos e tarefas
 * e mostra a página escolhida.
 */

import { useCallback, useEffect, useMemo, useState } from 'react'
import type { FormEvent } from 'react'
import { api, session } from './lib/api'
import type { Project, Task, TaskStatus } from './lib/api'
import { emptyDraft, TOAST_DURATION_MS } from './constants'
import type { Page, ProjectFilter, Stats, StatusFilter, TaskActions, TaskDraft, Toast as ToastData } from './types'
import { errorMessage } from './utils'
import { ProjectModal, TaskModal } from './components/Modals'
import { Sidebar } from './components/Sidebar'
import { Toast } from './components/Toast'
import { Topbar } from './components/Topbar'
import { AuthPage } from './pages/AuthPage'
import { OverviewPage } from './pages/OverviewPage'
import { ProjectsPage } from './pages/ProjectsPage'
import { TasksPage } from './pages/TasksPage'

function App() {
  /* ---------- Estados: autenticação ---------- */
  const [authenticated, setAuthenticated] = useState(Boolean(session.access))
  const [userLabel, setUserLabel] = useState('')

  /* ---------- Estados: dados vindos da API ---------- */
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(false)

  /* ---------- Estados: filtros e navegação ---------- */
  const [page, setPage] = useState<Page>('overview')
  const [activeProject, setActiveProject] = useState<ProjectFilter>('all')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [search, setSearch] = useState('')

  /* ---------- Estados: modais e formulários ---------- */
  const [modal, setModal] = useState<'project' | 'task' | null>(null)
  const [editingTask, setEditingTask] = useState<Task | null>(null) // null = criando
  const [projectName, setProjectName] = useState('')
  const [projectDescription, setProjectDescription] = useState('')
  const [taskDraft, setTaskDraft] = useState<TaskDraft>(emptyDraft)

  /* ---------- Estados: UI ---------- */
  const [toast, setToast] = useState<ToastData | null>(null)
  const [mobileNav, setMobileNav] = useState(false)

  const avatarInitial = (userLabel || 'U').slice(0, 1).toUpperCase()

  /* ======================================================================
   * AÇÕES GERAIS
   * ==================================================================== */

  /** Mostra um toast e o remove sozinho depois de alguns segundos. */
  const notify = useCallback((kind: ToastData['kind'], message: string) => {
    setToast({ kind, message })
    window.setTimeout(() => setToast(null), TOAST_DURATION_MS)
  }, [])

  /** Encerra a sessão e limpa os dados do estado. */
  function logout() {
    session.clear()
    setAuthenticated(false)
    setProjects([])
    setTasks([])
    setUserLabel('')
  }

  /** Chamado pela AuthPage quando login/cadastro dá certo. */
  function handleAuthSuccess(username: string) {
    setUserLabel(username)
    setAuthenticated(true)
  }

  /**
   * Busca projetos e tarefas em paralelo (tarefas ordenadas por atualização).
   * Erro de credencial/401 encerra a sessão; outros erros viram toast.
   * Também define o projeto padrão do formulário de tarefa.
   */
  const loadData = useCallback(async () => {
    setLoading(true)
    try {
      const [projectResponse, taskResponse] = await Promise.all([
        api.projects(),
        api.tasks('ordering=-updated_at'),
      ])
      setProjects(projectResponse.results)
      setTasks(taskResponse.results)
      setTaskDraft((current) => ({
        ...current,
        project: current.project || projectResponse.results[0]?.id || 0,
      }))
    } catch (error) {
      const message = errorMessage(error, '')
      if (message.toLowerCase().includes('credentials') || message.includes('401')) {
        session.clear()
        setAuthenticated(false)
      } else {
        notify('error', message || 'Não foi possível carregar os dados.')
      }
    } finally {
      setLoading(false)
    }
  }, [notify])

  // Carrega os dados assim que o usuário estiver autenticado.
  useEffect(() => {
    if (authenticated) void loadData()
  }, [authenticated, loadData])

  /* ======================================================================
   * DADOS DERIVADOS (filtros e estatísticas)
   * ==================================================================== */

  /** Tarefas após aplicar filtros de projeto, status e busca (título, descrição, projeto). */
  const visibleTasks = useMemo(() => {
    const query = search.trim().toLowerCase()
    return tasks.filter((task) => {
      const matchesProject = activeProject === 'all' || task.project === activeProject
      const matchesStatus = statusFilter === 'all' || task.status === statusFilter
      const matchesSearch =
        !query || `${task.title} ${task.description} ${task.project_name}`.toLowerCase().includes(query)
      return matchesProject && matchesStatus && matchesSearch
    })
  }, [tasks, activeProject, statusFilter, search])

  /** Contagens por status, usadas nos cards e no anel de progresso. */
  const stats = useMemo<Stats>(
    () => ({
      total: tasks.length,
      done: tasks.filter((task) => task.status === 'done').length,
      progress: tasks.filter((task) => task.status === 'in_progress').length,
      todo: tasks.filter((task) => task.status === 'todo').length,
    }),
    [tasks],
  )

  /** Projeto atualmente filtrado (undefined quando é "todos"). */
  const selectedProject = projects.find((project) => project.id === activeProject)

  /* ======================================================================
   * NAVEGAÇÃO
   * ==================================================================== */

  /** Troca de página e fecha o menu mobile. */
  function goTo(nextPage: Page) {
    setPage(nextPage)
    setMobileNav(false)
  }

  /** Vai para a lista de tarefas filtrada por um projeto (ou por todos). */
  function openProjectTasks(projectId: ProjectFilter) {
    setActiveProject(projectId)
    setPage('tasks')
    setMobileNav(false)
  }

  /* ======================================================================
   * AÇÕES: TAREFAS
   * ==================================================================== */

  /** Abre o modal de tarefa: preenche com `task` (edição) ou com padrões (criação). */
  function openTask(task?: Task) {
    setEditingTask(task || null)
    setTaskDraft(
      task
        ? {
            title: task.title,
            description: task.description,
            project: task.project,
            status: task.status,
            priority: task.priority,
            due_date: task.due_date || '',
          }
        : {
            ...emptyDraft,
            project: typeof activeProject === 'number' ? activeProject : projects[0]?.id || 0,
          },
    )
    setModal('task')
  }

  /** Abre o modal de nova tarefa; se não houver projeto, pede para criar um antes. */
  const startNewTask = () => (projects.length ? openTask() : setModal('project'))

  /** Cria ou atualiza a tarefa (conforme `editingTask`) e recarrega os dados. */
  async function saveTask(event: FormEvent) {
    event.preventDefault()
    if (!taskDraft.project) {
      notify('error', 'Crie um projeto antes de adicionar tarefas.')
      return
    }
    try {
      const payload = {
        ...taskDraft,
        title: taskDraft.title.trim(),
        project: Number(taskDraft.project),
        due_date: taskDraft.due_date || null,
      }
      if (editingTask) await api.updateTask(editingTask.id, payload)
      else await api.createTask(payload)
      setModal(null)
      notify('success', editingTask ? 'Tarefa atualizada.' : 'Tarefa criada.')
      await loadData()
    } catch (error) {
      notify('error', errorMessage(error, 'Não foi possível salvar a tarefa.'))
    }
  }

  /** Altera só o status de uma tarefa (checkbox e select rápido). */
  async function changeStatus(task: Task, status: TaskStatus) {
    try {
      await api.updateTask(task.id, { status })
      await loadData()
    } catch (error) {
      notify('error', errorMessage(error, 'Não foi possível atualizar o status.'))
    }
  }

  /** Exclui a tarefa após confirmação do usuário. */
  async function deleteTask(task: Task) {
    if (!window.confirm(`Excluir a tarefa "${task.title}"? Essa ação não pode ser desfeita.`)) return
    try {
      await api.deleteTask(task.id)
      notify('success', 'Tarefa excluída.')
      await loadData()
    } catch (error) {
      notify('error', errorMessage(error, 'Não foi possível excluir a tarefa.'))
    }
  }

  /** Ações de tarefa repassadas para as páginas. */
  const taskActions: TaskActions = { onStatus: changeStatus, onEdit: openTask, onDelete: deleteTask }

  /* ======================================================================
   * AÇÕES: PROJETOS
   * ==================================================================== */

  /** Cria um projeto novo e recarrega os dados. */
  async function saveProject(event: FormEvent) {
    event.preventDefault()
    try {
      await api.createProject({ name: projectName.trim(), description: projectDescription.trim() })
      setProjectName('')
      setProjectDescription('')
      setModal(null)
      notify('success', 'Projeto criado com sucesso.')
      await loadData()
    } catch (error) {
      notify('error', errorMessage(error, 'Não foi possível criar o projeto.'))
    }
  }

  /** Exclui o projeto e suas tarefas, após confirmação. Reseta o filtro se ele estava ativo. */
  async function deleteProject(project: Project) {
    if (!window.confirm(`Excluir o projeto "${project.name}" e todas as suas tarefas? Essa ação não pode ser desfeita.`)) return
    try {
      await api.deleteProject(project.id)
      if (activeProject === project.id) setActiveProject('all')
      notify('success', 'Projeto excluído.')
      await loadData()
    } catch (error) {
      notify('error', errorMessage(error, 'Não foi possível excluir o projeto.'))
    }
  }

  /* ======================================================================
   * RENDER
   * ==================================================================== */

  // Sem sessão: tela de login/cadastro.
  if (!authenticated) return <AuthPage onSuccess={handleAuthSuccess} />

  return (
    <div className="app-shell">
      <Sidebar
        page={page}
        open={mobileNav}
        stats={stats}
        projects={projects}
        activeProject={activeProject}
        displayName={userLabel}
        avatarInitial={avatarInitial}
        onNavigate={goTo}
        onOpenProject={openProjectTasks}
        onCreateProject={() => setModal('project')}
        onClose={() => setMobileNav(false)}
        onLogout={logout}
      />

      {/* Fundo escuro que fecha o menu no mobile */}
      {mobileNav && <button className="mobile-scrim" aria-label="Fechar menu" onClick={() => setMobileNav(false)} />}

      <main className="main-content">
        <Topbar onOpenMenu={() => setMobileNav(true)} />

        <div className="page-container">
          {page === 'overview' && (
            <OverviewPage
              {...taskActions}
              displayName={userLabel}
              stats={stats}
              projects={projects}
              tasks={visibleTasks}
              statusFilter={statusFilter}
              loading={loading}
              onStatusFilter={setStatusFilter}
              onNewTask={startNewTask}
              onSeeAll={() => setPage('tasks')}
              onCreateProject={() => setModal('project')}
              onOpenProject={openProjectTasks}
            />
          )}

          {page === 'tasks' && (
            <TasksPage
              {...taskActions}
              tasks={visibleTasks}
              projects={projects}
              selectedProject={selectedProject}
              activeProject={activeProject}
              statusFilter={statusFilter}
              search={search}
              loading={loading}
              onSearch={setSearch}
              onStatusFilter={setStatusFilter}
              onProjectFilter={setActiveProject}
              onNewTask={startNewTask}
            />
          )}

          {page === 'projects' && (
            <ProjectsPage
              projects={projects}
              onCreateProject={() => setModal('project')}
              onDeleteProject={deleteProject}
              onOpenProject={openProjectTasks}
            />
          )}
        </div>

        <footer className="app-footer">
          <span>TaskFlow, projeto de portfólio</span>
          <span>v1.0.0</span>
        </footer>
      </main>

      {/* Modais */}
      {modal === 'project' && (
        <ProjectModal
          name={projectName}
          description={projectDescription}
          onNameChange={setProjectName}
          onDescriptionChange={setProjectDescription}
          onSubmit={saveProject}
          onClose={() => setModal(null)}
        />
      )}
      {modal === 'task' && (
        <TaskModal
          draft={taskDraft}
          projects={projects}
          editing={Boolean(editingTask)}
          onChange={setTaskDraft}
          onSubmit={saveTask}
          onClose={() => setModal(null)}
        />
      )}

      {toast && <Toast toast={toast} onDismiss={() => setToast(null)} />}
    </div>
  )
}

export default App
