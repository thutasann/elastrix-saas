'use server'

import { CreateFunnelFormSchema } from '@/dto/forms/ticket-forms'
import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { generateObjectId } from '@/lib/utils'
import { z } from 'zod'

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
