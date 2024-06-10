'use server'

import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Agency, Plan, Role, User } from '@prisma/client'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { saveActivityLogsNotification } from './noti-queries'
import { generateObjectId, getSideBarOptions } from '@/lib/utils'

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
      id: generateObjectId(),
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
    Logger.error('upsert agency error ', error)
  }
}

/** send invitation */
export const sendInvitation = async (role: Role, email: string, agencyId: string) => {
  const response = await db.invitation.create({
    data: {
      email,
      agencyId,
      role,
    },
  })

  try {
    await clerkClient.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: process.env.NEXT_PUBLIC_URL,
      publicMetadata: {
        throughInvitation: true,
        role,
      },
    })
  } catch (error) {
    console.error('cleark send invitation error : ', error)
    throw error
  }

  return response
}
