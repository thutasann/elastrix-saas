import InfoBar from '@/components/organisms/agency/info-bar'
import Sidebar from '@/components/organisms/agency/sidebar'
import { Unauthorized } from '@/components/organisms/agency/unauthorized'
import { verifyAndAcceptInvitation } from '@/lib/server-actions/queries/agency-queries'
import { getnotificationAnduser } from '@/lib/server-actions/queries/noti-queries'
import { getAuthUserDetails } from '@/lib/server-actions/queries/subaccount-queries'
import { currentUser } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { redirect } from 'next/navigation'
import React from 'react'

interface ISubAccountLayout {
  children: React.ReactNode
  params: { subaccountId: string }
}

async function SubAccountLayout({ children, params }: ISubAccountLayout) {
  const agencyId = await verifyAndAcceptInvitation()
  if (!agencyId) return <Unauthorized />

  const user = await currentUser()
  if (!user) {
    return redirect('/')
  }

  let notifications: any[] = []

  if (!user.privateMetadata.role) {
    return <Unauthorized />
  } else {
    const allPermissions = await getAuthUserDetails()
    const hasPermission = allPermissions?.Permissions.find(
      (permissions) => permissions.access && permissions.subAccountId === params.subaccountId,
    )
    if (!hasPermission) {
      return <Unauthorized />
    }
  }

  const allNotifications = await getnotificationAnduser(agencyId)

  if (user.privateMetadata.role === 'AGENCY_ADMIN' || user.privateMetadata.role === 'AGENCY_OWNER') {
    if (allNotifications) notifications = allNotifications
  } else {
    const filteredNoti = allNotifications?.filter((item) => item.subAccountId === params.subaccountId)
    if (filteredNoti) notifications = filteredNoti
  }

  return (
    <div className='h-screen overflow-hidden'>
      <Sidebar id={params.subaccountId} type='subaccount' />
      <div className='md:pl-[300px]'>
        <InfoBar
          notifications={notifications}
          role={user.privateMetadata.role as Role}
          subAccountId={params.subaccountId as string}
        />
        <div className='relative'>{children}</div>
      </div>
    </div>
  )
}

export default SubAccountLayout
