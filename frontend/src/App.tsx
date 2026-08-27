import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Features from './components/Features'
import CtaSection from './components/CtaSection'
import Footer from './components/Footer'
import { AuthDialogProvider } from './context/AuthDialogContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <ToastProvider>
    <AuthDialogProvider>
    <div className="flex min-h-screen flex-col bg-white text-slate-900">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-20 focus:rounded-lg focus:bg-rose-600 focus:px-4 focus:py-2 focus:text-white"
      >
        Skip to main content
      </a>

      <Navbar />

      <main id="main" className="flex-1">
        <Hero />
        <Features />
        <CtaSection />
      </main>

      <Footer />
    </div>
    </AuthDialogProvider>
    </ToastProvider>
  )
}

export default App
