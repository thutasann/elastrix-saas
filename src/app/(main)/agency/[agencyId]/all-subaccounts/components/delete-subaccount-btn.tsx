'use client'

import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { deleteSubAccount, getSubaccountDetails } from '@/lib/server-actions/queries/subaccount-queries'
import { useRouter } from 'next/navigation'
import React from 'react'

interface IDeleteSubAccountButton {
  subaccountId: string
}

function DeleteSubAccountButton({ subaccountId }: IDeleteSubAccountButton) {
  const router = useRouter()

  return (
    <div
      className='text-white'
      onClick={async () => {
        const response = await getSubaccountDetails(subaccountId)
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Deleted a subaccount | ${response?.name}`,
          subAccountId: subaccountId,
        })
        await deleteSubAccount(subaccountId)
        router.refresh()
      }}
    >
      Delete Sub Account
    </div>
  )
}

export default DeleteSubAccountButton
