import { getPipelineDetails, getTicketsWithTags } from '@/lib/server-actions/queries/ticket-queries'
import { Contact, Lane, Prisma, Tag, Ticket, User } from '@prisma/client'

/** Ticket and Tags */
export type TicketAndTags = Ticket & {
  Tags: Tag[]
  Assigned: User | null
  Customer: Contact | null
}

/** Lane Detail */
export type LaneDetail = Lane & {
  Tickets: TicketAndTags[]
}

/** Pipeline Details with Lanes, Cards, Tags and Tickets */
export type PipelineDestilsWithLanesCardsTagsTickets = Prisma.PromiseReturnType<typeof getPipelineDetails>

/** Tickets with Tags, Customer and Assigned */
export type TicketWithTags = Prisma.PromiseReturnType<typeof getTicketsWithTags>
