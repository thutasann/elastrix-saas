'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { saveActivityLogsNotification } from './noti-queries'

/** get authed user details */
export const getAuthUserDetails = async () => {
  const user = await currentUser()
  Logger.info('fullName', user?.fullName)
  if (!user) return

  const userData = await db.user.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    include: {
      Agency: {
        include: {
          SidebarOption: true,
          SubAccount: {
            include: {
              SidebarOption: true,
            },
          },
        },
      },
      Permissions: true,
    },
  })

  return userData
}

/** verify and accept invitation */
export const verifyAndAcceptInvitation = async (): Promise<string | null> => {
  const user = await currentUser()
  if (!user) return redirect('/sign-in')
  const invitationExists = await db.invitation.findUnique({
    where: {
      email: user.emailAddresses[0].emailAddress,
      status: 'PENDING',
    },
  })

  if (invitationExists) {
    const userDetails = await createTeamUser(invitationExists.agencyId, {
      email: invitationExists.email,
      agencyId: invitationExists.agencyId,
      avatarUrl: user.imageUrl,
      id: user.id,
      name: `${user.firstName} ${user.lastName}`,
      role: invitationExists.role,
      createdAt: new Date(),
      updatedAt: new Date(),
    })

    await saveActivityLogsNotification({
      agencyId: invitationExists.agencyId,
      description: 'Joined',
      subAccountId: undefined,
    })

    if (userDetails) {
      // clerk update user meta data
      await clerkClient.users.updateUserMetadata(user.id, {
        privateMetadata: {
          role: userDetails.role || 'SUBACCOUNT_USER',
        },
      })

      await db.invitation.delete({
        where: {
          email: userDetails.email,
        },
      })

      return userDetails.agencyId
    } else return null
  } else {
    const agency = await db.user.findUnique({
      where: {
        email: user.emailAddresses[0].emailAddress,
      },
    })
    return agency ? agency.agencyId : null
  }
}

/** create team user */
export const createTeamUser = async (agencyId: string, user: User) => {
  if (user.role === 'AGENCY_OWNER') return null
  const response = await db.user.create({
    data: {
      ...user,
    },
  })
  return response
}
