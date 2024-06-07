import React from 'react'

interface IAgencyIdPage {
  params: {
    agencyId: string
  }
}

function AgencyIdPage({ params }: IAgencyIdPage) {
  return (
    <>
      <h1 className='text-muted-foreground'>AgencyID : {params.agencyId}</h1>
    </>
  )
}

export default AgencyIdPage
