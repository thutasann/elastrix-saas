'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { TicketFormSchema } from '@/dto/forms/ticket-forms'
import { TicketWithTags } from '@/dto/types/ticket'
import { getSubAccountWithTeamMembers, searchContacts } from '@/lib/server-actions/queries/subaccount-queries'
import { useModal } from '@/providers/modal-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { Contact, Tag, User } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import TagCreator from '../sub-account/tag-creator'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { CheckIcon, ChevronsUpDownIcon, User2 } from 'lucide-react'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command'
import { cn } from '@/lib/utils'
import { CustomLoader } from '@/components/molecules/loader'
import { useToast } from '@/components/ui/use-toast'
import { createTicket, updateTicket } from '@/lib/server-actions/queries/ticket-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'

interface ITicketForm {
  laneId: string
  subaccountId: string
  getNewTicket: (ticket: TicketWithTags[0]) => void
}

function TicketForm({ laneId, subaccountId, getNewTicket }: ITicketForm) {
  const { data: defaultData, setClose } = useModal()
  const router = useRouter()
  const { toast } = useToast()
  const [tags, setTags] = useState<Tag[]>([])
  const [contact, setContact] = useState('')
  const [search, setSearch] = useState('')
  const [contactList, setContactList] = useState<Contact[]>([])
  const [allTeamMembers, setAllTeamMembers] = useState<User[]>([])
  const [assignedTo, setAssignedTo] = useState(defaultData.ticket?.Assigned?.id || '')
  const saveTimerRef = useRef<ReturnType<typeof setTimeout>>()

  const form = useForm<z.infer<typeof TicketFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(TicketFormSchema),
    defaultValues: {
      name: defaultData?.ticket?.name || '',
      description: defaultData.ticket?.description || '',
      value: String(defaultData.ticket?.value || 0),
    },
  })

  useEffect(() => {
    if (subaccountId) {
      const fetchData = async () => {
        const response = await getSubAccountWithTeamMembers(subaccountId)
        if (response) setAllTeamMembers(response)
      }
      fetchData()
    }
  }, [subaccountId])

  useEffect(() => {
    if (defaultData.ticket) {
      form.reset({
        name: defaultData.ticket.name || '',
        description: defaultData.ticket?.description || '',
        value: String(defaultData.ticket?.value || 0),
      })
      if (defaultData.ticket.customerId) {
        setContact(defaultData.ticket.customerId)
      }

      const fetchData = async () => {
        const response = await searchContacts(defaultData?.ticket?.Customer?.name || '')
        setContactList(response)
      }
      fetchData()
    }
  }, [defaultData, form])

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof TicketFormSchema>) => {
    if (!laneId) return
    try {
      let response
      if (defaultData?.ticket?.id) {
        response = await updateTicket(
          {
            ...values,
            laneId,
            assignedUserId: assignedTo,
            ...(contact ? { customerId: contact } : {}),
          },
          tags,
          defaultData?.ticket?.id,
        )
      } else {
        response = await createTicket(
          {
            ...values,
            laneId,
            assignedUserId: assignedTo,
            ...(contact ? { customerId: contact } : {}),
          },
          tags,
        )
      }

      toast({
        title: 'Success',
        description: 'Ticket saved!',
      })
      setClose()
      if (response) {
        getNewTicket(response)
      } else {
        toast({
          variant: 'destructive',
          title: 'Oppse!',
          description: 'Could not save ticket details',
        })
      }
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save ticket details',
      })
    }
    router.refresh()
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Ticket Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            {/* Ticket Info */}
            <div className='space-y-4'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Name</FormLabel>
                    <FormControl>
                      <Input placeholder='Name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='description'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea placeholder='Description' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='value'
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ticket Value</FormLabel>
                    <FormControl>
                      <Input placeholder='Value' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Tags */}
            <h3>Add tags</h3>
            <TagCreator
              subAccountId={subaccountId}
              getSelectedTags={setTags}
              defaultTags={defaultData?.ticket?.Tags || []}
            />

            {/* Assgin Team Mmebers */}
            <FormLabel>Assigned To Team Member</FormLabel>
            <Select onValueChange={setAssignedTo} defaultValue={assignedTo}>
              <SelectTrigger>
                <SelectValue
                  placeholder={
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage alt='contact' />
                        <AvatarFallback className='bg-primary text-sm text-white'>
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className='text-sm text-muted-foreground'>Not Assigned</span>
                    </div>
                  }
                />
              </SelectTrigger>
              <SelectContent>
                {allTeamMembers.map((teamMember) => (
                  <SelectItem key={teamMember.id} value={teamMember.id}>
                    <div className='flex items-center gap-2'>
                      <Avatar className='h-8 w-8'>
                        <AvatarImage alt='contact' src={teamMember.avatarUrl} />
                        <AvatarFallback className='bg-primary text-sm text-white'>
                          <User2 size={14} />
                        </AvatarFallback>
                      </Avatar>

                      <span className='text-sm text-muted-foreground'>{teamMember.name}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {/* Customer */}
            <FormLabel>Customer</FormLabel>
            <Popover>
              <PopoverTrigger asChild className='w-full'>
                <Button variant='outline' role='combobox' className='justify-between'>
                  {contact ? contactList.find((c) => c.id === contact)?.name : 'Select Customer...'}
                  <ChevronsUpDownIcon className='ml-2 h-4 w-4 shrink-0 opacity-50' />
                </Button>
              </PopoverTrigger>
              <PopoverContent className='w-[400px] p-2'>
                <Command>
                  <CommandInput
                    placeholder='Search...'
                    className='h-9'
                    value={search}
                    onChangeCapture={async (value) => {
                      //@ts-ignore
                      setSearch(value.target.value)
                      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
                      saveTimerRef.current = setTimeout(async () => {
                        const response = await searchContacts(
                          //@ts-ignore
                          value.target.value,
                        )
                        setContactList(response)
                        setSearch('')
                      }, 1000)
                    }}
                  />
                  <CommandEmpty>No Customer found.</CommandEmpty>
                  <CommandGroup>
                    {contactList.map((c) => (
                      <CommandItem
                        key={c.id}
                        value={c.id}
                        onSelect={(currentValue) => {
                          setContact(currentValue === contact ? '' : currentValue)
                        }}
                      >
                        {c.name}
                        <CheckIcon className={cn('ml-auto h-4 w-4', contact === c.id ? 'opacity-100' : 'opacity-0')} />
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </Command>
              </PopoverContent>
              <Button className='mt-4 w-20' disabled={isLoading} type='submit'>
                {form.formState.isSubmitting ? <CustomLoader /> : 'Save'}
              </Button>
            </Popover>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default TicketForm
