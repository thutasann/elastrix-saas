import * as z from 'zod'

/**
 * Pipeline Create Form Schema
 */
export const CreatePipelineFormSchema = z.object({
  name: z.string().min(1),
})
