'use client'

import React from 'react'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { ContactUserFormSchema } from '@/dto/forms/agency-forms'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { CustomLoader } from '@/components/molecules/loader'

type IContactForm = {
  title: string
  subTitle: string
  apiCall: (values: z.infer<typeof ContactUserFormSchema>) => any
}

/**
 * Contact Form to be used in Funnel Editor
 */
function ContactForm({ title, subTitle, apiCall }: IContactForm) {
  const form = useForm<z.infer<typeof ContactUserFormSchema>>({
    mode: 'onChange',
    resolver: zodResolver(ContactUserFormSchema),
    defaultValues: {
      name: '',
      email: '',
    },
  })
  const isLoading = form.formState.isLoading

  //CHALLENGE: We want to create tags for each leads that comes from the form

  return (
    <Card className='w-[500px] max-w-[500px]'>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{subTitle}</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(apiCall)} className='flex flex-col gap-4'>
            <FormField
              disabled={isLoading}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
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
              name='email'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type='email' placeholder='Email' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button className='mt-4' disabled={isLoading} type='submit'>
              {form.formState.isSubmitting ? <CustomLoader /> : 'Get a free quote!'}
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default ContactForm
