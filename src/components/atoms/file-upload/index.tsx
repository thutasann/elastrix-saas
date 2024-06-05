'use client'

import React from 'react'

interface IFileUpload {
  apiEndpiont: 'agencyLogo' | 'avatar' | 'subAccountLogo'
  onChange: (url?: string) => void
  value?: string
}

function FileUpload({ apiEndpiont, onChange, value }: IFileUpload) {
    const type = value?.split(".").pop();
    
  return <div>FileUpload</div>
}

export default FileUpload
