'use server'

import { CreateFunnelFormSchema } from '@/dto/forms/ticket-forms'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { generateObjectId } from '@/lib/utils'
import { z } from 'zod'

/** create funnel */
export const createFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & {
    liveProducts: string
  },
) => {
  const response = await db.funnel.create({
    data: {
      ...funnel,
      subAccountId: subaccountId,
    },
  })

  return response
}

/** upsert funnel */
export const upsertFunnel = async (
  subaccountId: string,
  funnel: z.infer<typeof CreateFunnelFormSchema> & {
    liveProducts: string
  },
  funnelId: string,
) => {
  Logger.info('upsert funnel id ', funnelId)
  const response = await db.funnel.upsert({
    where: { id: funnelId },
    update: funnel,
    create: {
      ...funnel,
      id: funnelId || generateObjectId(),
      subAccountId: subaccountId,
    },
  })

  return response
}

/** get funnels */
export const getFunnels = async (subaccountId: string) => {
  const funnels = await db.funnel.findMany({
    where: { subAccountId: subaccountId },
    include: { FunnelPages: true },
  })
  return funnels
}

/** get single funnel */
export const getFunnel = async (funnelId: string) => {
  const funnel = await db.funnel.findUnique({
    where: { id: funnelId },
    include: {
      FunnelPages: {
        orderBy: {
          order: 'desc',
        },
      },
    },
  })
  return funnel
}

/** update funnel products */
export const updateFunnelProducts = async (products: string, funnelId: string) => {
  const data = await db.funnel.update({
    where: {
      id: funnelId,
    },
    data: {
      liveProducts: products,
    },
  })
  return data
}

/** delete funnel page */
export const deleteFunnelPage = async (funnelPageId: string) => {
  try {
    const response = await db.funnelPage.delete({
      where: {
        id: funnelPageId,
      },
    })
    return response
  } catch (error) {
    Logger.error('funnel delete error : ', error)
  }
}

/**  get funnel page details */
export const getFunnelPageDetails = async (funnelPageId: string) => {
  const response = await db.funnelPage.findUnique({
    where: {
      id: funnelPageId,
    },
  })
  return response
}
