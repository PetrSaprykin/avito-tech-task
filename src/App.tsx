import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ConfigProvider, theme as antdTheme } from 'antd'
import { ThemeProvider, useTheme } from '@/contexts/ThemeContext'
import { AnimatePresence, motion } from 'framer-motion'
import type { Transition, Variants } from 'framer-motion'
import { Layout } from '@/components/Layout'
import { AdListPage } from '@/pages/AdListPage'
import { useRouteProgress } from '@/hooks/useRouteProgress'
import { AdDetailPage } from '@/pages/AdDetailPage/AdDetailPage'
import { StatsPage } from '@/pages/StatsPage'
import './styles/global.css'

// анимации перехода между страницами
const pageVariants: Variants = {
  initial: {
    opacity: 0,
    x: -20,
  },
  animate: {
    opacity: 1,
    x: 0,
  },
  exit: {
    opacity: 0,
    x: 20,
  },
}

const pageTransition: Transition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.3,
}

function AppContent() {
  const { theme } = useTheme()
  const location = useLocation()

  useRouteProgress()

  return (
    <ConfigProvider
      theme={{
        algorithm: theme === 'dark' ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
      }}
    >
      <Layout>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<Navigate to="/list" replace />} />
            <Route
              path="/list"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                  style={{ width: '100%', overflowX: 'hidden' }}
                >
                  <AdListPage />
                </motion.div>
              }
            />
            <Route
              path="/item/:id"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                  style={{ width: '100%', overflowX: 'hidden' }}
                >
                  <AdDetailPage />
                </motion.div>
              }
            />
            <Route
              path="/stats"
              element={
                <motion.div
                  initial="initial"
                  animate="animate"
                  exit="exit"
                  variants={pageVariants}
                  transition={pageTransition}
                  style={{ width: '100%', overflowX: 'hidden' }}
                >
                  <StatsPage />
                </motion.div>
              }
            />
          </Routes>
        </AnimatePresence>
      </Layout>
    </ConfigProvider>
  )
}

function App() {
  return (
    <BrowserRouter>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </BrowserRouter>
  )
}

export default App
