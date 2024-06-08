'use client'

import React, { useEffect } from 'react'
import { useToast } from '@/components/ui/use-toast'
import { useModal } from '@/providers/modal-provider'
import { Agency, SubAccount } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { SubAccountFormSchema } from '@/dto/forms/agency-forms'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import FileUpload from '@/components/atoms/file-upload'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

interface ISubAccountDetailsForm {
  agencyDetails: Agency
  details?: Partial<SubAccount>
  userId: string
  userName: string
}

function SubAccountDetailsForm({ details, agencyDetails, userId, userName }: ISubAccountDetailsForm) {
  const { toast } = useToast()
  const { setClose } = useModal()
  const router = useRouter()
  const form = useForm<z.infer<typeof SubAccountFormSchema>>({
    resolver: zodResolver(SubAccountFormSchema),
    defaultValues: {
      name: details?.name,
      companyEmail: details?.companyEmail,
      companyPhone: details?.companyPhone,
      address: details?.address,
      city: details?.city,
      zipCode: details?.zipCode,
      state: details?.state,
      country: details?.country,
      subAccountLogo: details?.subAccountLogo,
    },
  })

  useEffect(() => {
    if (details) {
      form.reset(details)
    }
  }, [details, form])

  const onSubmit = async (values: z.infer<typeof SubAccountFormSchema>) => {
    try {
    } catch (error) {
      console.log('sub account save error: ', error)
      toast({
        variant: 'destructive',
        title: 'Opps!',
        description: 'Cannot save sub account details',
      })
    }
  }

  const isLoading = form.formState.isSubmitting

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle className='text-lg'>Sub Account Information</CardTitle>
        <CardDescription className='text-sm'>Please enter business details</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='subAccountLogo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Account Logo</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint='subaccountLogo' value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className='flex gap-4 md:flex-row'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='name'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Account Name</FormLabel>
                    <FormControl>
                      <Input required placeholder='Your agency name' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                disabled={isLoading}
                control={form.control}
                name='companyEmail'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Acount Email</FormLabel>
                    <FormControl>
                      <Input placeholder='Email' {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className='flex gap-4 md:flex-row'>
              <FormField
                disabled={isLoading}
                control={form.control}
                name='companyPhone'
                render={({ field }) => (
                  <FormItem className='flex-1'>
                    <FormLabel>Acount Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder='Phone' required {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              disabled={isLoading}
              control={form.control}
              name='address'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input required placeholder='123 st...' {...field} />
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
                      <Input required placeholder='City' {...field} />
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
                      <Input required placeholder='State' {...field} />
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
                      <Input required placeholder='Zipcode' {...field} />
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
                    <Input required placeholder='Country' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type='submit' disabled={isLoading}>
              {isLoading ? <CustomLoader /> : 'Save Account Information'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default SubAccountDetailsForm
