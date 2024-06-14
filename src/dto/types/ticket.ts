import { Contact, Lane, Tag, Ticket, User } from '@prisma/client'

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
