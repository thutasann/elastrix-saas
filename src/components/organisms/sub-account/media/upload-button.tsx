'use client'

import CustomModal from '@/components/molecules/modals/cutsom-modal'
import { Button } from '@/components/ui/button'
import { useModal } from '@/providers/modal-provider'
import React from 'react'
import UploadMediaForm from '../../forms/upload-media'

interface IMediaUploadButton {
  subaccountId: string
}

function MediaUploadButton({ subaccountId }: IMediaUploadButton) {
  const { setOpen } = useModal()
  return (
    <Button
      onClick={() => {
        setOpen(
          <CustomModal title='Upload Media' subheading='Upload a file to your media bucket'>
            <UploadMediaForm subaccountId={subaccountId} />
          </CustomModal>,
        )
      }}
    >
      Upload
    </Button>
  )
}

export default MediaUploadButton
