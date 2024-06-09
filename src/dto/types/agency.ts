import {
  getAuthUserDetails,
  getUsersWithAgencySubAccountPermissionsSidebarOptions,
} from '@/lib/server-actions/queries/subaccount-queries'
import { getUserPermissions } from '@/lib/server-actions/queries/subaccount-queries'
import { _getTicketsWithAllRelations } from '@/lib/server-actions/queries/ticket-queries'
import { Notification, Prisma, Role } from '@prisma/client'
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
