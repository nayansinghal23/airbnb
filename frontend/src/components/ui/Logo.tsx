interface LogoProps {
  className?: string
}

/** Brand mark + wordmark. Decorative icon is hidden from assistive tech. */
export default function Logo({ className = '' }: LogoProps) {
  return (
    <span className={`inline-flex items-center gap-2 font-bold text-slate-900 ${className}`}>
      <svg
        aria-hidden="true"
        viewBox="0 0 24 24"
        className="h-7 w-7 text-rose-600"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 21h18" />
        <path d="M5 21V7l7-4 7 4v14" />
        <path d="M9 21v-6h6v6" />
        <path d="M9 9h.01M15 9h.01M9 12h.01M15 12h.01" />
      </svg>
      <span className="text-lg tracking-tight">StayEase</span>
    </span>
  )
}
