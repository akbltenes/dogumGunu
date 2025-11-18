import { Navigate, Route, Routes } from 'react-router-dom'
import QrGatePage from './pages/QrGatePage.tsx'
import LoginPage from './pages/LoginPage.tsx'

function App() {
  return (
    <Routes>
      <Route path="/qr" element={<QrGatePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="*" element={<Navigate to="/qr" replace />} />
    </Routes>
  )
}

export default App
