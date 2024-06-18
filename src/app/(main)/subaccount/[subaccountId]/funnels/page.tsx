import React, { Fragment } from 'react'
import { getFunnels } from '@/lib/server-actions/queries/funnel-queries'
import BlurPage from '@/components/organisms/agency/blur-page'
import FunnelsTable from './components/funnels-table'
import { Plus } from 'lucide-react'
import { columns } from './components/columns'
import FunnelForm from '@/components/organisms/forms/funnel-form'

interface ISubAccoutnFunnelsPage {
  params: {
    subaccountId: string
  }
}

async function SubAccountFunnelsPage({ params }: ISubAccoutnFunnelsPage) {
  const funnels = await getFunnels(params.subaccountId)
  if (!funnels) return null

  return (
    <BlurPage>
      <FunnelsTable
        actionButtonText={
          <Fragment>
            <Plus size={15} />
            Create Funnel
          </Fragment>
        }
        modalChildren={<FunnelForm subAccountId={params.subaccountId} />}
        filterValue='name'
        columns={columns}
        data={funnels}
      />
    </BlurPage>
  )
}

export default SubAccountFunnelsPage
