import { Agency, SubAccount } from '@prisma/client'
import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateObjectId() {
  const hexDigits = '0123456789abcdef'

  function generateRandomHex(length: number) {
    let result = ''
    for (let i = 0; i < length; i++) {
      result += hexDigits.charAt(Math.floor(Math.random() * hexDigits.length))
    }
    return result
  }

  const timestamp = Math.floor(Date.now() / 1000)
    .toString(16)
    .padStart(8, '0')
  const machineIdentifier = generateRandomHex(6)
  const processIdentifier = generateRandomHex(4)
  const counter = generateRandomHex(6)

  return timestamp + machineIdentifier + processIdentifier + counter
}

export function getSideBarOptions(agency: Agency) {
  return [
    {
      name: 'Dashboard',
      icon: 'category',
      link: `/agency/${agency.id}`,
    },
    {
      name: 'Launchpad',
      icon: 'clipboardIcon',
      link: `/agency/${agency.id}/launchpad`,
    },
    {
      name: 'Billing',
      icon: 'payment',
      link: `/agency/${agency.id}/billing`,
    },
    {
      name: 'Settings',
      icon: 'settings',
      link: `/agency/${agency.id}/settings`,
    },
    {
      name: 'Sub Accounts',
      icon: 'person',
      link: `/agency/${agency.id}/all-subaccounts`,
    },
    {
      name: 'Team',
      icon: 'shield',
      link: `/agency/${agency.id}/team`,
    },
  ]
}

export function getSideBarOptionsForSubAccount(subAccount: SubAccount) {
  return [
    {
      name: 'Launchpad',
      icon: 'clipboardIcon',
      link: `/subaccount/${subAccount.id}/launchpad`,
    },
    {
      name: 'Settings',
      icon: 'settings',
      link: `/subaccount/${subAccount.id}/settings`,
    },
    {
      name: 'Funnels',
      icon: 'pipelines',
      link: `/subaccount/${subAccount.id}/funnels`,
    },
    {
      name: 'Media',
      icon: 'database',
      link: `/subaccount/${subAccount.id}/media`,
    },
    {
      name: 'Automations',
      icon: 'chip',
      link: `/subaccount/${subAccount.id}/automations`,
    },
    {
      name: 'Pipelines',
      icon: 'flag',
      link: `/subaccount/${subAccount.id}/pipelines`,
    },
    {
      name: 'Contacts',
      icon: 'person',
      link: `/subaccount/${subAccount.id}/contacts`,
    },
    {
      name: 'Dashboard',
      icon: 'category',
      link: `/subaccount/${subAccount.id}`,
    },
  ]
}
