'use client'

import React, { useEffect } from 'react'
import { useModal } from '@/providers/modal-provider'
import { Lane } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { LaneFormSchema } from '@/dto/forms/ticket-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { useToast } from '@/components/ui/use-toast'
import { upsertLane, getPipelineDetails } from '@/lib/server-actions/queries/ticket-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

interface ICreateLaneForm {
  defaultData?: Lane
  pipelineId: string
}

/**
 * Create Lane Form
 */
function CreateLaneForm({ defaultData, pipelineId }: ICreateLaneForm) {
  const { setClose } = useModal()
  const { toast } = useToast()
  const router = useRouter()

  const form = useForm<z.infer<typeof LaneFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(LaneFormSchema),
    defaultValues: {
      name: defaultData?.name || '',
    },
  })

  useEffect(() => {
    if (defaultData) {
      form.reset({
        name: defaultData.name || '',
      })
    }
  }, [defaultData, form])

  const isLoading = form.formState.isLoading

  const onSubmit = async (values: z.infer<typeof LaneFormSchema>) => {
    if (!pipelineId) return
    try {
      const response = await upsertLane({
        ...values,
        id: defaultData?.id,
        pipelineId: pipelineId,
        order: defaultData?.order,
      })

      const pipelineDetail = await getPipelineDetails(pipelineId)
      if (!pipelineDetail) return

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a lane | ${response?.name}`,
        subAccountId: pipelineDetail.subAccountId,
      })

      toast({
        title: 'Success',
        description: 'Saved pipeline details',
      })
      router.refresh()
    } catch (error) {
      console.log('create lane error ', error)
      toast({
        variant: 'destructive',
        title: 'Opp!',
        description: 'Could not save pipeline details',
      })
    }
    setClose()
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>Lane Details</CardTitle>
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
                  <FormLabel>Lane Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Lane Name' {...field} />
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

export default CreateLaneForm
