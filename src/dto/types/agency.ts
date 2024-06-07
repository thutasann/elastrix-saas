import { _getTicketsWithAllRelations } from '@/lib/server-actions/queries/ticket-queries'
import { Notification, Prisma, Role } from '@prisma/client'
import { Stripe } from 'stripe'

/** Ticket Deails with All Relations */
export type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithAllRelations>

/** Price List */
export type PricesList = Stripe.ApiList<Stripe.Price>

/** Notification with User */
export type NotificationWithUser =
  | ({
      User: {
        id: string
        name: string
        avatarUrl: string
        email: string
        createdAt: Date
        updatedAt: Date
        role: Role
        agencyId: string | null
      }
    } & Notification)[]
  | undefined
