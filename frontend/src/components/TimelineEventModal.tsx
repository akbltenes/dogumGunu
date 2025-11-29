import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { TimelineEvent } from '../types/timeline'
import LazyImage from './LazyImage'

interface TimelineEventModalProps {
  event: TimelineEvent | null
  onClose: () => void
}

interface QuizPayload {
  question: string
  correctAnswer: string
  options: string[]
}

interface PhotoGuessPayload {
  question: string
  correctAnswer: string
  options: string[]
}

const TimelineEventModal = ({ event, onClose }: TimelineEventModalProps) => {
  const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null)
  const [selectedOption, setSelectedOption] = useState<string | null>(null)

  if (!event) return null

  const formattedDate = new Date(event.eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const isQuiz = event.interactionType === 'QUIZ'
  const isPhotoGuess = event.interactionType === 'PHOTO_GUESS'
  const quizPayload = isQuiz ? (event.interactionPayload as QuizPayload) : null
  const photoGuessPayload = isPhotoGuess ? (event.interactionPayload as PhotoGuessPayload) : null

  const handleQuizSubmit = (option: string) => {
    if (!quizPayload) return
    setSelectedOption(option)
    const isCorrect = option === quizPayload.correctAnswer
    setFeedback(isCorrect ? 'correct' : 'incorrect')
  }

  const handlePhotoGuessSubmit = (option: string) => {
    if (!photoGuessPayload) return
    setSelectedOption(option)
    const isCorrect = option === photoGuessPayload.correctAnswer
    setFeedback(isCorrect ? 'correct' : 'incorrect')
  }

  const resetInteraction = () => {
    setFeedback(null)
    setSelectedOption(null)
  }

  const handleClose = () => {
    resetInteraction()
    onClose()
  }

  return (
    <AnimatePresence>
      {event && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={handleClose}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ duration: 0.3, ease: [0.34, 1.56, 0.64, 1] }}
            className="relative max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-3xl border border-rose-100/70 bg-white text-[#4A4A4A] shadow-[0_35px_120px_rgba(0,0,0,0.35)] ring-1 ring-white/70 dark:border-white/15 dark:bg-[#2b141b] dark:text-gray-100"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleClose}
              className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-slate-800 shadow-lg transition hover:-translate-y-0.5 hover:bg-white dark:bg-[#3a1b22] dark:text-white"
            >
              ✕
            </button>
            {event.mediaUrl && (
              <div className="relative flex w-full items-center justify-center overflow-hidden rounded-t-3xl bg-[#f8f6f6] p-4 sm:p-6">
                <LazyImage
                  src={event.mediaUrl}
                  alt={event.title}
                  className="max-h-[520px] w-full object-contain"
                />
              </div>
            )}

            <div className="space-y-4 p-6 sm:p-10">
              <div className="flex flex-col gap-3 text-center">
                <time className="text-xs uppercase tracking-[0.35em] text-[#C06C84] dark:text-rose-200">{formattedDate}</time>
                <h2 className="text-3xl font-bold text-[#181113] dark:text-white">{event.title}</h2>
                <p className="text-base leading-relaxed text-[#4A4A4A] dark:text-gray-200">{event.description}</p>
              </div>

              {isQuiz && quizPayload && (
                <div
                  className={`rounded-2xl border p-4 sm:p-6 transition ${
                    feedback === 'correct'
                      ? 'border-emerald-300 bg-emerald-50'
                      : feedback === 'incorrect'
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-rose-100/60 bg-white dark:bg-[#1b0d11]'
                  }`}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-[#181113] dark:text-white">{quizPayload.question}</h3>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {quizPayload.options.map((option) => {
                      const isCorrectOption = option === quizPayload.correctAnswer
                      const isSelectedOption = selectedOption === option
                      const answered = feedback !== null

                      let optionClasses = 'rounded-lg border px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition '
                      if (!answered) {
                        optionClasses += 'border-[#f4dce3] bg-white text-[#4A4A4A] hover:bg-[#fff7fa] dark:border-white/20 dark:bg-white/5 dark:text-white'
                      } else if (feedback === 'correct') {
                        optionClasses += isCorrectOption
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                          : 'border-rose-100 bg-white text-[#A0A0A0] dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                      } else {
                        optionClasses += isCorrectOption
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                          : isSelectedOption
                            ? 'border-rose-400 bg-rose-50 text-rose-800'
                            : 'border-rose-100 bg-white text-[#A0A0A0] dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => (feedback === null ? handleQuizSubmit(option) : undefined)}
                          className={optionClasses}
                          disabled={feedback !== null}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {feedback && (
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {feedback === 'correct' ? 'AFFERİN AŞKIMA' : 'puu rezill'}
                    </p>
                  )}
                </div>
              )}

              {isPhotoGuess && photoGuessPayload && (
                <div
                  className={`rounded-2xl border p-4 sm:p-6 transition ${
                    feedback === 'correct'
                      ? 'border-emerald-300 bg-emerald-50'
                      : feedback === 'incorrect'
                        ? 'border-rose-300 bg-rose-50'
                        : 'border-rose-100/60 bg-white dark:bg-[#1b0d11]'
                  }`}
                >
                  <h3 className="text-lg sm:text-xl font-semibold text-[#181113] dark:text-white">{photoGuessPayload.question}</h3>

                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {photoGuessPayload.options.map((option) => {
                      const isCorrectOption = option === photoGuessPayload.correctAnswer
                      const isSelectedOption = selectedOption === option
                      const answered = feedback !== null

                      let optionClasses = 'rounded-lg border px-4 sm:px-6 py-3 sm:py-4 text-sm font-medium transition '
                      if (!answered) {
                        optionClasses += 'border-[#f4dce3] bg-white text-[#4A4A4A] hover:bg-[#fff7fa] dark:border-white/20 dark:bg-white/5 dark:text-white'
                      } else if (feedback === 'correct') {
                        optionClasses += isCorrectOption
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                          : 'border-rose-100 bg-white text-[#A0A0A0] dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                      } else {
                        optionClasses += isCorrectOption
                          ? 'border-emerald-400 bg-emerald-50 text-emerald-800'
                          : isSelectedOption
                            ? 'border-rose-400 bg-rose-50 text-rose-800'
                            : 'border-rose-100 bg-white text-[#A0A0A0] dark:border-white/10 dark:bg-white/5 dark:text-white/60'
                      }

                      return (
                        <button
                          key={option}
                          type="button"
                          onClick={() => (feedback === null ? handlePhotoGuessSubmit(option) : undefined)}
                          className={optionClasses}
                          disabled={feedback !== null}
                        >
                          {option}
                        </button>
                      )
                    })}
                  </div>

                  {feedback && (
                    <p
                      className={`mt-3 text-sm font-semibold ${
                        feedback === 'correct' ? 'text-emerald-600' : 'text-rose-600'
                      }`}
                    >
                      {feedback === 'correct' ? 'AFFERİN AŞKIMA' : 'puu rezill'}
                    </p>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default TimelineEventModal
