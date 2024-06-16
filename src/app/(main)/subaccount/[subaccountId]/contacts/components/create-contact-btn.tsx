'use client'

import CustomModal from '@/components/molecules/modals/cutsom-modal'
import ContactUserForm from '@/components/organisms/forms/contact-user-form'
import { Button } from '@/components/ui/button'
import { ContactUserFormSchema } from '@/dto/forms/agency-forms'
import { useModal } from '@/providers/modal-provider'
import React from 'react'

interface ICreateContactButton {
  subaccountId: string
}

function CreateContactButton({ subaccountId }: ICreateContactButton) {
  const { setOpen } = useModal()

  const handleCreateContact = async () => {
    setOpen(
      <CustomModal title='Create Or Update Contact information' subheading='Contacts are like customers.'>
        <ContactUserForm subaccountId={subaccountId} />
      </CustomModal>,
    )
  }

  return <Button onClick={handleCreateContact}>Create Contact</Button>
}

export default CreateContactButton
