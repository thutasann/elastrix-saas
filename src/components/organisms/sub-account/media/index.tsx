import { GetMediaFiles } from '@/dto/types/agency'
import React from 'react'
import MediaUploadButton from './upload-button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command'
import MediaCard from './media-card'
import { FolderSearch } from 'lucide-react'

interface IMediaComponent {
  data: GetMediaFiles
  subaccountId: string
}

function MediaComponent({ data, subaccountId }: IMediaComponent) {
  return (
    <div className='flex h-full w-full flex-col gap-4'>
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-bold'>Media Bucket</h1>
        <MediaUploadButton subaccountId={subaccountId} />
      </div>
      <Command className='bg-transparent'>
        <CommandInput placeholder='Search for file name...' />
        <CommandList className='max-h-full pb-40'>
          <CommandEmpty>No Media Files</CommandEmpty>
          <CommandGroup heading='Media Files'>
            <div className='flex flex-wrap gap-4 pt-4'>
              {data?.Media.map((file) => (
                <CommandItem
                  key={file.id}
                  className='w-full max-w-[300px] rounded-lg !bg-transparent p-0 !font-medium !text-white'
                >
                  <MediaCard file={file} />
                </CommandItem>
              ))}
              {!data?.Media.length && (
                <div className='flex w-full flex-col items-center justify-center'>
                  <FolderSearch size={100} className='text-slate-300 dark:text-muted' />
                  <p className='text-muted-foreground'>Empty! no files to show.</p>
                </div>
              )}
            </div>
          </CommandGroup>
        </CommandList>
      </Command>
    </div>
  )
}

export default MediaComponent
