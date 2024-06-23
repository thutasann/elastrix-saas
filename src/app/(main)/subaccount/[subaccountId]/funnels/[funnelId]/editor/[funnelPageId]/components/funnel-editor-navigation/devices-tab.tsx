'use client'

import React from 'react'
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { DeviceTypes } from '@/providers/editor/editor-types'
import { useEditor } from '@/providers/editor/editor-provider'
import { Laptop, Smartphone, Tablet } from 'lucide-react'

function DevicesTab() {
  const { state, dispatch } = useEditor()

  return (
    <aside>
      <Tabs
        defaultValue='Desktop'
        className='w-fit'
        value={state.editor.device}
        onValueChange={(val) => {
          dispatch({
            type: 'CHANGE_DEVICE',
            payload: { device: val as DeviceTypes },
          })
        }}
      >
        <TabsList className='grid h-fit w-full grid-cols-3 bg-transparent'>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value='Desktop' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                <Laptop />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Desktop</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value='Tablet' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                <Tablet />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Tablet</p>
            </TooltipContent>
          </Tooltip>
          <Tooltip>
            <TooltipTrigger>
              <TabsTrigger value='Mobile' className='h-10 w-10 p-0 data-[state=active]:bg-muted'>
                <Smartphone />
              </TabsTrigger>
            </TooltipTrigger>
            <TooltipContent>
              <p>Mobile</p>
            </TooltipContent>
          </Tooltip>
        </TabsList>
      </Tabs>
    </aside>
  )
}

export default DevicesTab
