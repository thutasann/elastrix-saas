import { generateComponents } from '@uploadthing/react'
import { generateReactHelpers } from '@uploadthing/react/hooks'
import type { FileRouterProps } from '@/app/api/uploadthing/core'

export const { UploadButton, UploadDropzone, Uploader } = generateComponents<FileRouterProps>()

export const { useUploadThing, uploadFiles } = generateReactHelpers<FileRouterProps>()
