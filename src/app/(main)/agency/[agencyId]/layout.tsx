import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { verifyAndAcceptInvitation } from '@/lib/server-actions/queries/agency-queries'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/organisms/agency/sidebar'
import BlurPage from '@/components/organisms/agency/blur-page'
import { Unauthorized } from '@/components/organisms/agency/unauthorized'
import { getnotificationAnduser } from '@/lib/server-actions/queries/noti-queries'
import InfoBar from '@/components/organisms/agency/info-bar'

interface IAgencyIdLayout {
  children: React.ReactNode
  params: { agencyId: string }
}

async function AgencyIdLayout({ children, params }: IAgencyIdLayout) {
  const agencyId = await verifyAndAcceptInvitation()
  const user = await currentUser()
  console.log('user', user?.privateMetadata)

  if (!user) {
    return redirect('/')
  }

  if (!agencyId) {
    return redirect('/agency')
  }

  if (user.privateMetadata.role !== 'AGENCY_OWNER' && user.privateMetadata.role !== 'AGENCY_ADMIN')
    return <Unauthorized />

  let allNoti: any = []
  const notifications = await getnotificationAnduser(agencyId)
  if (notifications) allNoti = notifications

  return (
    <div className='h-screen overflow-hidden'>
      <Sidebar id={params.agencyId} type='agency' />
      <div className='md:pl-[300px]'>
        <InfoBar notifications={allNoti} role={allNoti.User?.role} />
        <div className='relative'>
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default AgencyIdLayout
