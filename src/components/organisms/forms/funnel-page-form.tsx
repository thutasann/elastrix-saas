'ues client'

import React, { useEffect } from 'react'
import { FunnelPage } from '@prisma/client'
import { useToast } from '@/components/ui/use-toast'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FunnelPageFormSchema } from '@/dto/forms/agency-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'
import { CopyPlusIcon, Trash } from 'lucide-react'
import { createFunnelPage } from '@/lib/server-actions/queries/funnel-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { useModal } from '@/providers/modal-provider'

interface IFunnelPageForm {
  defualtData?: FunnelPage
  subaccountId: string
  funnelId: string
  order: number
}

function FunnelPageForm({ defualtData, subaccountId, funnelId, order }: IFunnelPageForm) {
  const router = useRouter()
  const { toast } = useToast()
  const { setClose } = useModal()

  const form = useForm<z.infer<typeof FunnelPageFormSchema>>({
    resolver: zodResolver(FunnelPageFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      pathName: '',
    },
  })

  useEffect(() => {
    if (defualtData) {
      form.reset({
        name: defualtData.name,
        pathName: defualtData.pathName,
      })
    }
  }, [defualtData, form])

  const onSubmit = async (values: z.infer<typeof FunnelPageFormSchema>) => {
    if (order !== 0 && !values.pathName) {
      return form.setError('pathName', {
        message: "Pages other than the first page in the funnel require a path name example 'secondstep'.",
      })
    }

    try {
      const response = await createFunnelPage(
        subaccountId,
        {
          ...values,
          order: defualtData?.order || order,
          pathName: values.pathName || '',
        },
        funnelId,
      )

      await saveActivityLogsNotification({
        agencyId: undefined,
        description: `Updated a funnel page | ${response?.name}`,
        subAccountId: subaccountId,
      })

      toast({
        title: 'Success',
        description: 'Saves Funnel Page Details',
      })

      router.refresh()
      setClose()
    } catch (error) {
      console.log('funnel page upert error : ', error)
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'Could Save Funnel Page Details',
      })
    }
  }

  const onDelete = async (id: string) => {}

  const onCopy = async () => {}

  return (
    <Card>
      <CardHeader>
        <CardTitle>Funnel Page</CardTitle>
        <CardDescription>
          Funnel pages are flow in the order they are created by default. You can move them around to change their
          order.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col gap-6'>
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting || order === 0}
              control={form.control}
              name='pathName'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Path Name</FormLabel>
                  <FormControl>
                    <Input placeholder='Path for the page' {...field} value={field.value?.toLowerCase()} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex items-center gap-2'>
              <Button className='w-22 self-end' disabled={form.formState.isSubmitting} type='submit'>
                {form.formState.isSubmitting ? <CustomLoader /> : 'Save Page'}
              </Button>

              {/* delete */}
              {defualtData && defualtData?.id && (
                <Button
                  variant={'outline'}
                  className='w-22 self-end border-destructive text-destructive hover:bg-destructive'
                  disabled={form.formState.isSubmitting}
                  onClick={async () => await onDelete(defualtData.id)}
                >
                  {form.formState.isSubmitting ? <CustomLoader /> : <Trash />}
                </Button>
              )}

              {/* copy */}
              {defualtData?.id && (
                <Button
                  variant={'outline'}
                  size={'icon'}
                  disabled={form.formState.isSubmitting}
                  type='button'
                  onClick={async () => await onCopy()}
                >
                  {form.formState.isSubmitting ? <CustomLoader /> : <CopyPlusIcon />}
                </Button>
              )}
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default FunnelPageForm
