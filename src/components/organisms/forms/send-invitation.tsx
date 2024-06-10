'use client'

import React from 'react'
import { useToast } from '@/components/ui/use-toast'
import { InvitationUserDataSchema } from '@/dto/forms/agency-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { sendInvitation } from '@/lib/server-actions/queries/agency-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

interface ISendInvitation {
  agencyId: string
}

function SendInvitation({ agencyId }: ISendInvitation) {
  const { toast } = useToast()
  const form = useForm<z.infer<typeof InvitationUserDataSchema>>({
    resolver: zodResolver(InvitationUserDataSchema),
    mode: 'onChange',
    defaultValues: {
      email: '',
      role: 'SUBACCOUNT_USER',
    },
  })

  const onSubmit = async (values: z.infer<typeof InvitationUserDataSchema>) => {
    try {
      const res = await sendInvitation(values.role, values.email, agencyId)
      await saveActivityLogsNotification({
        agencyId,
        description: `Invited ${res.email}`,
        subAccountId: undefined,
      })
      toast({
        title: 'Success',
        description: 'Created and sent invitation',
      })
    } catch (error) {
      console.log('send invitation error : ', error)
      toast({
        variant: 'destructive',
        title: 'Opps!',
        description: 'Could not send invitation!',
      })
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Invitation</CardTitle>
        <CardDescription>
          An invitation will be sent to the user. Users who already have an invitation sent out to their email, will not
          receive another invitation.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='role'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>User role</FormLabel>
                  <Select onValueChange={(value) => field.onChange(value)} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder='Select user role...' />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value='AGENCY_ADMIN'>Agency Admin</SelectItem>
                      <SelectItem value='SUBACCOUNT_USER'>Sub Account User</SelectItem>
                      <SelectItem value='SUBACCOUNT_GUEST'>Sub Account Guest</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button disabled={form.formState.isSubmitting} type='submit'>
              {form.formState.isSubmitting ? <CustomLoader /> : 'Send Invitation'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SendInvitation
