import type { ReactNode } from 'react'

interface FeatureCardProps {
  /** Decorative icon element; hidden from assistive tech by the card. */
  icon: ReactNode
  title: string
  description: string
}

/** Reusable card for presenting a single product feature. */
export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
      <div
        aria-hidden="true"
        className="flex h-12 w-12 items-center justify-center rounded-xl bg-rose-100 text-rose-600"
      >
        {icon}
      </div>
      <h3 className="mt-4 text-lg font-semibold text-slate-900">{title}</h3>
      <p className="mt-2 text-slate-600">{description}</p>
    </div>
  )
}
