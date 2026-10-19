import { Menu } from 'lucide-react'

/** Barra superior: botão do menu (só no celular) e a data de hoje. */
export function Topbar({ onOpenMenu }: { onOpenMenu: () => void }) {
  const today = new Intl.DateTimeFormat('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' }).format(new Date())

  return (
    <header className="topbar">
      <button className="icon-button mobile-menu" aria-label="Abrir menu" onClick={onOpenMenu}>
        <Menu size={20} />
      </button>
      <span className="today-label">{today}</span>
    </header>
  )
}
