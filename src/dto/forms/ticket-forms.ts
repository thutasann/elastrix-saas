import * as z from 'zod'

/**
 * Pipeline Create Form Schema
 */
export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
})

/**
 * Create Funnel Form Schema
 */
export const CreateFunnelFormSchema = z.object({
  name: z.string().min(1),
  description: z.string(),
  subDomainName: z.string().optional(),
  favicon: z.string().optional(),
})
