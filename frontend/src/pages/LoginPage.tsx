import { type FormEvent, useEffect, useState } from 'react'
import type { Status } from '../types/status'

const LoginPage = () => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)

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

      const response = await fetch('/api/auth/login', {
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

      if (rememberMe) {
        localStorage.setItem('birthday-app-user', username)
      } else {
        localStorage.removeItem('birthday-app-user')
      }

      setStatus({ type: 'success', message: data?.message ?? 'Giriş başarılı!' })
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.'
      setStatus({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-100 px-4 py-10">
      <div className="mx-auto flex max-w-5xl flex-col overflow-hidden rounded-3xl bg-white/80 shadow-2xl backdrop-blur md:flex-row">
        <div className="flex flex-1 flex-col justify-between bg-gradient-to-br from-pink-500 via-rose-500 to-purple-500 p-10 text-white">
          <div>
            <p className="text-sm uppercase tracking-[0.3em] text-white/70">QR doğrulandı</p>
            <h1 className="mt-4 text-4xl font-semibold leading-tight">
              Sürpriz doğum günü günlüğüne hoş geldin ❤️
            </h1>
            <p className="mt-6 max-w-sm text-white/80">
              Timeline, quiz ve hayaller bölümünü görmek için giriş yap. Her köşede seni bekleyen küçük sürprizler var.
            </p>
          </div>
          <div className="mt-10 space-y-2 text-sm text-white/70">
            <p>✨ Timeline: Birlikte geçirdiğimiz en özel anlar</p>
            <p>🧠 Quiz: Beni ne kadar iyi tanıyorsun?</p>
            <p>🌈 Hayaller: Gelecek planlarımız</p>
          </div>
        </div>

        <div className="flex flex-1 flex-col justify-center px-8 py-12">
          <div className="mx-auto w-full max-w-md">
            <h2 className="text-3xl font-semibold text-slate-900">Giriş Yap</h2>
            <p className="mt-2 text-sm text-slate-500">QR kartındaki kullanıcı adı ve parola ile giriş yapabilirsin.</p>

            <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <label htmlFor="username" className="text-sm font-medium text-slate-700">
                  Kullanıcı Adı
                </label>
                <input
                  id="username"
                  type="text"
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring focus:ring-pink-200"
                  placeholder="ör. user_one"
                  value={username}
                  onChange={(event) => setUsername(event.target.value)}
                  autoComplete="username"
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="text-sm font-medium text-slate-700">
                  Parola
                </label>
                <input
                  id="password"
                  type="password"
                  className="w-full rounded-2xl border border-slate-200 bg-white/60 px-4 py-3 text-slate-900 outline-none transition focus:border-pink-400 focus:ring focus:ring-pink-200"
                  placeholder="********"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="current-password"
                />
              </div>

              <div className="flex items-center justify-between text-sm text-slate-600">
                <label className="inline-flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(event) => setRememberMe(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-pink-500 focus:ring-pink-400"
                  />
                  Bilgilerimi hatırla
                </label>
                <span className="text-xs text-slate-400">QR kartındaki bilgileri kullan</span>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="flex w-full items-center justify-center rounded-2xl bg-gradient-to-r from-pink-500 to-purple-500 px-4 py-3 text-base font-semibold text-white shadow-lg transition hover:from-pink-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-pink-400 disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isSubmitting ? 'Giriş yapılıyor...' : 'Giriş Yap'}
              </button>
            </form>

            {status.type !== 'idle' && (
              <p
                className={`mt-6 rounded-2xl px-4 py-3 text-sm ${
                  status.type === 'success'
                    ? 'bg-emerald-50 text-emerald-700'
                    : 'bg-rose-50 text-rose-600'
                }`}
              >
                {status.message}
              </p>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
