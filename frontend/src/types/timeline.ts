export type TimelineInteractionType = 'NONE' | 'QUIZ' | 'PHOTO_GUESS'

export interface TimelineEvent {
  id: string
  title: string
  eventDate: string
  description: string
  mediaUrl?: string
  interactionType: TimelineInteractionType
  interactionPayload?: unknown
}
