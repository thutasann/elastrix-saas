'use client'

import React from 'react'
import { Agency, AgencySidebarOption, SubAccount, User } from '@prisma/client'
import { useModal } from '@/providers/modal-provider'
import { Button } from '@/components/ui/button'
import { PlusCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import SubAccountDetailsForm from '@/components/organisms/forms/subaccount-details'

interface ICreateSubAccountButton {
  user: User & {
    Agency:
      | (
          | Agency
          | (null & {
              SubAccount: SubAccount[]
              SideBarOption: AgencySidebarOption[]
            })
        )
      | null
  }
  id: string
  className: string
}

/**
 * Create Subaccoutn button
 */
function CreateSubAccountButton({ user, id, className }: ICreateSubAccountButton) {
  const { setOpen } = useModal()
  const agencyDetails = user.Agency

  if (!agencyDetails) return

  return (
    <Button
      className={cn('flex w-full gap-4', className)}
      onClick={() => {
        setOpen(
          <CustomModal title='Create a Subaccount!' subheading='You can switch between'>
            <SubAccountDetailsForm agencyDetails={agencyDetails} userId={user.id} userName={user.name} />
          </CustomModal>,
        )
      }}
    >
      <PlusCircleIcon size={15} />
      Create Sub Account
    </Button>
  )
}

export default CreateSubAccountButton
