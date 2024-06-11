'use client'

import FileUpload from '@/components/atoms/file-upload'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { useToast } from '@/components/ui/use-toast'
import { UploadMediaSchema } from '@/dto/forms/agency-forms'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { createMedia } from '@/lib/server-actions/queries/subaccount-queries'
import { useModal } from '@/providers/modal-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import React from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface IUPloadMediaForm {
  subaccountId: string
}

/**
 * Upload Media Form
 */
function UploadMediaForm({ subaccountId }: IUPloadMediaForm) {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof UploadMediaSchema>>({
    resolver: zodResolver(UploadMediaSchema),
    mode: 'onSubmit',
    defaultValues: {
      link: '',
      name: '',
    },
  })

  const onSubmit = async (values: z.infer<typeof UploadMediaSchema>) => {
    try {
      const response = await createMedia(subaccountId, values)
      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Uploaded a media file | ${response.name}`,
        subAccountId: subaccountId,
      })
      toast({ title: 'Succes', description: 'Uploaded media' })
      setClose()
      router.refresh()
    } catch (error) {
      console.log('create media file error: ', error)
      toast({
        variant: 'destructive',
        title: 'Failed to upload media',
        description: 'Could not upload media',
      })
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Media Information</CardTitle>
        <CardDescription>Please enter the details for your file</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-3'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>File Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Your agency name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='link'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Media File</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint='subaccountLogo' value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' className='mt-4'>
              Upload Media
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UploadMediaForm
