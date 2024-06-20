'use client'

import React, { useEffect } from 'react'
import { useModal } from '@/providers/modal-provider'
import { Funnel } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreateFunnelFormSchema } from '@/dto/forms/ticket-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { createFunnel, upsertFunnel } from '@/lib/server-actions/queries/funnel-queries'
import { generateObjectId } from '@/lib/utils'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import FileUpload from '@/components/atoms/file-upload'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

interface IFunnelForm {
  defaultData?: Funnel
  subAccountId: string
}

function FunnelForm({ defaultData, subAccountId }: IFunnelForm) {
  console.log('defaultData', defaultData)
  const { setClose } = useModal()
  const { toast } = useToast()
  const router = useRouter()
  const form = useForm<z.infer<typeof CreateFunnelFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreateFunnelFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
      description: defaultData?.description || '',
      favicon: defaultData?.favicon || '',
      subDomainName: defaultData?.subDomainName || '',
    },
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        description: defaultData.description || '',
        favicon: defaultData.favicon || '',
        name: defaultData.name || '',
        subDomainName: defaultData.subDomainName || '',
      })
    }
  }, [defaultData, form])

  const onSubmit = async (values: z.infer<typeof CreateFunnelFormSchema>) => {
    if (!subAccountId) return

    const response = !defaultData
      ? // @ts-ignore
        await createFunnel(subAccountId, { ...values, liveProducts: defaultData?.liveProducts || '[]' })
      : await upsertFunnel(subAccountId, { ...values, liveProducts: defaultData?.liveProducts || '[]' }, defaultData.id)

    await saveActivityLogsNotification({
      agencyId: undefined,
      description: `Update funnel | ${response.name}`,
      subAccountId: subAccountId,
    })
    if (response)
      toast({
        title: 'Success',
        description: 'Saved funnel details',
      })
    else
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could not save funnel details',
      })
    setClose()
    router.refresh()
  }

  const isLoading = form.formState.isLoading

  return (
    <Card className='flex-1'>
      <CardHeader>
        <CardTitle>Funnel Details</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-4'>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Funnel Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder='Tell us a little bit more about this funnel.' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='subDomainName'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Sub domain</FormLabel>
                  <FormControl>
                    <Input placeholder='Sub domain for funnel' {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              disabled={isLoading}
              control={form.control}
              name='favicon'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Favicon</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint='subaccountLogo' value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4 w-20' disabled={isLoading} type='submit'>
              {form.formState.isSubmitting ? <CustomLoader /> : 'Save'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FunnelForm
