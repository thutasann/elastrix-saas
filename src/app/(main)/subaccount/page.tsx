import React from 'react'
import { Unauthorized } from '@/components/organisms/agency/unauthorized'
import { verifyAndAcceptInvitation } from '@/lib/server-actions/queries/agency-queries'
import { getAuthUserDetails } from '@/lib/server-actions/queries/subaccount-queries'
import { redirect } from 'next/navigation'

interface ISubAccountPage {
  searchParams: { state: string; code: string }
}

async function SubAccountPage({ searchParams }: ISubAccountPage) {
  const agencyId = await verifyAndAcceptInvitation()

  if (!agencyId) {
    return <Unauthorized />
  }

  const user = await getAuthUserDetails()
  if (!user) return

  const getFirstSubaccountWithAccess = user.Permissions.find((permission) => permission.access === true)

  if (searchParams.state) {
    const statePath = searchParams.state.split('___')[0]
    const stateSubaccountId = searchParams.state.split('___')[1]
    if (!stateSubaccountId) return <Unauthorized />
    return redirect(`/subaccount/${stateSubaccountId}/${statePath}?code=${searchParams.code}`)
  }

  if (getFirstSubaccountWithAccess) {
    return redirect(`/subaccount/${getFirstSubaccountWithAccess.subAccountId}`)
  }

  return <Unauthorized />
}

export default SubAccountPage
