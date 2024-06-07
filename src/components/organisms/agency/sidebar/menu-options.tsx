'use client'

import { useModal } from '@/providers/modal-provider'
import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React, { useEffect, useState } from 'react'
import { Popover, PopoverContent, PopoverTrigger } from '../../../ui/popover'
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '../../../ui/command'
import { Sheet } from '@/components/ui/sheet'

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

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return

  return <Sheet modal={false}></Sheet>
}

export default MenuOptions
