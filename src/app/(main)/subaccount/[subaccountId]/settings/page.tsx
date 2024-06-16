import React from 'react'
import BlurPage from '@/components/organisms/agency/blur-page'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/lib/db'
import SubAccountDetailsForm from '@/components/organisms/forms/subaccount-details'
import UserDetailsForm from '@/components/organisms/forms/user-details'

interface ISubAccountSettingsPage {
  params: {
    subaccountId: string
  }
}

async function SubAccountSettingsPage({ params }: ISubAccountSettingsPage) {
  const authUser = await currentUser()
  if (!authUser) return

  const userDetails = await db.user.findUnique({
    where: {
      email: authUser.emailAddresses[0].emailAddress,
    },
  })

  if (!userDetails) return

  const subAccount = await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
  })

  if (!subAccount) return

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: subAccount.agencyId,
    },
    include: { SubAccount: true },
  })

  if (!agencyDetails) return

  const subAccounts = agencyDetails.SubAccount

  return (
    <BlurPage>
      <div className='flex flex-col gap-4 lg:!flex-row'>
        <SubAccountDetailsForm
          agencyDetails={agencyDetails}
          details={subAccount}
          userId={userDetails.id}
          userName={userDetails.name}
        />
        <UserDetailsForm type='subaccount' id={params.subaccountId} subAccounts={subAccounts} userData={userDetails} />
      </div>
    </BlurPage>
  )
}

export default SubAccountSettingsPage
