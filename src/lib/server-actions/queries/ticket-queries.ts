'use server'

import { db } from '@/lib/db'

/** get tickets info with all relations */
export const _getTicketsWithAllRelations = async (laneId: string) => {
  const response = await db.ticket.findMany({
    where: { laneId },
    include: {
      Assigned: true,
      Customer: true,
      Lane: true,
      Tags: true,
    },
  })
  return response
}

/** get pipeline details */
export const getPipelineDetails = async (pipelineId: string) => {
  const response = await db.pipeline.findUnique({
    where: {
      id: pipelineId,
    },
  })
  return response
}
