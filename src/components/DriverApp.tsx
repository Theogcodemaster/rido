import { useEffect, useRef, useState } from 'react'
import { Avatar, Star, Sheet, Toggle, Row } from './shared-ui'
import RideMapView from './RideMapView'
import { POS_CENTER, carsAround, formatDistance, formatDuration, type Place } from '../lib/places'
import { fetchRoute, pointAt, type RouteResult } from '../lib/route'
import {
  DriverProvider,
  useDriver,
  MOVIE_TOWNE,
  PIARCO,
  tripsForPeriod,
  completedTotal,
  PLATFORM_FEE,
  type Period,
  type DriverTrip,
} from './driver-store'
import logo from '../assets/logo.jpeg'

type Screen = 'home' | 'request' | 'active' | 'earnings' | 'history'

const RED = '#E11D48'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 375, minHeight: 700 }}>
      <div className="relative bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100" style={{ minHeight: 700 }}>
        <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-white">
          <span className="text-xs font-600 text-gray-800">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5">
              {[3,4,4].map((h,i) => <div key={i} className="w-1 rounded-sm bg-gray-800" style={{height: h*3}}/>)}
            </div>
            <svg width="22" height="10" viewBox="0 0 44 20"><rect x="0" y="2" width="38" height="16" rx="4" stroke="#111" strokeWidth="2" fill="none"/><rect x="38" y="6" width="4" height="8" rx="2" fill="#111"/><rect x="2" y="4" width="28" height="12" rx="2" fill="#111"/></svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function DriverHome({ onRequest, onEarnings, onHistory, onLogout }: { onRequest: ()=>void; onEarnings: ()=>void; onHistory: ()=>void; onLogout: ()=>void }) {
  const { online, setOnline, driverName, trips, nextOffer } = useDriver()
  const [sheet, setSheet] = useState<null | 'profile' | 'docs' | 'vehicle'>(null)
  const [toast, setToast] = useState('')
  const autoFired = useRef(false)

  const todayEarnings = completedTotal(tripsForPeriod(trips, 'daily'))
  const todayTrips = tripsForPeriod(trips, 'daily').filter(t => t.status === 'completed').length
  const initials = driverName.trim().split(/\s+/).slice(0, 2).map(w => w[0]?.toUpperCase() ?? '').join('') || 'D'
  const firstName = driverName.trim().split(/\s+/)[0] || 'Driver'

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 2000)
  }

  // While online, a request arrives on its own after a short wait.
  useEffect(() => {
    if (!online || autoFired.current) return
    const t = setTimeout(() => {
      if (autoFired.current) return
      autoFired.current = true
      nextOffer()
      onRequest()
    }, 15000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online])

  const simulate = () => {
    if (!online) {
      flash('You’re offline — go online to receive trips')
      return
    }
    nextOffer()
    onRequest()
  }

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-4 flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-800 text-gray-900 tracking-tight">{firstName}</h3>
          <p className="text-sm text-gray-500 font-600 mt-0.5 flex items-center gap-1.5">
            <span className={`w-2 h-2 rounded-full ${online ? 'bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.6)]' : 'bg-gray-300'}`}/>
            {online ? 'Online & Ready' : 'Offline'}
          </p>
        </div>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setOnline(o => !o)}
            className={`relative w-14 h-8 rounded-full transition-all border-2 ${online ? 'bg-green-500 border-green-500' : 'bg-gray-200 border-gray-200'}`}
            aria-label="Toggle online"
          >
            <div className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow-sm transition-all ${online ? 'left-7' : 'left-0.5'}`}/>
          </button>
          <button onClick={() => setSheet('profile')} className="active:scale-95 transition-transform">
            <Avatar initials={initials} className="w-11 h-11 rounded-full text-sm ring-2 ring-white shadow-sm" />
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="px-5 mb-5">
         <button onClick={onEarnings} className="relative w-full overflow-hidden text-left bg-gray-900 rounded-3xl p-5 text-white flex justify-between items-center shadow-lg shadow-gray-900/20 active:scale-[0.99] transition-transform">
            <div className="absolute -top-10 -right-10 w-36 h-36 rounded-full bg-[#E11D48]/30 blur-2xl pointer-events-none"/>
            <div>
               <p className="text-gray-400 text-xs font-600 uppercase tracking-wider mb-1">Today's Earnings</p>
               <p className="text-3xl font-800 tracking-tight">TT$ {todayEarnings.toLocaleString()}</p>
            </div>
            <div className="relative text-right flex flex-col items-end">
               <p className="text-gray-400 text-xs font-600 uppercase tracking-wider mb-1">Trips</p>
               <p className="text-xl font-800 tracking-tight">{todayTrips}</p>
               <span className="text-xs font-700 text-[#FF6B8A] flex items-center gap-1 mt-1">Details
                 <svg width="11" height="11" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round"/></svg>
               </span>
            </div>
         </button>
      </div>

      {/* Map */}
      <div className="relative flex-1 mx-5 rounded-3xl overflow-hidden mb-5 border border-gray-100 shadow-sm isolate">
        <RideMapView pickup={POS_CENTER} cars={carsAround(POS_CENTER)} />
        {online && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/5">
             <div className="absolute inset-0 flex items-center justify-center">
                 <div className="w-48 h-48 rounded-full border border-[#E11D48]/40 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite] absolute"/>
                 <div className="w-32 h-32 rounded-full border border-[#E11D48]/60 animate-[ping_2s_cubic-bezier(0,0,0.2,1)_infinite_0.5s] absolute"/>
             </div>
            <div className="bg-white/95 backdrop-blur-md rounded-full px-5 py-2.5 shadow-lg flex items-center gap-2 z-10 border border-gray-100">
              <div className="w-2 h-2 bg-[#E11D48] rounded-full animate-pulse"/>
              <p className="text-sm font-700 text-gray-800">Finding trips...</p>
            </div>
          </div>
        )}
      </div>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)}
        title={sheet === 'profile' ? 'Driver profile' : sheet === 'vehicle' ? 'My vehicle' : 'Documents'}>
        {sheet === 'profile' && (
          <div>
            <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-4">
              <Avatar initials={initials} className="w-16 h-16 rounded-2xl text-lg" />
              <div className="flex-1">
                <p className="font-800 text-gray-900">{driverName}</p>
                <p className="text-xs text-gray-400 font-500">+1 868 555 0177</p>
                <div className="flex items-center gap-1 mt-1">
                  <Star filled size={13} />
                  <span className="text-xs font-700 text-gray-700">4.92</span>
                  <span className="text-xs text-gray-400 font-500">· 1,867 trips · since 2023</span>
                </div>
              </div>
            </div>
            <div className="space-y-1 mb-4">
              <Row label="My vehicle" sub="Honda Fit · THP 2358" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} onClick={() => setSheet('vehicle')} />
              <Row label="Documents" sub="3 valid · 1 expiring in 12 days" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} onClick={() => setSheet('docs')} />
              <Row label="Payout & bank" sub="Weekly · ScotiaBank ••4417" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} onClick={() => setSheet(null)} />
              <Row label="Help & support" right={<svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} onClick={() => setSheet(null)} />
            </div>
            <button onClick={() => { setSheet(null); onLogout() }} className="w-full py-3.5 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Log out</button>
          </div>
        )}
        {sheet === 'vehicle' && (
          <div className="bg-gray-50 rounded-2xl p-4">
            <Row label="Model" right={<span className="text-sm font-700 text-gray-900">Honda Fit 1.5</span>} />
            <Row label="Plate" right={<span className="text-sm font-800 text-gray-900">THP 2358</span>} />
            <Row label="Color" right={<span className="text-sm font-700 text-gray-900">Silver</span>} />
            <Row label="Insurance" right={<span className="text-sm font-700 text-green-600">Valid to Jun 2027</span>} />
            <Row label="Inspection" right={<span className="text-sm font-700 text-gray-900">Passed · Aug 2026</span>} />
          </div>
        )}
        {sheet === 'docs' && (
          <div className="space-y-2">
            {[
              { l: 'Driver’s licence', s: 'Valid until Mar 2028', ok: true },
              { l: 'Police clearance', s: 'Valid until Jan 2027', ok: true },
              { l: 'Vehicle insurance', s: 'Valid until Jun 2027', ok: true },
              { l: 'Roadworthiness cert', s: 'Expires in 12 days — renew now', ok: false },
            ].map(d => (
              <div key={d.l} className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-gray-100">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${d.ok ? 'bg-green-50' : 'bg-red-50'}`}>
                  {d.ok
                    ? <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                    : <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 8v5m0 3v.5M10.3 3.9L2.6 17.4A2 2 0 004.3 20.4h15.4a2 2 0 001.7-3L13.7 3.9a2 2 0 00-3.4 0z" stroke="#E11D48" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>}
                </div>
                <div className="flex-1">
                  <p className="text-sm font-700 text-gray-900">{d.l}</p>
                  <p className={`text-xs font-500 ${d.ok ? 'text-gray-400' : 'text-[#E11D48] font-600'}`}>{d.s}</p>
                </div>
              </div>
            ))}
            <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111] mt-1">Upload renewal</button>
          </div>
        )}
      </Sheet>

      {toast && (
        <div className="absolute left-5 right-5 bottom-24 z-[1150] anim-fade">
          <div className="bg-gray-900 text-white text-xs font-600 px-4 py-3 rounded-xl shadow-lg text-center">
            {toast}
          </div>
        </div>
      )}

      {/* Bottom nav */}
      <div className="flex justify-around items-center px-6 py-4 border-t border-gray-100 bg-white">
        {[
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'Home', active:true, action:null},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#ccc" strokeWidth="2.5"/></svg>, label:'Simulate', active:false, action:simulate},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'Earnings', active:false, action:onEarnings},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 6h16M4 12h16M4 18h16" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'History', active:false, action:onHistory}
        ].map(item => (
          <button key={item.label} onClick={item.action || undefined} className="flex flex-col items-center gap-1.5">
            {item.icon}
            <span className={`text-[10px] font-700 ${item.active ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

const FALLBACK_OFFER = {
  id: 'fallback',
  rider: 'Tariq Ahmed',
  initials: 'TA',
  rating: 4.9,
  riderTrips: 212,
  from: MOVIE_TOWNE,
  to: PIARCO,
  fare: 45,
  pickupKm: 0.5,
  pickupEta: 2,
  payment: 'Card ••8821',
  note: 'Blue shirt, by the cinema gate',
}

function IncomingRequest({ onAccept, onReject }: { onAccept: ()=>void; onReject: ()=>void }) {
  const { offer, clearOffer } = useDriver()
  const trip = offer ?? FALLBACK_OFFER
  const [surge, setSurge] = useState(0)
  const [count, setCount] = useState(8)
  const [sheet, setSheet] = useState<null | 'rider' | 'route'>(null)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const fare = trip.fare + surge

  const reject = () => { clearOffer(); onReject() }

  useEffect(() => {
    const ctrl = new AbortController()
    fetchRoute(trip.from, trip.to, ctrl.signal)
      .then(r => setRoute(r))
      .catch(() => {})
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id])

  useEffect(() => {
    if (sheet) return
    if (count <= 0) { reject(); return }
    const t = setTimeout(() => setCount(c => c - 1), 1000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [count, sheet])

  return (
    <div className="flex flex-col bg-gray-900 relative" style={{height: 680}}>
      <div className="relative flex-1 isolate">
        <RideMapView
          pickup={trip.from}
          dest={trip.to}
          route={route?.coords ?? null}
          cars={carsAround(trip.from, 3)}
        />
        <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-black/60 via-black/10 to-transparent pointer-events-none"/>

        <button onClick={() => setSheet('route')}
          className="absolute top-4 right-4 z-[1100] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full text-xs font-700 text-gray-900 shadow-md flex items-center gap-1.5 active:scale-95 transition-transform">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#111" strokeWidth="2.6" strokeLinecap="round"/></svg>
          Trip preview
        </button>
        {route && (
          <div className="absolute top-4 left-4 z-[1100] bg-white/95 backdrop-blur-md px-3.5 py-2 rounded-full shadow-md anim-fade">
            <span className="text-xs font-700 text-gray-900">{formatDistance(route.distanceM)} · {formatDuration(route.durationS)}</span>
          </div>
        )}
      </div>

      {/* Request card */}
      <div className="absolute bottom-4 left-4 right-4 bg-white rounded-3xl p-5 shadow-2xl">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2 bg-green-50 px-3 py-1.5 rounded-full border border-green-100">
            <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
            <span className="text-xs font-800 tracking-wide text-green-700">New Request</span>
          </div>
          <div className={`w-10 h-10 rounded-full border-2 flex items-center justify-center font-800 ${count <= 3 ? 'border-red-200 text-[#E11D48] animate-pulse' : 'border-gray-100 text-gray-900'}`}>{count}s</div>
        </div>

        <button onClick={() => setSheet('rider')} className="w-full flex items-center gap-4 mb-5 border-b border-gray-100 pb-5 text-left active:opacity-70 transition-opacity">
          <Avatar initials={trip.initials} className="w-14 h-14 rounded-2xl text-base shadow-sm" />
          <div>
            <p className="font-800 text-lg text-gray-900 tracking-tight">{trip.rider.split(' ')[0]}</p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className="text-gray-900 text-xs font-700 bg-gray-100 px-1.5 py-0.5 rounded flex items-center gap-1">
                 <Star filled size={11} />
                 {trip.rating.toFixed(1)}
              </span>
              <span className="text-xs text-gray-500 font-500">Pickuptt X</span>
            </div>
          </div>
          <div className="ml-auto text-right">
            <p className="font-800 text-2xl text-gray-900 tracking-tight">TT$ {fare}</p>
            <p className="text-xs text-gray-500 font-600 mt-0.5">{route ? formatDistance(route.distanceM) : '3.2 km'} total</p>
          </div>
        </button>

        <div className="relative mb-6 ml-2">
           <div className="absolute left-[3px] top-3 bottom-3 w-0.5 bg-gray-200"></div>
           <div className="space-y-4">
             <div className="flex gap-4 items-center">
               <div className="w-2 h-2 rounded-full bg-gray-900 z-10 ring-4 ring-white"/>
               <div>
                  <span className="text-gray-900 font-700 text-sm block">{trip.from.label}</span>
                  <span className="text-gray-400 font-500 text-xs block">{trip.pickupEta} min away ({trip.pickupKm} km)</span>
               </div>
             </div>
             <div className="flex gap-4 items-center">
               <div className="w-2 h-2 rounded-sm bg-[#E11D48] z-10 ring-4 ring-white"/>
               <div>
                  <span className="text-gray-900 font-700 text-sm block">{trip.to.label}</span>
                  <span className="text-gray-400 font-500 text-xs block">{route ? formatDuration(route.durationS) : '14 min'} trip ({route ? formatDistance(route.distanceM) : '2.7 km'})</span>
               </div>
             </div>
           </div>
        </div>

        <div className="flex gap-3">
          <button onClick={reject} className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={onAccept} className="flex-1 h-14 rounded-full font-800 text-base text-white shadow-[0_8px_24px_rgba(0,0,0,0.28)] active:scale-[0.98] transition-transform bg-[#111]">
            Accept Ride
          </button>
        </div>
      </div>

      <Sheet open={sheet === 'rider'} onClose={() => setSheet(null)} title={`About ${trip.rider.split(' ')[0]}`}>
        <div className="flex items-center gap-4 bg-gray-50 rounded-2xl p-4 mb-4">
          <Avatar initials={trip.initials} className="w-16 h-16 rounded-2xl text-lg" />
          <div>
            <p className="font-800 text-gray-900">{trip.rider}</p>
            <p className="text-xs text-gray-400 font-500">Member since 2024</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star filled size={13} />
              <span className="text-xs font-700 text-gray-700">{trip.rating.toFixed(1)}</span>
              <span className="text-xs text-gray-400 font-500">· {trip.riderTrips} trips</span>
            </div>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Payment" right={<span className="text-sm font-700 text-gray-900">{trip.payment}</span>} />
          <Row label="Notes" right={<span className="text-sm font-700 text-gray-900">{trip.note ? `“${trip.note}”` : 'No notes'}</span>} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Message</button>
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Call rider</button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'route'} onClose={() => setSheet(null)} title="Trip preview">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label={`${trip.from.label} → ${trip.to.label}`} sub={route ? `${formatDistance(route.distanceM)} · about ${formatDuration(route.durationS)}` : '3.2 km · about 16 min'} />
          <Row label="Pickup ETA" right={<span className="text-sm font-700 text-gray-900">{trip.pickupEta} min ({trip.pickupKm} km)</span>} />
          <Row label={surge > 0 ? 'Base fare + surge' : 'Base fare'} right={<span className="text-sm font-700 text-gray-900">TT$ {fare}.00</span>} />
          <Row label="Platform fee (15%)" right={<span className="text-sm font-700 text-gray-900">- TT$ {Math.round(fare * 0.15)}.00</span>} />
          <Row label="You earn" right={<span className="text-sm font-800 text-gray-900">TT$ {Math.round(fare * 0.85)}.00</span>} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSurge(5)} className={`flex-1 py-3 rounded-xl border-2 font-700 text-sm transition-all ${surge === 5 ? 'border-[#111] bg-gray-50' : 'border-gray-100 text-gray-500'}`}>+TT$ 5 surge</button>
          <button onClick={() => setSurge(0)} className={`flex-1 py-3 rounded-xl border-2 font-700 text-sm transition-all ${surge === 0 ? 'border-[#111] bg-gray-50' : 'border-gray-100 text-gray-500'}`}>Standard</button>
        </div>
      </Sheet>
    </div>
  )
}

function ActiveRide({ onComplete, onBack }: { onComplete: ()=>void; onBack: ()=>void }) {
  const { offer, clearOffer, addTrip, credit } = useDriver()
  const trip = offer ?? FALLBACK_OFFER
  const [stage, setStage] = useState<'pickup'|'arrived'|'inprogress'>('pickup')
  const [sheet, setSheet] = useState<null | 'call' | 'nav' | 'report'>(null)
  const [toPickup, setToPickup] = useState<RouteResult | null>(null)
  const [tripRoute, setTripRoute] = useState<RouteResult | null>(null)
  const [progress, setProgress] = useState(0)
  const [waited, setWaited] = useState(0)

  const driverStart: Place = { ...trip.from, id: 'driver', lat: trip.from.lat + 0.009, lng: trip.from.lng + 0.007 }

  useEffect(() => {
    const ctrl = new AbortController()
    fetchRoute(driverStart, trip.from, ctrl.signal).then(r => setToPickup(r)).catch(() => {})
    fetchRoute(trip.from, trip.to, ctrl.signal).then(r => setTripRoute(r)).catch(() => {})
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [trip.id])

  useEffect(() => { setProgress(0) }, [stage])

  // Vehicle creeps along the active leg until it reaches the next phase.
  useEffect(() => {
    if (stage === 'arrived') return
    const active = stage === 'pickup' ? toPickup : tripRoute
    if (!active) return
    const id = setInterval(() => {
      setProgress(p => {
        const next = p + 0.5 / 28
        return next >= 1 ? 1 : next
      })
    }, 500)
    return () => clearInterval(id)
  }, [stage, toPickup, tripRoute])

  // Phase auto-advances when the leg completes.
  useEffect(() => {
    if (progress < 1) return
    if (stage === 'pickup') setStage('arrived')
    if (stage === 'inprogress') finish()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, stage])

  // Rider boards after a short wait (or via the button).
  useEffect(() => {
    if (stage !== 'arrived') return
    if (waited >= 5) { setStage('inprogress'); return }
    const t = setTimeout(() => setWaited(w => w + 1), 1000)
    return () => clearTimeout(t)
  }, [stage, waited])

  const startTrip = () => { setWaited(5); setStage('inprogress') }

  const finish = () => {
    const now = new Date()
    const hh = String(now.getHours()).padStart(2, '0')
    const mm = String(now.getMinutes()).padStart(2, '0')
    if (offer) {
      addTrip({
        rider: trip.rider,
        from: trip.from.label,
        to: trip.to.label,
        fare: trip.fare,
        status: 'completed',
        dateLabel: `Today ${hh}:${mm}`,
        bucket: 'today',
      })
      credit(Math.round(trip.fare * (1 - PLATFORM_FEE) * 100) / 100)
      clearOffer()
    }
    onComplete()
  }

  const activeRoute = stage === 'inprogress' ? tripRoute : toPickup
  const target = stage === 'inprogress' ? trip.to : trip.from
  const remainingS = activeRoute ? activeRoute.durationS * (1 - progress) : null
  const etaLabel = stage === 'arrived'
    ? `Boarding in ${Math.max(0, 5 - waited)}s`
    : remainingS == null ? '—' : `${Math.max(1, Math.ceil(remainingS / 60))} min`
  const carPos: [number, number] | null = activeRoute
    ? pointAt(activeRoute.coords, progress)
    : [driverStart.lat, driverStart.lng]

  const stageLabel = stage === 'pickup' ? 'Heading to pickup' : stage === 'arrived' ? `Waiting for ${trip.rider.split(' ')[0]}` : 'Trip in progress'
  const stageColor = stage === 'pickup' ? 'bg-indigo-600 animate-pulse' : stage === 'arrived' ? 'bg-amber-500 animate-pulse' : 'bg-green-500'

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      <div className="relative flex-1 isolate">
        <RideMapView
          dest={target}
          route={activeRoute?.coords ?? null}
          cars={carPos ? [carPos] : []}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 to-transparent pointer-events-none"/>

        {/* Back button */}
        <button onClick={onBack}
          className="absolute top-5 left-5 z-[1100] w-10 h-10 rounded-full bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* Navigation panel */}
        <button onClick={() => setSheet('nav')} className="absolute top-5 left-[68px] right-5 z-[1100] bg-gray-900 rounded-3xl shadow-lg p-4 flex items-center gap-4 text-white text-left active:scale-[0.99] transition-transform">
           <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
           </div>
           <div>
              <p className="text-3xl font-800 tracking-tight">{activeRoute ? formatDistance(activeRoute.distanceM * (1 - progress)) : '…'}</p>
              <p className="text-gray-400 text-sm font-600">Turn right on Wrightson Rd</p>
           </div>
        </button>
      </div>

      <div className="bg-white rounded-t-3xl -mt-6 z-10 px-6 pt-5 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.05)]">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-6"/>

        <div className="flex items-center justify-between mb-6">
           <div className="flex items-center gap-2">
             <div className={`w-2.5 h-2.5 rounded-full ${stageColor}`}/>
             <span className="text-sm font-800 uppercase tracking-wider text-gray-900">
               {stageLabel}
             </span>
           </div>
           <span className="font-800 text-gray-900">{etaLabel}</span>
        </div>

        <div className="flex items-center gap-4 bg-gray-50 border border-gray-100 rounded-2xl p-4 mb-6">
          <Avatar initials={trip.initials} className="w-12 h-12 rounded-xl text-sm" />
          <div className="flex-1">
            <p className="font-800 text-base text-gray-900">{trip.rider.split(' ')[0]}</p>
            <p className="text-xs font-600 text-gray-500">{stage === 'inprogress' ? trip.to.label : trip.from.label}</p>
          </div>
          <button onClick={() => setSheet('call')} className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-gray-700 active:scale-95 transition-transform">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>

        <button onClick={() => setSheet('report')} className="w-full mb-4 text-center text-xs font-700 text-gray-400 hover:text-gray-600 transition-colors">
          Report an issue with this trip
        </button>

        {stage === 'pickup' && (
          <button onClick={() => setStage('arrived')} className="w-full py-4 rounded-full font-800 text-lg text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] active:scale-[0.98] transition-transform bg-[#111]">
            I’m at the pickup
          </button>
        )}
        {stage === 'arrived' && (
          <button onClick={startTrip} className="w-full py-4 rounded-full font-800 text-lg text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] active:scale-[0.98] transition-transform bg-[#111]">
            {waited >= 5 ? 'Start trip now' : `Rider boarding · ${Math.max(0, 5 - waited)}s`}
          </button>
        )}
        {stage === 'inprogress' && (
          <button onClick={finish} className="w-full py-4 rounded-full font-800 text-lg text-white shadow-[0_6px_20px_rgba(225,29,72,0.3)] active:scale-[0.98] transition-transform" style={{background: RED}}>
            {progress >= 1 ? 'Complete Drop-off' : 'Complete drop-off early'}
          </button>
        )}
      </div>

      <Sheet open={sheet === 'call'} onClose={() => setSheet(null)} title="Contact rider">
        <div className="space-y-2 mb-2">
          {[
            { l: `Call ${trip.rider.split(' ')[0]}`, s: '+1 868 555 0198' },
            { l: 'Send SMS', s: '“I’m outside the cinema gate”' },
            { l: 'Call safety line', s: 'Pickuptt 24/7 support' },
          ].map(o => (
            <button key={o.l} onClick={() => setSheet(null)} className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:bg-gray-50 text-left transition-colors">
              <span className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div>
                <p className="text-sm font-700 text-gray-900">{o.l}</p>
                <p className="text-xs text-gray-400 font-500">{o.s}</p>
              </div>
            </button>
          ))}
        </div>
      </Sheet>

      <Sheet open={sheet === 'nav'} onClose={() => setSheet(null)} title="Turn-by-turn">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4 space-y-4">
          {[
            { d: '200 m', i: 'Turn right on Wrightson Rd', now: true },
            { d: '1.2 km', i: 'Continue onto Independence Ave', now: false },
            { d: '900 m', i: 'Keep left at the roundabout', now: false },
            { d: '600 m', i: `Arrive at ${trip.to.label}`, now: false },
          ].map(s => (
            <div key={s.i} className="flex gap-3 items-center">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${s.now ? 'bg-gray-900' : 'bg-white'}`}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 5l7 7-7 7" stroke={s.now ? 'white' : '#9CA3AF'} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div className="flex-1">
                <p className={`text-sm font-700 ${s.now ? 'text-gray-900' : 'text-gray-600'}`}>{s.i}</p>
                <p className="text-xs text-gray-400 font-500">{s.d}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Mute</button>
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Open in maps</button>
        </div>
      </Sheet>

      <Sheet open={sheet === 'report'} onClose={() => setSheet(null)} title="Report an issue">
        <div className="space-y-2 mb-4">
          {['Rider not responding', 'Wrong pickup location', 'Safety concern', 'Fare looks incorrect', 'Something else'].map(o => (
            <button key={o} onClick={() => setSheet(null)} className="w-full flex items-center justify-between p-4 rounded-xl border-2 border-gray-100 hover:bg-gray-50 text-left transition-colors">
              <span className="text-sm font-700 text-gray-900">{o}</span>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Submit report</button>
      </Sheet>
    </div>
  )
}

function EarningsScreen({ onBack }: { onBack: ()=>void }) {
  const { trips, wallet, cashOut } = useDriver()
  const [period, setPeriod] = useState<'daily'|'weekly'|'monthly'>('weekly')
  const [sheet, setSheet] = useState<null | 'day' | 'cashout'>(null)
  const [day, setDay] = useState(4)
  const [amount, setAmount] = useState(5000)
  const [withdrawn, setWithdrawn] = useState(false)

  const days = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun']
  const todayIdx = (new Date().getDay() + 6) % 7
  const periodTrips = tripsForPeriod(trips, period)
  const gross = completedTotal(periodTrips)
  const net = Math.round(gross * (1 - PLATFORM_FEE))
  const commission = Math.round(gross * PLATFORM_FEE)
  const doneCount = periodTrips.filter(t => t.status === 'completed').length

  const dayEarn = [2850, 3400, 1900, 3050, 4100, 2450, 3500]
  dayEarn[todayIdx] = Math.round(completedTotal(tripsForPeriod(trips, 'daily')) * (1 - PLATFORM_FEE))
  const dayMax = Math.max(...dayEarn, 1)
  const bars = dayEarn.map(v => Math.max(10, Math.round((v / dayMax) * 100)))
  const dayCounts = [2, 3, 1, 2, 3, 1, 0]
  if (day === todayIdx) dayCounts[todayIdx] = tripsForPeriod(trips, 'daily').filter(t => t.status === 'completed').length

  const cashoutOptions = [1000, 5000, 10000].filter(a => a < wallet).concat(wallet > 0 ? [wallet] : [0]).slice(0, 4)
  const cashoutAmt = Math.min(amount, wallet)

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 -ml-1 rounded-full bg-red-50 flex items-center justify-center active:scale-95 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={RED} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <h2 className="font-800 text-xl text-gray-900">Earnings</h2>
      </div>

      <div className="px-5 flex-1 overflow-y-auto pb-4">
        <div className="flex gap-1 mb-4 bg-gray-100 p-1 rounded-xl">
          {(['daily','weekly','monthly'] as const).map(p => (
            <button key={p} onClick={() => setPeriod(p)} className={`flex-1 py-1.5 rounded-lg text-xs font-700 capitalize transition-all ${period===p?'bg-white text-gray-900 shadow':'text-gray-400'}`}>{p}</button>
          ))}
        </div>

        <div className="bg-red-50 border-2 border-[#E11D48] rounded-2xl p-4 mb-4">
          <p className="text-xs text-gray-400 font-500 mb-1">{period === 'daily' ? "Today's" : period==='weekly'?"This week's":"This month's"} earnings</p>
          <p className="text-3xl font-800 text-gray-900">TT$ {net.toLocaleString()}</p>
          <p className="text-xs text-green-600 font-600 mt-1">{doneCount} completed {doneCount === 1 ? 'trip' : 'trips'} · {period === 'daily' ? 'today' : period === 'weekly' ? 'this week' : 'this month'}</p>
        </div>

        {/* Bar chart */}
        <div className="bg-white border border-gray-100 rounded-2xl p-4 mb-4">
          <p className="text-xs font-700 text-gray-500 mb-3">Daily breakdown · tap a bar</p>
          <div className="flex items-end gap-2 h-24">
            {bars.map((h, i) => (
              <button key={i} onClick={() => { setDay(i); setSheet('day') }} className="flex-1 flex flex-col items-center gap-1 group">
                <div className="w-full rounded-t-md transition-all group-hover:opacity-100" style={{height: `${h}%`, background: i===day?RED:'#FDD', opacity: i===day?1:0.7}}/>
                <span className={`text-[9px] ${i===day?'text-gray-900 font-700':'text-gray-400'}`}>{days[i]}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-2 mb-4">
          {[
            {label:'Total Trips', val:`${doneCount}`},
            {label:'Gross fares', val:`TT$ ${gross.toLocaleString()}`},
            {label:'Wallet credit', val:`TT$ ${wallet.toLocaleString()}`},
            {label:'Commission (15%)', val:`- TT$ ${commission.toLocaleString()}`},
            {label:'Net Earnings', val:`TT$ ${net.toLocaleString()}`, bold: true},
          ].map(item => (
            <div key={item.label} className="flex justify-between items-center py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-500 font-500">{item.label}</span>
              <span className={`text-sm font-${item.bold?'800':'600'} ${item.bold?'text-gray-900':'text-gray-600'}`}>{item.val}</span>
            </div>
          ))}
        </div>

        <button onClick={() => setSheet('cashout')} className="w-full py-3.5 rounded-full font-800 text-sm text-white shadow-lg active:scale-[0.98] transition-transform" style={{background: RED, boxShadow: '0 8px 24px rgba(225,29,72,0.35)'}}>
          Cash out wallet
        </button>
      </div>

      <Sheet open={sheet === 'day'} onClose={() => setSheet(null)} title={`${days[day]} earnings`}>
        <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4">
          <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">Net for {days[day]}</p>
          <p className="text-3xl font-800 tracking-tight">TT$ {dayEarn[day].toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Trips completed" right={<span className="text-sm font-700 text-gray-900">{dayCounts[day]}</span>} />
          <Row label="Online hours" right={<span className="text-sm font-700 text-gray-900">6.5 h</span>} />
          <Row label="Gross fares" right={<span className="text-sm font-700 text-gray-900">TT$ {Math.round(dayEarn[day] / (1 - PLATFORM_FEE)).toLocaleString()}</span>} />
          <Row label="Commission (15%)" right={<span className="text-sm font-700 text-gray-900">- TT$ {Math.round(dayEarn[day]*0.15).toLocaleString()}</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
      </Sheet>

      <Sheet open={sheet === 'cashout'} onClose={() => { setSheet(null); setWithdrawn(false) }} title="Cash out">
        <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4 flex justify-between items-center">
          <div>
            <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">Available balance</p>
            <p className="text-3xl font-800 tracking-tight">TT$ {wallet.toLocaleString()}</p>
            {withdrawn && <p className="text-xs font-700 text-green-400 mt-1">TT$ {cashoutAmt.toLocaleString()} sent to Scotia ••4417</p>}
          </div>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="#fff" strokeWidth="2"/><path d="M2.5 10h19" stroke="#fff" strokeWidth="2"/></svg>
        </div>
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Amount</p>
        <div className="flex gap-2 mb-3">
          {cashoutOptions.map(a => (
            <button key={a} onClick={() => { setAmount(a); setWithdrawn(false) }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-700 border-2 transition-all ${amount===a?'border-[#111] bg-gray-50 text-gray-900':'border-gray-100 text-gray-500'}`}>
              {a === wallet ? 'All' : `TT$ ${(a/1000).toFixed(a % 1000 === 0 ? 0 : 1)}k`}
            </button>
          ))}
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Destination" right={<span className="text-sm font-700 text-gray-900">Scotia ••4417</span>} />
          <Row label="Arrives" right={<span className="text-sm font-700 text-gray-900">Within 1 business day</span>} />
        </div>
        <button
          disabled={wallet <= 0}
          onClick={() => { cashOut(cashoutAmt); setWithdrawn(true) }}
          className={`w-full py-3.5 rounded-full font-800 text-sm text-white transition-transform ${wallet <= 0 ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98] bg-[#111]'}`}>
          {wallet <= 0 ? 'No balance to withdraw' : withdrawn ? 'Withdraw again' : `Withdraw TT$ ${cashoutAmt.toLocaleString()}`}
        </button>
      </Sheet>
    </div>
  )
}

function HistoryScreen({ onBack }: { onBack: ()=>void }) {
  const { trips } = useDriver()
  const [detail, setDetail] = useState<DriverTrip | null>(null)
  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 -ml-1 rounded-full bg-red-50 flex items-center justify-center active:scale-95 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke={RED} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <h2 className="font-800 text-xl text-gray-900">Trip History</h2>
      </div>
      <div className="flex-1 overflow-auto px-5 space-y-3">
        {trips.length === 0 && (
          <p className="text-sm text-gray-400 font-500 text-center py-10">No trips yet — go online to start earning.</p>
        )}
        {trips.map((t) => (
          <button key={t.id} onClick={() => setDetail(t)} className="w-full text-left bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors active:scale-[0.99] border-l-[3px] border-[#E11D48]">
            <div className="flex justify-between items-center mb-2">
              <span className="font-700 text-sm text-gray-900">{t.rider}</span>
              <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${t.status==='completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{t.status}</span>
            </div>
            <div className="space-y-1 mb-2">
              <div className="flex gap-2 items-center text-xs text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full" style={{background:RED}}/>{t.from}
              </div>
              <div className="flex gap-2 items-center text-xs text-gray-400">
                <div className="w-1.5 h-1.5 rounded-full bg-gray-900"/>{t.to}
              </div>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-400">{t.dateLabel}</span>
              <span className="font-800 text-sm text-gray-900">TT$ {t.fare.toLocaleString()}</span>
            </div>
          </button>
        ))}
      </div>

      <Sheet open={detail !== null} onClose={() => setDetail(null)} title="Trip details">
        {detail && (
          <div>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
              <Avatar initials={detail.rider.split(' ').map(w => w[0]).join('')} className="w-12 h-12 rounded-xl text-sm" />
              <div className="flex-1">
                <p className="font-800 text-gray-900">{detail.rider}</p>
                <p className="text-xs text-gray-400 font-500">{detail.dateLabel}</p>
              </div>
              <span className={`text-xs font-700 px-2 py-0.5 rounded-full ${detail.status==='completed'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{detail.status}</span>
            </div>
            <div className="relative mb-4 ml-2">
              <div className="absolute left-[3px] top-3 bottom-3 w-0.5 bg-gray-200"/>
              <div className="space-y-4">
                <div className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-full bg-gray-900 z-10 ring-4 ring-white"/>
                  <span className="text-gray-900 font-700 text-sm">{detail.from}</span>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="w-2 h-2 rounded-sm" style={{background:RED}}/>
                  <span className="text-gray-900 font-700 text-sm">{detail.to}</span>
                </div>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Fare" right={<span className="text-sm font-700 text-gray-900">TT$ {detail.fare.toLocaleString()}</span>} />
              <Row label="Commission (15%)" right={<span className="text-sm font-700 text-gray-900">- TT$ {Math.round(detail.fare * PLATFORM_FEE)}</span>} />
              <Row label="You earned" right={<span className="text-sm font-800 text-gray-900">TT$ {Math.round(detail.fare * (1 - PLATFORM_FEE))}</span>} />
            </div>
            <button onClick={() => setDetail(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
          </div>
        )}
      </Sheet>
    </div>
  )
}

const VEHICLE_TYPES = ['Sedan', 'SUV', 'Bike', 'Van']
const authInput = 'w-full px-4 py-3.5 rounded-xl border-2 border-gray-100 bg-gray-50 outline-none text-sm font-600 text-gray-900 placeholder-gray-300 focus:border-[#E11D48] focus:bg-white transition-colors'

function AuthField({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-[11px] font-700 uppercase tracking-wider text-gray-400 mb-1.5">{label}</p>
      {children}
    </div>
  )
}

function DriverAuth({ onAuth }: { onAuth: () => void }) {
  const { setDriverName } = useDriver()
  const [mode, setMode] = useState<'signin' | 'signup'>('signin')
  const [email, setEmail] = useState('keston@example.com')
  const [password, setPassword] = useState('password123')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [vehicle, setVehicle] = useState('')
  const [error, setError] = useState('')

  const submit = () => {
    if (!email.trim() || !password) { setError('Enter your email and password to continue.'); return }
    if (email.includes('@') === false) { setError('Enter a valid email address.'); return }
    if (mode === 'signup') {
      if (!name.trim() || !phone.trim()) { setError('Fill in your name and phone number.'); return }
      if (!vehicle) { setError('Select the vehicle you drive.'); return }
      if (password.length < 6) { setError('Password must be at least 6 characters.'); return }
    }
    setError('')
    if (mode === 'signup' && name.trim()) setDriverName(name.trim())
    onAuth()
  }

  return (
    <div className="flex flex-col bg-white relative" style={{ height: 680 }}>
      {/* Hero */}
      <div className="shrink-0 px-6 pt-7 pb-6 text-white" style={{ background: '#111' }}>
        <div className="flex items-center gap-2.5 mb-5">
          <img src={logo} alt="Pickuptt" className="w-8 h-8 rounded-lg object-cover" />
          <span className="font-800 text-sm tracking-tight">Pickuptt Driver</span>
          <span className="ml-auto w-2 h-2 rounded-full" style={{ background: RED }} />
        </div>
        <h1 className="text-2xl font-800 tracking-[-0.03em] leading-tight mb-1.5">
          {mode === 'signin' ? 'Back on the road.' : 'Drive with Pickuptt.'}
        </h1>
        <p className="text-xs text-gray-400 font-500">
          {mode === 'signin' ? 'Sign in to start accepting trips.' : 'Apply in minutes — get approved in days.'}
        </p>
      </div>

      <div className="flex-1 overflow-y-auto px-6 pt-5 pb-6 space-y-4">
        {/* Mode tabs */}
        <div className="flex bg-gray-100 rounded-full p-1 mb-1">
          {(['signin', 'signup'] as const).map(m => (
            <button key={m} onClick={() => { setMode(m); setError('') }}
              className={`flex-1 py-2.5 rounded-full text-xs font-700 transition-all ${mode === m ? 'bg-white text-[#E11D48] shadow-sm' : 'text-gray-500'}`}>
              {m === 'signin' ? 'Sign in' : 'Sign up'}
            </button>
          ))}
        </div>

        {mode === 'signup' && (
          <AuthField label="Full name">
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Keston Joseph"
              className={authInput} autoComplete="name" />
          </AuthField>
        )}

        {mode === 'signup' && (
          <AuthField label="Phone">
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="868 555 0143"
              inputMode="tel" className={authInput} autoComplete="tel" />
          </AuthField>
        )}

        <AuthField label="Email">
          <input value={email} onChange={e => setEmail(e.target.value)} placeholder="you@example.com"
            type="email" className={authInput} autoComplete="email" />
        </AuthField>

        <AuthField label="Password">
          <input value={password} onChange={e => setPassword(e.target.value)} placeholder="At least 6 characters"
            type="password" className={authInput} autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
        </AuthField>

        {mode === 'signup' && (
          <div>
            <p className="text-[11px] font-700 uppercase tracking-wider text-gray-400 mb-1.5">Vehicle</p>
            <div className="flex gap-2">
              {VEHICLE_TYPES.map(v => (
                <button key={v} onClick={() => setVehicle(v)}
                  className={`flex-1 py-2.5 rounded-full text-xs font-700 border-2 transition-all ${vehicle === v ? 'border-[#E11D48] text-[#E11D48] bg-red-50' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
                  {v}
                </button>
              ))}
            </div>
          </div>
        )}

        {mode === 'signin' && (
          <div className="flex justify-end -mt-1">
            <button onClick={() => setError('Password reset link sent to your email.')}
              className="text-xs font-700" style={{ color: RED }}>Forgot password?</button>
          </div>
        )}

        {error && (
          <p className="text-xs font-600 px-3 py-2.5 rounded-lg bg-red-50" style={{ color: RED }}>{error}</p>
        )}

        <button onClick={submit}
          className="w-full py-4 rounded-full font-800 text-base text-white bg-[#111] hover:bg-black active:scale-[0.98] transition-all">
          {mode === 'signin' ? 'Sign in' : 'Create account'}
        </button>

        <p className="text-center text-xs text-gray-400 font-500 pt-1">
          {mode === 'signin' ? 'New driver? ' : 'Already driving? '}
          <button onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError('') }}
            className="font-700" style={{ color: RED }}>
            {mode === 'signin' ? 'Create account' : 'Sign in'}
          </button>
        </p>

        {mode === 'signup' && (
          <p className="text-[11px] text-gray-300 font-500 text-center leading-relaxed">
            By creating an account you agree to the Driver Agreement, background checks and vehicle inspections.
          </p>
        )}
      </div>
    </div>
  )
}

export default function DriverApp() {
  const [authed, setAuthed] = useState(false)
  const [screen, setScreen] = useState<Screen>('home')

  return (
    <DriverProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-10">
        <div className="flex gap-2 mb-6 flex-wrap justify-center px-4">
          {(authed ? (['home','request','active','earnings','history'] as Screen[]) : (['home'] as Screen[])).map(s => (
            <button key={s} onClick={() => setScreen(s)}
              className={`px-3 py-1 rounded-full text-xs font-600 capitalize transition-all ${authed && screen===s?'bg-[#E11D48] text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
          <button onClick={() => { setAuthed(false); setScreen('home') }}
            className="px-3 py-1 rounded-full text-xs font-600 bg-white text-gray-400 hover:bg-gray-50 border border-dashed border-gray-300 transition-all">
            {authed ? 'sign out' : 'sign in'}
          </button>
        </div>
        <PhoneFrame>
          {!authed ? (
            <DriverAuth onAuth={() => setAuthed(true)} />
          ) : (
            <>
              {screen === 'home' && <DriverHome onRequest={() => setScreen('request')} onEarnings={() => setScreen('earnings')} onHistory={() => setScreen('history')} onLogout={() => setAuthed(false)}/>}
              {screen === 'request' && <IncomingRequest onAccept={() => setScreen('active')} onReject={() => setScreen('home')}/>}
              {screen === 'active' && <ActiveRide onComplete={() => setScreen('home')} onBack={() => setScreen('home')}/>}
              {screen === 'earnings' && <EarningsScreen onBack={() => setScreen('home')}/>}
              {screen === 'history' && <HistoryScreen onBack={() => setScreen('home')}/>}
            </>
          )}
        </PhoneFrame>
      </div>
    </DriverProvider>
  )
}
