import { currencyNumberRegex } from '@/lib/constants'
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

/**
 * Lane Form Schema
 */
export const LaneFormSchema = z.object({
  name: z.string().min(1),
})

/**
 * Ticket Form Schema
 */
export const TicketFormSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  value: z.string().refine((value) => currencyNumberRegex.test(value), {
    message: 'Value must be a valid price',
  }),
})
