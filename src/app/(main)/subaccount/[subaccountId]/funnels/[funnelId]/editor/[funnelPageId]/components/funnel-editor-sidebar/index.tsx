'use client'

import React from 'react'
import { useEditor } from '@/providers/editor/editor-provider'
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from '@/components/ui/sheet'
import { Tabs, TabsContent } from '@/components/ui/tabs'
import clsx from 'clsx'
import EditorSidebarTabsList from './tabs/tab-lists'
import SettingsTab from './tabs/settings-tab'
import MediaBucketTab from './tabs/media-bucket-tab'
import ComponentsTab from './tabs/components-tab'

interface IFunnelEditorSidebar {
  subaccountId: string
}

function FunnelEditorSidebar({ subaccountId }: IFunnelEditorSidebar) {
  const { state, dispatch } = useEditor()
  return (
    <Sheet open={true} modal={false}>
      <Tabs className='w-full' defaultValue='Settings'>
        {/* Tabs List */}
        <SheetContent
          showX={false}
          side='right'
          className={clsx('z-[80] mt-[97px] w-16 overflow-hidden p-0 shadow-none transition-all focus:border-none', {
            hidden: state.editor.previewMode,
          })}
        >
          <EditorSidebarTabsList />
        </SheetContent>

        {/* Tabs Contents */}
        <SheetContent
          showX={false}
          side='right'
          className={clsx(
            'z-[40] mr-16 mt-[97px] h-full w-80 overflow-hidden bg-background p-0 shadow-none transition-all',
            { hidden: state.editor.previewMode },
          )}
        >
          <div className='grid h-full gap-4 overflow-auto pb-36'>
            <TabsContent value='Settings'>
              <SheetHeader className='p-6 text-left'>
                <SheetTitle>Styles</SheetTitle>
                <SheetDescription>
                  Show your creativity! You can customize every component as you like.
                </SheetDescription>
              </SheetHeader>
              <SettingsTab />
            </TabsContent>
            <TabsContent value='Media'>
              <MediaBucketTab subaccountId={subaccountId} />
            </TabsContent>
            <TabsContent value='Components'>
              <SheetHeader className='p-6 text-left'>
                <SheetTitle>Components</SheetTitle>
                <SheetDescription>You can drag and drop components on the canvas</SheetDescription>
              </SheetHeader>
              <ComponentsTab />
            </TabsContent>
          </div>
        </SheetContent>
      </Tabs>
    </Sheet>
  )
}

export default FunnelEditorSidebar
