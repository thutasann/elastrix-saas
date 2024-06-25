'use server'

import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { generateObjectId, getSideBarOptionsForSubAccount } from '@/lib/utils'
import { Prisma, SubAccount, User } from '@prisma/client'
import { clerkClient, currentUser } from '@clerk/nextjs/server'
import { CreateMediaType } from '@/dto/types/agency'

/** create sub account */
export const createSubAccount = async (subAccount: SubAccount) => {
  if (!subAccount.companyEmail) return null
  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: 'AGENCY_OWNER',
    },
  })
  if (!agencyOwner) return Logger.error('🔴 Error: could not create subaccount')
  const permissionId = generateObjectId()
  Logger.info('subAccount.id', subAccount.id)
  const response = await db.subAccount.create({
    data: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: 'Fitness Agency' },
      },
      SidebarOption: {
        create: getSideBarOptionsForSubAccount(subAccount),
      },
    },
  })
  return response
}

/** upsert sub account */
export const upsertSubAccount = async (subAccount: SubAccount, id: string) => {
  if (!subAccount.companyEmail) return null

  const agencyOwner = await db.user.findFirst({
    where: {
      Agency: {
        id: subAccount.agencyId,
      },
      role: 'AGENCY_OWNER',
    },
  })

  if (!agencyOwner) return console.log('🔴Erorr could not create subaccount')
  const permissionId = generateObjectId()
  const response = await db.subAccount.upsert({
    where: { id: id },
    update: subAccount,
    create: {
      ...subAccount,
      Permissions: {
        create: {
          access: true,
          email: agencyOwner.email,
          id: permissionId,
        },
        connect: {
          subAccountId: subAccount.id,
          id: permissionId,
        },
      },
      Pipeline: {
        create: { name: 'Lead Cycle' },
      },
      SidebarOption: {
        create: getSideBarOptionsForSubAccount(subAccount),
      },
    },
  })
  return response
}

/** get authed user details */
export const getAuthUserDetails = async () => {
  const user = await currentUser()
  Logger.info('getAuthUserDetails() fullName', user?.fullName)
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

/** get user permissions */
export const getUserPermissions = async (userId: string) => {
  const response = await db.user.findUnique({
    where: {
      id: userId,
    },
    select: {
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  })
  return response
}

/** update user */
export const updateUser = async (user: Partial<User>) => {
  const response = await db.user.update({
    where: { email: user.email },
    data: { ...user },
  })

  try {
    await clerkClient.users.updateUserMetadata(response.id, {
      privateMetadata: {
        role: user.role || 'SUBACCOUNT_USER',
      },
    })
  } catch (error) {
    console.log('error', error)
  }

  return response
}

/** change user permission */
export const changeUserPermissions = async (
  permissionId: string | undefined,
  userEmail: string,
  subAccountId: string,
  permission: boolean,
) => {
  try {
    const response = await db.permissions.upsert({
      where: { id: permissionId },
      update: { access: permission },
      create: {
        access: permission,
        email: userEmail,
        subAccountId: subAccountId,
      },
    })
    return response
  } catch (error) {
    Logger.error('could not change permission : ', error)
  }
}

/** get sub account details */
export const getSubaccountDetails = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
  })
  return response
}

/** delete sub account */
export const deleteSubAccount = async (subaccountId: string) => {
  const response = await db.subAccount.delete({
    where: {
      id: subaccountId,
    },
  })
  return response
}

/** get team members */
export const getTeamMembers = async (agencyId: string) => {
  const response = await db.user.findMany({
    where: {
      Agency: {
        id: agencyId,
      },
    },
    include: {
      Agency: { include: { SubAccount: true } },
      Permissions: { include: { SubAccount: true } },
    },
  })
  return response
}

/** get users with agency subaccount permissions and sidebar options */
export const getUsersWithAgencySubAccountPermissionsSidebarOptions = async (agencyId: string) => {
  const response = await db.user.findFirst({
    where: {
      Agency: { id: agencyId },
    },
    include: {
      Agency: {
        include: { SubAccount: true },
      },
      Permissions: {
        include: {
          SubAccount: true,
        },
      },
    },
  })
  return response
}

/** get user detail with id */
export const getUser = async (id: string) => {
  const user = await db.user.findUnique({
    where: {
      id,
    },
  })
  return user
}

/** delete user */
export const deleteUser = async (userId: string) => {
  try {
    await clerkClient.users.updateUserMetadata(userId, {
      privateMetadata: {
        role: undefined,
      },
    })
  } catch (error) {
    Logger.error('clerk update metadata error ', error)
  }

  const deletedUser = await db.user.delete({
    where: {
      id: userId,
    },
  })
  return deletedUser
}

/** get media */
export const getMedia = async (subaccountId: string) => {
  const mediaFiles = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    include: {
      Media: true,
    },
  })
  return mediaFiles
}

/** create media */
export const createMedia = async (subaccountId: string, mediaFile: CreateMediaType) => {
  const response = await db.media.create({
    data: {
      link: mediaFile.link,
      name: mediaFile.name,
      subAccountId: subaccountId,
    },
  })
  return response
}

/** delete media */
export const deleteMedia = async (mediaId: string) => {
  const response = await db.media.delete({
    where: {
      id: mediaId,
    },
  })
  return response
}

/** get subaccount with team members */
export const getSubAccountWithTeamMembers = async (subaccountId: string) => {
  const subaccuntUsersWithAccess = await db.user.findMany({
    where: {
      Agency: {
        SubAccount: {
          some: {
            id: subaccountId,
          },
        },
      },
      role: 'SUBACCOUNT_USER',
      Permissions: {
        some: {
          subAccountId: subaccountId,
          access: true,
        },
      },
    },
  })
  return subaccuntUsersWithAccess
}

/** search contacts */
export const searchContacts = async (searchTerms: string) => {
  const response = await db.contact.findMany({
    where: {
      name: {
        contains: searchTerms,
      },
    },
  })
  return response
}

/** get tags from subaccount */
export const getTagsFromSubaccount = async (subaccountId: string) => {
  const response = await db.subAccount.findUnique({
    where: {
      id: subaccountId,
    },
    select: {
      Tags: true,
    },
  })
  return response
}

/** upsert tag */
export const createTag = async (subaccountId: string, tag: Prisma.TagUncheckedCreateInput) => {
  console.log('subaccountId', subaccountId)
  try {
    const response = await db.tag.create({
      data: {
        ...tag,
        subAccountId: subaccountId,
      },
    })
    return response
  } catch (error) {
    console.log('upert tag error : ', error)
  }
}

/** create contact */
export const createContact = async (contact: Prisma.ContactUncheckedCreateInput) => {
  try {
    console.log('contact.', contact.name)
    const response = await db.contact.create({
      data: {
        ...contact,
      },
    })
    return response
  } catch (error) {
    console.log('create contact error : ', error)
  }
}
