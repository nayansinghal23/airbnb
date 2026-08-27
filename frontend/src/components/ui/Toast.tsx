export type ToastType = 'success' | 'error'

export interface ToastData {
  id: number
  type: ToastType
  message: string
}

interface ToastProps {
  toast: ToastData
  onDismiss: (id: number) => void
}

const styles: Record<ToastType, { container: string; icon: JSX.Element }> = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-800',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-emerald-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 6 9 17l-5-5" />
      </svg>
    ),
  },
  error: {
    container: 'border-rose-200 bg-rose-50 text-rose-800',
    icon: (
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-5 w-5 text-rose-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <circle cx="12" cy="12" r="9" />
        <path d="M12 8v4M12 16h.01" />
      </svg>
    ),
  },
}

/** A single toast notification. Errors are announced assertively, others politely. */
export default function Toast({ toast, onDismiss }: ToastProps) {
  const style = styles[toast.type]
  return (
    <div
      role={toast.type === 'error' ? 'alert' : 'status'}
      className={`pointer-events-auto flex w-full items-start gap-3 rounded-xl border px-4 py-3 shadow-md ${style.container}`}
    >
      <span className="mt-0.5 shrink-0">{style.icon}</span>
      <p className="flex-1 text-sm font-medium">{toast.message}</p>
      <button
        type="button"
        onClick={() => onDismiss(toast.id)}
        aria-label="Dismiss notification"
        className="-mr-1 shrink-0 rounded p-0.5 text-current/70 hover:text-current focus:outline-none focus-visible:ring-2 focus-visible:ring-current"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 24 24"
          className="h-4 w-4"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M18 6 6 18M6 6l12 12" />
        </svg>
      </button>
    </div>
  )
}
