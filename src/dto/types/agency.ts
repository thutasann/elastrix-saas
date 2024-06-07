import { _getTicketsWithAllRelations } from '@/lib/server-actions/queries/ticket-queries'
import { Prisma } from '@prisma/client'
import { Stripe } from 'stripe'

/** Ticket Deails with All Relations */
export type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithAllRelations>

/** Price List */
export type PricesList = Stripe.ApiList<Stripe.Price>
