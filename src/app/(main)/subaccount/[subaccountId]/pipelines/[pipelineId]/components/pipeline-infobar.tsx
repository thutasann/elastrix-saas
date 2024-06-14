'use client'

import { useModal } from '@/providers/modal-provider'
import { Pipeline } from '@prisma/client'
import React, { useState } from 'react'

interface IPipelineInfobar {
  subAccountId: string
  pipelines: Pipeline[]
  pipelineId: string
}

function PipelineInfoBar({ pipelineId, pipelines, subAccountId }: IPipelineInfobar) {
  const { setOpen: setOpenModal, setClose } = useModal()
  const [open, setOpen] = useState(false)
  const [value, setValue] = useState(pipelineId)

  return <div>PipelineInfoBar</div>
}

export default PipelineInfoBar
