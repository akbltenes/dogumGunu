import { useCallback, useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import type { TimelineEvent } from '../types/timeline'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorMessage from '../components/ErrorMessage'
import TimelineEventCard from '../components/TimelineEventCard'
import TimelineEventModal from '../components/TimelineEventModal'
import ConfirmDialog from '../components/ConfirmDialog'
import NavigationTabs from '../components/NavigationTabs'
import { apiFetch } from '../utils/api'

const interactionBadges = {
  NONE: { label: '', color: '' },
  QUIZ: { label: '', color: 'bg-primary/10 text-primary' },
  PHOTO_GUESS: { label: '🎯 Tahmin', color: 'bg-emerald-100 text-emerald-700' },
}

const TimelinePage = () => {
  const [events, setEvents] = useState<TimelineEvent[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null)
  const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState<TimelineEvent | null>(null)
  const navigate = useNavigate()

  const fetchTimeline = useCallback(async () => {
    try {
      setIsLoading(true)
      const response = await apiFetch('/api/timeline')

      if (response.status === 401) {
        console.log('Not authenticated for timeline, redirecting to login')
        navigate('/login', { replace: true })
        return
      }

      if (!response.ok) {
        throw new Error('Timeline yüklenemedi')
      }

      const data: TimelineEvent[] = await response.json()
      // Tarihe göre sırala (en yeni en üstte)
      const sorted = data.sort((a, b) => new Date(b.eventDate).getTime() - new Date(a.eventDate).getTime())
      setEvents(sorted)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }, [navigate])

  const handleDeleteClick = (eventId: string) => {
    const event = events.find((e) => e.id === eventId)
    if (event) {
      setEventToDelete(event)
      setConfirmDeleteOpen(true)
    }
  }

  const handleConfirmDelete = async () => {
    if (!eventToDelete) return

    try {
      setDeletingId(eventToDelete.id)
      setConfirmDeleteOpen(false)
      
      const response = await apiFetch(`/api/timeline/${eventToDelete.id}`, {
        method: 'DELETE',
      })


      if (!response.ok) {
        throw new Error('Anı silinemedi. Lütfen tekrar dene.')
      }

      setEvents((prev) => prev.filter((event) => event.id !== eventToDelete.id))
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Anı silinirken bir hata oluştu.'
      window.alert(message)
    } finally {
      setDeletingId(null)
      setEventToDelete(null)
    }
  }

  const handleCancelDelete = () => {
    setConfirmDeleteOpen(false)
    setEventToDelete(null)
  }

  useEffect(() => {
    fetchTimeline()
  }, [fetchTimeline])

  if (isLoading) {
    return <LoadingSpinner message="Timeline yükleniyor..." />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  const totalEvents = events.length
  const interactionCount = events.filter((event) => event.interactionType !== 'NONE').length

  return (
    <main className="min-h-screen bg-gradient-to-br from-rose-50 via-amber-50 to-lilac-100 px-4 py-6 font-display text-[#4A4A4A] dark:bg-background-dark dark:text-gray-200">
      <div className="mx-auto flex w-full max-w-[1100px] flex-col">
        <NavigationTabs currentPage="timeline" />

        <header className="flex flex-col items-center text-center py-10 md:py-16">
          <p className="text-sm uppercase tracking-[0.35em] text-[#89616b]">ANILARIMIZ</p>
          <h1 className="text-[#b4224a] dark:text-gray-100 tracking-tight text-4xl md:text-5xl font-bold leading-tight pb-3">
            İyi ki Doğdun Sevgilim!
          </h1>
          <p className="text-base md:text-lg text-[#89616b] dark:text-gray-400 max-w-2xl">
            Seninle geçen her an, hayatımın en değerli hazinesi. Birlikte biriktirdiğimiz güzel anıları hatırlayalım.
          </p>
          <div className="mt-8 flex flex-col items-center gap-3">
            <span className="rounded-full bg-white/90 px-4 py-1 text-xs font-semibold uppercase tracking-[0.35em] text-primary shadow-sm ring-1 ring-rose-100 dark:bg-[#2b141b]/80 dark:text-rose-100 dark:ring-white/10">
              Anıları keşfet
            </span>
            <span className="material-symbols-outlined text-primary text-3xl">keyboard_arrow_down</span>
          </div>
          <button
            onClick={() => navigate('/timeline/add')}
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-black shadow-lg shadow-primary/30 transition duration-300 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-xl focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary/60"
          >
            <span className="text-lg leading-none">＋</span> Yeni Anı Ekle
          </button>
        </header>

        <section className="w-full">
          {events.length > 0 ? (
            <div className="space-y-4">
              {events.map((event, index) => {
                const isLeft = index % 2 === 0
                const formattedDate = new Date(event.eventDate).toLocaleDateString('tr-TR', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric',
                })

                const desktopCard = (
                  <div className="hidden md:flex justify-center items-start pt-16">
                    <div className="w-full max-w-sm">
                      <TimelineEventCard
                        event={event}
                        index={index}
                        badge={interactionBadges[event.interactionType]}
                        onDelete={handleDeleteClick}
                        isDeleting={deletingId === event.id}
                        onClick={() => setSelectedEvent(event)}
                      />
                    </div>
                  </div>
                )

                const detailColumn = (alignRight: boolean) => (
                  <div className={`flex flex-col py-16 ${alignRight ? 'items-end text-right' : ''}`}>
                    <p className="text-[#89616b] dark:text-gray-400 text-base font-medium leading-normal">{formattedDate}</p>
                    <h3 className="mt-2 text-2xl font-romantic text-[#b4224a] dark:text-gray-100">{event.title}</h3>
                    <p className={`mt-2 text-sm leading-relaxed text-[#4A4A4A] dark:text-gray-300 ${alignRight ? 'md:text-right' : 'md:text-left'}`}>
                      {event.description}
                    </p>
                    <div className="md:hidden mt-4">
                      <TimelineEventCard
                        event={event}
                        index={index}
                        badge={interactionBadges[event.interactionType]}
                        onDelete={handleDeleteClick}
                        isDeleting={deletingId === event.id}
                        onClick={() => setSelectedEvent(event)}
                      />
                    </div>
                  </div>
                )

                const topConnectorClass = index === 0 ? 'h-8' : 'flex-1'
                const bottomConnectorClass = index === events.length - 1 ? 'h-8' : 'flex-1'

                const timelineColumn = (
                  <div className="flex flex-col items-center gap-1">
                    <div className={`w-0.5 bg-rose-200 dark:bg-rose-900/50 ${topConnectorClass}`}></div>
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#f05f88]/80 text-white shadow-lg ring-8 ring-rose-100/70 dark:bg-[#b4224a] dark:ring-rose-900/40">
                      <span className="text-lg font-semibold">{index + 1}</span>
                    </div>
                    <div className={`w-0.5 bg-rose-200 dark:bg-rose-900/50 ${bottomConnectorClass}`}></div>
                  </div>
                )

                return (
                  <div
                    key={event.id}
                    className="grid grid-cols-[auto_1fr] md:grid-cols-[1fr_auto_1fr] gap-x-4 md:gap-x-8 px-2 md:px-4"
                  >
                    {isLeft ? (
                      <>
                        {desktopCard}
                        {timelineColumn}
                        {detailColumn(false)}
                      </>
                    ) : (
                      <>
                        {detailColumn(true)}
                        {timelineColumn}
                        {desktopCard}
                      </>
                    )}
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="py-20 text-center text-[#89616b] dark:text-gray-400">
              <p>Henüz timeline olayı eklenmemiş.</p>
            </div>
          )}
        </section>

        <section className="mt-16 grid gap-6 md:grid-cols-2">
          <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-md ring-1 ring-rose-100 dark:bg-[#2b141b] dark:ring-white/10">
            <p className="text-sm uppercase tracking-[0.4em] text-[#89616b] dark:text-gray-400">Toplam Anı</p>
            <p className="mt-3 text-4xl font-bold text-primary">{totalEvents}</p>
          </div>
          <div className="rounded-2xl bg-white px-6 py-5 text-center shadow-md ring-1 ring-rose-100 dark:bg-[#2b141b] dark:ring-white/10">
            <p className="text-sm uppercase tracking-[0.4em] text-[#89616b] dark:text-gray-400">İnteraktif Kart</p>
            <p className="mt-3 text-4xl font-bold text-primary">{interactionCount}</p>
          </div>
        </section>

        <div className="py-16 text-center">
          <h3 className="text-[#181113] dark:text-gray-100 tracking-light text-3xl md:text-4xl font-bold leading-tight px-4 pb-2">
            Seni Çok Seviyorum
          </h3>
          <p className="text-[#89616b] dark:text-gray-400">Daha nice güzel anılara...</p>
        </div>

        <footer className="flex flex-col gap-2 px-5 pb-6 text-center">
          <p className="text-[#89616b] dark:text-gray-500 text-sm">© 2025 MUHAMMED ENES AKBULUT. Tüm Hakları Saklıdır.</p>
        </footer>
      </div>

      <TimelineEventModal event={selectedEvent} onClose={() => setSelectedEvent(null)} />

      <ConfirmDialog
        isOpen={confirmDeleteOpen}
        title="Anıyı Sil"
        message={`"${eventToDelete?.title}" anısını silmek istediğinden emin misin?`}
        confirmText="Sil"
        cancelText="İptal"
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </main>
  )
}

export default TimelinePage
