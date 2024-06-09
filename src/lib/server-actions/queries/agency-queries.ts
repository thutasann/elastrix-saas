'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Agency, Plan, Prisma, User } from '@prisma/client'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { saveActivityLogsNotification } from './noti-queries'
import { generateObjectId, getSideBarOptions } from '@/lib/utils'

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

/** export const updateAgencyDetails */
export const updateAgencyDetails = async (agencyId: string, agencyDetails: Partial<Agency>) => {
  const response = await db.agency.update({
    where: { id: agencyId },
    data: { ...agencyDetails },
  })
  return response
}

/** delete agency */
export const deleteAgency = async (agencyId: string) => {
  const response = await db.agency.delete({
    where: {
      id: agencyId,
    },
  })
  return response
}

/** init user for create new user */
export const initUser = async (newUser: Partial<User>) => {
  const id = generateObjectId()
  Logger.info('initUser id :', id)
  const user = await currentUser()
  if (!user) return

  const userData = await db.user.upsert({
    where: {
      email: user.emailAddresses[0].emailAddress,
    },
    update: newUser,
    create: {
      id: id,
      avatarUrl: user.imageUrl,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  await clerkClient.users.updateUserMetadata(user.id, {
    privateMetadata: {
      role: newUser.role || 'SUBACCOUNT_USER',
    },
  })

  return userData
}

/** create agency */
export const createAgency = async (agency: Agency, price?: Plan) => {
  Logger.info('create agency: ', agency.name)
  if (!agency.companyEmail) return null
  try {
    const agencyDetails = await db.agency.create({
      data: {
        users: { connect: { email: agency.companyEmail } },
        ...agency,
        SidebarOption: {
          create: getSideBarOptions(agency),
        },
      },
    })
    return agencyDetails
  } catch (error) {
    Logger.error('create agency error : ', error)
  }
}

/** update agency */
export const upsertAgency = async (agency: Agency, id?: string, price?: Plan) => {
  if (!agency.companyEmail) return null
  try {
    const agencyDetails = await db.agency.upsert({
      where: {
        id: id,
      },
      update: agency,
      create: {
        users: {
          connect: { email: agency.companyEmail },
        },
        ...agency,
        SidebarOption: {
          create: getSideBarOptions(agency),
        },
      },
    })
    return agencyDetails
  } catch (error) {
    console.log('upsert agency error ', error)
  }
}
