'use client'

import FileUpload from '@/components/atoms/file-upload'
import { CustomLoader } from '@/components/molecules/loader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Separator } from '@/components/ui/separator'
import { Switch } from '@/components/ui/switch'
import { useToast } from '@/components/ui/use-toast'
import { UserDataSchema } from '@/dto/forms/agency-forms'
import { AuthUserWithAgencySidebarOptionsAndSubAccounts, UserWithPermissionsAndSubAccounts } from '@/dto/types/agency'
import { saveActivityLogsNotification } from '@/lib/server-actions/queries/noti-queries'
import {
  changeUserPermissions,
  getAuthUserDetails,
  getUserPermissions,
  updateUser,
} from '@/lib/server-actions/queries/subaccount-queries'
import { generateObjectId } from '@/lib/utils'
import { useModal } from '@/providers/modal-provider'
import { zodResolver } from '@hookform/resolvers/zod'
import { SubAccount, User } from '@prisma/client'
import { access } from 'fs'
import { useRouter } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

interface IUserDetailsForm {
  id: string | null
  type: 'agency' | 'subaccount'
  userData?: Partial<User>
  subAccounts?: SubAccount[]
}

/**
 * User Details Form
 */
function UserDetailsForm({ id, type, subAccounts, userData }: IUserDetailsForm) {
  const router = useRouter()
  const { data, setClose } = useModal()
  const [subAccountPermissions, setSubAccountPermissions] = useState<UserWithPermissionsAndSubAccounts | null>(null)
  const [roleState, setRoleState] = useState('')
  const [loadingPermissions, setLoadingPermissions] = useState(false)
  const [authUserData, setAuthUserData] = useState<AuthUserWithAgencySidebarOptionsAndSubAccounts | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    if (data.user) {
      const fetchUserDetails = async () => {
        const response = await getAuthUserDetails()
        if (response) setAuthUserData(response)
      }
      fetchUserDetails()
    }
  }, [data])

  const form = useForm<z.infer<typeof UserDataSchema>>({
    resolver: zodResolver(UserDataSchema),
    mode: 'onChange',
    defaultValues: {
      name: userData ? userData.name : data?.user?.name,
      email: userData ? userData.email : data?.user?.email,
      avatarUrl: userData ? userData.avatarUrl : data?.user?.avatarUrl,
      role: userData ? userData.role : data?.user?.role,
    },
  })

  useEffect(() => {
    if (!data.user) return
    const getPermissions = async () => {
      if (!data.user) return
      const permission = await getUserPermissions(data.user.id)
      setSubAccountPermissions(permission)
    }
    getPermissions()
  }, [data, form])

  useEffect(() => {
    if (data.user) {
      form.reset(data.user)
    }
    if (userData) {
      form.reset(userData)
    }
  }, [userData, data, form])

  const onSubmit = async (values: z.infer<typeof UserDataSchema>) => {
    if (!id) return
    if (userData || data?.user) {
      const updatedUser = await updateUser(values)
      authUserData?.Agency?.SubAccount.filter((subacc) => {
        authUserData.Permissions.find((p) => p.subAccountId === subacc.id && p.access)
      }).forEach(async (subaaccount) => {
        await saveActivityLogsNotification({
          agencyId: undefined,
          description: `Updated ${userData?.name} description`,
          subAccountId: subaaccount.id,
        })
      })

      if (updatedUser) {
        toast({
          title: 'Success',
          description: 'Update User Information',
        })
        setClose()
        router.refresh()
      }
    }
  }

  const onChangePermission = async (subAccountId: string, val: boolean, permissionsId: string | undefined) => {
    if (!data.user?.email) return
    setLoadingPermissions(true)
    const response = await changeUserPermissions(
      permissionsId ? permissionsId : generateObjectId(),
      data.user.email,
      subAccountId,
      val,
    )
    if (type === 'agency') {
      await saveActivityLogsNotification({
        agencyId: authUserData?.Agency?.id,
        description: `Gave ${userData?.name} access to | ${
          subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.name
        } `,
        subAccountId: subAccountPermissions?.Permissions.find((p) => p.subAccountId === subAccountId)?.SubAccount.id,
      })
    }

    if (response) {
      toast({
        title: 'Success',
        description: 'The request was successful!',
      })
      if (subAccountPermissions) {
        subAccountPermissions.Permissions.find((perm) => {
          if (perm.subAccountId == subAccountId) {
            return {
              ...perm,
              access: !perm.access,
            }
          }
        })
      }
    } else {
      toast({
        variant: 'destructive',
        title: 'Failed',
        description: 'Could not update permissions',
      })
    }
    router.refresh()
    setLoadingPermissions(false)
  }

  return (
    <Card className='w-full'>
      <CardHeader>
        <CardTitle>User Details</CardTitle>
        <CardDescription>Add or update your information</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='avatarUrl'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Profile picture</FormLabel>
                  <FormControl>
                    <FileUpload apiEndpoint='avatar' value={field.value} onChange={field.onChange} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>User full name</FormLabel>
                  <FormControl>
                    <Input required placeholder='Full Name' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='email'
              render={({ field }) => (
                <FormItem className='flex-1'>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input
                      readOnly={userData?.role === 'AGENCY_OWNER' || form.formState.isSubmitting}
                      placeholder='Email'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              disabled={form.formState.isSubmitting}
              control={form.control}
              name='role'
              render={({ field }) => {
                return (
                  <FormItem className='flex-1'>
                    <FormLabel>User Role</FormLabel>
                    <Select
                      disabled={field.value === 'AGENCY_OWNER'}
                      onValueChange={(value) => {
                        if (value === 'SUBACCOUNT_USER' || value === 'SUBACCOUNT_GUEST') {
                          setRoleState('You need to have subaccounts to assign Subaccount access to team members.')
                        } else {
                          setRoleState('')
                        }
                        field.onChange(value)
                      }}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder='Select user role...' />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value='AGENCY_ADMING'>Agency Admin</SelectItem>
                        {(data?.user?.role === 'AGENCY_OWNER' || userData?.role === 'AGENCY_OWNER') && (
                          <SelectItem value='AGENCY_OWNER'>Agency Owner</SelectItem>
                        )}
                        <SelectItem value='SUBACCOUNT_USER'>Sub Account User</SelectItem>
                        <SelectItem value='SUBACCOUNT_GUEST'>Sub Account Guest</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className='text-muted-foreground'>{roleState}</p>
                  </FormItem>
                )
              }}
            />

            <Button disabled={form.formState.isSubmitting} type='submit'>
              {form.formState.isSubmitting ? <CustomLoader /> : 'Save User Details'}
            </Button>

            {/* Agency Owner Permission */}
            {authUserData?.role == 'AGENCY_OWNER' && (
              <div>
                <Separator className='my-4' />
                <FormLabel> User Permissions</FormLabel>
                <FormDescription className='mb-4'>
                  You can give Sub Account access to team member by turning on access control for each Sub Account. This
                  is only visible to agency owners
                </FormDescription>
                <div className='flex flex-col gap-4'>
                  {subAccounts?.map((sub) => {
                    const subAccountPermissionsDetails = subAccountPermissions?.Permissions.find(
                      (p) => p.subAccountId == sub.id,
                    )

                    return (
                      <div key={sub.id} className='flex items-center justify-between rounded-lg border p-4'>
                        <div>
                          <p>{sub.name}</p>
                        </div>
                        <Switch
                          disabled={loadingPermissions}
                          checked={subAccountPermissionsDetails?.access}
                          onCheckedChange={(permission) => {
                            onChangePermission(sub.id, permission, subAccountPermissionsDetails?.id)
                          }}
                        />
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default UserDetailsForm
