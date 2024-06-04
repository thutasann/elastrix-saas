'use server'

import { currentUser } from '@clerk/nextjs/server'
import { db } from '../db'
import { redirect } from 'next/navigation'
import { User } from '@prisma/client'
import { Logger } from '../logger'
import { connect } from 'http2'

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
export const verifyAndAcceptInvitation = async () => {
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

/** save activity logs notification */
export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  agencyId?: string
  description: string
  subAccountId?: string
}) => {
  const authUser = await currentUser()

  // ---- user info
  let userData
  if (!authUser) {
    const response = await db.user.findFirst({
      where: {
        Agency: {
          SubAccount: {
            some: { id: subAccountId },
          },
        },
      },
    })
    if (response) {
      userData = response
    }
  } else {
    userData = await db.user.findUnique({
      where: {
        email: authUser.emailAddresses[0].emailAddress,
      },
    })
  }

  if (!userData) {
    Logger.error('Could not find a uesr')
    return
  }

  // ---- agency Id
  let foundAgencyId = agencyId
  if (!foundAgencyId) {
    if (!subAccountId) {
      throw new Error('You need to provide atleast an agency Id or subaccount Id')
    }
    const response = await db.subAccount.findUnique({ where: { id: subAccountId } })
    if (response) foundAgencyId = response.agencyId
  }

  if (subAccountId) {
    await db.notification.create({
      data: {
        notification: `${userData.name} | ${description}`,
        User: {
          connect: {
            id: userData.id,
          },
        },
        Agency: {
          connect: {
            id: foundAgencyId,
          },
        },
      },
    })
  }
}
