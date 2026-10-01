import { useEffect, useState } from 'react'
import { MapCanvas, Avatar, Star, Sheet, Toggle, Row, Route } from './shared-ui'

type Screen = 'splash' | 'phone' | 'otp' | 'home' | 'ride' | 'vehicle' | 'tracking' | 'complete' | 'package' | 'profile'

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
  return (
    <div className="flex flex-col items-center justify-center" style={{height: 680, background: RED}}>
      <div className="text-center">
        <div className="w-20 h-20 bg-white/20 rounded-3xl flex items-center justify-center mx-auto mb-6">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="10" fill="white"/>
            <path d="M7 12l3 3 7-7" stroke={RED} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </div>
        <h1 className="text-4xl font-800 text-white mb-1 tracking-tight">Pickuptt</h1>
        <p className="text-white/70 text-sm">Your city, on demand</p>
      </div>
      <button onClick={onNext} className="absolute bottom-12 left-6 right-6 bg-white text-[#E11D48] font-700 py-4 rounded-2xl text-base">
        Get Started
      </button>
    </div>
  )
}

function PhoneScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [phone, setPhone] = useState('')
  const [sheet, setSheet] = useState<null | 'terms' | 'privacy'>(null)
  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <button onClick={onBack} className="mb-8"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <h2 className="text-3xl font-800 text-gray-900 mb-2 leading-tight">Enter your<br/>phone number</h2>
      <p className="text-gray-400 text-sm mb-8">We'll send you a verification code</p>
      <div className="flex gap-3 items-center border-2 border-gray-100 rounded-2xl px-4 py-3 mb-4 focus-within:border-[#E11D48] transition-colors">
        <span className="text-gray-500 font-600 text-base">+1</span>
        <div className="w-px h-6 bg-gray-200"/>
        <input
          type="tel"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          placeholder="868 123 4567"
          className="flex-1 outline-none text-gray-900 font-500 text-base bg-transparent placeholder-gray-300"
        />
      </div>
      <p className="text-xs text-gray-400 mb-auto">By continuing, you agree to our{' '}
        <button onClick={() => setSheet('terms')} className="text-[#E11D48] font-500 underline underline-offset-2">Terms</button>
        {' '}and{' '}
        <button onClick={() => setSheet('privacy')} className="text-[#E11D48] font-500 underline underline-offset-2">Privacy Policy</button>
      </p>
      <button onClick={onNext} className="w-full py-4 rounded-2xl font-700 text-base text-white" style={{background: RED}}>
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

function OTPScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [resendIn, setResendIn] = useState(45)

  useEffect(() => {
    if (resendIn <= 0) return
    const t = setTimeout(() => setResendIn(r => r - 1), 1000)
    return () => clearTimeout(t)
  }, [resendIn])

  const fillDigit = (i: number) => {
    setOtp(prev => {
      const next = [...prev]
      const digit = String((Number(next[i] || 0) + 1) % 10)
      next[i] = digit
      return next
    })
  }

  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <button onClick={onBack} className="mb-8"><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M19 12H5M5 12l7-7M5 12l7 7" stroke="#111" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
      <h2 className="text-3xl font-800 text-gray-900 mb-2 leading-tight">Verification<br/>Code</h2>
      <p className="text-gray-400 text-sm mb-8">Sent to +1 868 123 4567</p>
      <div className="flex gap-2 mb-6">
        {otp.map((d, i) => (
          <button key={i} onClick={() => fillDigit(i)}
            className={`flex-1 h-14 border-2 rounded-xl flex items-center justify-center text-xl font-700 transition-colors ${d ? 'border-[#E11D48] text-gray-900 bg-red-50/40' : 'border-gray-100 text-gray-300 hover:border-gray-300'}`}>
            {d || '·'}
          </button>
        ))}
      </div>
      <p className="text-xs text-gray-400 mb-auto">
        {resendIn > 0 ? (
          <>Resend code in <span className="text-[#E11D48] font-600">00:{String(resendIn).padStart(2, '0')}</span></>
        ) : (
          <button onClick={() => setResendIn(45)} className="text-[#E11D48] font-700 underline underline-offset-2">Resend code</button>
        )}
      </p>
      <button onClick={onNext} className="w-full py-4 rounded-2xl font-700 text-base text-white" style={{background: RED}}>
        Verify
      </button>
    </div>
  )
}

const SERVICES = [
  { icon: '🚗', label: 'Ride' },
  { icon: '📦', label: 'Package' },
  { icon: '🚛', label: 'Logistics' },
  { icon: '🔧', label: 'Towing' },
  { icon: '💊', label: 'Medi Boy' },
  { icon: '🏍️', label: 'Bike Taxi' },
  { icon: '🚑', label: 'Ambulance' },
]

function HomeScreen({ onRide, onPackage, onProfile }: { onRide: () => void; onPackage: () => void; onProfile: () => void }) {
  const [sheet, setSheet] = useState<null | 'schedule' | 'service' | 'all' | 'activity'>(null)
  const [activeService, setActiveService] = useState('Logistics')
  const [when, setWhen] = useState('Now')

  const suggestions = [
    { icon: '🚛', label: 'Logistics' },
    { icon: '🔧', label: 'Towing' },
    { icon: '💊', label: 'Medi Boy' },
    { icon: '🏍️', label: 'Bike' },
  ]

  const activity = [
    { title: 'Ride to Piarco Int’l', meta: 'Sep 30 · 15 min', fare: 'TT$ 45.00', status: 'Completed' },
    { title: 'Package to Kelaniya', meta: 'Sep 28 · 18 min', fare: 'TT$ 280.00', status: 'Completed' },
    { title: 'Ride to MovieTowne', meta: 'Sep 26 · 9 min', fare: 'TT$ 32.00', status: 'Cancelled' },
  ]

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      {/* Header */}
      <div className="px-5 pt-4 pb-4 flex items-center justify-between">
        <h2 className="text-3xl font-800 text-gray-900 tracking-tight">Pickuptt</h2>
        <button onClick={onProfile} className="w-10 h-10 rounded-full overflow-hidden bg-gray-100 border border-gray-200 shadow-sm">
          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&auto=format" alt="profile" className="w-full h-full object-cover"/>
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pb-4">
        {/* Main Services */}
        <div className="px-5 mb-6 flex gap-3">
          <button onClick={onRide} className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col justify-between items-start h-32 hover:border-gray-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-gray-900 mb-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
            <span className="font-800 text-gray-900 text-lg tracking-tight">Ride</span>
          </button>
          <button onClick={onPackage} className="flex-1 bg-gray-50 border border-gray-100 rounded-3xl p-5 flex flex-col justify-between items-start h-32 hover:border-gray-300 hover:shadow-md transition-all">
            <div className="w-12 h-12 bg-white rounded-2xl shadow-sm border border-gray-50 flex items-center justify-center text-gray-900 mb-2">
               <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/></svg>
            </div>
            <span className="font-800 text-gray-900 text-lg tracking-tight">Package</span>
          </button>
        </div>

        {/* Where to? */}
        <div className="px-5 mb-6">
          <div className="bg-gray-100 rounded-full flex items-center px-5 py-4 gap-3 shadow-sm cursor-text" onClick={onRide}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#111" strokeWidth="2.5" strokeLinecap="round"/></svg>
            <span className="text-gray-900 font-700 text-lg flex-1">Where to?</span>
            <button
              onClick={e => { e.stopPropagation(); setSheet('schedule') }}
              className="bg-white rounded-full p-2 shadow-sm flex items-center gap-2"
            >
               <span className="text-xs font-700 bg-gray-100 px-2 py-1 rounded-full text-gray-800">{when}</span>
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
              <button key={s.label} onClick={() => { setActiveService(s.label); setSheet('service') }} className="flex flex-col items-center gap-2 group">
                <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center text-2xl group-hover:bg-gray-200 transition-colors">
                  {s.icon}
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
              <button onClick={onRide} className="w-full flex items-center gap-4 cursor-pointer group text-left">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#111" strokeWidth="2.5"/></svg>
                 </div>
                 <div className="flex-1 border-b border-gray-100 pb-4">
                    <h4 className="font-700 text-gray-900">Piarco International Airport</h4>
                    <p className="text-xs text-gray-400 font-500 mt-0.5">Golden Grove Rd, Piarco</p>
                 </div>
              </button>
              <button onClick={onRide} className="w-full flex items-center gap-4 cursor-pointer group text-left">
                 <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm group-hover:shadow transition-all">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/><circle cx="12" cy="10" r="3" stroke="#111" strokeWidth="2.5"/></svg>
                 </div>
                 <div className="flex-1">
                    <h4 className="font-700 text-gray-900">MovieTowne Port of Spain</h4>
                    <p className="text-xs text-gray-400 font-500 mt-0.5">Audrey Jeffers Hwy, Port of Spain</p>
                 </div>
              </button>
           </div>
        </div>
      </div>

      {/* Bottom nav */}
      <div className="flex justify-around items-center px-6 py-4 border-t border-gray-100 bg-white">
        {[
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>, label:'Home', active:true},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><rect x="3" y="4" width="18" height="16" rx="2" stroke="#ccc" strokeWidth="2.5"/><path d="M8 2v4M16 2v4M3 10h18" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/></svg>, label:'Activity', active:false},
          {icon: <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10" stroke="#ccc" strokeWidth="2.5"/><path d="M12 8v4l3 3" stroke="#ccc" strokeWidth="2.5" strokeLinecap="round"/></svg>, label:'Account', active:false},
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
            <span className={`text-[10px] font-700 ${item.active ? 'text-gray-900' : 'text-gray-400'}`}>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Schedule sheet */}
      <Sheet open={sheet === 'schedule'} onClose={() => setSheet(null)} title="When do you leave?">
        <div className="space-y-2 mb-4">
          {['Now', 'In 15 min', 'In 30 min', 'In 1 hour', 'Tomorrow 8:00 AM'].map(t => (
            <button key={t} onClick={() => { setWhen(t === 'Now' ? 'Now' : t.replace('In ', '+')); setSheet(null) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${when === (t === 'Now' ? 'Now' : t.replace('In ', '+')) ? 'border-[#111] bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <span className="text-sm font-700 text-gray-900">{t}</span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Service sheet */}
      <Sheet open={sheet === 'service'} onClose={() => setSheet(null)} title={activeService}>
        <p className="text-sm text-gray-500 font-500 mb-4">Book a {activeService.toLowerCase()} expert near you. Upfront pricing, live tracking and insurance included.</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Starting from" right={<span className="text-sm font-800 text-gray-900">TT$ 60.00</span>} />
          <Row label="Nearest provider" right={<span className="text-sm font-700 text-green-600">4 min away</span>} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Not now</button>
          <button onClick={() => setSheet('all')} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">See options</button>
        </div>
      </Sheet>

      {/* All services sheet */}
      <Sheet open={sheet === 'all'} onClose={() => setSheet(null)} title="All services">
        <div className="grid grid-cols-3 gap-3 mb-2">
          {[{i:'🚗',l:'Ride'},{i:'📦',l:'Package'},{i:'🚛',l:'Logistics'},{i:'🔧',l:'Towing'},{i:'💊',l:'Medi Boy'},{i:'🏍️',l:'Bike Taxi'},{i:'🚑',l:'Ambulance'},{i:'🧹',l:'Cleaning'},{i:'🛠️',l:'Repairs'}].map(s => (
            <button key={s.l} onClick={() => { setActiveService(s.l); setSheet('service') }}
              className="flex flex-col items-center gap-2 py-3 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-colors">
              <span className="text-2xl">{s.i}</span>
              <span className="text-[11px] font-700 text-gray-700">{s.l}</span>
            </button>
          ))}
        </div>
      </Sheet>

      {/* Activity sheet */}
      <Sheet open={sheet === 'activity'} onClose={() => setSheet(null)} title="Your activity">
        <div className="space-y-3">
          {activity.map(a => (
            <div key={a.title} className="bg-gray-50 rounded-2xl p-4">
              <div className="flex justify-between items-start mb-1">
                <p className="font-700 text-sm text-gray-900">{a.title}</p>
                <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${a.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'}`}>{a.status}</span>
              </div>
              <div className="flex justify-between items-center">
                <p className="text-xs text-gray-400 font-500">{a.meta}</p>
                <p className="text-sm font-800 text-gray-900">{a.fare}</p>
              </div>
            </div>
          ))}
        </div>
      </Sheet>
    </div>
  )
}

const SAVED_PLACES = [
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20v-9.5z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>, label: 'Home', sub: '12 Walker St, Port of Spain' },
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><rect x="3" y="7" width="18" height="13" rx="2.5" stroke="currentColor" strokeWidth="2.2"/><path d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 12.5h18" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>, label: 'Work', sub: 'Level 3, Invaders Bay' },
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.4-7.5-11A7.5 7.5 0 0112 2.5 7.5 7.5 0 0119.5 10c0 6.6-7.5 11-7.5 11z" stroke="currentColor" strokeWidth="2.2"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="2.2"/></svg>, label: 'Piarco Int’l', sub: 'Golden Grove Rd' },
  { icon: <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M12 3l2.4 5.1 5.6.8-4 4 .9 5.6-4.9-2.7-4.9 2.7.9-5.6-4-4 5.6-.8L12 3z" stroke="currentColor" strokeWidth="2.2" strokeLinejoin="round"/></svg>, label: 'MovieTowne', sub: 'Audrey Jeffers Hwy' },
]

function RideScreen({ onNext, onBack, pickup, setPickup, dest, setDest }: {
  onNext: () => void; onBack: () => void
  pickup: string; setPickup: (v: string) => void
  dest: string; setDest: (v: string) => void
}) {
  const [timing, setTiming] = useState<'now' | 'later'>('now')
  const [sheet, setSheet] = useState<null | 'schedule' | 'promo' | 'map' | 'search'>(null)
  const [whenLabel, setWhenLabel] = useState('Leave now')
  const [promo, setPromo] = useState('')
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [toast, setToast] = useState('')

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(''), 1800)
  }

  return (
    <div className="flex flex-col bg-white relative" style={{ height: 680 }}>
      {/* Map */}
      <div className="relative h-[46%] shrink-0">
        <MapCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10" />

        {/* route */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 375 320" preserveAspectRatio="xMidYMid slice" fill="none">
          <Route d="M120 224C130 170 190 150 232 70" />
        </svg>

        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>

        {/* recenter */}
        <button
          onClick={() => flash('Map recentered on your location')}
          className="absolute bottom-4 right-4 w-9 h-9 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="3.4" fill="#111"/><circle cx="12" cy="12" r="7.4" stroke="#111" strokeWidth="2.2"/><path d="M12 1.5v3M12 19.5v3M22.5 12h-3M4.5 12h-3" stroke="#111" strokeWidth="2.2" strokeLinecap="round"/></svg>
        </button>

        {/* pickup pin + car */}
        <div className="absolute" style={{ left: '32%', bottom: '30%' }}>
          <div className="relative">
            <div className="absolute inset-0 -m-3 rounded-full bg-white/25 animate-ping" />
            <div className="relative w-4 h-4 rounded-full bg-[#111] ring-4 ring-white shadow-lg" />
          </div>
        </div>
        <div className="absolute" style={{ left: '62%', top: '22%' }}>
          <svg width="30" height="30" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="12" fill="rgba(255,255,255,0.9)" />
            <path d="M4.5 10.5h15M8 15.5h1m4 0h1M5.5 19h13a2 2 0 002-2v-7a3 3 0 00-3-3H6.5a3 3 0 00-3 3v7a2 2 0 002 2z" stroke="#111" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>

        {toast && (
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-700 px-4 py-2 rounded-full shadow-lg anim-fade whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      {/* Floating search card */}
      <div className="relative z-10 -mt-7 px-4">
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5 px-4 py-3.5">
          <div className="relative flex gap-3 items-center">
            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
              <div className="w-px flex-1 min-h-[18px] bg-gradient-to-b from-gray-300 to-gray-300" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#111]" />
            </div>
            <div className="flex-1 space-y-2.5">
              <input
                value={pickup}
                onChange={e => setPickup(e.target.value)}
                className="w-full bg-transparent outline-none text-[15px] font-600 text-gray-900 placeholder-gray-400"
                placeholder="Pickup location"
              />
              <input
                value={dest}
                onChange={e => setDest(e.target.value)}
                onClick={() => !dest && setSheet('search')}
                className="w-full bg-transparent outline-none text-[15px] font-600 text-gray-900 placeholder-gray-400"
                placeholder="Where to?"
              />
            </div>
            <button
              onClick={() => setSheet('search')}
              className="shrink-0 w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
            >
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" stroke="#111" strokeWidth="2.4" strokeLinecap="round"/></svg>
            </button>
          </div>
        </div>
      </div>

      {/* Sheet */}
      <div className="flex-1 flex flex-col px-5 pt-5 pb-5 overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-[26px] font-800 text-gray-900 tracking-[-0.02em] leading-none">Plan your ride</h2>
          <button onClick={() => setSheet('map')} className="text-xs font-700 text-gray-500 flex items-center gap-1 hover:text-gray-900">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M12 21s-7.5-4.4-7.5-11A7.5 7.5 0 0112 2.5 7.5 7.5 0 0119.5 10c0 6.6-7.5 11-7.5 11z" stroke="currentColor" strokeWidth="2.4"/><circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="2.4"/></svg>
            Map
          </button>
        </div>

        {/* Timing toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-5">
          {([
            { key: 'now', label: 'Leave now', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round" strokeLinejoin="round"/></svg> },
            { key: 'later', label: 'Schedule', icon: <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><rect x="3.5" y="5" width="17" height="15.5" rx="3" stroke="currentColor" strokeWidth="2.3"/><path d="M8 2.5V6M16 2.5V6M3.5 10.5h17" stroke="currentColor" strokeWidth="2.3" strokeLinecap="round"/></svg> },
          ] as const).map(t => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === 'later') setSheet('schedule')
                else { setTiming('now'); setWhenLabel('Leave now') }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-700 transition-all ${
                timing === t.key ? 'bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.12)]' : 'text-gray-500'
              }`}
            >
              {t.icon}
              {t.label}
            </button>
          ))}
        </div>
        {timing === 'later' && (
          <button onClick={() => setSheet('schedule')} className="-mt-3 mb-4 text-xs font-700 text-[#E11D48] text-left anim-fade">
            Scheduled for {whenLabel} · change
          </button>
        )}

        {/* Saved places */}
        <div className="grid grid-cols-2 gap-2.5 mb-4">
          {SAVED_PLACES.map(p => (
            <button key={p.label} onClick={() => { setDest(p.sub); flash(`Destination set to ${p.label}`) }}
              className="group flex items-center gap-2.5 bg-gray-50 hover:bg-gray-100 rounded-xl px-3 py-2.5 text-left transition-colors">
              <div className="w-7 h-7 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-gray-700 shrink-0">
                {p.icon}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-700 text-gray-900 leading-tight truncate">{p.label}</p>
                <p className="text-[10px] font-500 text-gray-400 truncate">{p.sub}</p>
              </div>
            </button>
          ))}
        </div>

        {/* Promo */}
        <button onClick={() => setSheet('promo')} className="flex items-center gap-2.5 border border-dashed border-gray-200 rounded-xl px-3 py-2.5 mb-auto text-left hover:border-[#E11D48]/50 transition-colors">
          <div className="w-7 h-7 rounded-lg bg-[#E11D48]/10 flex items-center justify-center shrink-0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M20 12v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 20v-8M2 8.5V4h20v4.5a2.5 2.5 0 000 5V18H2v-4.5a2.5 2.5 0 000-5z" stroke="#E11D48" strokeWidth="2.2" strokeLinejoin="round"/></svg>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-700 text-gray-900 leading-tight">{appliedPromo ? `${appliedPromo} applied` : 'Add promo code'}</p>
            <p className="text-[10px] font-500 text-gray-400">{appliedPromo ? 'Tap to change' : '2 offers available'}</p>
          </div>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2.4" strokeLinecap="round"/></svg>
        </button>

        <button
          onClick={onNext}
          className="mt-4 w-full py-4 rounded-full bg-[#111] text-white text-[15px] font-700 tracking-tight active:scale-[0.98] transition-transform shadow-[0_6px_20px_rgba(0,0,0,0.22)] flex items-center justify-center gap-2"
        >
          Choose Vehicle
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      {/* Schedule sheet */}
      <Sheet open={sheet === 'schedule'} onClose={() => setSheet(null)} title="Schedule your ride">
        <div className="space-y-2 mb-4">
          {['Leave now', 'In 15 minutes', 'In 30 minutes', 'In 1 hour', 'Tomorrow · 8:00 AM'].map(t => (
            <button key={t} onClick={() => { setWhenLabel(t); setTiming(t === 'Leave now' ? 'now' : 'later'); setSheet(null) }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${whenLabel === t ? 'border-[#111] bg-gray-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <span className="text-sm font-700 text-gray-900">{t}</span>
              {whenLabel === t && <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#111" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Promo sheet */}
      <Sheet open={sheet === 'promo'} onClose={() => setSheet(null)} title="Promo codes">
        <div className="space-y-2.5 mb-4">
          {[{ code: 'WELCOME20', desc: '20% off your next ride', exp: 'Expires Oct 31' }, { code: 'AIRPORT10', desc: 'TT$ 10 off airport trips', exp: 'Expires Nov 15' }].map(o => (
            <button key={o.code} onClick={() => { setPromo(o.code) }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${promo === o.code ? 'border-[#E11D48] bg-red-50' : 'border-gray-100 hover:bg-gray-50'}`}>
              <div className="w-9 h-9 rounded-lg bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M20 12v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 20v-8M2 8.5V4h20v4.5a2.5 2.5 0 000 5V18H2v-4.5a2.5 2.5 0 000-5z" stroke="#E11D48" strokeWidth="2.2" strokeLinejoin="round"/></svg>
              </div>
              <div className="flex-1">
                <p className="font-800 text-sm text-gray-900">{o.code}</p>
                <p className="text-xs text-gray-500 font-500">{o.desc} · {o.exp}</p>
              </div>
            </button>
          ))}
          <div className="flex gap-2 pt-1">
            <input value={promo} onChange={e => setPromo(e.target.value.toUpperCase())} placeholder="Enter code"
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none uppercase placeholder-gray-300 placeholder:normal-case border-2 border-transparent focus:border-gray-300"/>
            <button onClick={() => { if (promo) { setAppliedPromo(promo); setSheet(null) } }}
              className="px-5 rounded-xl font-700 text-sm text-white bg-[#111]">Apply</button>
          </div>
        </div>
      </Sheet>

      {/* Map sheet */}
      <Sheet open={sheet === 'map'} onClose={() => setSheet(null)} title="Route preview">
        <div className="relative h-56 rounded-2xl overflow-hidden ring-1 ring-black/5 mb-4">
          <MapCanvas />
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 335 224" fill="none">
            <Route d="M60 175C110 140 170 130 260 55" />
            <circle cx="60" cy="175" r="7" fill="#111" stroke="#fff" strokeWidth="3" />
            <circle cx="260" cy="55" r="7" fill="#E11D48" stroke="#fff" strokeWidth="3" />
          </svg>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <Row label="Distance" right={<span className="text-sm font-700 text-gray-900">3.2 km</span>} />
          <Row label="Est. time" right={<span className="text-sm font-700 text-gray-900">12 min</span>} />
          <Row label="Traffic" right={<span className="text-sm font-700 text-green-600">Light</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="mt-4 w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
      </Sheet>

      {/* Search sheet */}
      <Sheet open={sheet === 'search'} onClose={() => setSheet(null)} title="Choose destination">
        <input autoFocus value={dest} onChange={e => setDest(e.target.value)} placeholder="Where to?"
          className="w-full bg-gray-50 rounded-xl px-4 py-3.5 text-[15px] font-600 outline-none placeholder-gray-400 mb-4 border-2 border-transparent focus:border-gray-300"/>
        <p className="text-xs font-700 text-gray-400 uppercase tracking-wider mb-2">Recent</p>
        <div className="space-y-1 mb-4">
          {['Piarco International Airport', 'MovieTowne Port of Spain', 'Queen’s Park Savannah', 'Hyatt Regency'].map(p => (
            <button key={p} onClick={() => { setDest(p); setSheet(null) }}
              className="w-full flex items-center gap-3 px-2 py-3 rounded-xl hover:bg-gray-50 text-left">
              <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none"><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z" stroke="#111" strokeWidth="2.4"/><circle cx="12" cy="10" r="2.6" stroke="#111" strokeWidth="2.4"/></svg>
              </div>
              <span className="text-sm font-600 text-gray-800">{p}</span>
            </button>
          ))}
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Confirm destination</button>
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

function VehicleScreen({ onNext, onBack, pickup, dest }: { onNext: () => void; onBack: () => void; pickup: string; dest: string }) {
  const [selected, setSelected] = useState('Pickuptt X')
  const [sheet, setSheet] = useState<null | 'payment' | 'details' | 'confirm'>(null)
  const [payment, setPayment] = useState('Card ···· 4242')

  const selectedVehicle = VEHICLES.find(v => v.type === selected)!

  return (
    <div className="flex flex-col bg-white relative" style={{height: 680}}>
      <div className="relative h-44">
        <MapCanvas />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/5" />
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 375 176" fill="none">
          <Route d="M90 140C130 110 210 120 250 60" />
          <circle cx="90" cy="140" r="7" fill="#111" stroke="#fff" strokeWidth="3" />
          <circle cx="250" cy="60" r="7" fill="#E11D48" stroke="#fff" strokeWidth="3" />
        </svg>
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform">
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="relative z-10 flex-1 bg-white rounded-t-3xl -mt-6 px-5 pt-5 pb-6 shadow-[0_-8px_30px_rgba(0,0,0,0.06)] flex flex-col">
        <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-5"/>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-800 text-gray-900 text-2xl tracking-[-0.02em]">Choose a ride</h3>
          <button onClick={() => setSheet('details')} className="text-xs font-700 text-gray-500 hover:text-gray-900 flex items-center gap-1">
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
                  <span className="font-800 text-base text-gray-900">{v.price}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs font-500 text-gray-500">{v.desc}</span>
                </div>
                <div className="text-xs font-700 text-gray-900 mt-1">{v.time} dropoff</div>
              </div>
            </button>
          ))}
        </div>

        <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => setSheet('payment')} className="px-4 rounded-2xl bg-gray-100 flex items-center justify-center py-3.5 active:scale-95 transition-transform">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none"><path d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" stroke="#111" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
          <button onClick={() => setSheet('confirm')} className="flex-1 py-4 rounded-full font-700 text-[15px] text-white shadow-[0_6px_20px_rgba(0,0,0,0.22)] active:scale-[0.98] transition-transform bg-[#111]">
            Confirm {selected}
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
          <Row label="Distance · 3.2 km" right={<span className="text-sm font-700 text-gray-900">TT$ 19.20</span>} />
          <Row label="Time · 12 min" right={<span className="text-sm font-700 text-gray-900">TT$ 7.80</span>} />
          <Row label="Booking fee" right={<span className="text-sm font-700 text-gray-900">TT$ 0.00</span>} />
          <Row label="Total" right={<span className="text-sm font-800 text-gray-900">{selectedVehicle.price}</span>} />
        </div>
        <p className="text-xs text-gray-400 font-500 mb-4">Price may change if the route or wait time changes.</p>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Confirm sheet */}
      <Sheet open={sheet === 'confirm'} onClose={() => setSheet(null)} title="Confirm your ride">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label={selectedVehicle.type} sub={selectedVehicle.desc} right={<span className="text-sm font-800 text-gray-900">{selectedVehicle.price}</span>} />
          <Row label="Payment" sub={payment} right={<button onClick={() => setSheet('payment')} className="text-xs font-700 text-[#E11D48]">Change</button>} />
          <Row label="Pickup" sub={pickup || 'Current location'} />
          <Row label="Destination" sub={dest || 'Piarco Airport'} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Back</button>
          <button onClick={onNext} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111] active:scale-[0.98] transition-transform">
            Book {selected}
          </button>
        </div>
      </Sheet>
    </div>
  )
}

function TrackingScreen({ onNext, onBack }: { onNext: () => void; onBack: () => void }) {
  const [sheet, setSheet] = useState<null | 'sos' | 'call' | 'chat' | 'cancel' | 'driver'>(null)
  const [messages, setMessages] = useState([
    { me: false, text: 'Hi, I’m 2 minutes away at the main entrance.' },
  ])
  const [draft, setDraft] = useState('')
  const [sosSent, setSosSent] = useState(false)

  const send = () => {
    if (!draft.trim()) return
    setMessages(m => [...m, { me: true, text: draft.trim() }])
    setDraft('')
    setTimeout(() => setMessages(m => [...m, { me: false, text: 'Got it, see you shortly!' }]), 900)
  }

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="relative flex-1">
        <MapCanvas />
        {/* route + markers */}
        <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 375 460" fill="none">
          <Route d="M110 370C150 320 190 300 210 240s40-90 60-130" />
          <circle cx="110" cy="370" r="7" fill="#E11D48" stroke="#fff" strokeWidth="3" />
        </svg>
        {/* animated car marker */}
        <div className="absolute" style={{ left: '56%', top: '18%' }}>
          <div className="w-10 h-10 rounded-full bg-white shadow-[0_4px_14px_rgba(0,0,0,0.25)] flex items-center justify-center">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path d="M3 10.5h18M6.5 14h1.2m3.1 0h1.2m-6.6 3.8h10.6a2 2 0 002-2v-4.4a3 3 0 00-3-3H6.3a3 3 0 00-3 3v4.4a2 2 0 002 2z" stroke="#111" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M5.5 10.5l1.4-3.4A2 2 0 018.8 5.9h6.4a2 2 0 011.9 1.2l1.4 3.4" stroke="#111" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>
        {/* pickup dot */}
        <div className="absolute" style={{ left: '26%', bottom: '18%' }}>
          <div className="w-4 h-4 rounded-full bg-[#E11D48] border-4 border-white shadow-lg" />
        </div>
        {/* SOS */}
        <button onClick={() => setSheet('sos')} className="absolute top-4 right-4 bg-[#E11D48] text-white text-xs font-800 px-4 py-2 rounded-xl shadow active:scale-95 transition-transform">SOS</button>
        <button onClick={onBack} className="absolute top-4 left-4 w-9 h-9 bg-white rounded-full shadow flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
      </div>

      <div className="bg-white rounded-t-[28px] -mt-8 relative z-10 px-5 pt-4 pb-4 shadow-[0_-8px_30px_rgba(0,0,0,0.12)]">
        <div className="w-10 h-1 bg-gray-200 rounded-full mx-auto mb-4"/>
        <div className="flex items-center gap-2 mb-1">
          <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"/>
          <span className="text-xs font-700 text-green-600 uppercase tracking-wider">Driver en route</span>
        </div>
        <p className="text-2xl font-800 text-gray-900 mb-3 tracking-[-0.02em]">3 min away</p>

        <button onClick={() => setSheet('driver')} className="w-full flex items-center gap-3 bg-gray-50 rounded-2xl p-3 mb-4 text-left hover:bg-gray-100 transition-colors">
          <Avatar initials="KM" className="w-12 h-12 rounded-xl text-sm" />
          <div className="flex-1">
            <p className="font-700 text-gray-900 text-sm">Kevin Mohammed</p>
            <p className="text-xs text-gray-400">Pickuptt X · PDS 1234</p>
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
        </button>

        <div className="flex gap-2">
          <button onClick={onNext} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white flex items-center justify-center gap-1.5 shadow-[0_6px_18px_rgba(225,29,72,0.3)]" style={{background: RED}}>
            Trip In Progress
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
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
          <p className="text-xs text-gray-400 font-500 mb-1">Pickuptt X · PDS 1234</p>
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
            <p className="font-800 text-gray-900">Kevin Mohammed</p>
            <div className="flex items-center gap-1 mt-0.5">
              <Star filled size={13} />
              <span className="text-xs font-600 text-gray-600">4.92 · 2,841 trips</span>
            </div>
            <p className="text-xs text-gray-400 font-500 mt-0.5">Driving since 2021 · English, Hindi</p>
          </div>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Vehicle" sub="Pickuptt X · Black" right={<span className="text-sm font-700 text-gray-900">PDS 1234</span>} />
          <Row label="Total paid this trip" right={<span className="text-sm font-700 text-gray-900">TT$ 45.00</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Cancel sheet */}
      <Sheet open={sheet === 'cancel'} onClose={() => setSheet(null)} title="Cancel this ride?">
        <p className="text-sm text-gray-500 font-500 mb-4">Kevin is already on the way. A TT$ 10 cancellation fee may apply.</p>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Waited" right={<span className="text-sm font-700 text-gray-900">1 min 12 s</span>} />
          <Row label="Cancellation fee" right={<span className="text-sm font-700 text-gray-900">TT$ 10.00</span>} />
        </div>
        <div className="flex gap-3">
          <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Keep ride</button>
          <button onClick={() => { setSheet(null); onBack() }} className="flex-1 py-3.5 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Cancel ride</button>
        </div>
      </Sheet>
    </div>
  )
}

function CompleteScreen({ onBack }: { onBack: () => void }) {
  const [rating, setRating] = useState(5)
  const [tip, setTip] = useState(50)
  const [sheet, setSheet] = useState<null | 'receipt' | 'thanks'>(null)
  return (
    <div className="flex flex-col p-6 relative" style={{height: 680}}>
      <div className="flex-1 flex flex-col items-center justify-center text-center">
        <div className="w-20 h-20 rounded-3xl flex items-center justify-center mb-4 shadow-lg" style={{background: RED}}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </div>
        <h2 className="text-3xl font-800 text-gray-900 mb-1">Trip Complete!</h2>
        <p className="text-gray-400 text-sm mb-6">3.2 km · 15 min · TT$ 45.00</p>

        <div className="w-full bg-gray-50 rounded-2xl p-4 mb-6 text-left">
          <div className="flex items-center gap-3 mb-3">
            <Avatar initials="KM" className="w-10 h-10 rounded-xl text-xs" />
            <div>
              <p className="font-700 text-gray-900 text-sm">Kevin Mohammed</p>
              <p className="text-xs text-gray-400">Pickuptt X</p>
            </div>
            <div className="ml-auto text-right">
              <p className="text-sm font-800 text-gray-900">TT$ 45.00</p>
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
            {[5, 10, 15, 20].map(t => (
              <button key={t} onClick={() => setTip(t)} className={`flex-1 py-2.5 rounded-xl text-xs font-700 transition-all ${tip === t ? 'text-white shadow-md shadow-red-200' : 'bg-gray-100 text-gray-600'}`} style={tip===t?{background:RED}:{}}>
                TT$ {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      <button onClick={() => setSheet('thanks')} className="w-full py-4 rounded-2xl font-700 text-base text-white" style={{background: RED}}>
        Submit Rating
      </button>

      {/* Receipt sheet */}
      <Sheet open={sheet === 'receipt'} onClose={() => setSheet(null)} title="Trip receipt">
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="Trip" sub="Port of Spain → Piarco Airport" />
          <Row label="Date" sub="Oct 1, 2026 · 09:41" />
          <Row label="Driver" sub="Kevin Mohammed · Pickuptt X" />
          <Row label="Fare" right={<span className="text-sm font-700 text-gray-900">TT$ 45.00</span>} />
          <Row label="Tip" right={<span className="text-sm font-700 text-gray-900">TT$ {tip}.00</span>} />
          <Row label="Total" right={<span className="text-sm font-800 text-gray-900">TT$ {45 + tip}.00</span>} />
        </div>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Close</button>
      </Sheet>

      {/* Thanks sheet */}
      <Sheet open={sheet === 'thanks'} onClose={() => setSheet(null)} title="Thanks for your feedback!">
        <div className="flex flex-col items-center text-center py-1 mb-2">
          <div className="flex gap-1 mb-3">
            {[1,2,3,4,5].map(s => <Star key={s} filled={s <= rating} size={26} />)}
          </div>
          <p className="text-sm text-gray-500 font-500">You rated Kevin {rating} star{rating > 1 ? 's' : ''} and tipped TT$ {tip}. Your feedback keeps rides great for everyone.</p>
        </div>
        <div className="bg-gray-50 rounded-2xl p-4 mb-4">
          <Row label="New wallet balance" right={<span className="text-sm font-800 text-gray-900">TT$ {1250 - tip}.00</span>} />
        </div>
        <button onClick={onBack} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
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

function PackageScreen({ onBack }: { onBack: () => void }) {
  const [category, setCategory] = useState('food')
  const [sheet, setSheet] = useState<null | 'photo' | 'agent' | 'fare'>(null)
  const [searching, setSearching] = useState(false)
  const [photoAdded, setPhotoAdded] = useState(false)

  const openAgent = () => {
    setSearching(true)
    setSheet('agent')
    setTimeout(() => setSearching(false), 1600)
  }

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack} className="w-9 h-9 bg-gray-50 rounded-2xl flex items-center justify-center">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
        </button>
        <h2 className="font-800 text-xl text-gray-900">Package Delivery</h2>
      </div>

      <div className="flex-1 overflow-auto px-5 pb-4 space-y-4">
        {/* Route map */}
        <div className="relative h-36 rounded-2xl overflow-hidden ring-1 ring-black/5 shadow-sm">
          <MapCanvas />
          <svg className="absolute inset-0 h-full w-full pointer-events-none" viewBox="0 0 335 144" fill="none">
            <Route d="M60 110C110 90 160 70 270 40" />
            <circle cx="60" cy="110" r="7" fill="#E11D48" stroke="#fff" strokeWidth="3" />
            <circle cx="270" cy="40" r="7" fill="#111" stroke="#fff" strokeWidth="3" />
          </svg>
          <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur px-2.5 py-1 rounded-full text-[10px] font-700 text-gray-800 shadow">4.6 km · 18 min</div>
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-full" style={{background: RED}}/>
            <input className="flex-1 bg-transparent outline-none text-sm font-500 text-gray-800 placeholder-gray-300" placeholder="Pickup location" defaultValue="No. 12, Galle Road, Colombo 3"/>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
            <div className="w-2.5 h-2.5 rounded-sm bg-gray-900"/>
            <input className="flex-1 bg-transparent outline-none text-sm font-500 text-gray-800 placeholder-gray-300" placeholder="Delivery location" defaultValue="No. 45, Kandy Road, Kelaniya"/>
          </div>
        </div>

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

        <div>
          <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Package Details</p>
          <textarea className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none placeholder-gray-300 font-500" rows={3} placeholder="Describe your package..."/>
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
            <span className="font-800 text-gray-900 flex items-center gap-1">TT$ 250 – 320
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#E11D48" strokeWidth="2.4" strokeLinecap="round"/></svg>
            </span>
          </div>
        </button>
      </div>

      <div className="px-5 pb-4">
        <button onClick={openAgent} className="w-full py-4 rounded-full font-700 text-base text-white shadow-[0_6px_18px_rgba(225,29,72,0.3)] active:scale-[0.98] transition-transform" style={{background: RED}}>
          Find Agent Nearby
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
          <Row label="Pickup → delivery · 4.6 km" right={<span className="text-sm font-700 text-gray-900">TT$ 180.00</span>} />
          <Row label={`Handling · ${category}`} right={<span className="text-sm font-700 text-gray-900">TT$ 40.00</span>} />
          <Row label="Service fee" right={<span className="text-sm font-700 text-gray-900">TT$ 30.00</span>} />
          <Row label="Estimated total" right={<span className="text-sm font-800 text-gray-900">TT$ 250 – 320</span>} />
        </div>
        <p className="text-xs text-gray-400 font-500 mb-4">Final price depends on package weight and waiting time. You’ll see the exact fare before an agent accepts.</p>
        <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Got it</button>
      </Sheet>

      {/* Agent search sheet */}
      <Sheet open={sheet === 'agent'} onClose={() => setSheet(null)} title={searching ? 'Finding an agent…' : 'Agent found'}>
        {searching ? (
          <div className="flex flex-col items-center py-6">
            <div className="w-12 h-12 rounded-full border-4 border-red-100 border-t-[#E11D48] animate-spin mb-4"/>
            <p className="text-sm text-gray-500 font-500 text-center">Searching for delivery agents within 2 km of your pickup…</p>
          </div>
        ) : (
          <>
            <div className="flex items-center gap-3 bg-gray-50 rounded-2xl p-4 mb-4">
              <Avatar initials="RD" className="w-14 h-14 rounded-2xl text-base" />
              <div className="flex-1">
                <p className="font-800 text-gray-900">Rajesh Deo</p>
                <p className="text-xs text-gray-400 font-500">Bike courier · TDT 4471</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Star filled size={12} />
                  <span className="text-xs font-600 text-gray-600">4.89 · 1,204 deliveries</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-800 text-gray-900">4 min</p>
                <p className="text-[10px] text-gray-400 font-600">away</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Pickup ETA" right={<span className="text-sm font-700 text-gray-900">Today · within 10 min</span>} />
              <Row label="Delivery ETA" right={<span className="text-sm font-700 text-gray-900">Today · 18 min</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-600 bg-gray-100">Decline</button>
              <button onClick={() => setSheet(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Accept Rajesh</button>
            </div>
          </>
        )}
      </Sheet>
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

function ProfileScreen({ onBack }: { onBack: () => void }) {
  const [sheet, setSheet] = useState<null | typeof PROFILE_MENU[number]['key'] | 'edit' | 'walletcard'>(null)
  const [notifs, setNotifs] = useState({ push: true, sms: true, email: false, promos: true })
  const [language, setLanguage] = useState('English')
  const [corp, setCorp] = useState(false)
  const [name, setName] = useState('Kamal Perera')
  const [recharge, setRecharge] = useState(500)

  const menuTitle = () => {
    if (sheet === 'edit') return 'Edit profile'
    if (sheet === 'walletcard') return 'Wallet'
    return PROFILE_MENU.find(m => m.key === sheet)?.label ?? ''
  }

  const sheetBody = () => {
    switch (sheet) {
      case 'history':
        return (
          <div className="space-y-3">
            {[
              { t: 'Ride to Piarco Int’l', d: 'Sep 30 · 15 min', f: 'TT$ 45.00' },
              { t: 'Package to Kelaniya', d: 'Sep 28 · 18 min', f: 'TT$ 280.00' },
              { t: 'Ride to MovieTowne', d: 'Sep 26 · 9 min', f: 'TT$ 32.00' },
              { t: 'Bike taxi to Savannah', d: 'Sep 21 · 7 min', f: 'TT$ 18.00' },
            ].map(x => (
              <div key={x.t} className="bg-gray-50 rounded-xl p-3.5">
                <div className="flex justify-between"><p className="text-sm font-700 text-gray-900">{x.t}</p><p className="text-sm font-800 text-gray-900">{x.f}</p></div>
                <p className="text-xs text-gray-400 font-500 mt-0.5">{x.d}</p>
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
              <p className="text-3xl font-800 tracking-tight">TT$ 1,250.00</p>
            </div>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Recharge amount</p>
            <div className="flex gap-2 mb-3">
              {[200, 500, 1000, 2000].map(a => (
                <button key={a} onClick={() => setRecharge(a)}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-700 border-2 transition-all ${recharge === a ? 'border-[#111] bg-gray-50 text-gray-900' : 'border-gray-100 text-gray-500'}`}>
                  TT$ {a}
                </button>
              ))}
            </div>
            <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">
              Recharge TT$ {recharge}
            </button>
          </div>
        )
      case 'promo':
        return (
          <div className="space-y-2.5">
            {[{ c: 'WELCOME20', d: '20% off your next ride', e: 'Oct 31' }, { c: 'AIRPORT10', d: 'TT$ 10 off airport trips', e: 'Nov 15' }].map(o => (
              <div key={o.c} className="flex items-center gap-3 p-3.5 rounded-xl border-2 border-dashed border-gray-200">
                <div className="flex-1">
                  <p className="font-800 text-sm text-gray-900">{o.c}</p>
                  <p className="text-xs text-gray-500 font-500">{o.d} · exp {o.e}</p>
                </div>
                <button onClick={() => setSheet(null)} className="px-3.5 py-2 rounded-lg bg-[#E11D48] text-white text-xs font-700">Apply</button>
              </div>
            ))}
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
                <Toggle on={notifs[o.k]} onChange={v => setNotifs(n => ({ ...n, [o.k]: v }))} />
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
        return (
          <div className="space-y-2">
            {[
              { l: 'Chat with us', s: 'Typical reply in 2 min' },
              { l: 'Call support', s: '24/7 · +1 868 000 0000' },
              { l: 'Report an issue', s: 'Lost item, fare dispute, safety' },
              { l: 'FAQ', s: 'Browse common questions' },
            ].map(o => (
              <button key={o.l} onClick={() => setSheet(null)} className="w-full flex items-center gap-3 p-4 rounded-xl border-2 border-gray-100 hover:bg-gray-50 text-left transition-colors">
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
                <Avatar initials="KP" className="w-20 h-20 rounded-3xl text-xl" />
                <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-[#E11D48] flex items-center justify-center">
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
                </div>
              </div>
            </div>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <input defaultValue="+94 77 123 4567" placeholder="Phone"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <input defaultValue="kamal@example.com" placeholder="Email"
              className="w-full bg-gray-50 rounded-xl px-4 py-3 text-sm font-600 outline-none border-2 border-transparent focus:border-gray-300"/>
            <button onClick={() => setSheet(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Save changes</button>
          </div>
        )
      default:
        return null
    }
  }

  return (
    <div className="flex flex-col relative" style={{height: 680}}>
      <div className="px-5 pt-4 pb-2 flex items-center gap-3">
        <button onClick={onBack}><svg width="22" height="22" viewBox="0 0 24 24" fill="none"><path d="M15 5l-7 7 7 7" stroke="#111" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg></button>
        <h2 className="font-800 text-xl text-gray-900">My Profile</h2>
      </div>

      <div className="px-5 mb-5">
        <button onClick={() => setSheet('edit')} className="w-full text-left flex items-center gap-4 bg-gray-50 hover:bg-gray-100 rounded-2xl p-4 transition-colors">
          <div className="relative">
            <Avatar initials="KP" className="w-16 h-16 rounded-2xl text-lg" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center" style={{background:RED}}>
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none"><path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M18.5 2.5a2.12 2.12 0 013 3L12 15l-4 1 1-4 9.5-9.5z" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>
            </div>
          </div>
          <div>
            <p className="font-800 text-gray-900">{name}</p>
            <p className="text-xs text-gray-400 font-500">+94 77 123 4567</p>
            <p className="text-xs text-gray-400 font-500">kamal@example.com</p>
          </div>
          <div className="ml-auto text-right">
            <p className="text-xs text-gray-400">Wallet</p>
            <p className="font-800 text-gray-900 text-sm">TT$ 1,250</p>
          </div>
        </button>
      </div>

      <div className="flex-1 overflow-auto px-5 space-y-2">
        {PROFILE_MENU.map(item => (
          <button key={item.key} onClick={() => setSheet(item.key)}
            className="w-full flex items-center gap-3 bg-gray-50 hover:bg-gray-100 rounded-xl px-4 py-3 transition-colors text-left">
            <span className="w-9 h-9 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-gray-700 shrink-0">{item.icon}</span>
            <div className="flex-1">
              <p className="text-sm font-600 text-gray-800">{item.label}</p>
              {item.sub && <p className="text-xs text-gray-400">{item.sub}</p>}
            </div>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M9 18l6-6-6-6" stroke="#ccc" strokeWidth="2" strokeLinecap="round"/></svg>
          </button>
        ))}
      </div>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} title={menuTitle()}>
        {sheetBody()}
      </Sheet>
    </div>
  )
}

export default function CustomerApp() {
  const [screen, setScreen] = useState<Screen>('splash')
  const [pickup, setPickup] = useState('Current location')
  const [dest, setDest] = useState('')

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-10">
      {/* Screen selector */}
      <div className="flex gap-2 mb-6 flex-wrap justify-center px-4">
        {(['splash','phone','otp','home','ride','vehicle','tracking','complete','package','profile'] as Screen[]).map(s => (
          <button key={s} onClick={() => setScreen(s)}
            className={`px-3 py-1 rounded-full text-xs font-600 capitalize transition-all ${screen===s?'bg-[#E11D48] text-white':'bg-white text-gray-500 hover:bg-gray-50'}`}>
            {s}
          </button>
        ))}
      </div>

      <PhoneFrame>
        {screen === 'splash' && <SplashScreen onNext={() => setScreen('phone')}/>}
        {screen === 'phone' && <PhoneScreen onNext={() => setScreen('otp')} onBack={() => setScreen('splash')}/>}
        {screen === 'otp' && <OTPScreen onNext={() => setScreen('home')} onBack={() => setScreen('phone')}/>}
        {screen === 'home' && <HomeScreen onRide={() => setScreen('ride')} onPackage={() => setScreen('package')} onProfile={() => setScreen('profile')}/>}
        {screen === 'ride' && <RideScreen onNext={() => setScreen('vehicle')} onBack={() => setScreen('home')} pickup={pickup} setPickup={setPickup} dest={dest} setDest={setDest}/>}
        {screen === 'vehicle' && <VehicleScreen onNext={() => setScreen('tracking')} onBack={() => setScreen('ride')} pickup={pickup} dest={dest}/>}
        {screen === 'tracking' && <TrackingScreen onNext={() => setScreen('complete')} onBack={() => setScreen('vehicle')}/>}
        {screen === 'complete' && <CompleteScreen onBack={() => setScreen('home')}/>}
        {screen === 'package' && <PackageScreen onBack={() => setScreen('home')}/>}
        {screen === 'profile' && <ProfileScreen onBack={() => setScreen('home')}/>}
      </PhoneFrame>
    </div>
  )
}
