import { z } from 'zod'

export const LoginSchema = z.object({
  email:    z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
})

export const SignupSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50),
  lastName:  z.string().min(1, 'Last name is required').max(50),
  email:     z.string().email('Invalid email address'),
  password:  z.string()
    .min(8,  'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  phone:    z.string().optional(),
  vehicle:  z.string().optional(),
  role:     z.enum(['PASSENGER', 'DRIVER']).default('PASSENGER'),
})

export const BookingSchema = z.object({
  from:  z.string().min(2, 'Please enter a pickup location'),
  to:    z.string().min(2, 'Please enter a destination'),
  date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format'),
  time:  z.string().regex(/^\d{2}:\d{2}$/, 'Invalid time format'),
  pax:   z.number().int().min(1).max(16),
  type:  z.enum(['airport', 'intercity', 'hourly', 'vip', 'group', 'delivery']),
  driverId: z.string().cuid('Invalid driver ID'),
  price:    z.number().positive('Price must be positive'),
})

export const UpdateTripStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED']),
})

export const UpdateDriverStatusSchema = z.object({
  status: z.enum(['ACTIVE', 'INACTIVE', 'SUSPENDED', 'PENDING_REVIEW']),
})

export type LoginInput           = z.infer<typeof LoginSchema>
export type SignupInput           = z.infer<typeof SignupSchema>
export type BookingInput          = z.infer<typeof BookingSchema>
export type UpdateTripStatusInput = z.infer<typeof UpdateTripStatusSchema>
