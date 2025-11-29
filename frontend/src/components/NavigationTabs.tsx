import { useNavigate } from 'react-router-dom'

interface NavigationTabsProps {
  currentPage: 'timeline' | 'quiz' | 'dreams'
  className?: string
}

const navItems = [
  { path: '/timeline', label: 'Timeline', icon: '📅', key: 'timeline' as const },
  { path: '/quiz', label: 'Soru-Cevap', icon: '🧠', key: 'quiz' as const },
  { path: '/dreams', label: 'Gelecek Hayallerimiz', icon: '🌈', key: 'dreams' as const },
]

const NavigationTabs = ({ currentPage, className = '' }: NavigationTabsProps) => {
  const navigate = useNavigate()

  const containerClasses = [
    'flex flex-wrap items-center justify-center gap-6 border-b border-rose-100/70 pb-3 text-sm font-semibold text-[#89616b] dark:border-white/10 dark:text-gray-200',
    className,
  ]
    .filter(Boolean)
    .join(' ')

  return (
    <nav className={containerClasses}>
      {navItems.map((item) => {
        const isCurrent = item.key === currentPage
        return (
          <button
            key={item.key}
            type="button"
            onClick={() => !isCurrent && navigate(item.path)}
            disabled={isCurrent}
            className={`inline-flex items-center gap-2 border-b-2 border-transparent px-2 py-1 transition ${
              isCurrent
                ? 'border-primary text-primary dark:text-rose-200'
                : 'text-[#89616b] hover:text-primary dark:text-gray-100 dark:hover:text-rose-200'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        )
      })}
    </nav>
  )
}

export default NavigationTabs
