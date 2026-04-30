export type TripStatus   = 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled'
export type DriverStatus = 'active' | 'inactive' | 'suspended' | 'pending_review'
export type UserRole     = 'passenger' | 'driver' | 'admin'

export interface Trip {
  id: number
  from: string
  to: string
  date: string
  pax: number
  price: number
  status: TripStatus
  driver: string
  passenger: string
  type: string
}

export interface Driver {
  id: number
  name: string
  initials: string
  email: string
  car: string
  year: number
  rating: number
  rides: number
  earnings: number
  status: DriverStatus
  joined: string
  city: string
}

export interface User {
  id: number
  name: string
  initials: string
  email: string
  role: UserRole
  trips: number
  joined: string
  status: 'active' | 'suspended'
  country: string
}
