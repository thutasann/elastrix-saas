import React from 'react'
import { currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { getAuthUserDetails } from '@/lib/server-actions/queries'
import { Logger } from '@/lib/logger'

async function AgencyPage() {
  const authUser = await currentUser()
  if (!authUser) return redirect('/sign-in')

  const user = await getAuthUserDetails()
  Logger.info('name -> ', user?.name)

  return <div>AgencyPage</div>
}

export default AgencyPage
