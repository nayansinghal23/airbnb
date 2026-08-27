import Container from './ui/Container'
import FeatureCard from './FeatureCard'

const iconClass = 'h-6 w-6'
const iconProps = {
  className: iconClass,
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
}

const features = [
  {
    title: 'Real-time availability',
    description:
      'See up-to-the-second room availability across every hotel so you never book a room that is already taken.',
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v5l3 2" />
      </svg>
    ),
  },
  {
    title: 'Secure instant booking',
    description:
      'Reserve your room instantly with reliable, conflict-free booking backed by secure authentication.',
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <rect x="4" y="10" width="16" height="10" rx="2" />
        <path d="M8 10V7a4 4 0 0 1 8 0v3" />
      </svg>
    ),
  },
  {
    title: 'Instant email confirmations',
    description:
      'Get booking confirmations and updates delivered to your inbox the moment your reservation is made.',
    icon: (
      <svg viewBox="0 0 24 24" {...iconProps}>
        <rect x="3" y="5" width="18" height="14" rx="2" />
        <path d="m3 7 9 6 9-6" />
      </svg>
    ),
  },
]

/** Grid of product highlights. Responsive: 1 column on mobile, up to 3 on desktop. */
export default function Features() {
  return (
    <section aria-labelledby="features-heading" className="bg-white">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2
            id="features-heading"
            className="text-3xl font-bold tracking-tight text-slate-900"
          >
            Everything you need to book with confidence
          </h2>
          <p className="mt-4 text-slate-600">
            A fast, reliable hotel booking experience built for travelers.
          </p>
        </div>

        <ul className="mt-12 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => (
            <li key={feature.title}>
              <FeatureCard
                icon={feature.icon}
                title={feature.title}
                description={feature.description}
              />
            </li>
          ))}
        </ul>
      </Container>
    </section>
  )
}
