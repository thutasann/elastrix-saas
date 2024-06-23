import { db } from '@/lib/db'
import EditorProvider from '@/providers/editor/editor-provider'
import { redirect } from 'next/navigation'
import React from 'react'

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
  console.log('funnelPageDetails', funnelPageDetails)

  if (!funnelPageDetails) {
    return redirect(`/subaccount/${params.subaccountId}/funnels/${params.funnelId}`)
  }

  return (
    <div className='fixed bottom-0 left-0 right-0 top-0 z-[999] overflow-hidden bg-background'>
      <EditorProvider subaccountId={params.subaccountId} funnelId={params.funnelId} pageDetails={funnelPageDetails}>
        <h1>Editor Page</h1>
      </EditorProvider>
    </div>
  )
}

export default EditorFunnelPage
