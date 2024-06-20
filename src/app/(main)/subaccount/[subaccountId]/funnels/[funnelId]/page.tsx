import BlurPage from '@/components/organisms/agency/blur-page'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { getFunnel } from '@/lib/server-actions/queries/funnel-queries'
import { ChevronLeft } from 'lucide-react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import React from 'react'
import FunnelSteps from './components/funnel-steps'
import FunnelSettings from './components/funnel-settings'

interface IFunnelDetailPage {
  params: {
    funnelId: string
    subaccountId: string
  }
}

async function FunnelDetailPage({ params }: IFunnelDetailPage) {
  const funnelPages = await getFunnel(params.funnelId)

  if (!funnelPages) return redirect(`/subaccount/${params.subaccountId}/funnels`)

  return (
    <BlurPage>
      <Link
        href={`/subaccount/${params.subaccountId}/funnels`}
        className='mb-4 flex w-fit justify-between gap-4 rounded-full bg-slate-800 p-2 text-muted-foreground hover:bg-slate-900'
      >
        <ChevronLeft />
      </Link>
      <h1 className='mb-8 text-2xl font-bold'>{funnelPages.name}</h1>
      <Tabs defaultValue='steps' className='w-full'>
        <TabsList className='grid w-[50%] grid-cols-2 bg-transparent'>
          <TabsTrigger value='steps'>Steps</TabsTrigger>
          <TabsTrigger value='settings'>Settings</TabsTrigger>
        </TabsList>
        <TabsContent value='steps'>
          <FunnelSteps
            funnel={funnelPages}
            subaccountId={params.subaccountId}
            pages={funnelPages.FunnelPages}
            funnelId={params.funnelId}
          />
        </TabsContent>
        <TabsContent value='settings'>
          <FunnelSettings subaccountId={params.subaccountId} defaultData={funnelPages} />
        </TabsContent>
      </Tabs>
    </BlurPage>
  )
}

export default FunnelDetailPage
