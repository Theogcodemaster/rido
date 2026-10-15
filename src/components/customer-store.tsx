import { createContext, useContext, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'

export type TripStatus = 'Completed' | 'Cancelled'

export type Trip = {
  id: string
  title: string
  meta: string
  fare: number
  status: TripStatus
}

/** The confirmed ride, written by the vehicle screen and read by tracking + receipt. */
export type Booking = {
  vehicle: string
  /** total fare after promo, before tip */
  fare: number
  payment: string
  distanceM: number
  durationS: number
  pickupLabel: string
  destLabel: string
  promo: string | null
}

export type Profile = {
  name: string
  phone: string
  email: string
}

export type NotifPrefs = {
  push: boolean
  sms: boolean
  email: boolean
  promos: boolean
}

export const DEFAULT_SCHEDULE = 'Leave now'

const SEED_TRIPS: Trip[] = [
  { id: 'seed-1', title: 'Ride to Piarco Int’l', meta: 'Sep 30 · 15 min', fare: 45, status: 'Completed' },
  { id: 'seed-2', title: 'Package to Chaguanas', meta: 'Sep 28 · 18 min', fare: 280, status: 'Completed' },
  { id: 'seed-3', title: 'Ride to MovieTowne', meta: 'Sep 26 · 9 min', fare: 32, status: 'Cancelled' },
]

type CustomerStore = {
  profile: Profile
  setProfile: Dispatch<SetStateAction<Profile>>
  wallet: number
  recharge: (amount: number) => void
  spend: (amount: number) => void
  trips: Trip[]
  addTrip: (t: Omit<Trip, 'id'>) => void
  promo: string | null
  setPromo: Dispatch<SetStateAction<string | null>>
  schedule: string
  setSchedule: Dispatch<SetStateAction<string>>
  notifs: NotifPrefs
  setNotifs: Dispatch<SetStateAction<NotifPrefs>>
  language: string
  setLanguage: Dispatch<SetStateAction<string>>
  corp: boolean
  setCorp: Dispatch<SetStateAction<boolean>>
  booking: Booking | null
  setBooking: Dispatch<SetStateAction<Booking | null>>
}

const CustomerCtx = createContext<CustomerStore | null>(null)

export function CustomerProvider({ children }: { children: ReactNode }) {
  const [profile, setProfile] = useState<Profile>({
    name: 'Kamal Perera',
    phone: '+1 868 555 0143',
    email: 'kamal@example.com',
  })
  const [wallet, setWallet] = useState(1250)
  const [trips, setTrips] = useState<Trip[]>(SEED_TRIPS)
  const [promo, setPromo] = useState<string | null>(null)
  const [schedule, setSchedule] = useState(DEFAULT_SCHEDULE)
  const [notifs, setNotifs] = useState<NotifPrefs>({ push: true, sms: true, email: false, promos: true })
  const [language, setLanguage] = useState('English')
  const [corp, setCorp] = useState(false)
  const [booking, setBooking] = useState<Booking | null>(null)

  const recharge = (amount: number) => setWallet(w => Math.round((w + amount) * 100) / 100)
  const spend = (amount: number) => setWallet(w => Math.max(0, Math.round((w - amount) * 100) / 100))

  const addTrip = (t: Omit<Trip, 'id'>) =>
    setTrips(prev => [{ ...t, id: `trip-${Date.now()}` }, ...prev].slice(0, 24))

  return (
    <CustomerCtx.Provider
      value={{
        profile, setProfile,
        wallet, recharge, spend,
        trips, addTrip,
        promo, setPromo,
        schedule, setSchedule,
        notifs, setNotifs,
        language, setLanguage,
        corp, setCorp,
        booking, setBooking,
      }}
    >
      {children}
    </CustomerCtx.Provider>
  )
}

export function useCustomer(): CustomerStore {
  const ctx = useContext(CustomerCtx)
  if (!ctx) throw new Error('useCustomer must be used within <CustomerProvider>')
  return ctx
}

/** Promo discount for a fare. WELCOME20 = 20% off, AIRPORT10 = TT$ 10 off. */
export function promoDiscount(promo: string | null | undefined, fare: number): number {
  if (!promo) return 0
  if (promo === 'WELCOME20') return Math.round(fare * 0.2 * 100) / 100
  if (promo === 'AIRPORT10') return Math.min(10, fare)
  return 0
}

export function initialsOf(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean)
  if (parts.length === 0) return 'U'
  return parts.slice(0, 2).map(p => p[0]!.toUpperCase()).join('')
}

export function firstName(name: string): string {
  return name.trim().split(/\s+/)[0] || 'there'
}

/** "Ride to Piarco International Airport" → "Piarco International Airport" */
export function shortLabel(label: string): string {
  return label.replace(/^.*?\bto\b\s+/i, '')
}
