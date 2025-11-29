import { type FormEvent, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import type { Status } from '../types/status'
import { apiFetch } from '../utils/api'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isFlipped, setIsFlipped] = useState(false)
  const navigate = useNavigate()

  const risingHearts = useMemo(
    () =>
      Array.from({ length: 20 }, (_, index) => ({
        id: `rising-${index}`,
        initialX: Math.random() * 100,
        targetX: Math.random() * 100,
        duration: 5 + Math.random() * 3,
        delay: Math.random() * 2,
      })),
    []
  )

  const fallingHearts = useMemo(
    () =>
      Array.from({ length: 25 }, (_, index) => ({
        id: `falling-${index}`,
        left: Math.random() * 100,
        opacity: 0.3 + Math.random() * 0.3,
        duration: 8 + Math.random() * 3,
        delay: Math.random() * 3,
      })),
    []
  )

  const confettiParticles = useMemo(() => {
    const colors = ['#ee2b5b', '#f472b6', '#fbbf24', '#c084fc', '#fb923c']
    const shapes = ['●', '■', '▲', '★', '♥']

    return Array.from({ length: 30 }, (_, index) => ({
      id: `confetti-${index}`,
      color: colors[Math.floor(Math.random() * colors.length)],
      shape: shapes[Math.floor(Math.random() * shapes.length)],
      xOffset: (Math.random() - 0.5) * 1000,
      yOffset: Math.random() * 800 - 200,
      duration: 2 + Math.random() * 1.5,
      delay: Math.random() * 4,
      rotate: Math.random() * 720,
    }))
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const savedUser = window.localStorage.getItem('birthday-app-user')
    if (savedUser) {
      setUsername(savedUser)
      setRememberMe(true)
    }
  }, [])

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!username || !password) {
      setStatus({ type: 'error', message: 'Lütfen kullanıcı adı ve parolayı gir.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const response = await apiFetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      })

      const data = await response.json().catch(() => ({}))

      if (!response.ok) {
        const message = data?.message ?? 'Giriş başarısız. Lütfen bilgileri kontrol et.'
        throw new Error(message)
      }

      // Save JWT token
      if (data?.token) {
        localStorage.setItem('jwt-token', data.token)
      }

      if (rememberMe) {
        localStorage.setItem('birthday-app-user', username)
      } else {
        localStorage.removeItem('birthday-app-user')
      }

      setStatus({ type: 'success', message: data?.message ?? 'Giriş başarılı!' })
      navigate('/choose', { replace: true })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.'
      setStatus({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-br from-rose-50 via-amber-50 to-lilac-100 px-4 py-10 font-display">
      {/* Floating & Falling Hearts + Confetti Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        {/* Rising Hearts - Faster */}
        {risingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-3xl opacity-25"
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
        
        {/* Falling Hearts - Softer Descent */}
        {fallingHearts.map((heart) => (
          <motion.div
            key={heart.id}
            className="absolute text-2xl"
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

        {/* Confetti Burst */}
        {confettiParticles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute text-xl font-bold"
            style={{
              left: '50%',
              top: '50%',
              color: particle.color,
              opacity: 0.6,
            }}
            initial={{ x: 0, y: 0, scale: 0, rotate: 0 }}
            animate={{
              x: particle.xOffset,
              y: particle.yOffset,
              scale: [0, 1.5, 1],
              rotate: particle.rotate,
              opacity: [0, 0.8, 0],
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

      <div className="relative z-10 w-full max-w-2xl" style={{ perspective: '1000px' }}>
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            rotateY: isFlipped ? 180 : 0,
          }}
          transition={{ duration: 0.8, ease: 'easeInOut' }}
          style={{ transformStyle: 'preserve-3d' }}
          className="relative min-h-[600px] w-full cursor-pointer rounded-[32px] shadow-[0_30px_80px_rgba(238,43,91,0.12)]"
          onClick={() => !isFlipped && setIsFlipped(true)}
        >
          {/* Front Face - Welcome Card */}
          <motion.div
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(0deg)',
            }}
            className="absolute inset-0 flex flex-col justify-between overflow-hidden rounded-[32px] border border-rose-100/70 bg-gradient-to-br from-rose-100 via-amber-50 to-white p-10 text-[#3b2a30] backdrop-blur-xl"
          >
            <div>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-sm uppercase tracking-[0.3em] text-[#b36a7b]"
              >
                QR doğrulandı ✨
              </motion.p>
              <motion.h1
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-4 text-4xl font-bold leading-tight text-[#2a1b1f]"
              >
                Sürpriz doğum günü günlüğüne hoş geldin ❤️
              </motion.h1>
              <motion.p
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.6 }}
                className="mt-6 text-[#6e4d55]"
              >
                Timeline, quiz ve hayaller bölümünü görmek için giriş yap. Her köşede seni bekleyen küçük sürprizler var.
              </motion.p>
            </div>
            
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="space-y-3 text-sm text-[#6e4d55]"
            >
              <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                <span className="text-lg">✨</span> Timeline: Birlikte geçirdiğimiz en özel anlar
              </motion.p>
              <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                <span className="text-lg">🧠</span> Quiz: Beni ne kadar iyi tanıyorsun?
              </motion.p>
              <motion.p whileHover={{ x: 5 }} className="flex items-center gap-2">
                <span className="text-lg">🌈</span> Hayaller: Gelecek planlarımız
              </motion.p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1 }}
              className="mt-8 flex flex-col items-center justify-center gap-2 text-[#b36a7b]"
            >
              <span className="text-sm">Giriş yapmak için tıkla</span>
            </motion.div>
          </motion.div>

          {/* Back Face - Login Form */}
          <motion.div
            style={{ 
              backfaceVisibility: 'hidden',
              transform: 'rotateY(180deg)',
            }}
            className="absolute inset-0 flex flex-col justify-center overflow-hidden rounded-[32px] border border-rose-100/70 bg-white/40 p-10 backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsFlipped(false)}
              className="absolute right-4 top-4 flex h-10 w-10 items-center justify-center rounded-full bg-rose-100 text-primary transition hover:bg-rose-200"
            >
              ✕
            </button>

            <div className="mx-auto w-full max-w-md">
              <h2 className="text-3xl font-bold text-[#181113]">
                Giriş Yap 💖
              </h2>
              <p className="mt-2 text-sm text-[#89616b]">
                QR kartındaki kullanıcı adı ve parola ile giriş yapabilirsin.
              </p>

              <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-semibold text-[#6e4d55]">
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-[#4A4A4A] outline-none transition placeholder:text-[#b3969d] focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
                </div>

                <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-semibold text-[#6e4d55]">
                  Parola
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-2xl border border-rose-100 bg-white px-4 py-3 text-[#4A4A4A] outline-none transition placeholder:text-[#b3969d] focus:border-primary focus:ring-2 focus:ring-primary/20"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
                </div>

                <div className="flex items-center justify-between text-sm text-[#89616b]">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-rose-200 bg-white text-primary focus:ring-primary"
                  />
                  Bilgilerimi hatırla
                </label>
                  <span className="text-xs text-[#b3969d]">QR kartındaki bilgileri kullan</span>
                </div>

                <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-full bg-primary px-4 py-3.5 text-base font-bold text-white shadow-lg shadow-primary/30 transition focus:outline-none focus:ring-2 focus:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? (
                  <span className="flex items-center gap-2">
                    <motion.span
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                    >
                      ⭕
                    </motion.span>
                    Giriş yapılıyor...
                  </span>
                ) : (
                  'Giriş Yap →'
                )}
                </button>
              </form>

              {status.type !== 'idle' && (
                <p
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm font-medium ${
                    status.type === 'success'
                      ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                      : 'border-rose-200 bg-rose-50 text-rose-700'
                  }`}
                >
                  {status.message}
                </p>
              )}
            </div>
          </motion.div>
        </motion.div>
      </div>
    </main>
  )
}

export default LoginPage
