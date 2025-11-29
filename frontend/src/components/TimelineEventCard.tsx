import type { TimelineEvent } from '../types/timeline'
import LazyImage from './LazyImage'

interface TimelineEventCardProps {
  event: TimelineEvent
  index: number
  badge: { label: string; color: string }
  onDelete: (id: string) => void
  isDeleting: boolean
  onClick: () => void
  className?: string
}

const TimelineEventCard = ({ event, index, badge, onDelete, isDeleting, onClick, className }: TimelineEventCardProps) => {
  const formattedDate = new Date(event.eventDate).toLocaleDateString('tr-TR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  })

  const baseClasses = 'group relative transition-transform duration-300 hover:-translate-y-1'
  const articleClasses = className ? `${className} ${baseClasses}` : baseClasses

  return (
    <article
      className={articleClasses}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div
        className="flex h-full cursor-pointer flex-col overflow-hidden rounded-3xl bg-white/60 text-[#4A4A4A] shadow-[0_25px_60px_rgba(238,43,91,0.12)] ring-1 ring-rose-100/70 backdrop-blur-sm transition hover:-translate-y-1 hover:ring-primary/60 dark:bg-[#2b141b] dark:text-gray-100 dark:ring-white/10"
        onClick={onClick}
      >
        <div className="relative h-48 w-full overflow-hidden">
          {event.mediaUrl ? (
            <LazyImage
              src={event.mediaUrl}
              alt={event.title}
              className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-[#f8f6f6] text-sm font-semibold text-[#C06C84] dark:bg-[#1a0c10]">
              Fotoğraf yok
            </div>
          )}

          {badge.label && (
            <span className={`absolute left-4 top-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold shadow-lg ${badge.color || 'bg-rose-100 text-rose-600'}`}>
              {badge.label}
            </span>
          )}
        </div>

        <div className="flex flex-1 flex-col gap-3 p-5 sm:p-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <time className="text-xs uppercase tracking-[0.3em] text-[#C06C84] dark:text-rose-200">{formattedDate}</time>
              <h3 className="mt-2 text-2xl font-romantic text-[#b4224a] dark:text-white">{event.title}</h3>
            </div>
          </div>
          <p className="text-sm leading-relaxed text-[#4A4A4A] dark:text-gray-200">{event.description}</p>

          <div className="mt-auto flex flex-wrap items-center justify-between gap-3 pt-4">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation()
                onDelete(event.id)
              }}
              disabled={isDeleting}
              className="rounded-full border border-[#ee2b5b]/30 bg-[#ee2b5b]/5 px-5 py-2 text-sm font-semibold text-[#ee2b5b] transition hover:bg-[#ee2b5b] hover:text-white disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isDeleting ? 'Siliniyor...' : 'Sil'}
            </button>
            <span className="text-xs font-semibold uppercase tracking-[0.4em] text-[#89616b] dark:text-gray-400">
              Detayları Gör
            </span>
          </div>
        </div>
      </div>
    </article>
  )
}

export default TimelineEventCard
