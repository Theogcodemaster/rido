import { createContext, useContext, useRef, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import type { Place } from '../lib/places'

export type DriverTrip = {
  id: string
  rider: string
  from: string
  to: string
  /** gross fare before the 15% platform fee */
  fare: number
  status: 'completed' | 'cancelled'
  dateLabel: string
  /** where this trip sits for daily / weekly / monthly totals */
  bucket: 'today' | 'week' | 'month'
}

export type RideOffer = {
  id: string
  rider: string
  initials: string
  rating: number
  riderTrips: number
  from: Place
  to: Place
  fare: number
  pickupKm: number
  pickupEta: number
  payment: string
  note: string
}

export type Period = 'daily' | 'weekly' | 'monthly'

export const MOVIE_TOWNE: Place = { id: 'movietowne', label: 'MovieTowne POS', sub: 'Audrey Jeffers Hwy, Woodbrook', lat: 10.6584, lng: -61.533 }
export const PIARCO: Place = { id: 'piarco', label: 'Piarco International', sub: 'Golden Grove Rd, Piarco', lat: 10.5961, lng: -61.3362 }
export const ARIMA: Place = { id: 'arima', label: 'Arima Market', sub: 'Kennedy St, Arima', lat: 10.6429, lng: -61.2779 }
export const CHAGUANAS: Place = { id: 'chaguanas', label: 'Chaguanas Market', sub: 'Endeavour Rd, Chaguanas', lat: 10.5167, lng: -61.3994 }
export const SAVANNAH: Place = { id: 'savannah', label: 'Queen’s Park Savannah', sub: 'Port of Spain', lat: 10.676, lng: -61.5055 }
export const MARAVAL: Place = { id: 'maraval', label: 'Maraval Plaza', sub: 'Tragarete Rd, Maraval', lat: 10.6844, lng: -61.5156 }

const SEED_TRIPS: DriverTrip[] = [
  { id: 'd1', rider: 'Kamal Perera', from: 'Port of Spain', to: 'Piarco Airport', fare: 165, status: 'completed', dateLabel: 'Today 09:12', bucket: 'today' },
  { id: 'd2', rider: 'Dilani Silva', from: 'Arima', to: 'Chaguanas', fare: 260, status: 'completed', dateLabel: 'Today 08:45', bucket: 'today' },
  { id: 'd3', rider: 'Ruwani Mendis', from: 'Claxton Bay', to: 'Marabella', fare: 850, status: 'cancelled', dateLabel: 'Yesterday 18:30', bucket: 'week' },
  { id: 'd4', rider: 'Priya Fernando', from: 'Curepe', to: 'Tunapuna', fare: 65, status: 'completed', dateLabel: 'Yesterday 15:20', bucket: 'week' },
  { id: 'd5', rider: 'Devon Alexander', from: 'Port of Spain', to: 'Scarborough', fare: 480, status: 'completed', dateLabel: 'Oct 8 · 14:05', bucket: 'month' },
  { id: 'd6', rider: 'Ana-Marie Louis', from: 'Sangre Grande', to: 'Toco', fare: 390, status: 'completed', dateLabel: 'Oct 5 · 11:20', bucket: 'month' },
]

const OFFER_POOL: Omit<RideOffer, 'id'>[] = [
  {
    rider: 'Tariq Ahmed', initials: 'TA', rating: 4.9, riderTrips: 212,
    from: MOVIE_TOWNE, to: PIARCO, fare: 45, pickupKm: 0.5, pickupEta: 2,
    payment: 'Card ••8821', note: 'Blue shirt, by the cinema gate',
  },
  {
    rider: 'Sasha Bent', initials: 'SB', rating: 4.8, riderTrips: 87,
    from: SAVANNAH, to: MARAVAL, fare: 38, pickupKm: 0.8, pickupEta: 3,
    payment: 'Cash', note: 'Two bags of groceries',
  },
  {
    rider: 'Jerome Charles', initials: 'JC', rating: 5.0, riderTrips: 41,
    from: ARIMA, to: CHAGUANAS, fare: 120, pickupKm: 1.2, pickupEta: 5,
    payment: 'Wallet', note: 'Airport run — plenty of luggage space needed',
  },
  {
    rider: 'Nadia Mohammed', initials: 'NM', rating: 4.7, riderTrips: 305,
    from: MARAVAL, to: MOVIE_TOWNE, fare: 52, pickupKm: 0.6, pickupEta: 4,
    payment: 'Card ••1109', note: '',
  },
]

type DriverStore = {
  online: boolean
  setOnline: Dispatch<SetStateAction<boolean>>
  driverName: string
  setDriverName: Dispatch<SetStateAction<string>>
  trips: DriverTrip[]
  addTrip: (t: Omit<DriverTrip, 'id'>) => void
  wallet: number
  cashOut: (amount: number) => void
  credit: (amount: number) => void
  offer: RideOffer | null
  nextOffer: () => void
  clearOffer: () => void
}

const DriverCtx = createContext<DriverStore | null>(null)

export function DriverProvider({ children }: { children: ReactNode }) {
  const [online, setOnline] = useState(true)
  const [driverName, setDriverName] = useState('Keston Samuel')
  const [trips, setTrips] = useState<DriverTrip[]>(SEED_TRIPS)
  const [wallet, setWallet] = useState(14250)
  const [offer, setOffer] = useState<RideOffer | null>(null)
  const offerCount = useRef(0)

  const nextOffer = () => {
    const base = OFFER_POOL[offerCount.current % OFFER_POOL.length]
    offerCount.current += 1
    setOffer({ ...base, id: `offer-${Date.now()}` })
  }

  const clearOffer = () => setOffer(null)

  const addTrip = (t: Omit<DriverTrip, 'id'>) =>
    setTrips(prev => [{ ...t, id: `dtrip-${Date.now()}` }, ...prev].slice(0, 40))

  const cashOut = (amount: number) => setWallet(w => Math.max(0, w - amount))
  const credit = (amount: number) => setWallet(w => Math.round((w + amount) * 100) / 100)

  return (
    <DriverCtx.Provider
      value={{
        online, setOnline,
        driverName, setDriverName,
        trips, addTrip,
        wallet, cashOut, credit,
        offer, nextOffer, clearOffer,
      }}
    >
      {children}
    </DriverCtx.Provider>
  )
}

export function useDriver(): DriverStore {
  const ctx = useContext(DriverCtx)
  if (!ctx) throw new Error('useDriver must be used within <DriverProvider>')
  return ctx
}

/** Trips that count toward a period (daily = today, weekly = this week, monthly = everything). */
export function tripsForPeriod(trips: DriverTrip[], period: Period): DriverTrip[] {
  if (period === 'daily') return trips.filter(t => t.bucket === 'today')
  if (period === 'weekly') return trips.filter(t => t.bucket !== 'month')
  return trips
}

export function completedTotal(trips: DriverTrip[]): number {
  return trips.filter(t => t.status === 'completed').reduce((s, t) => s + t.fare, 0)
}

/** Number of completed trips in a bucket — used for the home card and charts. */
export function completedCount(trips: DriverTrip[], period: Period = 'daily'): number {
  return tripsForPeriod(trips, period).filter(t => t.status === 'completed').length
}

export const PLATFORM_FEE = 0.15
