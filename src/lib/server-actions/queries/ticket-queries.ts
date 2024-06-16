'use server'

import { db } from '@/lib/db'
import { Logger } from '@/lib/logger'
import { generateObjectId } from '@/lib/utils'
import { Lane, Prisma, Ticket } from '@prisma/client'

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

/** get tickets with tags */
export const getTicketsWithTags = async (pipelineId: string) => {
  const response = db.ticket.findMany({
    where: {
      Lane: {
        pipelineId,
      },
    },
    include: {
      Tags: true,
      Assigned: true,
      Customer: true,
    },
  })
  return response
}

/** get lanes with ticket and tags */
export const getLanesWithTicketAndTags = async (pipelineId: string) => {
  const response = await db.lane.findMany({
    where: {
      pipelineId,
    },
    orderBy: { order: 'asc' },
    include: {
      Tickets: {
        orderBy: {
          order: 'asc',
        },
        include: {
          Tags: true,
          Assigned: true,
          Customer: true,
        },
      },
    },
  })
  return response
}

/** create pipeline */
export const createPipeline = async (pipeline: Prisma.PipelineUncheckedCreateInput) => {
  const response = await db.pipeline.create({
    data: {
      ...pipeline,
    },
  })
  return response
}

/** update pipeline */
export const updatePipeline = async (pipeline: Prisma.PipelineUncheckedCreateInput, id: string) => {
  const response = await db.pipeline.upsert({
    where: { id },
    create: pipeline,
    update: {
      ...pipeline,
    },
  })
  return response
}

/** delete pipeline */
export const deletePipeline = async (pipelineId: string) => {
  const response = await db.pipeline.delete({
    where: {
      id: pipelineId,
    },
  })
  return response
}

/** update lanes order */
export const updateLanesOrder = async (lanes: Lane[]) => {
  if (!lanes) return
  try {
    const updateTrans = lanes.map((lane) =>
      db.lane.update({
        where: {
          id: lane.id,
        },
        data: {
          order: lane.order,
        },
      }),
    )
    await db.$transaction(updateTrans)
    Logger.info('Done lanes re-ordered')
  } catch (error) {
    console.error('update lanes order :', error)
  }
}

/** update tickets order */
export const updateTicketsOrder = async (tickets: Ticket[]) => {
  try {
    const updateTrans = tickets.map((ticket) =>
      db.ticket.update({
        where: {
          id: ticket.id,
        },
        data: {
          order: ticket.order,
          laneId: ticket.laneId,
        },
      }),
    )
    await db.$transaction(updateTrans)
    Logger.info('Done Ticket re-ordered ')
  } catch (error) {
    console.error('update tickets order error: ', error)
  }
}

/** create lane */
export const upsertLane = async (lane: Prisma.LaneUncheckedCreateInput) => {
  let order: number

  if (!lane.order) {
    const lanes = await db.lane.findMany({
      where: {
        pipelineId: lane.pipelineId,
      },
    })

    order = lanes.length
  } else {
    order = lane.order
  }

  const response = await db.lane.upsert({
    where: { id: lane.id || generateObjectId() },
    update: lane,
    create: {
      ...lane,
      order: order,
    },
  })

  return response
}

/** delete tag */
export const deleteTag = async (tagId: string) => {
  const response = await db.tag.delete({
    where: {
      id: tagId,
    },
  })
  return response
}

/** delete lane */
export const deleteLane = async (laneId: string) => {
  const response = await db.lane.delete({
    where: {
      id: laneId,
    },
  })
  return response
}
