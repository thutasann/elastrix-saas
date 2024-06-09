import AgencyDetails from '@/components/organisms/forms/agency-details'
import { db } from '@/lib/db'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'

interface ISettingsPage {
  params: { agencyId: string }
}

async function SettingsPage({ params }: ISettingsPage) {
  const authUser = await currentUser()
  if (!authUser) return null

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  })

  if (!userDetails) return

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  })

  if (!agencyDetails) return null

  const subAccounts = agencyDetails.SubAccount

  return (
    <div className='flex flex-col gap-4 lg:flex-row'>
      <AgencyDetails data={agencyDetails} update />
    </div>
  )
}

export default SettingsPage
