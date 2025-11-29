import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import PageLoader from './components/PageLoader'

const QrGatePage = lazy(() => import('./pages/QrGatePage.tsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'))
const ChoosePage = lazy(() => import('./pages/ChoosePage.tsx'))
const TimelinePage = lazy(() => import('./pages/TimelinePage.tsx'))
const AddTimelinePage = lazy(() => import('./pages/AddTimelinePage.tsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.tsx'))
const DreamsPage = lazy(() => import('./pages/DreamsPage.tsx'))

function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path="/qr" element={<QrGatePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/choose" element={<ChoosePage />} />
        <Route path="/timeline" element={<TimelinePage />} />
        <Route path="/timeline/add" element={<AddTimelinePage />} />
        <Route path="/quiz" element={<QuizPage />} />
        <Route path="/dreams" element={<DreamsPage />} />
        <Route path="*" element={<Navigate to="/qr" replace />} />
      </Routes>
    </Suspense>
  )
}

export default App
