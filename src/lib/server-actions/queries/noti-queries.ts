import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { currentUser } from '@clerk/nextjs/server'

/**
 * Save Activity Log Notifications
 */
export const saveActivityLogsNotification = async ({
  agencyId,
  description,
  subAccountId,
}: {
  /** agency Id */
  agencyId?: string | undefined
  /** noti description */
  description: string
  /** sub account Id */
  subAccountId?: string | undefined
}): Promise<void> => {
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
        SubAccount: {
          connect: {
            id: subAccountId,
          },
        },
      },
    })
  } else {
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
