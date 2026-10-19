import type { ReactNode } from 'react'

type StatCardProps = {
  label: string
  value: number
  detail: string
  icon: ReactNode
  /** Cor do card: purple | green | blue | orange. */
  tone: string
  trend: ReactNode
}

/** Card de métrica da visão geral. */
export function StatCard({ label, value, detail, icon, tone, trend }: StatCardProps) {
  return (
    <article className="stat-card">
      <div className="stat-top">
        <span>{label}</span>
        <span className={`stat-icon tone-${tone}`}>{icon}</span>
      </div>
      <div className="stat-value-row">
        <strong>{value.toString().padStart(2, '0')}</strong>
        <span className={`stat-trend trend-${tone}`}>{trend}</span>
      </div>
      <p>{detail}</p>
    </article>
  )
}
