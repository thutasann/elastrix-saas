'use client'

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
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AgencyDetailFormSchema } from '@/dto/forms/agency-forms'
import { Agency } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import FileUpload from '@/components/atoms/file-upload'
import { Input } from '@/components/ui/input'
import { Switch } from '@/components/ui/switch'
import { NumberInput } from '@tremor/react'
import {
  deleteAgency,
  initUser,
  updateAgencyDetails,
  createAgency,
  upsertAgency,
} from '@/lib/server-actions/queries/agency-queries'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'
import { generateObjectId } from '@/lib/utils'

interface IAgencyDetails {
  /** agency data */
  data?: Partial<Agency>
  /** check form is create form or edit form  */
  update?: boolean
}

/**
 * Agency Details Form
 */
function AgencyDetails({ data, update }: IAgencyDetails) {
  const { toast } = useToast()
  const router = useRouter()
  const [deletingAgency, setDeletingAgency] = useState(false)

  const form = useForm<z.infer<typeof AgencyDetailFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(AgencyDetailFormSchema),
    defaultValues: {
      name: data?.name,
      companyEmail: data?.companyEmail,
      companyPhone: data?.companyPhone,
      whiteLabel: data?.whiteLabel || false,
      address: data?.address,
      city: data?.city,
      zipCode: data?.zipCode,
      state: data?.state,
      country: data?.country,
      agencyLogo: data?.agencyLogo,
    },
  })
  const isLoading = form.formState.isSubmitting

  useEffect(() => {
    if (data) {
      form.reset(data)
    }
  }, [data, form])

  const handleSubmit = async (values: z.infer<typeof AgencyDetailFormSchema>) => {
    try {
      let newUserData
      let custId: string = ''

      if (!data?.id) {
        const bodyData = {
          email: values.companyEmail,
          name: values.name,
          shipping: {
            address: {
              city: values.city,
              country: values.country,
              line1: values.address,
              postal_code: values.zipCode,
              state: values.zipCode,
            },
            name: values.name,
          },
          address: {
            city: values.city,
            country: values.country,
            line1: values.address,
            postal_code: values.zipCode,
            state: values.zipCode,
          },
        }

        const customerResponse = await fetch(`/api/stripe/create-customer`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bodyData),
        })

        const customerData: { customerId: string } = await customerResponse.json()
        console.log('stripe customerData', customerData)
        custId = customerData.customerId
      }

      newUserData = await initUser({ role: 'AGENCY_OWNER' })
      if (!data?.customerId && !custId) return

      let response
      const payload = update
        ? ({
            customerId: data?.customerId || custId || '',
            address: values.address,
            agencyLogo: values.agencyLogo,
            city: values.city,
            companyPhone: values.companyPhone,
            country: values.country,
            name: values.name,
            state: values.state,
            whiteLabel: values.whiteLabel,
            zipCode: values.zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
            companyEmail: values.companyEmail,
            connectAccountId: '',
            goal: 5,
          } as Agency)
        : ({
            id: data?.id ? data.id : generateObjectId(),
            customerId: data?.customerId || custId || '',
            address: values.address,
            agencyLogo: values.agencyLogo,
            city: values.city,
            companyPhone: values.companyPhone,
            country: values.country,
            name: values.name,
            state: values.state,
            whiteLabel: values.whiteLabel,
            zipCode: values.zipCode,
            createdAt: new Date(),
            updatedAt: new Date(),
            companyEmail: values.companyEmail,
            connectAccountId: '',
            goal: 5,
          } as Agency)

      if (update) {
        response = await upsertAgency(payload, data?.id!)
      } else {
        response = await createAgency(payload)
      }

      toast({
        variant: response ? 'default' : 'destructive',
        title: !response ? "Can't save agency info" : 'Saved Agency',
      })

      if (data?.id) return router.refresh()

      if (response) {
        return router.refresh()
      }
    } catch (error) {
      console.log('create agency error: ', error)
      toast({
        variant: 'destructive',
        title: 'Oppse!',
        description: 'could not create your agency',
      })
    }
  }

  const handleDeleteAgency = async () => {
    if (!data?.id) return
    setDeletingAgency(true)
    try {
      const response = await deleteAgency(data.id)
      toast({
        title: 'Deleted agency',
        description: 'Deleted your agency and all subaccounts',
      })
      router.refresh()
    } catch (error) {
      console.error('agency delete error : ', error)
      toast({
        title: 'Opps!',
        description: 'Could not delete your agency',
        variant: 'destructive',
      })
    }
    setDeletingAgency(false)
  }

  return (
    <AlertDialog>
      <Card className='w-full'>
        <CardHeader>
          <CardTitle>Agency Information</CardTitle>
          <CardDescription>
            Lets create an agency for you business. You can edit agency settings later from the agency settings tab.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className='space-y-4'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='agencyLogo'
                render={({ field }) => {
                  return (
                    <FormItem>
                      <FormLabel>Agency Logo</FormLabel>
                      <FormControl>
                        <FileUpload apiEndpoint='agencyLogo' onChange={field.onChange} value={field.value} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <div className='flex gap-4 md:flex-row'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='name'
                  render={({ field }) => {
                    return (
                      <FormItem className='flex-1'>
                        <FormLabel>Agency Name</FormLabel>
                        <FormControl>
                          <Input placeholder='Your agency name' {...field} />
                        </FormControl>
                      </FormItem>
                    )
                  }}
                />
              </div>
              <div className='flex gap-4 md:flex-row'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='companyPhone'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Agency Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder='Phone' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                disabled={isLoading}
                control={form.control}
                name='whiteLabel'
                render={({ field }) => {
                  return (
                    <FormItem className='flex flex-row items-center justify-between gap-4 rounded-lg border p-4'>
                      <div>
                        <FormLabel>Whitelabel Agency</FormLabel>
                        <FormDescription>
                          Turning on whilelabel mode will show your agency logo to all sub accounts by default. You can
                          overwrite this functionality through sub account settings.
                        </FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )
                }}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='address'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder='123 st...' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <div className='flex gap-4 md:flex-row'>
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='city'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>City</FormLabel>
                      <FormControl>
                        <Input placeholder='City' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='state'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>State</FormLabel>
                      <FormControl>
                        <Input placeholder='State' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  disabled={isLoading}
                  control={form.control}
                  name='zipCode'
                  render={({ field }) => (
                    <FormItem className='flex-1'>
                      <FormLabel>Zipcpde</FormLabel>
                      <FormControl>
                        <Input placeholder='Zipcode' {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='country'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Country</FormLabel>
                    <FormControl>
                      <Input placeholder='Country' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {data?.id && (
                <div className='flex flex-col gap-2'>
                  <FormLabel>Create A Goal</FormLabel>
                  <FormDescription>
                    ✨ Create a goal for your agency. As your business grows your goals grow too so dont forget to set
                    the bar higher!
                  </FormDescription>
                  <NumberInput
                    defaultValue={data?.goal}
                    onValueChange={async (val) => {
                      if (!data?.id) return
                      await updateAgencyDetails(data.id, { goal: val })
                      await saveActivityLogsNotification({
                        agencyId: data.id,
                        description: `Updated the agency goal to | ${val} Sub Account`,
                        subAccountId: undefined,
                      })
                      router.refresh()
                    }}
                    min={1}
                    className='!border !border-input bg-background'
                    placeholder='Sub Account Goal'
                  />
                </div>
              )}
              <Button type='submit' disabled={isLoading}>
                {isLoading ? <CustomLoader /> : 'Save Agency Information'}
              </Button>
            </form>
          </Form>
          {data?.id && (
            <div className='mt-4 flex flex-row items-center justify-between gap-4 rounded-lg border border-destructive p-4'>
              <div className='font-bold text-slate-200'>
                <div>Danger Zone</div>
              </div>
              <div className='text-muted-foreground'>
                Deleting your agency cannot be undone. This will also delete all sub accounts and all data related to
                your sub accounts. Sub accounts will no longer have access to funnels, contacts etc.
              </div>
              <AlertDialogTrigger
                disabled={isLoading || deletingAgency}
                className='hove:bg-red-600 mt-2 whitespace-nowrap rounded-md p-2 text-center text-red-600 hover:text-white'
              >
                {deletingAgency ? 'Deleting' : 'Delete Agency'}
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle className='text-left'>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription className='text-left'>
                    This action cannot be undone. This will permanently delete the Agency account and all related sub
                    accounts.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex items-center'>
                  <AlertDialogCancel className='mb-2'>Cancel</AlertDialogCancel>
                  <AlertDialogAction
                    disabled={deletingAgency}
                    className='bg-destructive hover:bg-destructive'
                    onClick={handleDeleteAgency}
                  >
                    Delete
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </div>
          )}
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
