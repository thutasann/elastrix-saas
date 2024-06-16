import BlurPage from '@/components/organisms/agency/blur-page'
import { SubAccountWithContacts } from '@/dto/types/agency'
import { db } from '@/lib/db'
import { Ticket } from '@prisma/client'
import React from 'react'
import CreateContactButton from './components/create-contact-btn'

interface ISubAccountContacts {
  params: {
    subaccountId: string
  }
}

async function SubAccountContactsPage({ params }: ISubAccountContacts) {
  const contacts = (await db.subAccount.findUnique({
    where: {
      id: params.subaccountId,
    },
    include: {
      Contact: {
        include: {
          Ticket: {
            select: {
              value: true,
            },
          },
        },
      },
    },
  })) as SubAccountWithContacts

  const allContacts = contacts.Contact

  const formatTotal = (tickets: Ticket[]) => {
    if (!tickets || !tickets.length) return '$0.00'
    const amt = new Intl.NumberFormat(undefined, {
      style: 'currency',
      currency: 'USD',
    })

    const laneAmt = tickets.reduce((sum, ticket) => sum + (Number(ticket?.value) || 0), 0)

    return amt.format(laneAmt)
  }

  return (
    <BlurPage>
      <h1 className='p-4 text-2xl'>Contacts</h1>
      <CreateContactButton subaccountId={params.subaccountId} />
    </BlurPage>
  )
}

export default SubAccountContactsPage
