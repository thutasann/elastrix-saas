import { Pipeline } from '@prisma/client'
import React from 'react'

interface IPipelineSettings {
  pipelineId: string
  subaccountId: string
  pipelines: Pipeline[]
}

function PipelineSettings({ pipelineId, subaccountId, pipelines }: IPipelineSettings) {
  return <div>PipelineSettings</div>
}

export default PipelineSettings
