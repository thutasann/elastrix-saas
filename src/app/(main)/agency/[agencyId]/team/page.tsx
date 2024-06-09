import { db } from '@/lib/db'
import { getTeamMembers } from '@/lib/server-actions/queries/subaccount-queries'
import { currentUser } from '@clerk/nextjs/server'
import React from 'react'
import DataTable from './components/data-table'
import { Plus } from 'lucide-react'
import { columns } from './components/columns'
import SendInvitation from '@/components/organisms/forms/send-invitation'

interface ITeamPage {
  params: { agencyId: string }
}

async function TeamPage({ params }: ITeamPage) {
  const authUser = await currentUser()
  const teamMembers = await getTeamMembers(params.agencyId)

  if (!authUser) return null

  const agencyDetails = await db.agency.findUnique({
    where: {
      id: params.agencyId,
    },
    include: {
      SubAccount: true,
    },
  })

  if (!agencyDetails) return

  return (
    <DataTable
      actionButtonText={
        <>
          <Plus size={15} />
          Add
        </>
      }
      modalChildren={<SendInvitation agencyId={agencyDetails.id} />}
      filterValue='name'
      columns={columns}
      data={teamMembers}
    />
  )
}

export default TeamPage
