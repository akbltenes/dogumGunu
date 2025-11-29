import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import NavigationTabs from '../components/NavigationTabs'
import { apiFetch } from '../utils/api'

interface QuizQuestion {
  id: string
  question: string
  options: string[] | Record<string, unknown>
  correctOption: number
  explanation: string
  rewardMediaUrl?: string
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
}

type QuizState = 'start' | 'playing' | 'result'

const HERO_IMAGE_URL =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDLCxPDd_WRDXzqt_YuBmfnP5F6R89mJUb6dm_Nbr4mcUD-d1Nq_OhBVI0XRW_EKiYnYAszpHiqc85Tbqkryb1DTWzxazY8mOx-o-KawwBl25xtEhbmmGWWDJcvknigpP_shyMcLj81ShqFsYq1ZLZcnZo-g1NwrCvMLeSji4h3Mdoxp7ywEij3mMcgkMVNEYLppOFNiHhE1KnEQpxPYaFcNIbx_mp-JY-cOonLFAJ3yWW33pOD1yySZ83tt_FI8e6kREt0T2yfOw0"
const QUESTION_IMAGE_PLACEHOLDER =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDWQEDpG3L04AOAtuSPD_CPLl6GVEIVqYQpZfRN_I11Zfab6mjkNCFCD27Nkto3HMKaQfnXg8edeDVMeHr2pbhEKEE7sCeEYLorGbFpBbVI02ldjtrZ6tuJP6CshRuLMXja359ZMKL_yHWQx8MshU6EipEOdHaEkd6v_ZPI2Pmq_VI-4lJFzNG8wJUsGGt3czb6s2Ql4T0Mc6V3g3ZNzl1g4C-YMUQ1qpjhXM7dRHI2nSMWUxprFrCSQILv1WeiaDaLJ-Dpu49dQCE"
const RESULT_IMAGE_URL = '/WhatsApp%20G%C3%B6rsel%202025-11-28%20saat%2017.25.47_21b7160b.jpg'

const normalizeOptions = (options: QuizQuestion['options']): string[] => {
  if (Array.isArray(options)) {
    return options
  }

  if (options && typeof options === 'object') {
    return Object.values(options).map((value) => (typeof value === 'string' ? value : String(value)))
  }

  return []
}

const getScoreMessage = (score: number): string => {
  if (score === 0) return 'Yazık sana hiç mi tanımadın beni!!!!'
  if (score === 20) return 'Bunca zamandır boşuna mı beraberiz!!!'
  if (score === 40) return 'Yakıştıramadım bu puanı sana acilen geliştir kendini'
  if (score === 60) return 'Eh işteee daha iyi olabilirdi.'
  if (score === 80) return 'Oo iyisin haa ama mükemmel değilsin.'
  if (score === 100) return 'Mükemmelsin aşkımmmmm'
  return ''
}

interface QuizResult {
  id: string
  username: string
  score: number
  maxScore: number
  completedAt: string
  messageShown: string
}

const QuizPage = () => {
  const navigate = useNavigate()
  const [quizState, setQuizState] = useState<QuizState>('start')
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState<boolean[]>([])
  const [username, setUsername] = useState<string>('')
  const [previousResults, setPreviousResults] = useState<QuizResult[]>([])
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(false)
  const [questionError, setQuestionError] = useState<string | null>(null)

  const fetchUsername = async () => {
    try {
      console.log('Fetching username from /api/auth/me')
      const response = await apiFetch('/api/auth/me')

      console.log('Response status:', response.status)
      console.log('Response headers:', response.headers)

      if (response.ok) {
        const name = await response.text()
        console.log('Username received:', name)
        setUsername(name)
        return name
      } else {
        console.log('Response not ok:', response.status, response.statusText)
      }
    } catch (error) {
      console.error('Kullanıcı bilgisi alınamadı:', error)
    }
    return null
  }

  const fetchPreviousResults = async (user: string) => {
    try {
      const response = await apiFetch(`/api/quiz/results?username=${encodeURIComponent(user)}`)

      if (response.ok) {
        const data = await response.json()
        setPreviousResults(data.slice(0, 5)) // Son 5 sonuç
      }
    } catch (error) {
      console.error('Geçmiş sonuçlar yüklenemedi:', error)
    }
  }

  const fetchQuestions = async () => {
    try {
      setQuestionError(null)
      setIsLoadingQuestions(true)
      const response = await apiFetch('/api/quiz/questions/random?count=5')


      if (!response.ok) {
        throw new Error('Sorular yüklenemedi')
      }

      const data = await response.json()

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error('Sorular bulunamadı. Lütfen daha sonra tekrar dene.')
      }

      setQuestions(data)
      return true
    } catch (error) {
      console.error('Quiz yükleme hatası:', error)
      const message = error instanceof Error ? error.message : 'Sorular yüklenemedi. '
      setQuestionError(message)
      return false
    } finally {
      setIsLoadingQuestions(false)
    }
  }

  useEffect(() => {
    const loadUser = async () => {
      const user = await fetchUsername()
      if (user) {
        await fetchPreviousResults(user)
      }
    }
    loadUser()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'auto' })
  }, [])

  const handleStart = async () => {
    console.log('handleStart called, username:', username)
    if (!username) {
      console.log('No username, fetching...')
      const fetchedUsername = await fetchUsername()
      if (!fetchedUsername) {
        console.log('Failed to fetch username, returning')
        return
      }
    }

    const hasQuestions = await fetchQuestions()
    if (!hasQuestions) {
      console.log('Failed to fetch questions, returning')
      return
    }

    console.log('Starting quiz')
    setQuizState('playing')
    setCurrentQuestionIndex(0)
    setScore(0)
    setAnswers([])
    setSelectedOption(null)
    setFeedback(null)
  }

  const handleOptionSelect = (optionIndex: number) => {
    if (feedback !== null) return
    const currentQuestion = questions[currentQuestionIndex]
    if (!currentQuestion) return

    setSelectedOption(optionIndex)
    const isCorrect = optionIndex === currentQuestion.correctOption

    setFeedback(isCorrect ? 'correct' : 'incorrect')

    if (isCorrect) {
      setScore((prev) => prev + 20)
    }

    setAnswers((prev) => [...prev, isCorrect])
  }

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1)
      setSelectedOption(null)
      setFeedback(null)
    } else {
      setQuizState('result')
      saveResult()
    }
  }

  const saveResult = async () => {
    if (!username) {
      return
    }

    try {
      await apiFetch('/api/quiz/results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username,
          score,
          maxScore: questions.length * 20,
          completedAt: new Date().toISOString(),
          messageShown: getScoreMessage(score),
        }),
      })
      
      // Sonuç kaydedildikten sonra listeyi güncelle
      if (username) {
        await fetchPreviousResults(username)
      }
    } catch (error) {
      console.error('Sonuç kaydetme hatası:', error)
    }
  }

  const currentQuestion = questions[currentQuestionIndex]
  const questionOptions = currentQuestion ? normalizeOptions(currentQuestion.options) : []
  const progressPercent = questions.length ? Math.round(((currentQuestionIndex + 1) / questions.length) * 100) : 0
  const isLastQuestion = currentQuestionIndex === questions.length - 1
  const answeredCorrectCount = answers.filter(Boolean).length
  const totalScore = questions.length * 20

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-lilac-100 px-4 py-6 font-display text-[#4A4A4A] dark:bg-background-dark dark:text-gray-200">
      <div className="mx-auto flex w-full max-w-5xl flex-col">
        <NavigationTabs currentPage="quiz" />

        <div className="mt-10 flex min-h-[calc(100vh-12rem)] items-center justify-center">
          <div className="w-full">
            {quizState === 'start' && (
              <motion.section
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex min-h-[500px] flex-col items-center justify-center text-center"
              >
                <div
                  className="flex w-full max-w-3xl flex-col items-center gap-8 rounded-2xl p-8 shadow-xl"
                  style={{
                    backgroundImage: `linear-gradient(rgba(0,0,0,0.25), rgba(0,0,0,0.55)), url(${HERO_IMAGE_URL})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <h1 className="text-4xl font-extrabold text-white sm:text-5xl">Doğum Günü Testine Hoş Geldin Aşkım!</h1>
                    <p className="text-lg font-light text-white/90">Sana özel bu testi çözmeye hazır mısın?</p>
                  </div>
                  <div className="flex flex-col items-center gap-3">
                    <button
                      className="flex h-12 min-w-[180px] items-center justify-center rounded-lg bg-primary px-8 text-base font-bold text-white shadow-lg transition-transform duration-200 hover:scale-105 disabled:cursor-not-allowed disabled:opacity-70 disabled:hover:scale-100"
                      onClick={handleStart}
                      disabled={isLoadingQuestions}
                    >
                      {isLoadingQuestions ? 'Sorular Hazırlanıyor...' : 'Teste Başla'}
                    </button>
                    {questionError && <p className="text-sm font-medium text-rose-100">{questionError}</p>}
                  </div>
                </div>
              </motion.section>
            )}

            {quizState === 'playing' && currentQuestion && (
              <section className="mx-auto flex w-full max-w-3xl flex-col gap-6">
                <div className="rounded-xl bg-white/70 px-4 py-3 shadow-sm ring-1 ring-rose-100 backdrop-blur dark:bg-[#1f0f13]/80 dark:ring-white/10">
                  <div className="flex flex-wrap items-center justify-between text-sm font-medium text-[#89616b] dark:text-gray-200">
                    <span>
                      Soru {currentQuestionIndex + 1} / {questions.length}
                    </span>
                    <span className="text-primary">Puan: {score}</span>
                  </div>
                  <div className="mt-3 h-2 w-full rounded-full bg-primary/15 dark:bg-primary/30">
                    <motion.div
                      key={currentQuestionIndex}
                      initial={{ width: 0 }}
                      animate={{ width: `${progressPercent}%` }}
                      className="h-full rounded-full bg-primary"
                    />
                  </div>
                </div>

                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentQuestionIndex}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    className="flex flex-col gap-6"
                  >
                    <div className="rounded-2xl bg-white/80 shadow-lg ring-1 ring-rose-100 backdrop-blur dark:bg-[#1b0d11]/80 dark:text-gray-100 sm:flex">
                      <div
                        className="h-48 w-full rounded-t-2xl bg-cover bg-center sm:h-auto sm:w-1/3 sm:rounded-l-2xl sm:rounded-tr-none"
                        style={{
                          backgroundImage: `url(${currentQuestion.rewardMediaUrl || QUESTION_IMAGE_PLACEHOLDER})`,
                          backgroundSize: 'cover',
                          backgroundPosition: 'center',
                        }}
                      />
                      <div className="flex flex-1 flex-col gap-2 p-6 text-[#181113] dark:text-gray-100">
                        <p className="text-sm uppercase tracking-[0.25em] text-primary">Romantik Quiz</p>
                        <h2 className="text-2xl font-bold leading-tight">{currentQuestion.question}</h2>
                        <p className="text-sm text-[#89616b] dark:text-gray-400">Aşağıdaki seçeneklerden birini seç.</p>
                      </div>
                    </div>

                    <div className="flex flex-col gap-3">
                      {questionOptions.map((option, index) => {
                        const isCorrectOption = index === currentQuestion.correctOption
                        const isSelectedOption = selectedOption === index
                        const answered = feedback !== null

                        let optionClasses =
                          'flex cursor-pointer items-center gap-4 rounded-lg border border-gray-200 bg-white/90 p-4 text-gray-800 shadow-sm transition-all duration-200 focus-within:ring-2 dark:border-gray-700 dark:bg-gray-800/40 dark:text-gray-100 '
                        if (!answered) {
                          optionClasses += 'hover:border-primary hover:bg-primary/5 focus-within:ring-primary/40'
                        } else if (isCorrectOption) {
                          optionClasses += 'border-emerald-200 bg-emerald-50 text-emerald-800 ring-2 ring-emerald-100 dark:bg-emerald-500/15 dark:text-emerald-100'
                        } else if (isSelectedOption) {
                          optionClasses += 'border-rose-200 bg-rose-50 text-rose-700 ring-2 ring-rose-200 dark:bg-rose-500/15 dark:text-rose-100'
                        } else {
                          optionClasses += 'opacity-70 dark:opacity-50'
                        }

                        return (
                          <label key={`${option}-${index}`} className={optionClasses}>
                            <input
                              type="radio"
                              name={`question-${currentQuestion.id}`}
                              className="h-5 w-5 cursor-pointer accent-primary"
                              checked={selectedOption === index}
                              onChange={() => handleOptionSelect(index)}
                              disabled={feedback !== null}
                            />
                            <div className="flex grow flex-col">
                              <p className="text-base font-semibold">{option}</p>
                            </div>
                          </label>
                        )
                      })}
                    </div>

                    {feedback && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl bg-white/80 p-5 text-center shadow-sm ring-1 ring-rose-100 dark:bg-[#1b0d11]/80 dark:text-gray-100"
                      >
                        <p className={`text-base font-semibold ${feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'}`}>
                          {feedback === 'correct' ? 'Aferin aşkıma! ' : 'Olmadı bu kez, yeniden dene! '}
                        </p>
                        {currentQuestion.explanation && (
                          <p className="mt-2 text-sm text-[#89616b] dark:text-gray-400">{currentQuestion.explanation}</p>
                        )}
                        <button
                          onClick={handleNext}
                          className="mt-4 inline-flex min-w-[160px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
                        >
                          {isLastQuestion ? 'Sonuçları Gör' : 'Sonraki Soru'}
                        </button>
                      </motion.div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </section>
            )}

            {quizState === 'result' && (
              <motion.section
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="mx-auto flex w-full max-w-3xl flex-col items-center gap-6 rounded-2xl bg-white/85 p-8 text-center shadow-xl ring-1 ring-rose-100 backdrop-blur dark:bg-[#1b0d11]/80 dark:text-gray-100"
              >
                <span className="material-symbols-outlined text-6xl text-primary">celebration</span>
                <div className="flex flex-col gap-2">
                  <h2 className="text-3xl font-bold text-[#181113] dark:text-white">Test Tamamlandı!</h2>
                  
                </div>
                <div className="h-96 w-full overflow-hidden rounded-xl shadow-lg">
                  <img
                    src={RESULT_IMAGE_URL}
                    alt="Birlikte çekilmiş mutlu bir fotoğraf"
                    className="h-full w-full object-cover object-[10%_55%]"
                  />
                </div>
                <div className="flex flex-col items-center gap-2">
                  <p className="text-4xl font-extrabold text-primary">{score} / {totalScore}</p>
                  <p className="text-base text-[#4A4A4A] dark:text-gray-300">
                    {answeredCorrectCount} / {questions.length} doğru cevap
                  </p>
                  <p className={`text-lg font-semibold ${score === totalScore ? 'text-emerald-600' : score >= 60 ? 'text-amber-600' : 'text-rose-600'}`}>
                    {getScoreMessage(score)}
                  </p>
                </div>
                
                

                <div className="flex flex-col gap-4 sm:flex-row">
                  <button
                    onClick={handleStart}
                    className="inline-flex min-w-[160px] items-center justify-center rounded-lg bg-primary px-6 py-3 text-base font-bold text-white shadow-lg transition-transform hover:scale-105"
                  >
                    Tekrar Dene
                  </button>
                  <button
                    onClick={() => navigate('/choose')}
                    className="inline-flex min-w-[160px] items-center justify-center rounded-lg border border-primary/40 px-6 py-3 text-base font-bold text-primary transition hover:bg-primary/10"
                  >
                    Ana Sayfa
                  </button>
                </div>

                {previousResults.length > 0 && (
                  <div className="mt-6 w-full rounded-xl bg-white/90 p-6 text-left shadow ring-1 ring-rose-100 dark:bg-[#261016]/80 dark:text-gray-100">
                    <h3 className="text-xl font-bold text-[#181113] dark:text-white">Geçmiş Sonuçlarım</h3>
                    <div className="mt-4 space-y-3">
                      {previousResults.map((result) => (
                        <div
                          key={result.id}
                          className="flex flex-wrap items-center justify-between rounded-lg border border-rose-100/60 bg-white/70 px-4 py-3 text-sm font-medium text-[#4A4A4A] dark:border-white/10 dark:bg-white/5 dark:text-gray-200"
                        >
                          <span>
                            {new Date(result.completedAt).toLocaleDateString('tr-TR', {
                              day: 'numeric',
                              month: 'short',
                              hour: '2-digit',
                              minute: '2-digit',
                            })}
                          </span>
                          <span className="text-base font-bold text-primary">{result.score} puan</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </motion.section>
            )}

            {quizState === 'playing' && !currentQuestion && (
              <div className="text-center text-sm text-rose-600">Sorular yüklenemedi. Lütfen tekrar deneyin.</div>
            )}
          </div>
        </div>
      </div>
    </main>
  )
}

export default QuizPage
