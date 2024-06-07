import { AgencySidebarOption, SubAccount, SubAccountSidebarOption } from '@prisma/client'
import React from 'react'

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
  return <div>MenuOptions</div>
}

export default MenuOptions
