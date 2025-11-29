import { type FormEvent, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Status } from '../types/status'
import FileUploadInput from '../components/FileUploadInput'
import { apiFetch } from '../utils/api'

const navItems = [
  { path: '/timeline', label: 'Timeline', icon: '📅' },
  { path: '/quiz', label: 'Soru-Cevap', icon: '🧠' },
  { path: '/dreams', label: 'Gelecek Hayallerimiz', icon: '🌈' },
]

const AddTimelinePage = () => {
  const [title, setTitle] = useState('')
  const [eventDate, setEventDate] = useState('')
  const [description, setDescription] = useState('')
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [interactionType, setInteractionType] = useState<'NONE' | 'QUIZ' | 'PHOTO_GUESS'>('NONE')
  const [quizQuestion, setQuizQuestion] = useState('')
  const [quizCorrectAnswer, setQuizCorrectAnswer] = useState('')
  const [quizWrongOption1, setQuizWrongOption1] = useState('')
  const [quizWrongOption2, setQuizWrongOption2] = useState('')
  const [quizWrongOption3, setQuizWrongOption3] = useState('')
  const [correctAnswer, setCorrectAnswer] = useState('')
  const [wrongOption1, setWrongOption1] = useState('')
  const [wrongOption2, setWrongOption2] = useState('')
  const [wrongOption3, setWrongOption3] = useState('')
  const [status, setStatus] = useState<Status>({ type: 'idle', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const navigate = useNavigate()

  const handleFileChange = (selectedFile: File | null, preview: string) => {
    setFile(selectedFile)
    setPreviewUrl(preview)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!title || !eventDate || !description || !file) {
      setStatus({ type: 'error', message: 'Lütfen tüm alanları doldurun ve bir fotoğraf seçin.' })
      return
    }

    if (interactionType === 'QUIZ' && (!quizQuestion || !quizCorrectAnswer || !quizWrongOption1 || !quizWrongOption2 || !quizWrongOption3)) {
      setStatus({ type: 'error', message: 'Soru ve tüm seçenekleri doldurun.' })
      return
    }

    if (interactionType === 'PHOTO_GUESS' && (!correctAnswer || !wrongOption1 || !wrongOption2 || !wrongOption3)) {
      setStatus({ type: 'error', message: 'Tüm lokasyon seçeneklerini doldurun.' })
      return
    }

    try {
      setIsSubmitting(true)
      setStatus({ type: 'idle', message: '' })

      const formData = new FormData()
      formData.append('file', file)
      formData.append('title', title)
      formData.append('eventDate', eventDate)
      formData.append('description', description)
      formData.append('interactionType', interactionType)

      if (interactionType === 'QUIZ') {
        const options = [quizCorrectAnswer, quizWrongOption1, quizWrongOption2, quizWrongOption3]
        const shuffled = options.sort(() => Math.random() - 0.5)
        formData.append('interactionPayload', JSON.stringify({
          question: quizQuestion,
          correctAnswer: quizCorrectAnswer,
          options: shuffled
        }))
      } else if (interactionType === 'PHOTO_GUESS') {
        const options = [correctAnswer, wrongOption1, wrongOption2, wrongOption3]
        const shuffled = options.sort(() => Math.random() - 0.5)
        formData.append('interactionPayload', JSON.stringify({
          question: 'Bu fotoğraf nerede çekildi?',
          correctAnswer,
          options: shuffled
        }))
      }

      const response = await apiFetch('/api/timeline/upload', {
        method: 'POST',
        body: formData,
      })

      if (response.status === 401) {
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        throw new Error(errorData?.message ?? 'Fotoğraf yüklenemedi.')
      }

      setStatus({ type: 'success', message: 'Fotoğraf başarıyla eklendi!' })
      
      // Clear form
      setTitle('')
      setEventDate('')
      setDescription('')
      setFile(null)
      setPreviewUrl('')
      setInteractionType('NONE')
      setQuizQuestion('')
      setQuizCorrectAnswer('')
      setQuizWrongOption1('')
      setQuizWrongOption2('')
      setQuizWrongOption3('')
      setCorrectAnswer('')
      setWrongOption1('')
      setWrongOption2('')
      setWrongOption3('')

      // Redirect to timeline after 1.5 seconds
      setTimeout(() => {
        navigate('/timeline')
      }, 1500)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Beklenmeyen bir hata oluştu.'
      setStatus({ type: 'error', message })
    } finally {
      setIsSubmitting(false)
    }
  }

  const inputClasses =
    'w-full rounded-2xl border border-rose-100/70 bg-white px-4 py-3 text-sm text-[#4A4A4A] placeholder:text-[#b3969d] focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 dark:border-white/15 dark:bg-[#1b0d11] dark:text-white'

  const mutedInputClasses =
    'w-full rounded-2xl border border-emerald-300/70 bg-emerald-50 px-4 py-3 text-sm text-emerald-900 focus:border-emerald-400 focus:outline-none focus:ring-2 focus:ring-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-100'

  return (
    <main className="min-h-screen bg-background-light px-4 py-6 font-display text-[#4A4A4A] dark:bg-background-dark dark:text-gray-100">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col">
        <nav className="mb-6 flex flex-wrap items-center justify-center gap-3 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-[#89616b] shadow-sm ring-1 ring-rose-100 backdrop-blur dark:bg-[#2b141b]/80 dark:text-gray-200 dark:ring-white/10">
          {navItems.map((item) => {
            const isCurrent = item.path === '/timeline/add'
            return (
              <button
                key={item.path}
                type="button"
                onClick={() => !isCurrent && navigate(item.path)}
                disabled={isCurrent}
                className={`inline-flex items-center gap-2 rounded-full px-4 py-2 transition ${
                  isCurrent
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'text-[#89616b] hover:bg-primary/10 dark:text-gray-100 dark:hover:bg-white/10'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </button>
            )
          })}
        </nav>

        <header className="flex flex-col items-center text-center py-8">
          <p className="text-xs uppercase tracking-[0.35em] text-[#89616b]">YENİ ANI</p>
          <h1 className="mt-4 text-4xl font-bold text-[#181113] dark:text-white">Timeline'a Fotoğraf Ekle</h1>
          <p className="mt-3 max-w-2xl text-sm text-[#89616b] dark:text-gray-400">
            Özel anlarımızı nazik bir ritüelle kaydet. Fotoğrafını yükle, hikayeni anlat ve istersen küçük oyunlarla daha da eğlenceli hale getir.
          </p>
        </header>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-rose-100/50 bg-white p-6 shadow-xl ring-1 ring-rose-50 dark:border-white/10 dark:bg-[#2b141b]">
            <section className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">1</span>
                <p className="text-sm font-semibold text-[#89616b] dark:text-gray-300">Fotoğraf &amp; Önizleme</p>
              </div>
              <FileUploadInput previewUrl={previewUrl} onChange={handleFileChange} />
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">2</span>
                <p className="text-sm font-semibold text-[#89616b] dark:text-gray-300">Temel Bilgiler</p>
              </div>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <label htmlFor="title" className="text-sm font-medium text-[#6e4d55] dark:text-gray-200">
                    Başlık
                  </label>
                  <input
                    type="text"
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className={inputClasses}
                    placeholder="Örn. İlk Tatilimiz"
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="eventDate" className="text-sm font-medium text-[#6e4d55] dark:text-gray-200">
                    Tarih
                  </label>
                  <input
                    type="date"
                    id="eventDate"
                    value={eventDate}
                    onChange={(e) => setEventDate(e.target.value)}
                    className={inputClasses}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="text-sm font-medium text-[#6e4d55] dark:text-gray-200">
                  Açıklama
                </label>
                <textarea
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={4}
                  className={`${inputClasses} resize-none`}
                  placeholder="Bu anıyı neden unutulmaz kılıyor?"
                />
              </div>
            </section>

            <section className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary">3</span>
                <p className="text-sm font-semibold text-[#89616b] dark:text-gray-300">İnteraktif Dokunuş</p>
              </div>

              <div className="space-y-2">
                <label htmlFor="interactionType" className="text-sm font-medium text-[#6e4d55] dark:text-gray-200">
                  İnteraktif Özellik
                </label>
                <select
                  id="interactionType"
                  value={interactionType}
                  onChange={(e) => setInteractionType(e.target.value as 'NONE' | 'QUIZ' | 'PHOTO_GUESS')}
                  className={`${inputClasses} appearance-none`}
                >
                  <option value="NONE">Yok</option>
                  <option value="QUIZ">Soru</option>
                  <option value="PHOTO_GUESS">Lokasyon Tahmini</option>
                </select>
              </div>

              {interactionType === 'QUIZ' && (
                <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <div className="space-y-2">
                    <label htmlFor="quizQuestion" className="text-sm font-semibold text-[#6e4d55] dark:text-gray-100">
                      Soru
                    </label>
                    <input
                      type="text"
                      id="quizQuestion"
                      value={quizQuestion}
                      onChange={(e) => setQuizQuestion(e.target.value)}
                      className={inputClasses}
                      placeholder="Bu fotoğraf nerede çekildi?"
                    />
                  </div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#89616b]">Şıklar</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={quizCorrectAnswer}
                      onChange={(e) => setQuizCorrectAnswer(e.target.value)}
                      className={mutedInputClasses}
                      placeholder="Doğru cevap"
                    />
                    <input
                      type="text"
                      value={quizWrongOption1}
                      onChange={(e) => setQuizWrongOption1(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış cevap"
                    />
                    <input
                      type="text"
                      value={quizWrongOption2}
                      onChange={(e) => setQuizWrongOption2(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış cevap"
                    />
                    <input
                      type="text"
                      value={quizWrongOption3}
                      onChange={(e) => setQuizWrongOption3(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış cevap"
                    />
                  </div>
                </div>
              )}

              {interactionType === 'PHOTO_GUESS' && (
                <div className="space-y-4 rounded-2xl border border-rose-100 bg-rose-50/60 p-4 dark:border-white/10 dark:bg-white/5">
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#89616b]">Lokasyon Seçenekleri</p>
                  <div className="space-y-3">
                    <input
                      type="text"
                      value={correctAnswer}
                      onChange={(e) => setCorrectAnswer(e.target.value)}
                      className={mutedInputClasses}
                      placeholder="Doğru lokasyon"
                    />
                    <input
                      type="text"
                      value={wrongOption1}
                      onChange={(e) => setWrongOption1(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış lokasyon"
                    />
                    <input
                      type="text"
                      value={wrongOption2}
                      onChange={(e) => setWrongOption2(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış lokasyon"
                    />
                    <input
                      type="text"
                      value={wrongOption3}
                      onChange={(e) => setWrongOption3(e.target.value)}
                      className={inputClasses}
                      placeholder="Yanlış lokasyon"
                    />
                  </div>
                </div>
              )}
            </section>

            {status.message && (
              <div
                className={`rounded-2xl border p-4 text-sm font-medium ${
                  status.type === 'success'
                    ? 'border-emerald-200 bg-emerald-50 text-emerald-700'
                    : status.type === 'error'
                      ? 'border-rose-200 bg-rose-50 text-rose-700'
                      : 'border-rose-100 bg-white text-[#89616b]'
                }`}
              >
                {status.message}
              </div>
            )}

            <div className="flex flex-col gap-3 sm:flex-row sm:gap-4">
              <button
                type="button"
                onClick={() => navigate('/timeline')}
                className="flex-1 rounded-full border border-rose-100 bg-white px-6 py-3 text-sm font-semibold text-[#89616b] shadow-sm transition hover:bg-rose-50 dark:border-white/20 dark:bg-transparent dark:text-gray-200"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 rounded-full border border-rose-100 bg-white px-6 py-3 text-sm font-semibold text-[#89616b] shadow-sm transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-60 dark:border-white/20 dark:bg-transparent dark:text-gray-200"
              >
                {isSubmitting ? 'Yükleniyor...' : 'Kaydet'}
              </button>
            </div>
          </form>

          <aside className="space-y-6 rounded-3xl border border-rose-100/70 bg-white p-6 text-sm shadow-xl ring-1 ring-rose-50 dark:border-white/10 dark:bg-[#2b141b]">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-[#89616b] dark:text-gray-400">İpucu</p>
              <h3 className="mt-3 text-xl font-semibold text-[#181113] dark:text-white">Hikayeni Hissettir</h3>
              <p className="mt-2 text-[#6e4d55] dark:text-gray-300">
                Kısa ama duygu dolu açıklamalar, gelecekte bu anı tekrar yaşamanı sağlar. Quiz ekleyerek eğlenceli sürprizler yapabilirsin.
              </p>
            </div>

            <div className="rounded-2xl border border-rose-100 bg-rose-50/80 p-4 text-[#6e4d55] dark:border-white/10 dark:bg-white/5 dark:text-gray-200">
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#C06C84]">Durum</p>
              <ul className="mt-3 space-y-2 text-sm">
                <li>• Fotoğraf zorunlu</li>
                <li>• Quiz için 4 seçenek gerek</li>
                <li>• Lokasyon tahmininde 1 doğru + 3 yanlış</li>
              </ul>
            </div>
          </aside>
        </div>
      </div>
    </main>
  )
}

export default AddTimelinePage
