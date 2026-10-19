import { Check, X } from 'lucide-react'
import type { Toast as ToastData } from '../types'

/** Aviso flutuante de sucesso/erro, com botão para dispensar. */
export function Toast({ toast, onDismiss }: { toast: ToastData; onDismiss: () => void }) {
  return (
    <div className={`toast toast-${toast.kind}`}>
      <span>{toast.kind === 'success' ? <Check size={16} /> : <X size={16} />}</span>
      {toast.message}
      <button onClick={onDismiss} aria-label="Dispensar"><X size={15} /></button>
    </div>
  )
}
