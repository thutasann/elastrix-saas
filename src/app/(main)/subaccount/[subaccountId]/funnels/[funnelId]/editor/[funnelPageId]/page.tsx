import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelEditorNavigation from './components/funnel-editor-navigation'
import FunnelEditor from './components/funnel-editor'

interface IEditorFunnelPage {
  params: {
    subaccountId: string
    funnelId: string
    funnelPageId: string
  }
}

async function EditorFunnelPage({ params }: IEditorFunnelPage) {
  const funnelPageDetails = await db.funnelPage.findFirst({
    where: {
      id: params.funnelPageId,
    },
  })

  if (!funnelPageDetails) {
    return redirect(`/subaccount/${params.subaccountId}/funnels/${params.funnelId}`)
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-[999] overflow-hidden bg-background'>
      <EditorProvider subaccountId={params.subaccountId} funnelId={params.funnelId} pageDetails={funnelPageDetails}>
        <FunnelEditorNavigation
          funnelId={params.funnelId}
          funnelPageDetails={funnelPageDetails}
          subaccountId={params.subaccountId}
        />
        <div className='flex h-full justify-between'>
          <FunnelEditor funnelPageId={params.funnelPageId} />
        </div>
      </EditorProvider>
    </div>
  )
}

export default EditorFunnelPage
