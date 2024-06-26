import FunnelEditor from '@/app/(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/components/funnel-editor'
import { getDomainContent } from '@/lib/server-actions/queries/funnel-queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'

interface IDomainPathPage {
  params: {
    domain: string
    path: string
  }
}

async function DomainPathPage({ params }: IDomainPathPage) {
  const domainData = await getDomainContent(params.domain.slice(0, -1))
  const pageData = domainData?.FunnelPages.find((page) => page.pathName === params.path)

  if (!pageData || !domainData) return notFound()

  return (
    <EditorProvider subaccountId={domainData.subAccountId} pageDetails={pageData} funnelId={domainData.id}>
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  )
}

export default DomainPathPage
