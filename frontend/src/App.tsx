import { BrowserRouter, Route, Routes } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import AdminPage from './pages/AdminPage'
import RoomCategoriesPage from './pages/RoomCategoriesPage'
import RequireAdmin from './components/RequireAdmin'
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
