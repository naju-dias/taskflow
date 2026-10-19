import { useState } from 'react'
import type { CSSProperties, FormEvent } from 'react'
import { api } from '../lib/api'
import { errorMessage } from '../utils'

/**
 * Conta de demonstração (opcional). Defina VITE_DEMO_USER e VITE_DEMO_PASSWORD
 * no .env do frontend para mostrar o botão "Entrar com conta demo".
 * Atenção: variáveis VITE_ ficam visíveis no navegador — use uma conta sem dados reais.
 */
const DEMO_USER = import.meta.env.VITE_DEMO_USER as string | undefined
const DEMO_PASSWORD = import.meta.env.VITE_DEMO_PASSWORD as string | undefined
const hasDemo = Boolean(DEMO_USER && DEMO_PASSWORD)

/**
 * Tarefas de exemplo da prévia. As que têm `doneAt` são "riscadas" pela animação
 * (valor = segundos até concluir). A animação roda uma vez ao carregar a página.
 */
const previewTasks = [
  { title: 'Entregar relatório da atividade', project: 'Faculdade', due: 'hoje', doneAt: 1.1 },
  { title: 'Enviar currículo', project: 'Estágios', due: 'amanhã', doneAt: 2.2 },
  { title: 'Publicar o site', project: 'Portfólio', due: 'sexta', doneAt: undefined },
]

/**
 * Tela de login/cadastro. Guarda o próprio estado do formulário
 * e avisa o App (`onSuccess`) quando a autenticação der certo.
 */
export function AuthPage({ onSuccess }: { onSuccess: (username: string) => void }) {
  const [mode, setMode] = useState<'login' | 'register'>('login')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const isLogin = mode === 'login'

  /** Executa login/cadastro, controla o loading e mostra o erro, se houver. */
  async function authenticate(action: () => Promise<unknown>, name: string, fallback: string) {
    setError('')
    setLoading(true)
    try {
      await action()
      onSuccess(name)
    } catch (err) {
      setError(errorMessage(err, fallback))
    } finally {
      setLoading(false)
    }
  }

  /** Envia o formulário: login ou cadastro, conforme `mode`. */
  function handleSubmit(event: FormEvent) {
    event.preventDefault()
    const name = username.trim()
    void authenticate(
      isLogin ? () => api.login(name, password) : () => api.register(name, email.trim(), password),
      name,
      isLogin ? 'Não foi possível entrar.' : 'Não foi possível criar a conta.',
    )
  }

  /** Entra direto com a conta de demonstração. */
  function loginAsDemo() {
    if (!DEMO_USER || !DEMO_PASSWORD) return
    void authenticate(() => api.login(DEMO_USER, DEMO_PASSWORD), DEMO_USER, 'Não foi possível entrar na conta demo.')
  }

  /** Alterna entre login e cadastro e limpa o erro anterior. */
  function toggleMode() {
    setMode(isLogin ? 'register' : 'login')
    setError('')
  }

  return (
    <main className="login">
      {/* Coluna esquerda: apresentação + prévia animada do produto */}
      <section className="login-story">
        <span className="login-wordmark">taskflow</span>

        <div className="login-hero">
          <h1>Suas tarefas, separadas por projeto.</h1>
          <p className="login-lede">
            Crie projetos, adicione tarefas com prazo e prioridade e acompanhe o que já foi concluído.
          </p>

          {/* Prévia decorativa: as tarefas são concluídas uma a uma ao carregar */}
          <ul className="login-list" aria-hidden="true">
            {previewTasks.map((task) => (
              <li
                key={task.title}
                className={`login-task ${task.doneAt ? 'is-done' : ''}`}
                style={{ '--delay': `${task.doneAt ?? 0}s` } as CSSProperties}
              >
                <span className="login-check" />
                <span className="login-task-main">
                  <span className="login-task-title">{task.title}</span>
                  <span className="login-task-project">{task.project}</span>
                </span>
                <span className="login-task-due">{task.due}</span>
              </li>
            ))}
          </ul>
        </div>

        <p className="login-story-footer">Projeto de portfólio · v1.0.0</p>
      </section>

      {/* Coluna direita: formulário */}
      <section className="login-panel">
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{isLogin ? 'Entrar' : 'Criar conta'}</h2>
          <p className="login-form-hint">
            {isLogin ? 'Acesse suas tarefas e projetos.' : 'Escolha um usuário e uma senha.'}
          </p>

          <label className="login-field">
            <span>Usuário</span>
            <input
              autoComplete="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              minLength={3}
            />
          </label>

          {/* E-mail só aparece no cadastro */}
          {!isLogin && (
            <label className="login-field">
              <span>E-mail</span>
              <input
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>
          )}

          <label className="login-field">
            <span>Senha</span>
            <input
              type="password"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
            />
            {!isLogin && <small>Mínimo de 8 caracteres.</small>}
          </label>

          {error && <div className="login-error" role="alert">{error}</div>}

          <button className="login-submit" disabled={loading}>
            {loading ? (isLogin ? 'Entrando...' : 'Criando conta...') : isLogin ? 'Entrar' : 'Criar conta'}
          </button>

          {isLogin && hasDemo && (
            <button type="button" className="login-demo" onClick={loginAsDemo} disabled={loading}>
              Entrar com conta demo
            </button>
          )}

          <p className="login-switch">
            {isLogin ? 'Não tem conta?' : 'Já tem conta?'}{' '}
            <button type="button" onClick={toggleMode}>
              {isLogin ? 'Criar conta' : 'Entrar'}
            </button>
          </p>
        </form>
      </section>
    </main>
  )
}
