import React from 'react'

interface IAgencyIdPage {
  params: {
    agencyId: string
  }
}

function AgencyIdPage({ params }: IAgencyIdPage) {
  return (
    <div>
      <h1 className='text-white'>AgencyID : {params.agencyId}</h1>
    </div>
  )
}

export default AgencyIdPage
