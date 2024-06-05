'use client'

import { AlertDialog } from '@/components/ui/alert-dialog'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { useToast } from '@/components/ui/use-toast'
import { AgencyDetailFormSchema } from '@/dto/forms/agency-details-form'
import { Agency } from '@prisma/client'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { Form, FormField, FormItem, FormLabel } from '@/components/ui/form'

interface IAgencyDetails {
  data?: Partial<Agency>
}

function AgencyDetails({ data }: IAgencyDetails) {
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

  const handleSubmit = async () => {}

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
                    </FormItem>
                  )
                }}
              />
            </form>
          </Form>
        </CardContent>
      </Card>
    </AlertDialog>
  )
}

export default AgencyDetails
