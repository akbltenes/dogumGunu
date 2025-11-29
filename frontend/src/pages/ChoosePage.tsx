import { useCallback, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

interface Journey {
  title: string
  description: string
  accent: string
  path: string
  ready: boolean
  image: string
  imageAlt: string
  badge: string
  highlights: string[]
}

const journeys: Journey[] = [
  {
    title: 'Timeline',
    description: 'Birlikte yaşadığımız tüm özel anları kronolojik olarak keşfet.',
    accent: 'from-rose-400 via-pink-500 to-orange-500',
    path: '/timeline',
    ready: true,
    image:
      'https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1000&q=80&sat=-5',
    imageAlt: 'Fotoğraf albümü ve polaroid kareleri',
    badge: 'Anı Koleksiyonu',
    highlights: ['Fotoğraflar', 'Notlar', 'Videolar'],
  },
  {
    title: 'Quiz',
    description: 'Beni ne kadar iyi tanıdığını kanıtlamak için eğlenceli sorular.',
    accent: 'from-purple-400 via-fuchsia-500 to-indigo-500',
    path: '/quiz',
    ready: true,
    image:
      'https://upload.wikimedia.org/wikipedia/commons/thumb/4/46/Question_mark_%28black%29.svg/800px-Question_mark_%28black%29.svg.png',
    imageAlt: 'Renkli ışıklandırılmış quiz sahnesi ve büyük soru işaretleri',
    badge: 'Zihin Oyunu',
    highlights: ['Sorular', 'Puanlama', 'Sürprizler'],
  },
  {
    title: 'Hayaller',
    description: 'Gelecek planlarımızı ve ortak hayallerimizi burada saklayalım.',
    accent: 'from-emerald-400 via-teal-500 to-cyan-500',
    path: '/dreams',
    ready: true,
    image:
      'https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=1000&q=80&sat=-12',
    imageAlt: 'Uzaklara bakan çift ve güneş',
    badge: 'Gelecek Planı',
    highlights: ['Hedefler', 'Rotamız', 'Hayaller'],
  },
]

const ChoosePage = () => {
  const navigate = useNavigate()

  // Performance: Memoize background animations to prevent re-renders
  const risingHearts = useMemo(
    () =>
      Array.from({ length: 15 }, (_, index) => ({
        id: `rising-${index}`,
        initialX: Math.random() * 100,
        targetX: Math.random() * 100,
        duration: 6 + Math.random() * 4,
        delay: Math.random() * 3,
      })),
    []
  )

  const fallingHearts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: `falling-${index}`,
        left: Math.random() * 100,
        opacity: 0.2 + Math.random() * 0.3,
        duration: 9 + Math.random() * 4,
        delay: Math.random() * 4,
      })),
    []
  )

  const confettiParticles = useMemo(() => {
    const colors = ['#ee2b5b', '#f472b6', '#fbbf24', '#c084fc', '#fb923c']
    const shapes = ['●', '■', '▲', '★', '♥']

    return Array.from({ length: 25 }, (_, index) => ({
      id: `confetti-${index}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      xOffset: (Math.random() - 0.5) * 1200,
      yOffset: Math.random() * 900 - 300,
      duration: 2.5 + Math.random() * 2,
      delay: Math.random() * 5,
      rotate: Math.random() * 720,
    }))
  }, [])

  // Performance: Memoize card click handler
  const handleCardClick = useCallback(
    (journey: Journey) => {
      if (journey.ready) {
        navigate(journey.path)
      }
    },
    [navigate]
  )

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-lilac-100 px-4 py-16 font-display">
      {/* Animated Background: Hearts & Confetti */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Rising Hearts */}
        {risingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl opacity-20"
            initial={{ y: '110%', x: `${heart.initialX}%` }}
            animate={{
              y: '-10%',
              x: `${heart.targetX}%`,
              rotate: [0, 360],
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'linear',
            }}
          >
            ❤️
          </motion.div>
        ))}

        {/* Falling Hearts */}
        {fallingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-xl"
            style={{
              left: `${heart.left}%`,
              opacity: heart.opacity,
            }}
            initial={{ y: -50, rotate: 0 }}
            animate={{
              y: typeof window !== 'undefined' ? window.innerHeight + 50 : 1000,
              rotate: 720,
            }}
            transition={{
              duration: heart.duration,
              repeat: Infinity,
              delay: heart.delay,
              ease: 'easeInOut',
            }}
          >
            💖
          </motion.div>
        ))}

        {/* Confetti Particles */}
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-lg font-bold"
            style={{
              left: '50%',
              top: '50%',
              color: particle.color,
              opacity: 0.5,
            }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              x: particle.xOffset,
              y: particle.yOffset,
              scale: [0, 1.5, 1],
              rotate: particle.rotate,
              opacity: [0, 0.7, 0],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: 'easeOut',
            }}
          >
            {particle.shape}
          </motion.div>
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full max-w-6xl">
        {/* Header Section */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="mb-16 text-center"
        >
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-sm uppercase tracking-[0.3em] text-[#b36a7b]"
          >
            Özel Yolculuk ✨
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="mt-4 text-5xl font-bold text-[#2a1b1f] sm:text-6xl"
          >
            Birini Seç 💖
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-[#6e4d55]"
          >
            QR ile giriş yaptın ve artık sürprizlerin kapısı aralandı. Aşağıdaki üç yoldan birini seçerek doğum
            günü maceramızda ilerle.
          </motion.p>
        </motion.div>

        {/* Journey Cards Grid */}
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {journeys.map((journey, index) => (
            <motion.article
              key={journey.title}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.5 + index * 0.15,
                duration: 0.6,
                ease: 'easeOut',
              }}
              whileHover={{ y: -12, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => handleCardClick(journey)}
              className={`group relative overflow-hidden rounded-[28px] border border-white/60 bg-white/0 shadow-[0_20px_60px_rgba(238,43,91,0.08)] backdrop-blur-sm transition-all duration-500 ${
                journey.ready
                  ? 'cursor-pointer hover:border-transparent hover:shadow-[0_30px_80px_rgba(238,43,91,0.15)]'
                  : 'cursor-not-allowed opacity-60'
              }`}
            >
              {/* Photo Background */}
              <div className="relative flex h-[440px] flex-col">
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url(${journey.image})` }}
                  role="img"
                  aria-label={journey.imageAlt}
                />

                {/* Gradient Overlays */}
                <div className="absolute inset-0 bg-gradient-to-b from-black/10 via-black/40 to-black/80" />
                <div
                  className={`pointer-events-none absolute inset-0 bg-gradient-to-br opacity-0 transition-opacity duration-500 group-hover:opacity-80 ${journey.accent}`}
                />

                {/* Content Overlay */}
                <div className="relative z-10 flex h-full flex-col justify-between p-6 text-white">
                  <div className="space-y-4">
                    <span className="inline-flex items-center gap-2 rounded-full bg-white/25 px-4 py-1 text-xs font-semibold uppercase tracking-[0.3em] backdrop-blur">
                      {journey.badge}
                    </span>
                    <div className="flex flex-wrap gap-2">
                      {journey.highlights.map((highlight) => (
                        <span
                          key={highlight}
                          className="rounded-full bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur"
                        >
                          {highlight}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <p className="text-sm uppercase tracking-[0.3em] text-white/70">{journey.title}</p>
                      <h2 className="mt-2 text-3xl font-bold">{journey.title}</h2>
                      <p className="mt-2 text-sm leading-relaxed text-white/90">{journey.description}</p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="text-sm font-semibold text-white/80">
                        {journey.ready ? 'Keşfetmeye hazır' : 'Hazırlanıyor'}
                      </div>
                      <motion.button
                        type="button"
                        className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold text-white shadow-inner backdrop-blur"
                        animate={{ x: [0, 6, 0] }}
                        transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
                      >
                        {journey.ready ? 'Görüntüle' : 'Yakında'}
                        <span aria-hidden="true">→</span>
                      </motion.button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Shine Effect */}
              <motion.div
                className="pointer-events-none absolute -left-full top-0 h-full w-1/2 rotate-12 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                animate={{
                  left: ['110%', '-110%'],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                  ease: 'linear',
                }}
              />
            </motion.article>
          ))}
        </div>
      </div>
    </main>
  )
}

export default ChoosePage
