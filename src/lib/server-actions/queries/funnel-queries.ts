'use server'

import { CreateFunnelFormSchema } from '@/dto/forms/ticket-forms'
import { UpsertFunnelPage } from '@/dto/types/agency'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { generateObjectId } from '@/lib/utils'
import { revalidatePath } from 'next/cache'
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
          order: 'asc',
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

/** create funnel page */
export const createFunnelPage = async (subaccountId: string, funnelPage: UpsertFunnelPage, funnelId: string) => {
  if (!subaccountId || !funnelId) return
  const response = await db.funnelPage.create({
    data: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: '__body',
              name: 'Body',
              styles: { backgroundColor: 'white' },
              type: '__body',
            },
          ]),
      funnelId,
    },
  })
  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, 'page')
  return response
}

/** upsert funnel page */
export const upsertFunnelPage = async (
  subaccountId: string,
  pageId: string,
  funnelPage: UpsertFunnelPage,
  funnelId: string,
) => {
  if (!subaccountId || !funnelId) return
  console.log('funnelPage', funnelPage)
  const response = await db.funnelPage.upsert({
    where: { id: pageId || '' },
    update: { ...funnelPage },
    create: {
      ...funnelPage,
      content: funnelPage.content
        ? funnelPage.content
        : JSON.stringify([
            {
              content: [],
              id: '__body',
              name: 'Body',
              styles: { backgroundColor: 'white' },
              type: '__body',
            },
          ]),
      funnelId,
    },
  })

  revalidatePath(`/subaccount/${subaccountId}/funnels/${funnelId}`, 'page')
  return response
}

/** delete funnel page */
export const deleteFunnelPage = async (funnelPageId: string) => {
  console.log('delete funnelPageId', funnelPageId)
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
