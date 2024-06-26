import { currencyNumberRegex } from '@/lib/constants'
import * as z from 'zod'

/**
 * Agency Detail Form Schema
 */
export const AgencyDetailFormSchema = z.object({
  name: z.string().min(2, { message: 'Agency name must be atleast 2 chars.' }),
  companyEmail: z.string().min(1),
  companyPhone: z.string().min(1),
  whiteLabel: z.boolean(),
  address: z.string().min(1),
  city: z.string().min(1),
  zipCode: z.string().min(1),
  state: z.string().min(1),
  country: z.string().min(1),
  agencyLogo: z.string().min(1),
})

/**
 * SubAccount Detail Form Schema
 */
export const SubAccountFormSchema = z.object({
  name: z.string(),
  companyEmail: z.string(),
  companyPhone: z.string().min(1),
  address: z.string(),
  city: z.string(),
  subAccountLogo: z.string(),
  zipCode: z.string(),
  state: z.string(),
  country: z.string(),
})

/**
 * User Details Form Schema
 */
export const UserDataSchema = z.object({
  name: z.string().min(1),
  email: z.string().email(),
  avatarUrl: z.string(),
  role: z.enum(['AGENCY_OWNER', 'AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),
})

/**
 * Invigation User Data Form Schema
 */
export const InvitationUserDataSchema = z.object({
  email: z.string().email(),
  role: z.enum(['AGENCY_ADMIN', 'SUBACCOUNT_USER', 'SUBACCOUNT_GUEST']),
})

/**
 * Upload Media Schema
 */
export const UploadMediaSchema = z.object({
  link: z.string().min(1, { message: 'Media File is required' }),
  name: z.string().min(1, { message: 'Name is required' }),
})

/**
 * Contact User Form
 */
export const ContactUserFormSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  email: z.string().email(),
})

/**
 * Funnel Page Form Schema
 */
export const FunnelPageFormSchema = z.object({
  name: z.string().min(1),
  pathName: z.string().optional(),
})
