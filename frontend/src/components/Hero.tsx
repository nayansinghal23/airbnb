import Button from './ui/Button'
import Container from './ui/Container'

/** Primary above-the-fold section: value proposition + main auth call to action. */
export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-rose-50 to-white">
      <Container className="py-16 sm:py-24 lg:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="inline-block rounded-full bg-rose-100 px-3 py-1 text-sm font-medium text-rose-700">
            Book smarter, stay better
          </span>

          <h1 className="mt-6 text-4xl font-extrabold tracking-tight text-slate-900 sm:text-5xl lg:text-6xl">
            Find and book your perfect stay in seconds
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-600">
            StayEase connects you to hotels worldwide with real-time availability,
            secure instant booking, and confirmations delivered straight to your inbox.
            Create an account to start booking today.
          </p>

          <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="w-full sm:w-auto">
              Get started — it&apos;s free
            </Button>
            <Button href="/login" variant="secondary" size="lg" className="w-full sm:w-auto">
              Log in to your account
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
