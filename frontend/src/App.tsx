import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import RoomCategoriesPage from './pages/RoomCategoriesPage'
import HotelsPage from './pages/HotelsPage'
import BookingsPage from './pages/BookingsPage'
import RequireAdmin from './components/RequireAdmin'
import RequireAuth from './components/RequireAuth'
import { AuthProvider } from './context/AuthContext'
import { AuthDialogProvider } from './context/AuthDialogContext'
import { ToastProvider } from './context/ToastContext'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <AuthDialogProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route
                path="/hotels"
                element={
                  <RequireAuth>
                    <HotelsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/bookings"
                element={
                  <RequireAuth>
                    <BookingsPage />
                  </RequireAuth>
                }
              />
              <Route
                path="/admin"
                element={
                  <RequireAdmin>
                    <AdminPage />
                  </RequireAdmin>
                }
              />
              <Route
                path="/admin/hotels/:hotelId/room-categories"
                element={
                  <RequireAdmin>
                    <RoomCategoriesPage />
                  </RequireAdmin>
                }
              />
            </Routes>
          </AuthDialogProvider>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
