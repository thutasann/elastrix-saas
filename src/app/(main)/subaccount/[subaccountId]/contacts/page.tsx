import BlurPage from '@/components/organisms/agency/blur-page'
import { SubAccountWithContacts } from '@/dto/types/agency'
import { db } from '@/lib/db'
import { Ticket } from '@prisma/client'
import React from 'react'
import CreateContactButton from './components/create-contact-btn'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import format from 'date-fns/format'

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
      <div className='flex w-full items-center justify-between'>
        <h1 className='p-4 text-2xl font-bold'>Contacts</h1>
        <CreateContactButton subaccountId={params.subaccountId} />
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className='w-[200px]'>Name</TableHead>
            <TableHead className='w-[300px]'>Email</TableHead>
            <TableHead className='w-[200px]'>Active</TableHead>
            <TableHead className='whitespace-nowrap'>Created Date</TableHead>
            <TableHead className='whitespace-nowrap'>Total Value</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody className='truncate font-medium'>
          {allContacts.map((contact) => (
            <TableRow key={contact.id}>
              <TableCell>
                <Avatar>
                  <AvatarImage alt='@shadcn' />
                  <AvatarFallback className='bg-primary text-white'>
                    {contact.name.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </TableCell>
              <TableCell>{contact.email}</TableCell>
              <TableCell>
                {formatTotal(contact.Ticket) === '$0.00' ? (
                  <Badge variant={'destructive'}>Inactive</Badge>
                ) : (
                  <Badge className='bg-emerald-700'>Active</Badge>
                )}
              </TableCell>
              {/* @ts-ignore */}
              <TableCell>{format(contact.createdAt, 'MM/dd/yyyy')}</TableCell>
              <TableCell className='text-right'>{formatTotal(contact.Ticket)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </BlurPage>
  )
}

export default SubAccountContactsPage
