'use client'

import React from 'react'
import { Pipeline } from '@prisma/client'
import { useRouter } from 'next/navigation'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { deletePipeline } from '@/lib/server-actions/queries/ticket-queries'

interface IPipelineSettings {
  pipelineId: string
  subaccountId: string
  pipelines: Pipeline[]
}

function PipelineSettings({ pipelineId, subaccountId }: IPipelineSettings) {
  const router = useRouter()
  const { toast } = useToast()
  return (
    <AlertDialog>
      <div className='mb-4 flex items-center justify-between'>
        <AlertDialogTrigger asChild>
          <Button variant='destructive'>Delete Pipeline</Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogHeader>Are you absolutely sure?</AlertDialogHeader>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete your account and remove your data from our
              servers.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={async () => {
                try {
                  await deletePipeline(pipelineId)
                  toast({
                    title: 'Deleted',
                    description: 'Pipeline is deleted',
                  })
                  router.replace(`/subaccount/${subaccountId}/pipelines`)
                } catch (error) {
                  toast({
                    variant: 'destructive',
                    title: 'Oppse!',
                    description: 'Could Delete Pipeline',
                  })
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </div>
    </AlertDialog>
  )
}

export default PipelineSettings
