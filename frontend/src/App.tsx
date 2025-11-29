import { lazy, Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import PageLoader from './components/PageLoader'

const QrGatePage = lazy(() => import('./pages/QrGatePage.tsx'))
const LoginPage = lazy(() => import('./pages/LoginPage.tsx'))
const ChoosePage = lazy(() => import('./pages/ChoosePage.tsx'))
const TimelinePage = lazy(() => import('./pages/TimelinePage.tsx'))
const AddTimelinePage = lazy(() => import('./pages/AddTimelinePage.tsx'))
const QuizPage = lazy(() => import('./pages/QuizPage.tsx'))
const DreamsPage = lazy(() => import('./pages/DreamsPage.tsx'))

const pageVariants = {
  initial: { opacity: 0, scale: 0.95, y: 50 },
  in: { opacity: 1, scale: 1, y: 0 },
  out: { opacity: 0, scale: 0.95, y: -50 }
}

const pageTransition = {
  type: 'tween',
  ease: [0.43, 0.13, 0.23, 0.96], // Cubic bezier ease
  duration: 1.2
}

const AnimatedPage = ({ children }: { children: React.ReactNode }) => (
  <motion.div
    initial="initial"
    animate="in"
    exit="out"
    variants={pageVariants}
    transition={pageTransition}
  >
    {children}
  </motion.div>
)

function App() {
  return (
    <AnimatePresence mode="wait">
      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/qr" element={<AnimatedPage><QrGatePage /></AnimatedPage>} />
          <Route path="/login" element={<AnimatedPage><LoginPage /></AnimatedPage>} />
          <Route path="/choose" element={<AnimatedPage><ChoosePage /></AnimatedPage>} />
          <Route path="/timeline" element={<AnimatedPage><TimelinePage /></AnimatedPage>} />
          <Route path="/timeline/add" element={<AnimatedPage><AddTimelinePage /></AnimatedPage>} />
          <Route path="/quiz" element={<AnimatedPage><QuizPage /></AnimatedPage>} />
          <Route path="/dreams" element={<AnimatedPage><DreamsPage /></AnimatedPage>} />
          <Route path="*" element={<Navigate to="/qr" replace />} />
        </Routes>
      </Suspense>
    </AnimatePresence>
  )
}

export default App
