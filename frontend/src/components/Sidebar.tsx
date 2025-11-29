import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

interface SidebarProps {
  currentPage: 'timeline' | 'quiz' | 'dreams'
}

const menuItems = [
  { path: '/timeline', label: 'Timeline', icon: '📅', key: 'timeline' as const },
  { path: '/quiz', label: 'Soru-Cevap', icon: '🧠', key: 'quiz' as const },
  { path: '/dreams', label: 'Gelecek Hayallerimiz', icon: '🌈', key: 'dreams' as const },
]

const Sidebar = ({ currentPage }: SidebarProps) => {
  const navigate = useNavigate()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const buttonClasses = "flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left font-medium text-white transition hover:bg-gradient-to-r hover:from-slate-900/80 hover:via-purple-900/50 hover:to-slate-900/80 hover:brightness-125 focus:bg-gradient-to-r focus:from-slate-900/80 focus:via-purple-900/50 focus:to-slate-900/80 active:bg-gradient-to-r active:from-slate-900/80 active:via-purple-900/50 active:to-slate-900/80"

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        whileTap={{ scale: 0.9 }}
        className="fixed left-4 top-4 z-50 rounded-xl bg-white/10 p-3 text-white backdrop-blur transition hover:bg-white/20 lg:hidden"
      >
        <motion.span
          animate={{ rotate: mobileMenuOpen ? 90 : 0 }}
          transition={{ duration: 0.2 }}
          className="block text-xl"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </motion.span>
      </motion.button>

      {/* Mobile Dropdown Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-64 border-r border-white/10 bg-gradient-to-br from-slate-900 via-purple-900/40 to-rose-900/30 backdrop-blur-xl p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="mb-8 mt-12"
              >
                <h2 className="text-2xl font-bold text-white">Menü</h2>
              </motion.div>
              <motion.nav
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.key}
                    initial={{ x: -20, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ delay: 0.25 + index * 0.05 }}
                    onClick={() => item.key !== currentPage && navigate(item.path)}
                    className={buttonClasses}
                    disabled={item.key === currentPage}
                  >
                    <span className="text-lg">{item.icon}</span>
                    <span>{item.label}</span>
                  </motion.button>
                ))}
              </motion.nav>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar Navigation */}
      <aside className="hidden w-56 border-r border-white/10 bg-transparent p-6 lg:block">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-black">Menü</h2>
        </div>
        <nav className="space-y-2">
          {menuItems.map((item) => (
            <button
              key={item.key}
              onClick={() => item.key !== currentPage && navigate(item.path)}
              className={buttonClasses}
              disabled={item.key === currentPage}
            >
              <span className="text-lg">{item.icon}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </aside>
    </>
  )
}

export default Sidebar
