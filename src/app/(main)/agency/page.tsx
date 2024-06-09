import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { verifyAndAcceptInvitation } from '@/lib/server-actions/queries/agency-queries'
import { Plan } from '@prisma/client'
import AgencyDetails from '@/components/organisms/forms/agency-details'
import { ChevronLeft } from 'lucide-react'
import { getAuthUserDetails } from '@/lib/server-actions/queries/subaccount-queries'

interface IAgencyPage {
  searchParams: {
    plan: Plan
    state: string
    code: string
  }
}

async function AgencyPage({ searchParams }: IAgencyPage) {
  const agencyId = await verifyAndAcceptInvitation()
  const user = await getAuthUserDetails()

  if (agencyId) {
    if (user?.role === 'SUBACCOUNT_GUEST' || user?.role === 'SUBACCOUNT_USER') {
      return redirect('/subaccount')
    } else if (user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') {
      if (searchParams.plan) {
        return redirect(`/agency/${agencyId}/billing?plan=${searchParams.plan}`)
      }
      if (searchParams.state) {
        const statePath = searchParams.state.split('__')[0]
        const stateAgencyId = searchParams.state.split('__')[1]
        if (!stateAgencyId) return <div>Not Authorized</div>
        return redirect(`/agency/${stateAgencyId}/${statePath}?code=${searchParams.code}`)
      } else return redirect(`/agency/${agencyId}`)
    } else {
      return <div>Not Authorized</div>
    }
  }
  const authUser = await currentUser()

  return (
    <div className='mt-4 flex items-center justify-center'>
      <div className='max-w-[850px] rounded-xl border-[1px] p-4'>
        <h1 className='mb-3 text-center text-2xl font-bold'>Create an Agency</h1>
        <AgencyDetails
          data={{
            companyEmail: authUser?.emailAddresses[0].emailAddress,
          }}
        />
      </div>
    </div>
  )
}

export default AgencyPage
