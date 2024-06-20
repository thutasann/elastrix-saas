'use client'

import { FunnelsForSubAccount } from '@/dto/types/agency'
import { FunnelPage } from '@prisma/client'
import React from 'react'

interface IFUnnelSteps {
  funnel: FunnelsForSubAccount
  subaccountId: string
  pages: FunnelPage[]
  funnelId: string
}

function FunnelSteps({ funnel, subaccountId, pages, funnelId }: IFUnnelSteps) {
  return <div>FunelSteps</div>
}

export default FunnelSteps
