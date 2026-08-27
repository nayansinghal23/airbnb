import Container from './ui/Container'
import Logo from './ui/Logo'

/** Site footer. */
export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      <Container className="flex flex-col items-center justify-between gap-4 py-8 sm:flex-row">
        <Logo />
        <p className="text-sm text-slate-500">
          © {new Date().getFullYear()} StayEase. All rights reserved.
        </p>
      </Container>
    </footer>
  )
}
