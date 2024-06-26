'use client'

import React, { useEffect } from 'react'
import { Pipeline } from '@prisma/client'
import { useModal } from '@/providers/modal-provider'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { CreatePipelineFormSchema } from '@/dto/forms/ticket-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { createPipeline } from '@/lib/server-actions/queries/ticket-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

interface ICreatePipelineForm {
  defaultData?: Pipeline
  subAccountId: string
}

function CreatePipelineForm({ defaultData, subAccountId }: ICreatePipelineForm) {
  const router = useRouter()
  const { toast } = useToast()
  const { setClose } = useModal()
  const form = useForm<z.infer<typeof CreatePipelineFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(CreatePipelineFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
    },
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData?.name || '',
      })
    }
  }, [defaultData, form])

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof CreatePipelineFormSchema>) => {
    if (!subAccountId) return
    try {
      const response = await createPipeline({
        ...values,
        subAccountId: subAccountId,
      })

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updates a pipeline | ${response?.name}`,
        subAccountId: subAccountId,
      })

      toast({
        title: 'Success',
        description: 'Saved pipeline details',
      })
      setClose()
      router.refresh()
    } catch (error) {
      toast({
        variant: 'destructive',
        title: 'Opp!',
        description: 'Could not save pipeline details',
      })
    }
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Pipeline Details</CardTitle>
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
                  <FormLabel>Pipeline Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
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

export default CreatePipelineForm
