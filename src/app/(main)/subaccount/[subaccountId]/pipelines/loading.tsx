import React from 'react'
import { CustomLoader } from '@/components/molecules/loader'

function PipelineLoading() {
  return (
    <div className='flex h-[100vh] w-full items-center justify-center'>
      <CustomLoader className='h-8 w-8' />
    </div>
  )
}

export default PipelineLoading
