import { ArrowRight, FolderKanban } from 'lucide-react'

/** Estado vazio do painel de projetos, com atalho para criar o primeiro. */
export function EmptyProjects({ onCreate }: { onCreate: () => void }) {
  return (
    <div className="empty-projects">
      <span className="empty-icon"><FolderKanban size={20} /></span>
      <p>Crie seu primeiro projeto para começar.</p>
      <button className="text-button" onClick={onCreate}>
        Criar projeto <ArrowRight size={14} />
      </button>
    </div>
  )
}
