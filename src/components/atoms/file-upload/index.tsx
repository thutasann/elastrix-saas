'use client'

import { Button } from '@/components/ui/button'
import { UploadDropzone } from '@/lib/uploadthings'
import { X, FileIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

interface IFileUpload {
  apiEndpoint: 'agencyLogo' | 'avatar' | 'subaccountLogo'
  onChange: (url?: string) => void
  value?: string
}

function FileUpload({ apiEndpoint, onChange, value }: IFileUpload) {
  const type = value?.split('.').pop()

  if (value) {
    return (
      <div className='flex flex-col items-center justify-center'>
        {type !== 'pdf' ? (
          <div className='relative h-40 w-40'>
            <Image src={value} alt='uploaded image' className='object-contain' fill />
          </div>
        ) : (
          <div className='relative mt-2 flex items-center rounded-md bg-background/10 p-2'>
            <FileIcon />
            <a
              href={value}
              target='_blank'
              rel='noopener_noreferrer'
              className='ml-2 text-sm text-indigo-500 hover:underline dark:text-indigo-400'
            >
              View PDF
            </a>
          </div>
        )}
        <Button onClick={() => onChange('')} variant='ghost' type='button'>
          <X className='h-4 w-4' />
          Remove Logo
        </Button>
      </div>
    )
  }

  return (
    <div className='w-full bg-muted/30'>
      <UploadDropzone
        endpoint={apiEndpoint}
        onClientUploadComplete={(res) => {
          onChange(res?.[0].url)
        }}
        onUploadError={(error: Error) => {
          console.error(error)
        }}
      />
    </div>
  )
}

export default FileUpload
