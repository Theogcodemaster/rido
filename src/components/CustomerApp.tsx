import { useEffect, useRef, useState } from 'react'
import { MapCanvas, Avatar, Star, Sheet, Toggle, Row, Route } from './shared-ui'
import { RideScreen } from './RideScreen'
import RideMapView from './RideMapView'
import { POS_CENTER, carsAround, formatDistance, formatDuration, getRecents, type Place } from '../lib/places'
import { fetchRoute, pointAt, type RouteResult } from '../lib/route'
import {
  CustomerProvider,
  useCustomer,
  initialsOf,
  firstName,
  promoDiscount,
  shortLabel,
} from './customer-store'
import logo from '../assets/logo.jpeg'

type Screen = 'splash' | 'phone' | 'otp' | 'home' | 'ride' | 'vehicle' | 'tracking' | 'complete' | 'package' | 'profile' | 'service'

const RED = '#E11D48'

function PhoneFrame({ children }: { children: React.ReactNode }) {
  return (
    <div className="relative mx-auto" style={{ width: 375, minHeight: 700 }}>
      <div className="relative bg-white rounded-[40px] overflow-hidden shadow-2xl border border-gray-100" style={{ minHeight: 700 }}>
        {/* Status bar */}
        <div className="flex justify-between items-center px-6 pt-3 pb-1 bg-white">
          <span className="text-xs font-600 text-gray-800">9:41</span>
          <div className="flex gap-1 items-center">
            <div className="flex gap-0.5">
              {[3,4,4].map((h,i) => <div key={i} className="w-1 rounded-sm bg-gray-800" style={{height: h*3}}/>)}
            </div>
            <svg width="12" height="10" viewBox="0 0 24 20" fill="none"><path d="M12 4.8C9.12 4.8 6.56 5.96 4.72 7.84L2 5.12C4.48 2.6 7.92 1 11.96 1c4.04 0 7.52 1.6 10 4.12L19.24 7.84C17.44 5.96 14.88 4.8 12 4.8z" fill="#111"/><path d="M12 10.2c-1.64 0-3.12.68-4.2 1.76L5.56 9.72C7.24 8.04 9.48 7 12 7s4.76 1.04 6.44 2.72l-2.24 2.24C15.12 10.88 13.64 10.2 12 10.2z" fill="#111"/><circle cx="12" cy="17" r="2" fill="#111"/></svg>
            <svg width="22" height="10" viewBox="0 0 44 20"><rect x="0" y="2" width="38" height="16" rx="4" stroke="#111" strokeWidth="2" fill="none"/><rect x="38" y="6" width="4" height="8" rx="2" fill="#111"/><rect x="2" y="4" width="28" height="12" rx="2" fill="#111"/></svg>
          </div>
        </div>
        {children}
      </div>
    </div>
  )
}

function SplashScreen({ onNext }: { onNext: () => void }) {
  // Splash behaves like a real launch screen: auto-advances, but the button still works.
  useEffect(() => {
    const t = setTimeout(onNext, 2600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="flex flex-col items-center justify-center relative" style={{height: 680, background: RED}}>
      <div className="text-center anim-fade">
        <div className="w-24 h-24 bg-white rounded-[26px] p-1.5 mx-auto mb-6 shadow-[0_16px_44px_rgba(0,0,0,0.28)]">
          <img src={logo} alt="Pickuptt" className="w-full h-full rounded-[20px] object-cover"/>
        </div>
        <h1 className="text-4xl font-800 text-white mb-1 tracking-[-0.03em]">Pickuptt</h1>
        <p className="text-white/70 text-sm">Your city, on demand</p>
        <div className="mt-8 w-10 h-10 border-2 border-white/30 border-t-white rounded-full mx-auto animate-spin"/>
      </div>
      <button onClick={onNext} className="absolute bottom-12 left-6 right-6 bg-white text-[#E11D48] font-700 py-4 rounded-2xl text-base shadow-lg active:scale-[0.98] transition-transform">
        Get Started
      </button>
    </div>
  )
}

function PhoneScreen({ onNext, onBack }: { onNext: (phone: string) => void; onBack: () => void }) {
  const [digits, setDigits] = useState('')
  const [sheet, setSheet] = useState<null | 'terms' | 'privacy'>(null)
  const valid = digits.length >= 7
  const formatted =
    digits.length > 6
      ? `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`
      : digits.length > 3
        ? `${digits.slice(0, 3)} ${digits.slice(3)}`
        : digits

  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <button onClick={onBack} className="mb-8"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <h2 className="text-3xl font-800 text-gray-900 mb-2 leading-tight">Enter your<br/>phone number</h2>
      <p className="text-gray-400 text-sm mb-8">We'll send you a verification code</p>
      <div className={`flex gap-3 items-center border-2 rounded-2xl px-4 py-3 mb-2 transition-colors ${valid ? 'border-gray-100 focus-within:border-[#E11D48]' : 'border-gray-100 focus-within:border-[#E11D48]'}`}>
        <span className="text-gray-500 font-600 text-base">+1</span>
        <div className="w-px h-6 bg-gray-200"/>
        <input
          type="tel"
          inputMode="numeric"
          value={formatted}
          onChange={e => setDigits(e.target.value.replace(/\D/g, '').slice(0, 10))}
          onKeyDown={e => { if (e.key === 'Enter' && valid) onNext(`+1 ${formatted}`) }}
          placeholder="868 123 4567"
          autoFocus
          className="flex-1 outline-none text-gray-900 font-500 text-base bg-transparent placeholder-gray-300"
        />
        {valid && (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#16A34A" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/></svg>
        )}
      </div>
      <p className="text-xs text-gray-400 mb-auto mt-2">{valid ? 'Standard message rates may apply.' : `Enter at least 7 digits (${digits.length}/7).`}</p>
      <p className="text-xs text-gray-400 mb-4">By continuing, you agree to our{' '}
        <button onClick={() => setSheet('terms')} className="text-[#E11D48] font-500 underline underline-offset-2">Terms</button>
        {' '}and{' '}
        <button onClick={() => setSheet('privacy')} className="text-[#E11D48] font-500 underline underline-offset-2">Privacy Policy</button>
      </p>
      <button
        onClick={() => onNext(`+1 ${formatted}`)}
        disabled={!valid}
        className={`w-full py-4 rounded-2xl font-700 text-base text-white transition-all ${valid ? 'active:scale-[0.98]' : 'opacity-40 cursor-not-allowed'}`}
        style={{background: RED}}>
        Continue
      </button>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet === 'terms' ? 'Terms of Service' : 'Privacy Policy'}>
        <div className="space-y-3 text-sm text-gray-600 font-500 leading-relaxed max-h-72 overflow-y-auto pr-1">
          {sheet === 'terms' ? (
            <>
              <p>1. Pickuptt connects riders with independent drivers. Fares are estimated before booking and confirmed on trip completion.</p>
              <p>2. Cancellations within 2 minutes of matching are free. After that a small fee may apply.</p>
              <p>3. You agree to treat drivers and other riders with respect at all times.</p>
              <p>4. Promotional codes are subject to availability and may expire at any time.</p>
            </>
          ) : (
            <>
              <p>We collect your location during active trips to match you with nearby drivers and share it with your driver for pickup.</p>
              <p>Your phone number is shared with your driver only after a trip is matched.</p>
              <p>Payment details are tokenized and never stored on our servers.</p>
              <p>You can request deletion of your account data at any time from Profile → Support.</p>
            </>
          )}
        </div>
        <button onClick={() => setSheet(null)} className="mt-5 w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Got it</button>
      </Sheet>
    </div>
  )
}

function OTPScreen({ phone, onNext, onBack }: { phone: string; onNext: () => void; onBack: () => void }) {
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [resendIn, setResendIn] = useState(45)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  // Auto-verify as soon as the 6th digit lands.
  useEffect(() => {
    if (code.length < 6) return
    const t = setTimeout(onNext, 400)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [code])

  const update = (raw: string) => {
    const digits = raw.replace(/\D/g, '').slice(0, 6)
    setCode(digits)
    if (digits.length < 6) setError('')
  }

  const verify = () => {
    if (code.length < 6) {
      setError('Enter all 6 digits to continue')
      inputRef.current?.focus()
      return
    }
    onNext()
  }

  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <button onClick={onBack} className="mb-8"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <h2 className="text-3xl font-800 text-gray-900 mb-2 leading-tight">Verification<br/>Code</h2>
      <p className="text-gray-400 text-sm mb-6">Sent to {phone || '+1 868 123 4567'}</p>

      <div className="relative mb-3" onClick={() => inputRef.current?.focus()}>
        <input
          ref={inputRef}
          value={code}
          onChange={e => update(e.target.value)}
          onKeyDown={e => { if (e.key === 'Enter') verify() }}
          inputMode="numeric"
          autoComplete="one-time-code"
          aria-label="6 digit verification code"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
        <div className="flex gap-2 pointer-events-none">
          {Array.from({ length: 6 }).map((_, i) => {
            const d = code[i]
            const active = i === code.length
            return (
              <div key={i}
                className={`flex-1 h-14 border-2 rounded-xl flex items-center justify-center text-xl font-700 transition-all ${d ? 'border-[#E11D48] text-gray-900 bg-red-50/40' : active ? 'border-gray-400 bg-gray-50' : 'border-gray-100 text-gray-300'}`}>
                {d ?? (active ? '' : '·')}
              </div>
            )
          })}
        </div>
      </div>

      {error ? (
        <p className="text-xs text-[#E11D48] font-600 mb-3 anim-fade">{error}</p>
      ) : (
        <p className="text-xs text-gray-400 mb-3">Demo build — type any 6 digits to continue.</p>
      )}

      <p className="text-xs text-gray-400 mb-auto">
        {resendIn > 0 ? (
          <>Resend code in <span className="text-[#E11D48] font-600">00:{String(resendIn).padStart(2, '0')}</span></>
        ) : (
          <button onClick={() => { setResendIn(45); setError('') }} className="text-[#E11D48] font-700 underline underline-offset-2">Resend code</button>
        )}
      </p>
      <button
        onClick={verify}
        disabled={code.length < 6}
        className={`w-full py-4 rounded-2xl font-700 text-base text-white transition-all ${code.length < 6 ? 'opacity-40 cursor-not-allowed' : 'active:scale-[0.98]'}`}
        style={{background: RED}}>
        {code.length === 6 ? 'Verify' : `Verify (${code.length}/6)`}
      </button>
    </div>
  )
}

const SERVICE_ICONS: Record<string, React.ReactNode> = {
  'Ride': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M5 16h14M6.5 16l1.2-5h8.6L17.5 16M7 11l1.4-4h7.2L17 11"/><circle cx="7.2" cy="17.6" r="1.9"/><circle cx="16.8" cy="17.6" r="1.9"/></svg>,
  'Package & Cargo': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/></svg>,
  'Towing': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 16V9a1 1 0 011-1h8v8M11 11h4l3 3.5V16h-1.5M2 16h1.5m7.5 0H11"/><circle cx="6" cy="17.6" r="1.9"/><circle cx="15.5" cy="17.6" r="1.9"/></svg>,
  'Medi Boy': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round"><rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)"/><path d="M9 9l6 6"/></svg>,
  'Bike Taxi': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17" r="2.6"/><circle cx="18.5" cy="17" r="2.6"/><path d="M8 15.5l3-5.5h4.2l2.3 3.4H19M11 10H8.6"/></svg>,
  'Bike': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><circle cx="5.5" cy="17" r="2.6"/><circle cx="18.5" cy="17" r="2.6"/><path d="M8 15.5l3-5.5h4.2l2.3 3.4H19M11 10H8.6"/></svg>,
  'Ambulance': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M2 17V8h11v9M13 11h3.5l3.5 3.5V17h-1.8M2 17h1.6m7.4 0h4.6"/><circle cx="6.5" cy="17.6" r="1.9"/><circle cx="16.5" cy="17.6" r="1.9"/><path d="M7.5 10.5v3M6 12h3"/></svg>,
  'Cleaning': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M19 3l-7.5 7.5M12.5 4.5L19.5 11.5M4 20l3-6.5 6 3.5L4 20z"/></svg>,
  'Repairs': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>,
  'Errands': <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"><path d="M6 8h12l1 12H5L6 8zM9 8V6a3 3 0 016 0v2"/></svg>,
}

const SUGGESTIONS = ['Cleaning', 'Towing', 'Medi Boy', 'Bike']
const ALL_SERVICES = ['Ride', 'Package & Cargo', 'Towing', 'Medi Boy', 'Bike Taxi', 'Ambulance', 'Cleaning', 'Repairs', 'Errands']

const SERVICE_BASE: Record<string, number> = {
  'Ride': 45,
  'Package & Cargo': 250,
  'Towing': 120,
  'Medi Boy': 80,
  'Bike Taxi': 30,
  'Bike': 35,
  'Ambulance': 200,
  'Cleaning': 60,
  'Repairs': 90,
  'Errands': 70,
}

const SERVICE_BLURBS: Record<string, string> = {
  'Ride': 'Get a reliable ride in minutes. Upfront pricing, live tracking and 5-star rated drivers.',
  'Package & Cargo': 'Send parcels or book trucks anywhere in Trinidad. Upfront pricing, live tracking and insurance included.',
  'Bike Taxi': 'Beat the traffic on two wheels — quick pickups across town with upfront pricing.',
  'Bike': 'Beat the traffic on two wheels — quick pickups across town with upfront pricing.',
  'Medi Boy': 'Trained medical riders for clinic runs, prescriptions and hospital transfers.',
  'Ambulance': 'Emergency and non-emergency medical transport with certified attendants on call.',
  'Towing': '24/7 roadside assistance and towing. Flatbeds available for cars, bikes and light trucks.',
  'Cleaning': 'Vetted cleaners for homes and offices. Upfront pricing and supplies included.',
  'Repairs': 'Verified technicians for plumbing, electrical and general repairs — same-day slots.',
  'Errands': 'Someone to line, shop and deliver for you. Pay only for the errand time you book.',
}

function scheduleShort(label: string): string {
  return label
    .replace('Leave now', 'Now')
    .replace('In ', '+')
    .replace(' minutes', ' min')
    .replace(' minute', ' min')
    .replace(' hour', ' hr')
    .replace('Tomorrow · ', 'Tomorrow ')
}

function HomeScreen({ onRide, onPackage, onProfile, onService }: { onRide: (place?: Place) => void; onPackage: () => void; onProfile: () => void; onService: (name: string) => void }) {
  const { trips, wallet, schedule, setSchedule, profile } = useCustomer()
  const [sheet, setSheet] = useState<null | 'schedule' | 'all' | 'activity'>(null)
  const [recents, setRecents] = useState<Place[]>(() => getRecents())

  const suggestions = SUGGESTIONS.map(l => ({ label: l }))

  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening'
  const whenShort = schedule === 'Leave now' ? 'Now' : scheduleShort(schedule)

  // Refresh recents whenever we come back to home (a trip may have added one).
  useEffect(() => {
    if (sheet !== 'schedule' && sheet !== 'all' && sheet !== 'activity') setRecents(getRecents())
  }, [sheet])

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-800 text-gray-900 tracking-[-0.03em]">Pickuptt<span style={{color: RED}}>.</span></h2>
          <p className="text-xs text-gray-400 font-500 mt-0.5">{greeting}, {firstName(profile.name)} · Port of Spain</p>
        </div>
        <div className="flex items-center gap-2">
          <div className="px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-right">
            <p className="text-[9px] font-700 text-gray-400 uppercase tracking-wider leading-none mb-0.5">Wallet</p>
            <p className="text-xs font-800 text-gray-900 leading-none">TT$ {wallet.toLocaleString()}</p>
          </div>
          <button onClick={onProfile} className="w-10 h-10 rounded-full border border-gray-200 shadow-sm active:scale-95 transition-transform overflow-hidden">
            <Avatar initials={initialsOf(profile.name)} className="w-full h-full rounded-full text-[11px]" />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Main Services */}
        <div className="px-5 mb-6 flex gap-3">
          <button onClick={() => onRide()} className="flex-1 bg-red-50 border border-red-100 rounded-3xl p-5 flex flex-col justify-between items-start h-32 hover:border-red-200 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-red-100 flex items-center justify-center mb-2" style={{color: RED}}>
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span className="font-800 text-lg tracking-tight" style={{color: RED}}>Ride</span>
          </button>
          <button onClick={onPackage} className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col justify-between items-start h-32 hover:border-gray-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-gray-900 mb-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="font-800 text-gray-900 text-lg tracking-tight">Package & Cargo</span>
          </button>
        </div>

        {/* Where to? */}
        <div className="px-5 mb-6">
          <div className="bg-gray-100 rounded-full flex items-center px-5 py-4 gap-3 shadow-sm cursor-text" onClick={() => onRide()}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke={RED} strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span className="text-gray-900 font-700 text-lg flex-1">Where to?</span>
            <button
              onClick={e => { e.stopPropagation(); setSheet('schedule') }}
              className="bg-white rounded-full p-2 shadow-sm flex items-center gap-2"
            >
               <span className="text-xs font-700 px-2 py-1 rounded-full" style={{background: '#FDE7EC', color: RED}}>{whenShort}</span>
               <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M6 9l6 6 6-6" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        {/* More Services Grid */}
        <div className="px-5 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-800 text-lg text-gray-900">Suggestions</h3>
            <button onClick={() => setSheet('all')} className="text-sm font-600 text-gray-500 hover:text-gray-900">See all</button>
          </div>
          <div className="grid grid-cols-4 gap-4">
            {suggestions.map(s => (
              <button key={s.label} onClick={() => onService(s.label)} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-900 group-hover:bg-gray-900 group-hover:text-white transition-colors">
                  {SERVICE_ICONS[s.label]}
                </div>
                <span className="text-[11px] font-600 text-gray-700">{s.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Recent Destinations */}
        <div className="px-5">
           <h3 className="font-800 text-lg text-gray-900 mb-4">Recent</h3>
           <div className="bg-gray-50 border border-gray-100 rounded-3xl p-4 space-y-4">
              {recents.slice(0, 3).map((r, i) => (
                <button key={r.id} onClick={() => onRide(r)} className="w-full flex items-center gap-4 cursor-pointer group text-left">
                   <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-all shrink-0">
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke={RED} strokeWidth="2.5"/></svg>
                   </div>
                   <div className={`flex-1 min-w-0 ${i < Math.min(recents.length, 3) - 1 ? 'border-b border-gray-200 pb-4' : ''}`}>
                      <h4 className="font-700 text-gray-900 truncate">{r.label}</h4>
                      <p className="text-xs text-gray-400 font-500 mt-0.5 truncate">{r.sub ?? `${r.lat.toFixed(4)}, ${r.lng.toFixed(4)}`}</p>
                   </div>
                   <svg width="14" height="14" viewBox="0 0 24 24" fill="none" className="shrink-0 text-gray-300 group-hover:text-gray-500"><path d="M9 18l6-6-6-6" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
                </button>
              ))}
           </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around items-center px-6 py-4 border-t border-gray-100 bg-white">
        {[
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'Home', active:true},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#ccc" strokeWidth="2.5"/><path d="M8 2v4M16 2v4M3 10h18" stroke="#ccc" strokeWidth="2.5"/></svg>, label:'Activity', active:false},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2.5"/><path d="M12 8v4l3 3" stroke="#ccc" strokeWidth="2.5"/></svg>, label:'Account', active:false},
        ].map(item => (
          <button
            key={item.label}
            onClick={() => {
              if (item.label === 'Account') onProfile()
              else if (item.label === 'Activity') setSheet('activity')
            }}
            className="flex flex-col items-center gap-1.5 active:scale-95 transition-transform"
          >
            {item.icon}
            <span className={`text-[10px] font-700 ${item.active ? 'text-[#E11D48]' : 'text-gray-400'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Schedule sheet */}
      <Sheet open={sheet === 'schedule'} onClose={() => setSheet(null)} title="When do you leave?">
        <div className="space-y-2 mb-4">
          {['Leave now', 'In 15 minutes', 'In 30 minutes', 'In 1 hour', 'Tomorrow · 8:00 AM'].map(t => (
            <button key={t} onClick={() => { setSchedule(t); setSheet(null) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${schedule === t ? 'border-[#111] bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <span className="text-sm font-700 text-gray-900">{t}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                {schedule === t
                  ? <path d="M5 12l5 5L20 7" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                  : <path d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#111" strokeWidth="2" strokeLinecap="round"/>}
              </svg>
            </button>
          ))}
          <p className="text-xs text-gray-400 font-500 pt-1">Scheduled rides are matched with a driver closer to the departure time.</p>
        </div>
      </Sheet>

      {/* All services sheet */}
      <Sheet open={sheet === 'all'} onClose={() => setSheet(null)} title="All services">
        <div className="grid grid-cols-3 gap-3 mb-2">
          {ALL_SERVICES.map(l => (
            <button key={l} onClick={() => {
              setSheet(null)
              if (l === 'Ride') onRide()
              else if (l === 'Package & Cargo') onPackage()
              else onService(l)
            }}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-gray-900">{SERVICE_ICONS[l]}</span>
              <span className="text-[11px] font-700 text-gray-700">{l}</span>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Activity sheet */}
      <Sheet open={sheet === 'activity'} onClose={() => setSheet(null)} title="Your activity">
        <div className="space-y-3">
          {trips.length === 0 && (
            <p className="text-sm text-gray-400 font-500 text-center py-6">No trips yet. Your rides and deliveries will show up here.</p>
          )}
          {trips.map(a => (
            <div key={a.id} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-700 text-sm text-gray-900">{a.title}</p>
                <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${a.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{a.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 font-500">{a.meta}</p>
                <p className="text-sm font-800 text-gray-900">TT$ {a.fare.toFixed(2)}</p>
              </div>
            </div>
          ))}
          <div className="flex justify-between items-center pt-1">
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider">Completed spend</p>
            <p className="text-sm font-800" style={{color: RED}}>
              TT$ {trips.filter(t => t.status === 'Completed').reduce((s, t) => s + t.fare, 0).toFixed(2)}
            </p>
          </div>
        </div>
      </Sheet>
    </div>
  )
}

const SERVICE_WHEN = ['Now', 'In 1 hour', 'Tomorrow']

function ServiceScreen({ service, onBack }: { service: string; onBack: () => void }) {
  const { addTrip, schedule } = useCustomer()
  const [when, setWhen] = useState('Now')
  const [priority, setPriority] = useState(false)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [stage, setStage] = useState<'form' | 'searching' | 'matched' | 'booked'>('form')

  useEffect(() => {
    const ctrl = new AbortController()
    fetchRoute(PKG_PICKUP, PKG_DEST, ctrl.signal).then(r => setRoute(r)).catch(() => {})
    return () => ctrl.abort()
  }, [])

  // Search → matched provider is a timed simulation.
  useEffect(() => {
    if (stage !== 'searching') return
    const t = setTimeout(() => setStage('matched'), 1900)
    return () => clearTimeout(t)
  }, [stage])

  const km = route ? route.distanceM / 1000 : 0
  const base = SERVICE_BASE[service] ?? 60
  const distanceFee = Math.max(6, Math.round(km * 4))
  const total = base + distanceFee + (priority ? 40 : 0)
  const blurb = SERVICE_BLURBS[service] ?? 'Book a trusted provider near you. Upfront pricing, live tracking and insurance included.'

  const PROVIDER: Record<string, { name: string; initials: string; role: string; eta: string }> = {
    'Cleaning': { name: 'Anisa Joseph', initials: 'AJ', role: 'Vetted cleaner · supplies included', eta: '25 min' },
    'Towing': { name: 'Dev Rambachan', initials: 'DR', role: 'Flatbed operator · TDT 4412', eta: '18 min' },
    'Medi Boy': { name: 'Nurse Alana', initials: 'NA', role: 'Certified medic · Medi Boy 042', eta: '12 min' },
    'Bike': { name: 'Jevon Reyes', initials: 'JR', role: 'Bike courier · TDM 7729', eta: '7 min' },
    'Bike Taxi': { name: 'Jevon Reyes', initials: 'JR', role: 'Bike taxi · TDM 7729', eta: '7 min' },
    'Ambulance': { name: 'Station 12 Crew', initials: 'S12', role: 'Certified attendants · Unit 12', eta: '14 min' },
    'Repairs': { name: 'Marcus Grant', initials: 'MG', role: 'Verified technician · ID 2214', eta: '40 min' },
    'Errands': { name: 'Shanice Ali', initials: 'SA', role: 'Errand runner · ID 1088', eta: '15 min' },
    'Ride': { name: 'Kevin Mohammed', initials: 'KM', role: 'Pickuptt X · TPN 7084', eta: '4 min' },
    'Package & Cargo': { name: 'Rajesh Deo', initials: 'RD', role: 'Bike courier · TDR 5163', eta: '6 min' },
  }
  const provider = PROVIDER[service] ?? PROVIDER['Ride']!

  const bookService = () => {
    setStage('searching')
  }

  const confirmBooking = () => {
    addTrip({
      title: `${service} booking`,
      meta: `Today · ${when}${route ? ` · ${formatDistance(route.distanceM)}` : ''}`,
      fare: total,
      status: 'Completed',
    })
    setStage('booked')
  }

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      {/* Header */}
      <div className="px-5 pt-4 pb-3 flex items-center gap-3 shrink-0">
        <button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center transition-colors" style={{background: '#FDE7EC'}} aria-label="Back">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center" style={{color: RED}}>
          {SERVICE_ICONS[service]}
        </div>
        <h2 className="font-800 text-xl text-gray-900 tracking-[-0.02em]">{service}</h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
        {/* Map with real route */}
        <div className="relative h-36 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm isolate">
          <RideMapView pickup={PKG_PICKUP} dest={PKG_DEST} route={route?.coords ?? null} cars={carsAround(PKG_PICKUP, 3)} interactive={false} zoom={11} />
          <div className="absolute bottom-2 left-2 z-[1100] flex items-center gap-1.5 bg-white/95 backdrop-blur rounded-full px-3 py-1.5 shadow-sm">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M13 2L3 14h7l-1 8 10-12h-7l1-8z" stroke={RED} strokeWidth="2.2" strokeLinejoin="round"/></svg>
            <span className="text-[11px] font-800 text-gray-900">
              {route ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationS)}` : 'Calculating route…'}
            </span>
          </div>
        </div>

        {/* Blurb */}
        <div className="bg-red-50 border-l-[3px] rounded-xl p-4" style={{borderColor: RED}}>
          <p className="text-sm text-gray-600 font-500 leading-snug">{blurb}</p>
        </div>

        {/* Addresses */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{background: RED, boxShadow: `0 0 0 4px rgba(225,29,72,0.15)`}} />
            <div className="min-w-0">
              <p className="text-[11px] font-700 text-gray-400 uppercase tracking-wider">Service address</p>
              <p className="text-sm font-700 text-gray-900 truncate">{PKG_PICKUP.label}</p>
            </div>
          </div>
          <div className="border-t border-gray-200" />
          <div className="flex items-center gap-3">
            <div className="w-2.5 h-2.5 rounded-sm shrink-0 bg-gray-900" />
            <div className="min-w-0">
              <p className="text-[11px] font-700 text-gray-400 uppercase tracking-wider">Destination</p>
              <p className="text-sm font-700 text-gray-900 truncate">{PKG_DEST.label}</p>
            </div>
          </div>
        </div>

        {/* When */}
        <div>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">When</p>
          <div className="flex gap-2">
            {SERVICE_WHEN.map(t => (
              <button key={t} onClick={() => setWhen(t)}
                className={`flex-1 py-2.5 rounded-full text-xs font-700 border-2 transition-all ${when === t ? 'border-[#E11D48] text-[#E11D48] bg-red-50' : 'border-gray-100 text-gray-500 hover:bg-gray-50'}`}>
                {t}
              </button>
            ))}
          </div>
        </div>

        {/* Priority */}
        <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3.5">
          <div className="flex-1 min-w-0">
            <p className="text-sm font-700 text-gray-900">Priority matching</p>
            <p className="text-[11px] text-gray-400 font-500">Get a provider faster · +TT$ 40</p>
          </div>
          <Toggle on={priority} onChange={setPriority} />
        </div>

        {/* Price estimate */}
        <div className="bg-gray-50 rounded-2xl p-4 space-y-3">
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wider">Estimate</p>
          <Row label={`Base · ${service}`} right={<span className="text-sm font-700 text-gray-900">TT$ {base.toFixed(2)}</span>} />
          <Row label={`Distance · ${route ? formatDistance(route.distanceM) : '—'}`} right={<span className="text-sm font-700 text-gray-900">TT$ {distanceFee.toFixed(2)}</span>} />
          <Row label="Priority matching" right={<span className="text-sm font-700 text-gray-900">{priority ? 'TT$ 40.00' : '—'}</span>} />
          <div className="border-t border-gray-200" />
          <Row label="Total" right={<span className="text-base font-800" style={{color: RED}}>TT$ {total.toFixed(2)}</span>} />
        </div>
      </div>

      {/* Footer */}
      <div className="shrink-0 px-5 pt-3 pb-4 border-t border-gray-100 bg-white">
        <button onClick={bookService}
          className="w-full py-4 rounded-full font-800 text-base text-white bg-[#111] hover:bg-black active:scale-[0.98] transition-all">
          Book {service} · TT$ {total.toFixed(2)}
        </button>
        <p className="text-[11px] text-gray-400 font-500 text-center mt-2">Free cancellation within 2 minutes of matching.</p>
      </div>

      {/* Booking flow sheet */}
      <Sheet
        open={stage !== 'form'}
        onClose={() => stage === 'booked' ? onBack() : setStage('form')}
        title={
          stage === 'searching'
            ? `Finding a ${service.toLowerCase()} provider…`
            : stage === 'matched'
              ? 'Provider found'
              : 'Booking confirmed'
        }
      >
        {stage === 'searching' && (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-[#E11D48] animate-spin mb-4"/>
            <p className="text-sm text-gray-500 font-500 text-center">
              Matching you with verified {service.toLowerCase()} providers within 3 km of {PKG_PICKUP.label}…
            </p>
          </div>
        )}

        {stage === 'matched' && (
          <>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
              <Avatar initials={provider.initials} className="w-14 h-14 rounded-2xl text-base" />
              <div className="flex-1 min-w-0">
                <p className="font-800 text-gray-900">{provider.name}</p>
                <p className="text-xs text-gray-400 font-500 truncate">{provider.role}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star filled size={12} />
                  <span className="text-xs font-600 text-gray-600">4.91 · 1,024 jobs</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-800 text-gray-900">{provider.eta}</p>
                <p className="text-[10px] text-gray-400 font-600">away</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Service" right={<span className="text-sm font-700 text-gray-900">{service}</span>} />
              <Row label="When" right={<span className="text-sm font-700 text-gray-900">{when === 'Now' && schedule !== 'Leave now' ? schedule : when}</span>} />
              <Row label="Route" right={<span className="text-sm font-700 text-gray-900">{route ? formatDistance(route.distanceM) : '—'}</span>} />
              <Row label="Priority" right={<span className="text-sm font-700 text-gray-900">{priority ? 'On' : 'Off'}</span>} />
              <div className="border-t border-gray-200" />
              <Row label="Total" right={<span className="text-base font-800" style={{color: RED}}>TT$ {total.toFixed(2)}</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setStage('form')} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Decline</button>
              <button onClick={confirmBooking} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white active:scale-[0.98] transition-transform" style={{background: RED}}>
                Confirm booking
              </button>
            </div>
          </>
        )}

        {stage === 'booked' && (
          <>
            <div className="flex flex-col items-center text-center py-2 mb-3">
              <div className="w-14 h-14 rounded-full bg-green-50 flex items-center justify-center mb-3">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#16A34A" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="font-800 text-gray-900 text-lg">{provider.name} is on the way</p>
              <p className="text-sm text-gray-400 font-500">Arriving in {provider.eta} · {service}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Service address" sub={PKG_PICKUP.label} />
              <Row label="Destination" sub={PKG_DEST.label} />
              <Row label="When" right={<span className="text-sm font-700 text-gray-900">{when}</span>} />
              <Row label="Charged to" right={<span className="text-sm font-700 text-gray-900">Card ···· 4242</span>} />
              <div className="border-t border-gray-200" />
              <Row label="Total" right={<span className="text-base font-800" style={{color: RED}}>TT$ {total.toFixed(2)}</span>} />
            </div>
            <button onClick={onBack} className="w-full py-4 rounded-full font-800 text-base text-white" style={{background: RED}}>
              Done
            </button>
          </>
        )}
      </Sheet>
    </div>
  )
}

const VEHICLES = [
  { type: 'Pickuptt X', kind: 'sedan', time: '3 min', price: 'TT$ 45.00', desc: 'Affordable, everyday rides', cap: 4 },
  { type: 'Pickuptt Comfort', kind: 'comfort', time: '5 min', price: 'TT$ 65.00', desc: 'Newer cars with extra legroom', cap: 4 },
  { type: 'Pickuptt XL', kind: 'suv', time: '8 min', price: 'TT$ 85.00', desc: 'SUVs for groups up to 6', cap: 6 },
] as const

function VehicleGlyph({ kind }: { kind: string }) {
  if (kind === 'suv') {
    return (
      <svg width="76" height="40" viewBox="0 0 76 40" fill="none">
        <path d="M8 27c-1.6 0-2.8-1.3-2.7-2.9l.5-5.4c.2-1.7 1.3-3.1 2.9-3.5l6.4-1.7 4.6-5.3c.8-1 2-1.5 3.2-1.5h20.3c1.4 0 2.7.7 3.5 1.8l4.7 6.4 6.8 1.4c2.3.5 3.9 2.5 3.9 4.9l-.1 4.6c0 1.4-1.1 2.5-2.5 2.5H8z" fill="#111"/>
        <path d="M24 12.2l3.3-3.8c.4-.5 1-.8 1.7-.8h13.4c.8 0 1.5.4 1.9 1l3.7 4.9-24 -1.3z" fill="#3A3F44"/>
        <circle cx="21" cy="28" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
        <circle cx="55" cy="28" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
      </svg>
    )
  }
  if (kind === 'comfort') {
    return (
      <svg width="76" height="40" viewBox="0 0 76 40" fill="none">
        <path d="M5 28c-1.4 0-2.5-1.1-2.5-2.5v-3.2c0-1.6.9-3 2.3-3.7l7.7-3.6 6.2-5.7c.9-.8 2.1-1.3 3.4-1.3h17.5c1.3 0 2.6.5 3.5 1.5l5.9 6.1 8.9 2.4c1.9.5 3.2 2.3 3.2 4.3v2.7c0 1.4-1.1 2.5-2.5 2.5H5z" fill="#111"/>
        <path d="M24 12l4.1-3.8c.5-.5 1.2-.7 1.9-.7h12.3c.8 0 1.6.4 2.1 1l4.8 5.6-25.2 -2.1z" fill="#3A3F44"/>
        <circle cx="20" cy="28.5" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
        <circle cx="56" cy="28.5" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
      </svg>
    )
  }
  return (
    <svg width="76" height="40" viewBox="0 0 76 40" fill="none">
      <path d="M5 28.5c-1.4 0-2.5-1.1-2.5-2.5v-3.4c0-1.5.8-2.9 2.1-3.6l8.4-4.3 5.9-5.1c1-.9 2.3-1.4 3.7-1.4h16.6c1.4 0 2.7.6 3.7 1.6l5.6 6 8.4 2.4c1.8.5 3 2.2 3 4.1v2.7c0 1.4-1.1 2.5-2.5 2.5H5z" fill="#111"/>
      <path d="M24 13l3.6-3.5c.5-.5 1.2-.8 1.9-.8h11.8c.8 0 1.6.4 2 1l4.4 5.2-23.7-1.9z" fill="#3A3F44"/>
      <circle cx="20" cy="29" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
      <circle cx="56" cy="29" r="5.5" fill="#111" stroke="#9CA3AF" strokeWidth="2.4"/>
    </svg>
  )
}

function VehicleScreen({ onNext, onBack, pickup, dest }: { onNext: () => void; onBack: () => void; pickup: Place; dest: Place | null }) {
  const { promo, schedule, setBooking } = useCustomer()
  const [selected, setSelected] = useState('Pickuptt X')
  const [sheet, setSheet] = useState<null | 'payment' | 'details' | 'confirm'>(null)
  const [payment, setPayment] = useState('Card ···· 4242')
  const [route, setRoute] = useState<RouteResult | null>(null)

  useEffect(() => {
    if (!dest) {
      setRoute(null)
      return
    }
    const ctrl = new AbortController()
    fetchRoute(pickup, dest, ctrl.signal)
      .then(r => setRoute(r))
      .catch(() => {})
    return () => ctrl.abort()
  }, [pickup, dest])

  const km = route ? route.distanceM / 1000 : 3.2
  const mins = route ? route.durationS / 60 : 12
  const fareX = 18 + 6 * km + 0.65 * mins
  const RATES: Record<string, number> = { 'Pickuptt X': 1, 'Pickuptt Comfort': 65 / 45, 'Pickuptt XL': 85 / 45 }
  const priceOf = (type: string) => `TT$ ${(fareX * (RATES[type] ?? 1)).toFixed(2)}`
  const discount = promoDiscount(promo, fareX * (RATES[selected] ?? 1))
  const payable = Math.max(0, fareX * (RATES[selected] ?? 1) - discount)
  const statsLabel = route ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationS)}` : null
  const scheduled = schedule !== 'Leave now'

  const selectedVehicle = VEHICLES.find(v => v.type === selected)!

  const confirmRide = () => {
    setBooking({
      vehicle: selected,
      fare: Math.round(payable * 100) / 100,
      payment,
      distanceM: route?.distanceM ?? 0,
      durationS: route?.durationS ?? 0,
      pickupLabel: pickup.label,
      destLabel: dest?.label ?? 'Piarco Airport',
      promo,
    })
    setSheet(null)
    onNext()
  }

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      <div className="relative h-44 isolate">
        <RideMapView
          pickup={pickup}
          dest={dest}
          route={route?.coords ?? null}
          cars={carsAround(pickup)}
          interactive={false}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/5 pointer-events-none" />
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform z-[1100]">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <div className="absolute bottom-8 left-4 z-[1100]">
          {statsLabel ? (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)] anim-fade">
              <span className="text-[11px] font-bold text-gray-900">{statsLabel}</span>
              {route?.fallback && <span className="text-[11px] font-semibold text-gray-400"> · approx.</span>}
            </div>
          ) : dest ? (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
              <span className="text-[11px] font-bold text-gray-500 animate-pulse">Calculating route…</span>
            </div>
          ) : null}
        </div>
      </div>

      <div className="relative z-10 flex-1 bg-white rounded-t-3xl -mt-6 px-5 pt-5 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5"/>
        <div className="flex items-center justify-between mb-4">
          <div className="min-w-0">
            <h3 className="font-800 text-gray-900 text-2xl tracking-[-0.02em]">Choose a ride</h3>
            {scheduled && (
              <p className="text-[11px] font-700 mt-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full" style={{background: '#FDE7EC', color: RED}}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round"/></svg>
                Scheduled · {schedule}
              </p>
            )}
            {promo && (
              <p className="text-[11px] font-700 mt-1 ml-1 inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-green-50 text-green-700">
                {promo} applied
              </p>
            )}
          </div>
          <button onClick={() => setSheet('details')} className="text-xs font-700 text-gray-500 hover:text-gray-900 flex items-center gap-1 shrink-0">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="2"/><path d="M12 11v5M12 7.5v.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
            Fare details
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-2.5 pr-1 -mr-1">
          {VEHICLES.map(v => (
            <button key={v.type} onClick={() => setSelected(v.type)}
              className={`w-full flex items-center gap-4 p-4 rounded-2xl border-2 transition-all text-left ${selected === v.type ? 'border-gray-900 bg-gray-50 shadow-[0_2px_12px_rgba(0,0,0,0.06)]' : 'border-transparent hover:bg-gray-50'}`}>
              <div className="w-[84px] flex items-center justify-center shrink-0">
                <VehicleGlyph kind={v.kind} />
              </div>
              <div className="flex-1">
                <div className="flex justify-between items-center mb-0.5">
                  <div className="flex items-center gap-2">
                     <span className="font-800 text-base text-gray-900">{v.type}</span>
                     <div className="flex items-center gap-0.5 text-gray-500 bg-gray-200/60 px-1.5 py-0.5 rounded text-[10px] font-700">
                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="8.5" cy="7" r="4" stroke="currentColor" strokeWidth="2.5"/></svg>
                        {v.cap}
                     </div>
                  </div>
                  <span className="font-800 text-base text-gray-900">{priceOf(v.type)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-500 text-gray-500">{v.desc}</span>
                </div>
                <div className="text-xs font-700 text-gray-900 mt-1">{v.time} dropoff</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3 items-center">
          <button onClick={() => setSheet('payment')} className="h-[51px] px-3.5 rounded-2xl bg-gray-100 flex items-center gap-2 active:scale-95 transition-transform shrink-0 max-w-[44%]">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>
            <span className="text-[11px] font-700 text-gray-700 truncate">{payment}</span>
          </button>
          <button onClick={() => setSheet('confirm')} className="flex-1 min-w-0 h-[51px] rounded-full font-700 text-[15px] text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] active:scale-[0.98] transition-transform bg-[#111] flex items-center justify-center gap-2 px-3">
            <span className="truncate">Confirm {selected}</span>
            <span className="font-800 shrink-0">TT$ {payable.toFixed(2)}</span>
          </button>
        </div>
      </div>

      {/* Payment sheet */}
      <Sheet open={sheet === 'payment'} onClose={() => setSheet(null)} title="Payment method">
        <div className="space-y-2 mb-4">
          {[
            { label: 'Card ···· 4242', sub: 'Visa · expires 08/28', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="2"/><path d="M2.5 10h19" stroke="currentColor" strokeWidth="2"/></svg> },
            { label: 'Cash', sub: 'Pay driver after trip', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="12" rx="2" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="2"/></svg> },
            { label: 'Wallet', sub: 'Balance TT$ 1,250', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 8.5V6.5A2.5 2.5 0 0017.5 4h-13A2.5 2.5 0 002 6.5v11A2.5 2.5 0 004.5 20h15a1.5 1.5 0 001.5-1.5v-8a1.5 1.5 0 00-1.5-1.5H4.5" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><circle cx="17" cy="14" r="1.3" fill="currentColor"/></svg> },
          ].map(m => (
            <button key={m.label} onClick={() => { setPayment(m.label); setSheet(null) }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border-2 transition-all text-left ${payment === m.label ? 'border-[#111] bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <span className="w-9 h-9 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-gray-700">{m.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-700 text-gray-900">{m.label}</p>
                <p className="text-xs text-gray-400 font-500">{m.sub}</p>
              </div>
              {payment === m.label && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Fare details sheet */}
      <Sheet open={sheet === 'details'} onClose={() => setSheet(null)} title="Fare breakdown">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Base fare" right={<span className="text-sm font-700 text-gray-900">TT$ 18.00</span>} />
          <Row label={`Distance · ${formatDistance(route?.distanceM ?? 3200)}`} right={<span className="text-sm font-700 text-gray-900">TT$ {(6 * km).toFixed(2)}</span>} />
          <Row label={`Time · ${formatDuration(route?.durationS ?? 720)}`} right={<span className="text-sm font-700 text-gray-900">TT$ {(0.65 * mins).toFixed(2)}</span>} />
          <Row label="Booking fee" right={<span className="text-sm font-700 text-gray-900">TT$ 0.00</span>} />
          <Row label={`${selectedVehicle.type} multiplier`} right={<span className="text-sm font-700 text-gray-900">×{(RATES[selected] ?? 1).toFixed(2)}</span>} />
          {discount > 0 && (
            <Row label={`Promo · ${promo}`} right={<span className="text-sm font-700 text-green-600">− TT$ {discount.toFixed(2)}</span>} />
          )}
          <Row label="Total" right={<span className="text-sm font-800 text-gray-900">TT$ {payable.toFixed(2)}</span>} />
        </div>
        <p className="text-xs text-gray-400 font-500 mb-4">Price may change if the route or wait time changes.</p>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Confirm sheet */}
      <Sheet open={sheet === 'confirm'} onClose={() => setSheet(null)} title="Confirm your ride">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label={selectedVehicle.type} sub={selectedVehicle.desc} right={<span className="text-sm font-800 text-gray-900">TT$ {payable.toFixed(2)}</span>} />
          <Row label="Payment" sub={payment} right={<button onClick={() => setSheet('payment')} className="text-xs font-700 text-[#E11D48]">Change</button>} />
          {scheduled && <Row label="Schedule" sub={schedule} right={<span className="text-xs font-700 text-gray-400">Pickup scheduled</span>} />}
          {discount > 0 && <Row label={`Promo · ${promo}`} sub="Applied to this fare" right={<span className="text-sm font-700 text-green-600">− TT$ {discount.toFixed(2)}</span>} />}
          <Row label="Pickup" sub={pickup.label} />
          <Row label="Destination" sub={dest?.label ?? 'Piarco Airport'} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Back</button>
          <button onClick={confirmRide} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111] active:scale-[0.98] transition-transform">
            Book {selected}
          </button>
        </div>
      </Sheet>
    </div>
  )
}

type Phase = 'enroute' | 'arrived' | 'trip'

const FALLBACK_DEST: Place = {
  id: 'trip-dest-fallback',
  label: 'Piarco International Airport',
  sub: 'Golden Grove Rd, Piarco',
  lat: 10.5954,
  lng: -61.3372,
}

function TrackingScreen({ onNext, onBack, pickup, dest }: { onNext: () => void; onBack: () => void; pickup: Place; dest: Place | null }) {
  const { booking, setBooking } = useCustomer()
  const [sheet, setSheet] = useState<null | 'sos' | 'call' | 'chat' | 'cancel' | 'driver'>(null)
  const [messages, setMessages] = useState([
    { me: false, text: 'Hi, I’m 2 minutes away at the main entrance.' },
  ])
  const [draft, setDraft] = useState('')
  const [sosSent, setSosSent] = useState(false)
  const [toast, setToast] = useState('')
  const [phase, setPhase] = useState<Phase>('enroute')
  const [approach, setApproach] = useState<RouteResult | null>(null)
  const [tripRoute, setTripRoute] = useState<RouteResult | null>(null)
  const [progress, setProgress] = useState(0)
  const finishedRef = useRef(false)

  const target = dest ?? FALLBACK_DEST
  const driverName = 'Kevin Mohammed'

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  // Driver starts ~1.2 km out and drives to the pickup point (real OSRM route).
  const driverStart: Place = { ...pickup, id: 'driver', label: 'Driver', lat: pickup.lat + 0.011, lng: pickup.lng - 0.009 }

  useEffect(() => {
    const ctrl = new AbortController()
    fetchRoute(driverStart, pickup, ctrl.signal)
      .then(r => setApproach(r))
      .catch(() => {})
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickup])

  // Once the rider is in the car, fetch the real pickup → destination route.
  useEffect(() => {
    if (phase !== 'trip') return
    const ctrl = new AbortController()
    fetchRoute(pickup, target, ctrl.signal)
      .then(r => setTripRoute(r))
      .catch(() => {})
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // Advance the car along the active route; a leg takes ~20s of wall time.
  useEffect(() => {
    if (phase === 'arrived') return
    if (phase === 'enroute' && !approach) return
    if (phase === 'trip' && !tripRoute) return
    const legSeconds = phase === 'enroute' ? 20 : 24
    const id = setInterval(() => {
      setProgress(p => Math.min(1, p + 0.5 / legSeconds))
    }, 500)
    return () => clearInterval(id)
  }, [phase, approach, tripRoute])

  // en route → arrived (driver reaches the pickup point)
  useEffect(() => {
    if (phase !== 'enroute' || !approach || progress < 1) return
    setProgress(0)
    setPhase('arrived')
    setMessages(m => [...m, { me: false, text: 'I’m at your pickup point now — white Toyota, TPN 7084.' }])
    flash(`${driverName} has arrived`)
  }, [progress, phase, approach])

  const startTrip = () => {
    if (phase !== 'arrived') return
    setProgress(0)
    setPhase('trip')
    setMessages(m => [...m, { me: false, text: 'Enjoy the ride — heading to ' + target.label + '.' }])
  }

  // arrived → trip (auto after a short wait, or when the rider taps Start trip)
  useEffect(() => {
    if (phase !== 'arrived') return
    const t = setTimeout(startTrip, 6000)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  // trip → complete when the car reaches the destination
  useEffect(() => {
    if (phase !== 'trip' || !tripRoute || progress < 1 || finishedRef.current) return
    finishedRef.current = true
    const t = setTimeout(() => onNext(), 700)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [progress, phase, tripRoute])

  const activeRoute = phase === 'trip' ? tripRoute : approach
  const remainingS = activeRoute ? activeRoute.durationS * (1 - progress) : null
  const remainingKm = activeRoute ? activeRoute.distanceM * (1 - progress) : null
  const driverPos: [number, number] | null =
    phase === 'arrived'
      ? [pickup.lat, pickup.lng]
      : activeRoute
        ? pointAt(activeRoute.coords, progress)
        : [driverStart.lat, driverStart.lng]

  const etaLabel =
    phase === 'arrived'
      ? 'Waiting for you'
      : remainingS == null
        ? 'Calculating…'
        : `${Math.max(1, Math.ceil(remainingS / 60))} min ${phase === 'enroute' ? 'away' : 'to destination'}`

  const statusLabel =
    phase === 'enroute' ? 'Driver en route'
      : phase === 'arrived' ? 'Driver has arrived'
        : 'On trip'

  const send = () => {
    if (!draft.trim()) return
    setMessages(m => [...m, { me: true, text: draft.trim() }])
    setDraft('')
    setTimeout(() => setMessages(m => [...m, { me: false, text: 'Got it, see you shortly!' }]), 900)
  }

  // Cancellation is free early in the approach, otherwise a fee applies.
  const cancelFee = phase === 'enroute' && progress < 0.35 ? 0 : 10

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="relative flex-1 isolate">
        <RideMapView
          pickup={pickup}
          dest={phase === 'trip' ? target : null}
          route={activeRoute?.coords ?? null}
          cars={driverPos ? [driverPos] : []}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/25 via-transparent to-black/10 pointer-events-none" />
        <div className="absolute bottom-10 left-4 z-[1100] bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)] anim-fade">
          {phase === 'arrived' ? (
            <span className="text-[11px] font-bold text-gray-900">At pickup · {driverName.split(' ')[0]} is waiting</span>
          ) : remainingKm != null ? (
            <span className="text-[11px] font-bold text-gray-900">{formatDistance(remainingKm)} {phase === 'enroute' ? 'away' : 'to go'}</span>
          ) : (
            <span className="text-[11px] font-bold text-gray-500 animate-pulse">Locating…</span>
          )}
        </div>
        {/* SOS */}
        <button onClick={() => setSheet('sos')} className="absolute top-4 right-4 z-[1100] bg-[#E11D48] text-white text-xs font-800 px-4 py-2 rounded-xl shadow active:scale-95 transition-transform">SOS</button>
        <button onClick={onBack} className="absolute top-4 left-4 z-[1100] w-9 h-9 bg-white rounded-full shadow flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        {toast && (
          <div className="absolute top-16 left-1/2 -translate-x-1/2 z-[1200] bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg anim-fade whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      <div className="bg-white rounded-t-[28px] -mt-8 relative z-10 px-5 pt-4 pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-3"/>

        {/* Phase stepper */}
        <div className="flex items-center justify-between mb-3 px-1">
          {([
            { key: 'enroute', label: 'En route' },
            { key: 'arrived', label: 'Arrived' },
            { key: 'trip', label: 'On trip' },
          ] as const).map((s, i) => {
            const order: Phase[] = ['enroute', 'arrived', 'trip']
            const active = order.indexOf(phase) >= i
            const current = phase === s.key
            return (
              <div key={s.key} className="flex items-center flex-1 last:flex-none">
                <div className="flex items-center gap-1.5">
                  <div className={`w-2.5 h-2.5 rounded-full transition-colors ${active ? (current ? 'animate-pulse' : '') : ''}`} style={{background: active ? RED : '#E5E7EB'}}/>
                  <span className={`text-[10px] font-700 uppercase tracking-wider ${active ? 'text-gray-900' : 'text-gray-300'}`}>{s.label}</span>
                </div>
                {i < 2 && <div className="flex-1 h-px bg-gray-200 mx-2"><div className="h-full transition-all" style={{width: active && order.indexOf(phase) > i ? '100%' : '0%', background: RED}}/></div>}
              </div>
            )
          })}
        </div>

        <div className="flex items-center gap-2 mb-1">
          <div className={`w-2 h-2 rounded-full ${phase === 'trip' ? 'bg-[#E11D48]' : 'bg-green-500'} animate-pulse`}/>
          <span className={`text-xs font-700 uppercase tracking-wider ${phase === 'trip' ? 'text-[#E11D48]' : 'text-green-600'}`}>{statusLabel}</span>
        </div>
        <p className="text-2xl font-800 text-gray-900 mb-3 tracking-[-0.02em]">{etaLabel}</p>

        <div role="button" tabIndex={0} onClick={() => setSheet('driver')} onKeyDown={e => e.key === 'Enter' && setSheet('driver')} className="w-full flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-4 text-left hover:bg-gray-100 transition-colors cursor-pointer">
          <Avatar initials="KM" className="w-12 h-12 rounded-xl text-sm" />
          <div className="flex-1">
            <p className="font-700 text-gray-900 text-sm">Kevin Mohammed</p>
            <p className="text-xs text-gray-400">Pickuptt X · TPN 7084</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star filled size={12} />
              <span className="text-xs font-600 text-gray-600">4.92 · 2,841 trips</span>
            </div>
          </div>
          <div className="flex gap-2" onClick={e => e.stopPropagation()}>
            <button onClick={() => setSheet('call')} className="w-10 h-10 rounded-xl bg-[#E11D48] flex items-center justify-center shadow-[0_4px_12px_rgba(225,29,72,0.3)]">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.5 16.9v2.7a2 2 0 01-2.2 2 19.6 19.6 0 01-8.6-3.1 19.3 19.3 0 01-6-6A19.6 19.6 0 011.6 4a2 2 0 012-2.2h2.7a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1l-1.1 1.1a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.7 2z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
            <button onClick={() => setSheet('chat')} className="w-10 h-10 rounded-xl bg-gray-200 flex items-center justify-center">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.9 8.9 0 01-4-.9L3 20.5l1.5-4.4a8.4 8.4 0 01-.9-3.9 8.4 8.4 0 018.4-8.4h.5A8.4 8.4 0 0121 11v.5z" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          {phase === 'enroute' ? (
            <button onClick={() => setSheet('chat')} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white flex items-center justify-center gap-1.5 shadow-[0_6px_18px_rgba(225,29,72,0.3)]" style={{background: RED}}>
              Message {driverName.split(' ')[0]}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M21 11.5a8.4 8.4 0 01-9 8.4 8.9 8.9 0 01-4-.9L3 20.5l1.5-4.4a8.4 8.4 0 01-.9-3.9 8.4 8.4 0 018.4-8.4h.5A8.4 8.4 0 0121 11v.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          ) : (
            <button
              onClick={() => phase === 'arrived' ? startTrip() : onNext()}
              className="flex-1 py-3.5 rounded-full font-700 text-sm text-white flex items-center justify-center gap-1.5 shadow-[0_6px_18px_rgba(225,29,72,0.3)] active:scale-[0.98] transition-transform"
              style={{background: RED}}>
              {phase === 'arrived' ? 'Start trip' : 'Complete trip'}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </button>
          )}
          <button
            onClick={() => flash('Trip link copied — share it with a contact')}
            className="px-4 py-3.5 rounded-full font-700 text-sm text-gray-500 bg-gray-100 active:scale-95 transition-transform"
            aria-label="Share trip">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M4 12v7a2 2 0 002 2h12a2 2 0 002-2v-7M16 6l-4-4-4 4M12 2v14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
          <button onClick={() => setSheet('cancel')} className="px-4 py-3.5 rounded-full font-700 text-sm text-gray-500 bg-gray-100">Cancel</button>
        </div>
      </div>

      {/* SOS sheet */}
      <Sheet open={sheet === 'sos'} onClose={() => setSheet(null)} title={sosSent ? 'Help is on the way' : 'Emergency SOS'}>
        {sosSent ? (
          <>
            <div className="flex flex-col items-center text-center py-2">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mb-3">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#E11D48" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </div>
              <p className="text-sm text-gray-600 font-500">Your live location and trip details were shared with emergency services and our safety team.</p>
            </div>
            <button onClick={() => { setSosSent(false); setSheet(null) }} className="mt-4 w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-500 font-500 mb-4">This will share your live location, trip details and driver information with emergency services.</p>
            <div className="space-y-2 mb-4">
              <Row label="Call 999" sub="Police, fire or ambulance" right={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} />
              <Row label="Share trip with contact" sub="Sends a live tracking link" right={<svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Dismiss</button>
              <button onClick={() => setSosSent(true)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#E11D48]">Send SOS</button>
            </div>
          </>
        )}
      </Sheet>

      {/* Call sheet */}
      <Sheet open={sheet === 'call'} onClose={() => setSheet(null)} title="Calling…">
        <div className="flex flex-col items-center text-center py-2 mb-2">
          <Avatar initials="KM" className="w-20 h-20 rounded-full text-2xl mb-3" />
          <p className="font-800 text-gray-900">Kevin Mohammed</p>
          <p className="text-xs text-gray-400 font-500 mb-1">Pickuptt X · TPN 7084</p>
          <p className="text-sm font-600 text-green-600 animate-pulse mt-1">Ringing…</p>
        </div>
        <button onClick={() => setSheet(null)} className="mt-3 w-full py-4 rounded-full font-700 text-sm text-white bg-[#E11D48] flex items-center justify-center gap-2">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
          End call
        </button>
      </Sheet>

      {/* Chat sheet */}
      <Sheet open={sheet === 'chat'} onClose={() => setSheet(null)} title="Message Kevin">
        <div className="space-y-2 mb-4 max-h-56 overflow-y-auto pr-1">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.me ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] px-3.5 py-2.5 rounded-2xl text-sm font-500 ${m.me ? 'bg-[#111] text-white rounded-br-md' : 'bg-gray-100 text-gray-800 rounded-bl-md'}`}>
                {m.text}
              </div>
            </div>
          ))}
        </div>
        <div className="flex gap-2">
          <input value={draft} onChange={e => setDraft(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()}
            placeholder="Type a message…"
            className="flex-1 bg-gray-50 rounded-full px-4 py-3 text-sm font-500 outline-none placeholder-gray-400 border-2 border-transparent focus:border-gray-300"/>
          <button onClick={send} className="w-11 h-11 rounded-full bg-[#111] flex items-center justify-center active:scale-95 transition-transform shrink-0">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </button>
        </div>
      </Sheet>

      {/* Driver sheet */}
      <Sheet open={sheet === 'driver'} onClose={() => setSheet(null)} title="Your driver">
        <div className="flex items-center gap-4 mb-4">
          <Avatar initials="KM" className="w-16 h-16 rounded-2xl text-lg" />
          <div>
            <p className="font-800 text-gray-900">{driverName}</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star filled size={13} />
              <span className="text-xs font-600 text-gray-600">4.92 · 2,841 trips</span>
            </div>
            <p className="text-xs text-gray-400 font-500 mt-0.5">Driving since 2021 · English, Spanish</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Vehicle" sub="Pickuptt X · Black" right={<span className="text-sm font-700 text-gray-900">TPN 7084</span>} />
          <Row label="Trip fare" sub={booking ? booking.payment : 'Card ···· 4242'} right={<span className="text-sm font-700 text-gray-900">TT$ {(booking?.fare ?? 45).toFixed(2)}</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Cancel sheet */}
      <Sheet open={sheet === 'cancel'} onClose={() => setSheet(null)} title="Cancel this ride?">
        <p className="text-sm text-gray-500 font-500 mb-4">
          {cancelFee === 0
            ? `${driverName.split(' ')[0]} is still on the way — cancelling now is free.`
            : `${driverName.split(' ')[0]} is already on the way. A TT$ ${cancelFee} cancellation fee applies.`}
        </p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Status" right={<span className="text-sm font-700 text-gray-900">{statusLabel}</span>} />
          <Row label="Cancellation fee" right={<span className={`text-sm font-700 ${cancelFee === 0 ? 'text-green-600' : 'text-gray-900'}`}>{cancelFee === 0 ? 'Free' : `TT$ ${cancelFee}.00`}</span>} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Keep ride</button>
          <button onClick={() => { setSheet(null); setBooking(null); onBack() }} className="flex-1 py-3.5 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Cancel ride</button>
        </div>
      </Sheet>
    </div>
  )
}

function CompleteScreen({ onBack }: { onBack: () => void }) {
  const { booking, wallet, spend, addTrip, setBooking } = useCustomer()
  const [rating, setRating] = useState(5)
  const [tip, setTip] = useState(5)
  const [sheet, setSheet] = useState<null | 'receipt' | 'thanks'>(null)
  const submittedRef = useRef(false)

  const fare = booking?.fare ?? 45
  const total = Math.round((fare + tip) * 100) / 100
  const distLabel = booking && booking.distanceM > 0 ? formatDistance(booking.distanceM) : '3.2 km'
  const durLabel = booking && booking.durationS > 0 ? formatDuration(booking.durationS) : '15 min'
  const destLabel = booking?.destLabel ?? 'Piarco Airport'
  const payment = booking?.payment ?? 'Card ···· 4242'
  const usesWallet = payment.startsWith('Wallet')
  const walletAfter = Math.max(0, wallet - (usesWallet ? total : 0))

  const submit = () => {
    if (submittedRef.current) return
    submittedRef.current = true
    addTrip({
      title: `Ride to ${shortLabel(destLabel)}`,
      meta: `Today · ${durLabel} · ${rating}★`,
      fare: total,
      status: 'Completed',
    })
    if (usesWallet) spend(total)
    setSheet('thanks')
  }

  const finish = () => {
    submittedRef.current = false
    setBooking(null)
    setSheet(null)
    onBack()
  }

  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <div className="flex-1 flex flex-col items-center justify-center text-center overflow-y-auto">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg" style={{background: RED}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-3xl font-800 text-gray-900 mb-1">Trip Complete!</h2>
        <p className="text-gray-400 text-sm mb-6">{distLabel} · {durLabel} · TT$ {total.toFixed(2)}</p>

        <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Avatar initials="KM" className="w-10 h-10 rounded-xl text-xs" />
            <div>
              <p className="font-700 text-gray-900 text-sm">Kevin Mohammed</p>
              <p className="text-xs text-gray-400">{booking?.vehicle ?? 'Pickuptt X'}</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-800 text-gray-900">TT$ {fare.toFixed(2)}</p>
              <button onClick={() => setSheet('receipt')} className="text-[10px] text-[#E11D48] font-700 underline underline-offset-2">View receipt</button>
            </div>
          </div>
          <p className="text-xs font-600 text-gray-500 mb-2">Rate your driver</p>
          <div className="flex gap-2">
            {[1,2,3,4,5].map(s => (
              <button key={s} onClick={() => setRating(s)} className={`flex-1 py-2 rounded-xl flex items-center justify-center transition-colors ${s <= rating ? 'bg-yellow-50' : 'bg-gray-100'}`}>
                <Star filled={s <= rating} size={22} />
              </button>
            ))}
          </div>
        </div>

        <div className="w-full mb-4">
          <p className="text-xs font-600 text-gray-500 mb-2">Add a tip</p>
          <div className="flex gap-2">
            {[0, 5, 10, 20].map(t => (
              <button key={t} onClick={() => setTip(t)} className={`flex-1 py-2.5 rounded-xl text-xs font-700 transition-all ${tip === t ? 'text-white shadow-md shadow-red-200' : 'bg-gray-100 text-gray-600'}`} style={tip===t?{background:RED}:{}}>
                {t === 0 ? 'No tip' : `TT$ ${t}`}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={submit} className="w-full py-4 rounded-2xl font-700 text-base text-white active:scale-[0.98] transition-transform" style={{background: RED}}>
        Submit Rating · TT$ {total.toFixed(2)}
      </button>

      {/* Receipt sheet */}
      <Sheet open={sheet === 'receipt'} onClose={() => setSheet(null)} title="Trip receipt">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Trip" sub={`${booking?.pickupLabel ?? 'Port of Spain'} → ${destLabel}`} />
          <Row label="Date" sub={`${new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })} · 09:41`} />
          <Row label="Driver" sub={`Kevin Mohammed · ${booking?.vehicle ?? 'Pickuptt X'}`} />
          <Row label="Distance" sub={distLabel} right={<span className="text-sm font-700 text-gray-900">{durLabel}</span>} />
          {booking?.promo && <Row label={`Promo · ${booking.promo}`} sub="Discount included in fare" right={<span className="text-sm font-700 text-green-600">Applied</span>} />}
          <Row label="Fare" right={<span className="text-sm font-700 text-gray-900">TT$ {fare.toFixed(2)}</span>} />
          <Row label="Tip" right={<span className="text-sm font-700 text-gray-900">TT$ {tip.toFixed(2)}</span>} />
          <div className="border-t border-gray-200" />
          <Row label="Total" right={<span className="text-sm font-800 text-gray-900">TT$ {total.toFixed(2)}</span>} />
          <Row label="Paid with" right={<span className="text-sm font-700 text-gray-900">{payment}</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Thanks sheet */}
      <Sheet open={sheet === 'thanks'} onClose={() => setSheet(null)} title="Thanks for your feedback!">
        <div className="flex flex-col items-center text-center py-1 mb-2">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(s => <Star key={s} filled={s <= rating} size={26} />)}
          </div>
          <p className="text-sm text-gray-500 font-500">You rated Kevin {rating} star{rating > 1 ? 's' : ''} and tipped TT$ {tip.toFixed(2)}. Your feedback keeps rides great for everyone.</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          {usesWallet ? (
            <Row label="Wallet charged" right={<span className="text-sm font-700 text-gray-900">− TT$ {total.toFixed(2)}</span>} />
          ) : (
            <Row label="Charged to" right={<span className="text-sm font-700 text-gray-900">{payment}</span>} />
          )}
          <Row label="New wallet balance" right={<span className="text-sm font-800 text-gray-900">TT$ {walletAfter.toLocaleString()}.00</span>} />
        </div>
        <button onClick={finish} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
      </Sheet>
    </div>
  )
}

const PACKAGE_CATS = [
  { key: 'food', label: 'Food', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 3v7a3 3 0 003 3v8M7 3v6M10 3v6M17 3c-1.7 1.8-2.5 3.8-2.5 6 0 2 .8 3.4 2.5 4v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'medicine', label: 'Medicine', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="8" width="19" height="8" rx="4" transform="rotate(-45 12 12)" stroke="currentColor" strokeWidth="2"/><path d="M9 9l6 6" stroke="currentColor" strokeWidth="2"/></svg> },
  { key: 'docs', label: 'Docs', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { key: 'electronics', label: 'Electronics', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="6.5" y="2.5" width="11" height="19" rx="2.5" stroke="currentColor" strokeWidth="2"/><path d="M11 18.5h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { key: 'clothes', label: 'Clothes', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M9 3l3 2 3-2 5 3.5-2 4-2-1v11.5a1 1 0 01-1 1H9a1 1 0 01-1-1V9.5l-2 1-2-4L9 3z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
  { key: 'other', label: 'Other', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
]

const CARGO_TYPES = [
  { key: 'pallets', label: 'Pallets', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth="2"/><rect x="3" y="14" width="18" height="6" rx="1.5" stroke="currentColor" strokeWidth="2"/></svg> },
  { key: 'furniture', label: 'Furniture', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 11V7a2 2 0 012-2h12a2 2 0 012 2v4M2 11h20v6H2v-6zM6 17v2M18 17v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'materials', label: 'Materials', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M12 3l9 4.5-9 4.5-9-4.5L12 3zM3 12l9 4.5 9-4.5M3 16.5L12 21l9-4.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'bulk', label: 'Bulk Goods', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M4 20V9l8-5 8 5v11M4 20h16M9 20v-6h6v6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'machinery', label: 'Machinery', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.2" stroke="currentColor" strokeWidth="2"/><path d="M12 2.5v3M12 18.5v3M21.5 12h-3M5.5 12h-3M18.7 5.3l-2.1 2.1M7.4 16.6l-2.1 2.1M18.7 18.7l-2.1-2.1M7.4 7.4L5.3 5.3" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { key: 'other', label: 'Other', icon: <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
]

const TRUCKS = [
  { key: 'pickup', label: 'Pickup', sub: '1 t · light loads', lo: 850, hi: 1100, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M1 16V9a1 1 0 011-1h10v8M12 10h4l3 4v2h-2M1 16h2m8 0h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6" cy="17.5" r="2" stroke="currentColor" strokeWidth="2"/><circle cx="16.5" cy="17.5" r="2" stroke="currentColor" strokeWidth="2"/></svg> },
  { key: 'lorry', label: 'Lorry', sub: '3 t · pallets', lo: 1450, hi: 1900, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M1 17V6a1 1 0 011-1h13v12M15 9h4l3 4v4h-2.5M1 17h2.5m9 0H15" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><circle cx="6.5" cy="18" r="2" stroke="currentColor" strokeWidth="2"/><circle cx="17.5" cy="18" r="2" stroke="currentColor" strokeWidth="2"/></svg> },
  { key: 'container', label: 'Container', sub: '10 t · freight', lo: 2600, hi: 3400, icon: <svg width="22" height="22" viewBox="0 0 24 24" fill="none"><rect x="2" y="6" width="20" height="10" rx="1.5" stroke="currentColor" strokeWidth="2"/><path d="M6 6v10M10 6v10M14 6v10M18 6v10" stroke="currentColor" strokeWidth="1.6"/><circle cx="7" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="2"/><circle cx="17" cy="18.5" r="1.8" stroke="currentColor" strokeWidth="2"/></svg> },
]

const PKG_PICKUP: Place = { id: 'pkg-pickup', label: '12 Maraval Rd, St Clair, Port of Spain', lat: 10.6657, lng: -61.5194 }
const PKG_DEST: Place = { id: 'pkg-dest', label: '45 Southern Main Rd, Chaguanas', lat: 10.5471, lng: -61.3743 }

function PackageScreen({ onBack }: { onBack: () => void }) {
  const { addTrip } = useCustomer()
  const [mode, setMode] = useState<'parcel' | 'cargo'>('parcel')
  const [category, setCategory] = useState('food')
  const [cargoType, setCargoType] = useState('pallets')
  const [truck, setTruck] = useState<'pickup' | 'lorry' | 'container'>('lorry')
  const [weight, setWeight] = useState(250)
  const [helpers, setHelpers] = useState(false)
  const [sheet, setSheet] = useState<null | 'photo' | 'agent' | 'fare'>(null)
  const [searching, setSearching] = useState(false)
  const [photoAdded, setPhotoAdded] = useState(false)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [pickupText, setPickupText] = useState(PKG_PICKUP.label)
  const [destText, setDestText] = useState(PKG_DEST.label)
  const [details, setDetails] = useState('')
  const [booked, setBooked] = useState<{ name: string; initials: string } | null>(null)

  useEffect(() => {
    const ctrl = new AbortController()
    fetchRoute(PKG_PICKUP, PKG_DEST, ctrl.signal)
      .then(r => setRoute(r))
      .catch(() => {})
    return () => ctrl.abort()
  }, [])

  const truckInfo = TRUCKS.find(t => t.key === truck)!
  const weightExtra = Math.round(weight / 50) * 25
  const helperExtra = helpers ? 180 : 0
  const km = route ? route.distanceM / 1000 : 4.6
  const parcelLo = Math.max(180, Math.round(150 + 20 * km))
  const parcelHi = parcelLo + 70
  const [fareLo, fareHi] = mode === 'parcel'
    ? [parcelLo, parcelHi]
    : [truckInfo.lo + weightExtra + helperExtra, truckInfo.hi + weightExtra + helperExtra]

  const openAgent = () => {
    setSearching(true)
    setSheet('agent')
    setTimeout(() => setSearching(false), 1600)
  }

  const acceptAgent = () => {
    const agent = mode === 'parcel'
      ? { name: 'Rajesh Deo', initials: 'RD' }
      : { name: 'Kwesi Boateng', initials: 'KB' }
    addTrip({
      title: mode === 'parcel'
        ? `Package to ${shortLabel(destText)}`
        : `${truckInfo.label} haul to ${shortLabel(destText)}`,
      meta: `Today · ${route ? formatDuration(route.durationS) : '45 min'} · ${mode === 'parcel' ? 'Parcel' : `${weight} kg`}`,
      fare: Math.round(((fareLo + fareHi) / 2) * 100) / 100,
      status: 'Completed',
    })
    setSheet(null)
    setBooked(agent)
  }

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-gray-50 rounded-2xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="font-800 text-xl text-gray-900">Package & Cargo</h2>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-4 space-y-4">
        {/* Parcel / Cargo mode */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
          {(['parcel', 'cargo'] as const).map(m => (
            <button key={m} onClick={() => setMode(m)}
              className={`flex-1 py-2.5 rounded-lg text-xs font-700 transition-all ${mode === m ? 'bg-white text-gray-900 shadow' : 'text-gray-400'}`}>
              {m === 'parcel' ? 'Parcel' : 'Cargo & Logistics'}
            </button>
          ))}
        </div>
        {/* Route map */}
        <div className="relative h-36 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm isolate">
          <RideMapView
            pickup={PKG_PICKUP}
            dest={PKG_DEST}
            route={route?.coords ?? null}
            cars={carsAround(PKG_PICKUP, 3)}
            interactive={false}
            zoom={11}
          />
          <div className="absolute bottom-2 left-2 z-[1100] bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-700 text-gray-800 shadow">
            {route ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationS)}` : 'Calculating route…'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{background: RED}}/>
            <input value={pickupText} onChange={e => setPickupText(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-500 text-gray-800 placeholder-gray-300" placeholder="Pickup location"/>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-900"/>
            <input value={destText} onChange={e => setDestText(e.target.value)}
              className="flex-1 bg-transparent outline-none text-sm font-500 text-gray-800 placeholder-gray-300" placeholder="Delivery location"/>
          </div>
          {!destText.trim() && <p className="text-xs text-[#E11D48] font-600 px-1">A delivery location is required.</p>}
        </div>

        {mode === 'parcel' ? (
          <div>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Category</p>
            <div className="grid grid-cols-3 gap-2">
              {PACKAGE_CATS.map(c => (
                <button key={c.key} onClick={() => setCategory(c.key)}
                  className={`py-3 rounded-xl flex flex-col items-center gap-1.5 border-2 transition-all ${category === c.key ? 'border-[#E11D48] bg-red-50 text-[#E11D48]' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                  {c.icon}
                  <span className={`text-[10px] font-700 capitalize ${category===c.key?'text-[#E11D48]':'text-gray-500'}`}>{c.label}</span>
                </button>
              ))}
            </div>
          </div>
        ) : (
          <>
            <div>
              <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Cargo type</p>
              <div className="grid grid-cols-3 gap-2">
                {CARGO_TYPES.map(c => (
                  <button key={c.key} onClick={() => setCargoType(c.key)}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1.5 border-2 transition-all ${cargoType === c.key ? 'border-[#E11D48] bg-red-50 text-[#E11D48]' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                    {c.icon}
                    <span className={`text-[10px] font-700 ${cargoType===c.key?'text-[#E11D48]':'text-gray-500'}`}>{c.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <p className="text-xs font-700 text-gray-500 uppercase tracking-wider">Load weight</p>
                <span className="text-xs font-800 text-gray-900">{weight} kg</span>
              </div>
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2.5">
                <button onClick={() => setWeight(w => Math.max(10, w - 50))} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-800 text-gray-900 active:scale-95 transition-transform">−</button>
                <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full rounded-full transition-all" style={{ width: `${Math.min(100, (weight / 2000) * 100)}%`, background: RED }}/>
                </div>
                <button onClick={() => setWeight(w => Math.min(2000, w + 50))} className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center font-800 text-gray-900 active:scale-95 transition-transform">+</button>
              </div>
            </div>

            <div>
              <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Vehicle</p>
              <div className="grid grid-cols-3 gap-2">
                {TRUCKS.map(t => (
                  <button key={t.key} onClick={() => setTruck(t.key as 'pickup' | 'lorry' | 'container')}
                    className={`py-3 rounded-xl flex flex-col items-center gap-1 border-2 transition-all ${truck === t.key ? 'border-[#E11D48] bg-red-50 text-[#E11D48]' : 'border-gray-100 bg-gray-50 text-gray-500'}`}>
                    {t.icon}
                    <span className={`text-[10px] font-700 ${truck===t.key?'text-[#E11D48]':'text-gray-500'}`}>{t.label}</span>
                    <span className="text-[8px] font-600 text-gray-400">{t.sub}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
              <div className="flex-1">
                <p className="text-sm font-700 text-gray-900">Add 2 loaders</p>
                <p className="text-[11px] text-gray-400 font-500">Help with loading & unloading · +TT$ 180</p>
              </div>
              <Toggle on={helpers} onChange={setHelpers} />
            </div>
          </>
        )}

        <div>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">{mode === 'parcel' ? 'Package Details' : 'Cargo Details'}</p>
          <textarea className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none placeholder-gray-300 font-500" rows={3}
            value={details} onChange={e => setDetails(e.target.value)}
            placeholder={mode === 'parcel' ? 'Describe your package…' : 'Describe the cargo, pickup access and unloading point…'}/>
        </div>

        <button onClick={() => setSheet('photo')} className={`w-full flex items-center gap-3 rounded-xl px-4 py-3 transition-colors ${photoAdded ? 'bg-green-50' : 'bg-gray-50 hover:bg-gray-100'}`}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M3 8.5A2.5 2.5 0 015.5 6H8l1.5-2.2A1.5 1.5 0 0110.8 3h2.4a1.5 1.5 0 011.3.8L16 6h2.5A2.5 2.5 0 0121 8.5v9A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5v-9z" stroke={photoAdded ? '#16A34A' : '#9CA3AF'} strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" stroke={photoAdded ? '#16A34A' : '#9CA3AF'} strokeWidth="2"/></svg>
          <span className={`text-sm font-500 ${photoAdded ? 'text-green-700 font-700' : 'text-gray-400'}`}>{photoAdded ? 'Photo attached · tap to replace' : 'Add photo'}</span>
        </button>

        <button onClick={() => setSheet('fare')} className="w-full bg-red-50 border-2 border-[#E11D48] rounded-2xl p-4 text-left active:scale-[0.99] transition-transform">
          <div className="flex justify-between text-sm items-center">
            <span className="text-gray-500 font-500 flex items-center gap-1.5">
              Estimated fare
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9" stroke="#9CA3AF" strokeWidth="2"/><path d="M12 11v5M12 7.5v.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"/></svg>
            </span>
            <span className="font-800 text-gray-900 flex items-center gap-1">TT$ {fareLo.toLocaleString()} – {fareHi.toLocaleString()}
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round"/></svg>
            </span>
          </div>
        </button>
      </div>

      <div className="px-5 pb-4">
        <button onClick={openAgent} disabled={!destText.trim()}
          className={`w-full py-4 rounded-full font-700 text-base text-white shadow-[0_6px_18px_rgba(225,29,72,0.3)] transition-all ${destText.trim() ? 'active:scale-[0.98]' : 'opacity-40 cursor-not-allowed'}`}
          style={{background: RED}}>
          {mode === 'parcel' ? 'Find Courier Nearby' : 'Find Truck Nearby'}
        </button>
      </div>

      {/* Photo sheet */}
      <Sheet open={sheet === 'photo'} onClose={() => setSheet(null)} title="Add a photo">
        <div className="space-y-2 mb-4">
          {[
            { label: 'Take a photo', sub: 'Use your camera' },
            { label: 'Choose from library', sub: 'Pick an existing image' },
          ].map(o => (
            <button key={o.label} onClick={() => { setPhotoAdded(true); setSheet(null) }}
              className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:bg-gray-50 transition-colors text-left">
              <span className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center">
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M3 8.5A2.5 2.5 0 015.5 6H8l1.5-2.2A1.5 1.5 0 0110.8 3h2.4a1.5 1.5 0 011.3.8L16 6h2.5A2.5 2.5 0 0121 8.5v9A2.5 2.5 0 0118.5 20h-13A2.5 2.5 0 013 17.5v-9z" stroke="#111" strokeWidth="2" strokeLinejoin="round"/><circle cx="12" cy="13" r="3.5" stroke="#111" strokeWidth="2"/></svg>
              </span>
              <div>
                <p className="text-sm font-700 text-gray-900">{o.label}</p>
                <p className="text-xs text-gray-400 font-500">{o.sub}</p>
              </div>
            </button>
          ))}
        </div>
        {photoAdded && (
          <button onClick={() => setPhotoAdded(false)} className="w-full py-3 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Remove photo</button>
        )}
      </Sheet>

      {/* Fare breakdown sheet */}
      <Sheet open={sheet === 'fare'} onClose={() => setSheet(null)} title="Fare estimate">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          {mode === 'parcel' ? (
            <>
              <Row label={`Pickup → delivery · ${formatDistance(route?.distanceM ?? 4600)}`} right={<span className="text-sm font-700 text-gray-900">TT$ {parcelLo - 70}.00</span>} />
              <Row label={`Handling · ${category}`} right={<span className="text-sm font-700 text-gray-900">TT$ 40.00</span>} />
              <Row label="Service fee" right={<span className="text-sm font-700 text-gray-900">TT$ 30.00</span>} />
            </>
          ) : (
            <>
              <Row label={`${truckInfo.label} · ${formatDistance(route?.distanceM ?? 4600)} haul`} right={<span className="text-sm font-700 text-gray-900">TT$ {truckInfo.lo}.00 – {truckInfo.hi}.00</span>} />
              <Row label={`Weight · ${weight} kg`} right={<span className="text-sm font-700 text-gray-900">TT$ {weightExtra}.00</span>} />
              {helpers && <Row label="Loaders · 2" right={<span className="text-sm font-700 text-gray-900">TT$ 180.00</span>} />}
              <Row label={`Cargo · ${cargoType}`} right={<span className="text-sm font-700 text-gray-900">TT$ 30.00</span>} />
            </>
          )}
          <Row label="Estimated total" right={<span className="text-sm font-800 text-gray-900">TT$ {fareLo.toLocaleString()} – {fareHi.toLocaleString()}</span>} />
        </div>
        <p className="text-xs text-gray-400 font-500 mb-4">
          {mode === 'parcel'
            ? 'Final price depends on package weight and waiting time. You’ll see the exact fare before an agent accepts.'
            : 'Final price depends on haul distance, load weight and loading time. The driver confirms the exact fare at pickup.'}
        </p>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Got it</button>
      </Sheet>

      {/* Agent search sheet */}
      <Sheet open={sheet === 'agent'} onClose={() => setSheet(null)}
        title={searching ? (mode === 'parcel' ? 'Finding a courier…' : 'Finding a truck…') : (mode === 'parcel' ? 'Courier found' : 'Truck found')}>
        {searching ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-[#E11D48] animate-spin mb-4"/>
            <p className="text-sm text-gray-500 font-500 text-center">
              Searching for {mode === 'parcel' ? 'delivery couriers' : 'trucks & drivers'} within 2 km of your pickup…
            </p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
              <Avatar initials={mode === 'parcel' ? 'RD' : 'KB'} className="w-14 h-14 rounded-2xl text-base" />
              <div className="flex-1">
                <p className="font-800 text-gray-900">{mode === 'parcel' ? 'Rajesh Deo' : 'Kwesi Boateng'}</p>
                <p className="text-xs text-gray-400 font-500">
                  {mode === 'parcel' ? 'Bike courier · TDR 5163' : `${truckInfo.label} driver · TDT 8892`}
                </p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star filled size={12} />
                  <span className="text-xs font-600 text-gray-600">4.89 · {mode === 'parcel' ? '1,204 deliveries' : '632 hauls'}</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-800 text-gray-900">{mode === 'parcel' ? '4 min' : '9 min'}</p>
                <p className="text-[10px] text-gray-400 font-600">away</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Pickup ETA" right={<span className="text-sm font-700 text-gray-900">Today · within {mode === 'parcel' ? '10' : '20'} min</span>} />
              <Row label="Delivery ETA" right={<span className="text-sm font-700 text-gray-900">Today · {mode === 'parcel' ? '18' : '45'} min</span>} />
              {mode === 'cargo' && <Row label="Load" right={<span className="text-sm font-700 text-gray-900">{weight} kg · {cargoType}</span>} />}
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Decline</button>
              <button onClick={acceptAgent} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white active:scale-[0.98] transition-transform" style={{background: RED}}>
                Accept {mode === 'parcel' ? 'Rajesh' : 'Kwesi'}
              </button>
            </div>
          </>
        )}
      </Sheet>

      {/* Booking confirmed overlay */}
      {booked && (
        <div className="absolute inset-0 z-[60] bg-white flex flex-col anim-fade">
          <div className="px-5 pt-5 pb-3 flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center bg-green-50 text-green-600">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <h2 className="font-800 text-xl text-gray-900">{mode === 'parcel' ? 'Courier booked' : 'Truck booked'}</h2>
          </div>

          <div className="flex-1 overflow-y-auto px-5 pb-4 space-y-4">
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4">
              <Avatar initials={booked.initials} className="w-14 h-14 rounded-2xl text-base" />
              <div className="flex-1 min-w-0">
                <p className="font-800 text-gray-900">{booked.name}</p>
                <p className="text-xs text-gray-400 font-500">{mode === 'parcel' ? 'Bike courier · TDR 5163' : `${truckInfo.label} driver · TDT 8892`}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star filled size={12} />
                  <span className="text-xs font-600 text-gray-600">4.89 · {mode === 'parcel' ? '1,204 deliveries' : '632 hauls'}</span>
                </div>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-800 text-gray-900">{mode === 'parcel' ? '4 min' : '9 min'}</p>
                <p className="text-[10px] text-gray-400 font-600">to pickup</p>
              </div>
            </div>

            <div className="relative h-32 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm isolate">
              <RideMapView pickup={PKG_PICKUP} dest={PKG_DEST} route={route?.coords ?? null} interactive={false} zoom={11} />
            </div>

            <div className="bg-gray-50 rounded-2xl p-4">
              <Row label="Pickup" sub={pickupText} />
              <Row label="Delivery" sub={destText} />
              <Row label="Category" right={<span className="text-sm font-700 text-gray-900 capitalize">{mode === 'parcel' ? category : `${cargoType} · ${weight} kg`}</span>} />
              <Row label="Status" right={<span className="text-xs font-700 px-2 py-1 rounded-full bg-green-100 text-green-700">{searching ? 'Matching' : 'Assigned'}</span>} />
              <Row label="Estimated fare" right={<span className="text-sm font-800 text-gray-900">TT$ {fareLo.toLocaleString()} – {fareHi.toLocaleString()}</span>} />
            </div>

            <p className="text-xs text-gray-400 font-500">{details.trim() ? `Notes: ${details.trim()}` : 'Live tracking stays on until delivery is confirmed.'}</p>
          </div>

          <div className="px-5 pb-4 flex gap-3">
            <button onClick={() => { setBooked(null); onBack() }} className="flex-1 py-4 rounded-full font-700 text-sm text-gray-600 bg-gray-100">View in activity</button>
            <button onClick={() => { setBooked(null); onBack() }} className="flex-1 py-4 rounded-full font-800 text-sm text-white active:scale-[0.98] transition-transform" style={{background: RED}}>
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

const PROFILE_MENU = [
  { key: 'history', label: 'Trip History', sub: '24 trips', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'wallet', label: 'Wallet & Recharge', sub: 'TT$ 1,250', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><rect x="2.5" y="5.5" width="19" height="13" rx="2.5" stroke="currentColor" strokeWidth="2"/><path d="M2.5 10h19M6 14.5h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
  { key: 'promo', label: 'Promo Codes', sub: '2 active', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M20 12v7.5a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 19.5V12M2 8.5V4h20v4.5a2.5 2.5 0 000 5V18H2v-4.5a2.5 2.5 0 000-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
  { key: 'refer', label: 'Refer & Earn', sub: 'Earn TT$ 100', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'places', label: 'Saved Places', sub: 'Home, Work', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.4-7.5-11A7.5 7.5 0 0112 2.5 7.5 7.5 0 0119.5 10c0 6.6-7.5 11-7.5 11z" stroke="currentColor" strokeWidth="2"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="2"/></svg> },
  { key: 'language', label: 'Language', sub: 'English', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="9.5" stroke="currentColor" strokeWidth="2"/><path d="M2.5 12h19M12 2.5c2.5 2.6 3.8 5.8 3.8 9.5S14.5 18.9 12 21.5c-2.5-2.6-3.8-5.8-3.8-9.5S9.5 5.1 12 2.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/></svg> },
  { key: 'notifications', label: 'Notifications', sub: 'All on', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M18 8.5a6 6 0 10-12 0c0 6.5-2.5 8.5-2.5 8.5h17S18 15 18 8.5zM13.7 20.5a2 2 0 01-3.4 0" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'corporate', label: 'Corporate Account', sub: 'Personal', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M4 21V5a2 2 0 012-2h8a2 2 0 012 2v16M16 9h2a2 2 0 012 2v10M2 21h20M8 7h2M8 11h2M8 15h2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'support', label: 'Support', sub: '', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M21.5 16.9v2.7a2 2 0 01-2.2 2 19.6 19.6 0 01-8.6-3.1 19.3 19.3 0 01-6-6A19.6 19.6 0 011.6 4a2 2 0 012-2.2h2.7a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1l-1.1 1.1a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.7 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg> },
  { key: 'terms', label: 'Terms & Privacy', sub: '', icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M14 3H7a2 2 0 00-2 2v14a2 2 0 002 2h10a2 2 0 002-2V8l-5-5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/><path d="M14 3v5h5M9 13h6M9 17h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg> },
] as const

function ProfileScreen({ onBack, onLogout }: { onBack: () => void; onLogout: () => void }) {
  const {
    profile, setProfile,
    wallet, recharge: rechargeWallet,
    trips, promo, setPromo,
    notifs, setNotifs,
    language, setLanguage,
    corp, setCorp,
  } = useCustomer()
  const [sheet, setSheet] = useState<null | typeof PROFILE_MENU[number]['key'] | 'edit' | 'walletcard'>(null)
  const [name, setName] = useState(profile.name)
  const [phone, setPhone] = useState(profile.phone)
  const [email, setEmail] = useState(profile.email)
  const [amount, setAmount] = useState(500)
  const [recharged, setRecharged] = useState(false)
  const [supportTopic, setSupportTopic] = useState<string | null>(null)

  const menuTitle = () => {
    if (sheet === 'edit') return 'Edit profile'
    if (sheet === 'walletcard') return 'Wallet'
    return PROFILE_MENU.find(m => m.key === sheet)?.label ?? ''
  }

  const menuSub = (key: string, fallback: string): string => {
    switch (key) {
      case 'history': return `${trips.length} trips`
      case 'wallet': return `TT$ ${wallet.toLocaleString()}`
      case 'promo': return promo ? `${promo} applied` : '2 active'
      case 'language': return language
      case 'corporate': return corp ? 'Business' : 'Personal'
      case 'notifications': {
        const on = Object.values(notifs).filter(Boolean).length
        return on === 4 ? 'All on' : `${on} of 4 on`
      }
      default: return fallback
    }
  }

  const sheetBody = () => {
    switch (sheet) {
      case 'history':
        return (
          <div className="space-y-3">
            {trips.length === 0 && <p className="text-sm text-gray-400 font-500 py-4 text-center">No trips yet.</p>}
            {trips.map(x => (
              <div key={x.id} className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex justify-between gap-3">
                  <p className="text-sm font-700 text-gray-900 truncate">{x.title}</p>
                  <p className="text-sm font-800 text-gray-900 shrink-0">TT$ {x.fare.toFixed(2)}</p>
                </div>
                <div className="flex justify-between items-center mt-0.5">
                  <p className="text-xs text-gray-400 font-500">{x.meta}</p>
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${x.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{x.status}</span>
                </div>
              </div>
            ))}
          </div>
        )
      case 'wallet':
      case 'walletcard':
        return (
          <div>
            <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4">
              <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">Wallet balance</p>
              <p className="text-3xl font-800 tracking-tight">TT$ {wallet.toLocaleString()}.00</p>
              {recharged && <p className="text-xs font-700 text-green-400 mt-1 anim-fade">TT$ {amount.toLocaleString()} added — new balance TT$ {wallet.toLocaleString()}.00</p>}
            </div>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Recharge amount</p>
            <div className="flex gap-2 mb-3">
              {[200, 500, 1000, 2000].map(a => (
                <button key={a} onClick={() => { setAmount(a); setRecharged(false) }}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-700 border-2 transition-all ${amount === a ? 'border-[#111] bg-gray-50 text-gray-900' : 'border-gray-100 text-gray-500'}`}>
                  TT$ {a}
                </button>
              ))}
            </div>
            <button onClick={() => { rechargeWallet(amount); setRecharged(true) }}
              className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111] active:scale-[0.98] transition-transform">
              {recharged ? 'Recharge again' : `Recharge TT$ ${amount}`}
            </button>
            <button onClick={() => setSheet(null)} className="w-full py-3 font-700 text-sm text-gray-500 mt-1">Done</button>
          </div>
        )
      case 'promo':
        return (
          <div className="space-y-2.5">
            {[{ c: 'WELCOME20', d: '20% off your next ride', e: 'Oct 31' }, { c: 'AIRPORT10', d: 'TT$ 10 off airport trips', e: 'Nov 15' }].map(o => {
              const active = promo === o.c
              return (
                <div key={o.c} className={`flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed ${active ? 'border-[#E11D48] bg-red-50' : 'border-gray-200'}`}>
                  <div className="flex-1">
                    <p className="font-800 text-sm text-gray-900">{o.c}</p>
                    <p className="text-xs text-gray-500 font-500">{o.d} · exp {o.e}</p>
                  </div>
                  <button
                    onClick={() => setPromo(active ? null : o.c)}
                    className={`px-3.5 py-2 rounded-lg text-xs font-700 transition-colors ${active ? 'bg-gray-900 text-white' : 'bg-[#E11D48] text-white'}`}>
                    {active ? 'Remove' : 'Apply'}
                  </button>
                </div>
              )
            })}
            <p className="text-xs text-gray-400 font-500">Applied promos discount your fare automatically at checkout.</p>
          </div>
        )
      case 'refer':
        return (
          <div className="text-center">
            <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-2xl py-5 mb-4">
              <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">Your referral code</p>
              <p className="text-2xl font-800 text-gray-900 tracking-[0.15em]">KAMAL100</p>
            </div>
            <p className="text-sm text-gray-500 font-500 mb-4">Give TT$ 100 to a friend, get TT$ 100 after their first ride.</p>
            <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Share invite link</button>
          </div>
        )
      case 'places':
        return (
          <div className="space-y-2">
            {[{ l: 'Home', s: '12 Walker St, Port of Spain' }, { l: 'Work', s: 'Level 3, Invaders Bay' }].map(p => (
              <div key={p.l} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50">
                <div className="w-8 h-8 rounded-lg bg-white shadow-sm flex items-center justify-center">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20v-9.5z" stroke="#111" strokeWidth="2.2" strokeLinejoin="round"/></svg>
                </div>
                <div className="flex-1">
                  <p className="text-sm font-700 text-gray-900">{p.l}</p>
                  <p className="text-xs text-gray-400 font-500">{p.s}</p>
                </div>
                <button className="text-xs font-700 text-[#E11D48]">Edit</button>
              </div>
            ))}
            <button onClick={() => setSheet(null)} className="w-full py-3 rounded-xl border-2 border-dashed border-gray-200 text-sm font-700 text-gray-500 hover:border-gray-300">+ Add a place</button>
          </div>
        )
      case 'language':
        return (
          <div className="space-y-2">
            {['English', 'Spanish', 'French'].map(l => (
              <button key={l} onClick={() => setLanguage(l)}
                className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${language === l ? 'border-[#111] bg-gray-50' : 'border-gray-100'}`}>
                <span className="text-sm font-700 text-gray-900">{l}</span>
                {language === l && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
              </button>
            ))}
          </div>
        )
      case 'notifications':
        return (
          <div className="space-y-1">
            {([
              { k: 'push', l: 'Push notifications', s: 'Trip updates and driver messages' },
              { k: 'sms', l: 'SMS alerts', s: 'OTP and critical trip info' },
              { k: 'email', l: 'Email receipts', s: 'Get receipts after each trip' },
              { k: 'promos', l: 'Promotions', s: 'Offers, discounts and news' },
            ] as const).map(o => (
              <div key={o.k} className="flex items-center gap-3 py-3 border-b border-gray-100 last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-700 text-gray-900">{o.l}</p>
                  <p className="text-xs text-gray-400 font-500">{o.s}</p>
                </div>
                <Toggle on={notifs[o.k]} onChange={v => setNotifs({ ...notifs, [o.k]: v })} />
              </div>
            ))}
          </div>
        )
      case 'corporate':
        return (
          <div>
            <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
              {(['Personal', 'Business'] as const).map(m => (
                <button key={m} onClick={() => setCorp(m === 'Business')}
                  className={`flex-1 py-2.5 rounded-lg text-xs font-700 transition-all ${corp === (m === 'Business') ? 'bg-white text-gray-900 shadow' : 'text-gray-400'}`}>
                  {m}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 font-500 mb-4">
              {corp ? 'Link your company to expense rides to a central bill and download monthly VAT invoices.' : 'Switch to a business profile to separate work and personal trips.'}
            </p>
            <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">
              {corp ? 'Link company account' : 'Continue as personal'}
            </button>
          </div>
        )
      case 'support':
        if (supportTopic) {
          const content: Record<string, React.ReactNode> = {
            'Chat with us': (
              <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                <div className="max-w-[80%] bg-gray-100 text-gray-800 px-3.5 py-2.5 rounded-2xl rounded-bl-md text-sm font-500">Hi Kamal 👋 You're chatting with Pickuptt support. How can we help?</div>
                <div className="max-w-[80%] ml-auto bg-[#111] text-white px-3.5 py-2.5 rounded-2xl rounded-br-md text-sm font-500">Where is my refund from the cancelled ride?</div>
                <div className="max-w-[80%] bg-gray-100 text-gray-800 px-3.5 py-2.5 rounded-2xl rounded-bl-md text-sm font-500">It was approved yesterday — it should hit your card in 3–5 business days. I've emailed you the reference.</div>
                <p className="text-[11px] text-gray-400 font-600 text-center pt-1">Agent joined · typically replies in 2 min</p>
              </div>
            ),
            'Call support': (
              <div className="text-center py-3">
                <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-3" style={{color: RED}}>
                  <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M21.5 16.9v2.7a2 2 0 01-2.2 2 19.6 19.6 0 01-8.6-3.1 19.3 19.3 0 01-6-6A19.6 19.6 0 011.6 4a2 2 0 012-2.2h2.7a2 2 0 012 1.7c.1 1 .4 2 .7 2.9a2 2 0 01-.5 2.1l-1.1 1.1a16 16 0 006 6l1.1-1.1a2 2 0 012.1-.5c.9.3 1.9.6 2.9.7a2 2 0 011.7 2z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
                </div>
                <p className="font-800 text-gray-900">+1 868 000 0000</p>
                <p className="text-xs text-gray-400 font-500 mb-4">24/7 · average wait under 2 min</p>
                <a href="tel:+18680000000" className="block w-full py-3.5 rounded-full font-700 text-sm text-white" style={{background: RED}}>Call now</a>
              </div>
            ),
            'Report an issue': (
              <div className="space-y-2">
                {['Lost item', 'Fare dispute', 'Safety concern', 'Driver behaviour'].map(r => (
                  <div key={r} className="flex items-center gap-3 p-3.5 rounded-xl bg-gray-50">
                    <div className="flex-1"><p className="text-sm font-700 text-gray-900">{r}</p></div>
                    <span className="text-[11px] font-700 px-2 py-1 rounded-full bg-white border border-gray-200 text-gray-500">Report</span>
                  </div>
                ))}
                <p className="text-xs text-gray-400 font-500 pt-1">Reports are reviewed by our safety team within 24 hours.</p>
              </div>
            ),
            'FAQ': (
              <div className="space-y-3 text-sm text-gray-600 font-500 leading-relaxed max-h-64 overflow-y-auto pr-1">
                <p><b className="text-gray-900">How is my fare calculated?</b><br/>Base fare + distance + time, with multipliers per vehicle class. You always see it before booking.</p>
                <p><b className="text-gray-900">Can I schedule a ride?</b><br/>Yes — pick “Schedule” on the ride screen up to 24 hours ahead.</p>
                <p><b className="text-gray-900">How do refunds work?</b><br/>Approved refunds return to your original payment method within 3–5 business days.</p>
                <p><b className="text-gray-900">Is my wallet transferable?</b><br/>Wallet balance can pay any Pickuptt service and is non-transferable between accounts.</p>
              </div>
            ),
          }
          return (
            <div>
              <button onClick={() => setSupportTopic(null)} className="text-xs font-700 text-[#E11D48] mb-3 flex items-center gap-1">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none"><path d="M15 18l-6-6 6-6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
                All support options
              </button>
              <p className="font-800 text-gray-900 mb-3">{supportTopic}</p>
              {content[supportTopic]}
            </div>
          )
        }
        return (
          <div className="space-y-2">
            {[
              { l: 'Chat with us', s: 'Typical reply in 2 min' },
              { l: 'Call support', s: '24/7 · +1 868 000 0000' },
              { l: 'Report an issue', s: 'Lost item, fare dispute, safety' },
              { l: 'FAQ', s: 'Browse common questions' },
            ].map(o => (
              <button key={o.l} onClick={() => setSupportTopic(o.l)} className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:bg-gray-50 text-left transition-colors">
                <div className="flex-1">
                  <p className="text-sm font-700 text-gray-900">{o.l}</p>
                  <p className="text-xs text-gray-400 font-500">{o.s}</p>
                </div>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>
              </button>
            ))}
          </div>
        )
      case 'terms':
        return (
          <div className="space-y-3 text-sm text-gray-600 font-500 leading-relaxed max-h-64 overflow-y-auto pr-1">
            <p><b className="text-gray-900">Terms.</b> Pickuptt connects riders with independent drivers. Fares are estimated before booking and confirmed on trip completion. Cancellations within 2 minutes of matching are free.</p>
            <p><b className="text-gray-900">Privacy.</b> We collect your location during active trips to match you with nearby drivers and share it with your driver for pickup. Payment details are tokenized and never stored on our servers.</p>
            <p><b className="text-gray-900">Data.</b> You can request deletion of your account data at any time from Support.</p>
          </div>
        )
      case 'edit':
        return (
          <div className="space-y-3">
            <div className="flex justify-center mb-1">
              <div className="relative">
                <Avatar initials={initialsOf(name)} className="w-20 h-20 rounded-3xl text-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E11D48] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="Phone"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <input value={email} onChange={e => setEmail(e.target.value)} placeholder="Email"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <button
              onClick={() => {
                if (!name.trim()) return
                setProfile({ name: name.trim(), phone: phone.trim() || profile.phone, email: email.trim() || profile.email })
                setSheet(null)
              }}
              className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111] active:scale-[0.98] transition-transform">Save changes</button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 -ml-1 rounded-full bg-red-50 flex items-center justify-center active:scale-95 transition-transform"><svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke={RED} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <h2 className="font-800 text-xl text-gray-900">My Profile</h2>
      </div>

      <div className="px-5 mb-5">
        <button onClick={() => setSheet('edit')} className="w-full text-left flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors">
          <div className="relative shrink-0">
            <Avatar initials={initialsOf(profile.name)} className="w-16 h-16 rounded-2xl text-lg ring-2 ring-[#E11D48]/50" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{background:RED}}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div className="min-w-0">
            <p className="font-800 text-gray-900 truncate">{profile.name}</p>
            <p className="text-xs text-gray-400 font-500 truncate">{profile.phone}</p>
            <p className="text-xs text-gray-400 font-500 truncate">{profile.email}</p>
          </div>
          <div className="ml-auto text-right shrink-0">
            <p className="text-xs text-gray-400">Wallet</p>
            <p className="font-800 text-sm" style={{color: RED}}>TT$ {wallet.toLocaleString()}</p>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 space-y-2">
        {PROFILE_MENU.map(item => (
          <button key={item.key} onClick={() => { if (item.key === 'support') setSupportTopic(null); setSheet(item.key) }}
            className="group w-full flex items-center gap-3 bg-gray-50 hover:bg-red-50 rounded-xl px-4 py-3 transition-colors text-left">
            <span className="w-9 h-9 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center shrink-0 text-gray-700 group-hover:text-[#E11D48] group-hover:ring-[#E11D48]/30 transition-colors">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-600 text-gray-800 group-hover:text-[#E11D48]">{item.label}</p>
              {menuSub(item.key, item.sub) && <p className="text-xs text-gray-400">{menuSub(item.key, item.sub)}</p>}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        ))}

        <button onClick={onLogout}
          className="group w-full flex items-center gap-3 bg-gray-50 hover:bg-red-50 rounded-xl px-4 py-3 transition-colors text-left">
          <span className="w-9 h-9 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center shrink-0 text-gray-700 group-hover:text-[#E11D48] group-hover:ring-[#E11D48]/30 transition-colors">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4M16 17l5-5-5-5M21 12H9" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </span>
          <div className="flex-1">
            <p className="text-sm font-600 text-gray-800 group-hover:text-[#E11D48]">Log out</p>
          </div>
        </button>
      </div>

      <Sheet open={sheet !== null} onClose={() => { setSheet(null); setSupportTopic(null) }} title={menuTitle()}>
        {sheetBody()}
      </Sheet>
    </div>
  )
}

export default function CustomerApp() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [activeService, setActiveService] = useState('Cleaning')
  const [pickup, setPickup] = useState<Place>(POS_CENTER)
  const [dest, setDest] = useState<Place | null>(null)
  const [phone, setPhone] = useState('')

  return (
    <CustomerProvider>
      <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-10">
        {/* Screen selector */}
        <div className="flex gap-2 mb-6 flex-wrap justify-center px-4">
          {(['splash','phone','otp','home','ride','vehicle','tracking','complete','package','profile','service'] as Screen[]).map(s => (
            <button key={s} onClick={() => setScreen(s)}
              className={`px-3 py-1 rounded-full text-xs font-600 capitalize transition-all ${screen===s?'bg-[#E11D48] text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
              {s}
            </button>
          ))}
        </div>

        <PhoneFrame>
          {screen === 'splash' && <SplashScreen onNext={() => setScreen('phone')}/>}
          {screen === 'phone' && <PhoneScreen onNext={p => { setPhone(p); setScreen('otp') }} onBack={() => setScreen('splash')}/>}
          {screen === 'otp' && <OTPScreen phone={phone} onNext={() => setScreen('home')} onBack={() => setScreen('phone')}/>}
          {screen === 'home' && (
            <HomeScreen
              onRide={place => { if (place) setDest(place); setScreen('ride') }}
              onPackage={() => setScreen('package')}
              onProfile={() => setScreen('profile')}
              onService={name => { setActiveService(name); setScreen('service') }}
            />
          )}
          {screen === 'ride' && <RideScreen onNext={() => setScreen('vehicle')} onBack={() => setScreen('home')} pickup={pickup} setPickup={setPickup} dest={dest} setDest={setDest}/>}
          {screen === 'vehicle' && <VehicleScreen onNext={() => setScreen('tracking')} onBack={() => setScreen('ride')} pickup={pickup} dest={dest}/>}
          {screen === 'tracking' && <TrackingScreen onNext={() => setScreen('complete')} onBack={() => setScreen('vehicle')} pickup={pickup} dest={dest}/>}
          {screen === 'complete' && <CompleteScreen onBack={() => setScreen('home')}/>}
          {screen === 'package' && <PackageScreen onBack={() => setScreen('home')}/>}
          {screen === 'profile' && <ProfileScreen onBack={() => setScreen('home')} onLogout={() => setScreen('splash')}/>}
          {screen === 'service' && <ServiceScreen service={activeService} onBack={() => setScreen('home')}/>}
        </PhoneFrame>
      </div>
    </CustomerProvider>
  )
}
