import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { verifyAndAcceptInvitation } from '@/lib/server-actions/queries/agency-queries'
import { redirect } from 'next/navigation'
import Sidebar from '@/components/organisms/agency/sidebar'
import BlurPage from '@/components/organisms/agency/blur-page'

interface IAgencyIdLayout {
  children: React.ReactNode
  params: { agencyId: string }
}

async function AgencyIdLayout({ children, params }: IAgencyIdLayout) {
  const agencyId = await verifyAndAcceptInvitation()
  const user = await currentUser()

  if (!user) {
    return redirect('/')
  }

  if (!agencyId) {
    return redirect('/agency')
  }

  return (
    <div className='h-screen overflow-hidden'>
      <Sidebar id={params.agencyId} type='agency' />
      <div className='md:pl-[300px]'>
        <div className='relative'>
          <BlurPage>{children}</BlurPage>
        </div>
      </div>
    </div>
  )
}

export default AgencyIdLayout
