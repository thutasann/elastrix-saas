import React from 'react'
import { getAuthUserDetails } from '@/lib/server-actions/queries/agency-queries'
import MenuOptions from './menu-options'

interface ISidebar {
  id: string
  type: 'agency' | 'subaccount'
}

async function Sidebar({ id, type }: ISidebar) {
  const user = await getAuthUserDetails()
  if (!user) return null
  if (!user.Agency) return

  /** agency details */
  const details = type === 'agency' ? user?.Agency : user?.Agency.SubAccount.find((sub) => sub.id === id)

  /** check if it's white label or not */
  const whiteLabelAgency = user.Agency.whiteLabel

  if (!details) return

  /** sidebar logo */
  let sideBarLogo = user.Agency.agencyLogo || '/assets/elastrix.png'

  if (!whiteLabelAgency) {
    if (type === 'subaccount') {
      sideBarLogo = user?.Agency.SubAccount.find((sub) => sub.id === id)?.subAccountLogo || user.Agency.agencyLogo
    }
  }

  /** sidebar options */
  const sidebarOptions =
    type === 'agency'
      ? user.Agency.SidebarOption || []
      : user.Agency.SubAccount.find((sub) => sub.id === id)?.SidebarOption || []

  /** sub account and permissions */
  const subaccounts = user.Agency.SubAccount.filter((sub) =>
    user.Permissions.find((permission) => permission.subAccountId === sub.id && permission.access),
  )

  return (
    <>
      <MenuOptions
        defaultOpen={true}
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOptions}
        subAccounts={subaccounts}
        user={user}
      />
      <MenuOptions
        details={details}
        id={id}
        sidebarLogo={sideBarLogo}
        sidebarOpt={sidebarOptions}
        subAccounts={subaccounts}
        user={user}
      />
    </>
  )
}

export default Sidebar
