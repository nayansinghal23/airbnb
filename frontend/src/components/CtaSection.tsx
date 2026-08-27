import Button from './ui/Button'
import Container from './ui/Container'

/** Closing call-to-action band nudging visitors to log in or register. */
export default function CtaSection() {
  return (
    <section className="bg-slate-900">
      <Container className="py-16 sm:py-20">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-white">
            Ready to book your next stay?
          </h2>
          <p className="mt-4 text-slate-300">
            Join StayEase today and reserve your room in just a few clicks.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Button href="/register" size="lg" className="w-full sm:w-auto">
              Create an account
            </Button>
            <Button
              href="/login"
              variant="secondary"
              size="lg"
              className="w-full sm:w-auto"
            >
              Log in
            </Button>
          </div>
        </div>
      </Container>
    </section>
  )
}
