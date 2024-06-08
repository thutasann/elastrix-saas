'use client'

import { useModal } from '@/providers/modal-provider'
import { Agency, AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React, { useEffect, useMemo, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../../ui/command'
import { Sheet, SheetClose, SheetContent, SheetTrigger } from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { ChevronsUpDown, Compass, Menu, PlusCircleIcon } from 'lucide-react'
import { AspectRatio } from '@/components/ui/aspect-ratio'
import Image from 'next/image'
import clsx from 'clsx'
import Link from 'next/link'
import { icons } from '@/lib/constants'
import CustomModal from '@/components/molecules/modals/cutsom-modal'
import SubAccountDetailsForm from '../../forms/subaccount-details'

interface IMenuOptions {
  defaultOpen?: boolean
  subAccounts: SubAccount[]
  sidebarOpt: AgencySidebarOption[] | SubAccountSidebarOption[]
  sidebarLogo: string
  details: any
  user: any
  id: string
}

function MenuOptions({ defaultOpen, subAccounts, sidebarOpt, sidebarLogo, details, user, id }: IMenuOptions) {
  const { setOpen } = useModal()
  const [isMounted, setIsMounted] = useState(false)

  const openState = useMemo(() => (defaultOpen ? { open: true } : {}), [defaultOpen])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return

  return (
    <Sheet modal={false} {...openState}>
      <SheetTrigger asChild className='absolute left-4 top-4 z-[100] flex md:!hidden'>
        <Button variant='outline' size='icon'>
          <Menu />
        </Button>
      </SheetTrigger>
      <SheetContent
        showX={!defaultOpen}
        side='left'
        className={clsx('fixed top-0 border-r-[1px] bg-background/80 p-6 backdrop-blur-xl', {
          'z-0 hidden w-[300px] md:inline-block': defaultOpen,
          'z-[100] inline-block w-full md:hidden': !defaultOpen,
        })}
      >
        <div>
          <AspectRatio ratio={16 / 5}>
            <Image src={sidebarLogo} alt='Sidebar Logo' fill className='rounded-lg object-contain' />
          </AspectRatio>

          {/* Agency / Sub Account Popup */}
          <Popover>
            <PopoverTrigger asChild>
              <Button className='my-4 flex w-full items-center justify-between py-8' variant='ghost'>
                <div className='flex items-center gap-2 text-left'>
                  <Compass />
                  <div className='flex flex-col'>
                    {details.name}
                    <span className='text-muted-foreground'>{details.address}</span>
                  </div>
                </div>
                <ChevronsUpDown size={16} className='text-muted-foreground' />
              </Button>
            </PopoverTrigger>
            <PopoverContent className='z-[200] mt-4 h-80 w-80'>
              <Command className='rounded-lg'>
                <CommandInput placeholder='Search Accounts...' />
                <CommandList className='pb-16'>
                  <CommandEmpty> No results found</CommandEmpty>
                  {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && user?.Agency && (
                    <CommandGroup heading='Agency'>
                      <CommandItem className='broder-[1px] my-2 cursor-pointer rounded-md border-border !bg-transparent p-2 text-primary transition-all hover:!bg-muted'>
                        {defaultOpen ? (
                          <Link href={`/agency/${user?.Agency?.id}`} className='flex h-full w-full gap-4'>
                            <div className='relative w-16'>
                              <Image
                                src={user?.Agency?.agencyLogo}
                                alt='Agency Logo'
                                fill
                                className='rounded-md object-contain'
                              />
                            </div>
                            <div className='flex flex-1 flex-col'>
                              {user?.Agency?.name}
                              <span className='text-muted-foreground'>{user?.Agency?.address}</span>
                            </div>
                          </Link>
                        ) : (
                          <SheetClose asChild>
                            <Link href={`/agency/${user?.Agency?.id}`} className='flex h-full w-full gap-4'>
                              <div className='relative w-16'>
                                <Image
                                  src={user?.Agency?.agencyLogo}
                                  alt='Agency Logo'
                                  fill
                                  className='rounded-md object-contain'
                                />
                              </div>
                              <div className='flex flex-1 flex-col'>
                                {user?.Agency?.name}
                                <span className='text-muted-foreground'>{user?.Agency?.address}</span>
                              </div>
                            </Link>
                          </SheetClose>
                        )}
                      </CommandItem>
                    </CommandGroup>
                  )}
                  <CommandGroup heading='Accounts'>
                    {!!subAccounts
                      ? subAccounts.map((subaccount) => (
                          <CommandItem key={subaccount.id}>
                            {defaultOpen ? (
                              <Link href={`/subaccount/${subaccount.id}`} className='flex h-full w-full gap-4'>
                                <div className='relative w-16'>
                                  <Image
                                    src={subaccount.subAccountLogo}
                                    alt='subaccount Logo'
                                    fill
                                    className='rounded-md object-contain'
                                  />
                                </div>
                                <div className='flex flex-1 flex-col'>
                                  {subaccount.name}
                                  <span className='text-muted-foreground'>{subaccount.address}</span>
                                </div>
                              </Link>
                            ) : (
                              <SheetClose asChild>
                                <Link href={`/subaccount/${subaccount.id}`} className='flex h-full w-full gap-4'>
                                  <div className='relative w-16'>
                                    <Image
                                      src={subaccount.subAccountLogo}
                                      alt='subaccount Logo'
                                      fill
                                      className='rounded-md object-contain'
                                    />
                                  </div>
                                  <div className='flex flex-1 flex-col'>
                                    {subaccount.name}
                                    <span className='text-muted-foreground'>{subaccount.address}</span>
                                  </div>
                                </Link>
                              </SheetClose>
                            )}
                          </CommandItem>
                        ))
                      : 'No Accounts'}
                  </CommandGroup>
                </CommandList>
                {(user?.role === 'AGENCY_OWNER' || user?.role === 'AGENCY_ADMIN') && (
                  <SheetClose>
                    <Button
                      className='felx gpa-2 w-full'
                      onClick={() => {
                        setOpen(
                          <CustomModal
                            title='Create a subaccount'
                            subheading='You can switch between your agency account and the subaccount from the sidebar'
                          >
                            <SubAccountDetailsForm
                              agencyDetails={user?.Agency as Agency}
                              userId={user?.id as string}
                              userName={user?.name}
                            />
                          </CustomModal>,
                        )
                      }}
                    >
                      <PlusCircleIcon size={15} />
                      Create Sub Account
                    </Button>
                  </SheetClose>
                )}
              </Command>
            </PopoverContent>
          </Popover>

          {/* Menus */}
          <nav className='relative'>
            <Command className='overflow-visible rounded-lg bg-transparent'>
              <CommandInput placeholder='Search menus...' />
              <CommandList className='overflow-visible py-4'>
                <CommandEmpty>No Results Found</CommandEmpty>
                <CommandGroup className='overflow-visible'>
                  {sidebarOpt.map((sidebarOptions) => {
                    let icon
                    const result = icons.find((icon) => icon.value === sidebarOptions.icon)
                    if (result) {
                      icon = <result.path />
                    }
                    return (
                      <CommandItem key={sidebarOptions.id} className='my-2 w-full py-2.5 md:w-[320px]'>
                        <Link
                          href={sidebarOptions.link}
                          className='flex w-[320px] items-center gap-2 rounded-md transition-all hover:bg-transparent md:w-full'
                        >
                          {icon}
                          <span>{sidebarOptions.name}</span>
                        </Link>
                      </CommandItem>
                    )
                  })}
                </CommandGroup>
              </CommandList>
            </Command>
          </nav>
        </div>
      </SheetContent>
    </Sheet>
  )
}

export default MenuOptions
