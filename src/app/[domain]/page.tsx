import { db } from '@/lib/db'
import { getDomainContent } from '@/lib/server-actions/queries/funnel-queries'
import EditorProvider from '@/providers/editor/editor-provider'
import { notFound } from 'next/navigation'
import React from 'react'
import FunnelEditor from '../(main)/subaccount/[subaccountId]/funnels/[funnelId]/editor/[funnelPageId]/components/funnel-editor'

interface IDomainPage {
  params: {
    domain: string
  }
}

async function DomainPage({ params }: IDomainPage) {
  const domainData = await getDomainContent(params.domain.slice(0, -1))
  if (!domainData) return notFound()

  const pageData = domainData.FunnelPages.find((page) => !page.pathName)
  if (!pageData) return notFound()

  await db.funnelPage.update({
    where: {
      id: pageData.id,
    },
    data: {
      visits: {
        increment: 1,
      },
    },
  })

  return (
    <EditorProvider subaccountId={domainData.subAccountId} pageDetails={pageData} funnelId={domainData.id}>
      <FunnelEditor funnelPageId={pageData.id} liveMode={true} />
    </EditorProvider>
  )
}

export default DomainPage
