import { generateUploadButton, generateUploader, generateUploadDropzone } from '@uploadthing/react'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import type { FileRouterProps } from '@/app/api/uploadthing/core'

export const Uploader = generateUploader<FileRouterProps>()
export const UploadDropzone = generateUploadDropzone<FileRouterProps>()
export const UploadButton = generateUploadButton<FileRouterProps>()

export const { useUploadThing, uploadFiles } = generateReactHelpers<FileRouterProps>()
