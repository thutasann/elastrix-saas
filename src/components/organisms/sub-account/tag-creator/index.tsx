'use client'

import React, { useEffect, useState } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { getTagsFromSubaccount, upsertTag } from '@/lib/server-actions/queries/subaccount-queries'
import { generateObjectId } from '@/lib/utils'
import { Tag } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { deleteAgency } from '@/lib/server-actions/queries/agency-queries'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from '@/components/ui/command'
import { PlusCircleIcon, TrashIcon, X } from 'lucide-react'
import TagComponent from './tag-component'

interface ITagCreator {
  subAccountId: string
  getSelectedTags: (tags: Tag[]) => void
  defaultTags?: Tag[]
}

const TagColors = ['BLUE', 'ORANGE', 'ROSE', 'PURPLE', 'GREEN'] as const
export type TagColor = (typeof TagColors)[number]

function TagCreator({ getSelectedTags, subAccountId, defaultTags }: ITagCreator) {
  const { toast } = useToast()
  const router = useRouter()
  const [selectedTags, setSelectedTags] = useState<Tag[]>(defaultTags || [])
  const [tags, setTags] = useState<Tag[]>([])
  const [value, setValue] = useState('')
  const [selectedColor, setSelectedColor] = useState('')

  useEffect(() => {
    getSelectedTags(selectedTags)
  }, [getSelectedTags, selectedTags])

  useEffect(() => {
    if (subAccountId) {
      const fetchData = async () => {
        const response = await getTagsFromSubaccount(subAccountId)
        if (response) setTags(response.Tags)
      }
      fetchData()
    }
  }, [subAccountId])

  /** handle add selections */
  const handleAddSelections = (tag: Tag) => {
    if (selectedTags.every((t) => t.id !== tag.id)) {
      setSelectedTags([...selectedTags, tag])
    }
  }

  /** handle delete selection */
  const handleDeleteSelection = (tagId: string) => {
    setSelectedTags(selectedTags.filter((tag) => tag.id !== tagId))
  }

  /** handle add tag */
  const handleAddTag = async () => {
    if (!value) {
      toast({
        variant: 'destructive',
        title: 'Tags need to have a name',
      })
      return
    }
    if (!selectedColor) {
      toast({
        variant: 'destructive',
        title: 'Please Select a color',
      })
      return
    }
    const tagData: Tag = {
      color: selectedColor,
      createdAt: new Date(),
      id: generateObjectId(),
      name: value,
      subAccountId,
      updatedAt: new Date(),
      ticketId: '',
    }

    setTags([...tags, tagData])
    setValue('')
    setSelectedColor('')

    try {
      const response = await upsertTag(subAccountId, tagData)
      toast({
        title: 'Created the tag',
      })
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a tag | ${response?.name}`,
        subAccountId: subAccountId,
      })
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not create tag',
      })
    }
  }

  /** handle delete tag */
  const handleDeleteTag = async (tagId: string) => {
    setTags(tags.filter((tag) => tag.id !== tagId))
    try {
      const response = await deleteAgency(tagId)
      toast({
        title: 'Deleted tag',
        description: 'The tag is deleted from your subaccount.',
      })

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Deleted a tag | ${response?.name}`,
        subAccountId: subAccountId,
      })
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Could not delete tag',
      })
    }
  }

  return (
    <AlertDialog>
      <Command className='bg-transparent'>
        {!!selectedTags.length && (
          <div className='flex flex-wrap gap-2 rounded-md border-2 border-border bg-background p-2'>
            {selectedTags.map((tag) => (
              <div key={tag.id} className='flex items-center'>
                <TagComponent title={tag.name} colorName={tag.color} />
                <X
                  size={14}
                  className='cursor-pointer text-muted-foreground'
                  onClick={() => handleDeleteSelection(tag.id)}
                />
              </div>
            ))}
          </div>
        )}
        <div className='my-2 flex items-center gap-2'>
          {TagColors.map((colorName) => (
            <TagComponent key={colorName} selectedColor={setSelectedColor} title='' colorName={colorName} />
          ))}
        </div>
        <div className='relative'>
          <CommandInput placeholder='Search for tag...' value={value} onValueChange={setValue} />
          <PlusCircleIcon
            onClick={handleAddTag}
            size={20}
            className='absolute right-2 top-1/2 -translate-y-1/2 transform cursor-pointer text-muted-foreground transition-all hover:text-primary'
          />
        </div>
        <CommandList>
          <CommandSeparator />
          <CommandGroup heading='Tags'>
            {tags.map((tag) => (
              <CommandItem
                key={tag.id}
                className='flex cursor-pointer items-center justify-between !bg-transparent !font-light hover:!bg-secondary'
              >
                <div onClick={() => handleAddSelections(tag)}>
                  <TagComponent title={tag.name} colorName={tag.color} />
                </div>

                <AlertDialogTrigger>
                  <TrashIcon
                    size={16}
                    className='cursor-pointer text-muted-foreground transition-all hover:text-rose-400'
                  />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle className='text-left'>Are you absolutely sure?</AlertDialogTitle>
                    <AlertDialogDescription className='text-left'>
                      This action cannot be undone. This will permanently delete your the tag and remove it from our
                      servers.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter className='items-center'>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction className='bg-destructive' onClick={() => handleDeleteTag(tag.id)}>
                      Delete Tag
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </CommandItem>
            ))}
          </CommandGroup>
          <CommandEmpty>No results found.</CommandEmpty>
        </CommandList>
      </Command>
    </AlertDialog>
  )
}

export default TagCreator
