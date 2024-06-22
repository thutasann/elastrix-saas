import { getFunnels } from '@/lib/server-actions/queries/funnel-queries'
import {
  getAuthUserDetails,
  getMedia,
  getUsersWithAgencySubAccountPermissionsSidebarOptions,
} from '@/lib/server-actions/queries/subaccount-queries'
import { getUserPermissions } from '@/lib/server-actions/queries/subaccount-queries'
import { _getTicketsWithAllRelations } from '@/lib/server-actions/queries/ticket-queries'
import { Contact, Notification, Prisma, Role, SubAccount, Ticket } from '@prisma/client'
import { Stripe } from 'stripe'

/** Ticket Deails with All Relations Props */
export type TicketDetails = Prisma.PromiseReturnType<typeof _getTicketsWithAllRelations>

/** Price List Props */
export type PricesList = Stripe.ApiList<Stripe.Price>

/** Notification with User Props */
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

/** Permissions and SubAccount Props */
export type UserWithPermissionsAndSubAccounts = Prisma.PromiseReturnType<typeof getUserPermissions>

/**  Auth User with Agency Sidebar Options and SubAccounts Props */
export type AuthUserWithAgencySidebarOptionsAndSubAccounts = Prisma.PromiseReturnType<typeof getAuthUserDetails>

/** Users with Agency SubAccount Permissions and Sidebar Options Props */
export type UsersWithAgencySubAccountPermissionsSidebarOptions = Prisma.PromiseReturnType<
  typeof getUsersWithAgencySubAccountPermissionsSidebarOptions
>

/** Get media files props */
export type GetMediaFiles = Prisma.PromiseReturnType<typeof getMedia>

/** Create media files props */
export type CreateMediaType = Prisma.MediaCreateWithoutSubaccountInput

/** SubAccount with Contact Props */
export type SubAccountWithContacts = SubAccount & {
  Contact: (Contact & { Ticket: Ticket[] })[]
}

/** Funnels for Sub account Props */
export type FunnelsForSubAccount = Prisma.PromiseReturnType<typeof getFunnels>[0]

/** Upsert Funnel paeg */
export type UpsertFunnelPage = Prisma.FunnelPageCreateWithoutFunnelInput
