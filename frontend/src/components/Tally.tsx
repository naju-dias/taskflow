import type { CSSProperties } from 'react'
import type { Stats } from '../types'

type Kind = 'done' | 'progress' | 'todo'

/** Repete `value` `count` vezes. */
const repeat = (value: Kind, count: number): Kind[] => Array.from({ length: count }, () => value)

/**
 * "Contagem" das tarefas: um quadradinho por tarefa, como riscos num caderno.
 * Cheio = concluída, meio cheio = em andamento, vazio = a fazer.
 * Os quadrados aparecem um a um quando a página carrega.
 */
export function Tally({ stats }: { stats: Stats }) {
  if (!stats.total) return null

  const cells = [...repeat('done', stats.done), ...repeat('progress', stats.progress), ...repeat('todo', stats.todo)]

  return (
    <div>
      <div
        className="tally"
        role="img"
        aria-label={`${stats.done} concluídas, ${stats.progress} em andamento e ${stats.todo} a fazer`}
      >
        {cells.map((kind, index) => (
          <span key={index} className={`tally-cell ${kind}`} style={{ '--i': index } as CSSProperties} />
        ))}
      </div>
      <ul className="tally-legend">
        <li><span className="tally-cell done" />Concluídas <strong>{stats.done}</strong></li>
        <li><span className="tally-cell progress" />Em andamento <strong>{stats.progress}</strong></li>
        <li><span className="tally-cell todo" />A fazer <strong>{stats.todo}</strong></li>
      </ul>
    </div>
  )
}
