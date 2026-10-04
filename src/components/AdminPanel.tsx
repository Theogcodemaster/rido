import { useState } from 'react'
import { Sheet, Toggle, Row, Avatar, Star } from './shared-ui'
import logo from '../assets/logo.jpeg'

const RED = '#E11D48'

type AdminSection = 'dashboard' | 'rides' | 'drivers' | 'passengers' | 'fare' | 'reports' | 'notifications' | 'promo' | 'wallet' | 'settings'

const ICONS: Record<AdminSection, string> = {
  dashboard: 'M3 3h7v9H3zM14 3h7v5h-7zM14 12h7v9h-7zM3 16h7v5H3z',
  rides: 'M5 16h14M6.5 16l1.2-5h8.6L17.5 16M7 11l1.4-4h7.2L17 11M7.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM16.5 16a1.5 1.5 0 100 3 1.5 1.5 0 000-3z',
  drivers: 'M16 21v-2a4 4 0 00-4-4H6a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM22 21v-2a4 4 0 00-3-3.87',
  passengers: 'M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 11a4 4 0 100-8 4 4 0 000 8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75',
  fare: 'M12 1v22M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6',
  reports: 'M18 20V10M12 20V4M6 20v-6',
  notifications: 'M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.7 21a2 2 0 01-3.4 0',
  promo: 'M20 12v10H4V12M2 7h20v5H2zM12 22V7M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7zM12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z',
  wallet: 'M21 12V7H5a2 2 0 010-4h14v4M3 5v14a2 2 0 002 2h16v-5M18 12a2 2 0 000 4h4v-4h-4z',
  settings: 'M12 15a3 3 0 100-6 3 3 0 000 6zM19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 11-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 11-4 0v-.09A1.65 1.65 0 008 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 11-2.83-2.83l.06-.06a1.65 1.65 0 00.33-1.82 1.65 1.65 0 00-1.51-1H2a2 2 0 110-4h.09A1.65 1.65 0 004.6 8a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 112.83-2.83l.06.06A1.65 1.65 0 008 3.6 1.65 1.65 0 009 2.09V2a2 2 0 114 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 112.83 2.83l-.06.06a1.65 1.65 0 00-.33 1.82V9a1.65 1.65 0 001.51 1H22a2 2 0 110 4h-.09a1.65 1.65 0 00-1.51 1z',
}

function Ic({ name, size = 16, className = '' }: { name: AdminSection; size?: number; className?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
      <path d={ICONS[name]} />
    </svg>
  )
}

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

function SectionHead({ title, sub }: { title: string; sub?: string }) {
  return (
    <div className="mb-4">
      <h1 className="text-xl font-800 text-gray-900 tracking-[-0.02em]">{title}</h1>
      {sub && <p className="text-xs text-gray-400 font-500 mt-0.5">{sub}</p>}
    </div>
  )
}

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return <div className={`bg-white border border-gray-100 rounded-2xl ${className}`}>{children}</div>
}

const statusCls = (s: string) =>
  s === 'completed' || s === 'active' || s === 'online' ? 'bg-green-100 text-green-700'
  : s === 'in-progress' || s === 'on-trip' ? 'bg-blue-100 text-blue-700'
  : s === 'cancelled' || s === 'blocked' || s === 'suspended' ? 'bg-red-100 text-red-700'
  : 'bg-gray-100 text-gray-500'

function Status({ s }: { s: string }) {
  return <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full capitalize ${statusCls(s)}`}>{s}</span>
}

type Ride = { id: string; type: string; passenger: string; driver: string; from: string; to: string; fare: string; status: string; date: string }

const RIDES: Ride[] = [
  { id:'#R-10042', type:'Ride', passenger:'Kamal Perera', driver:'Andre B.', from:'Port of Spain', to:'Piarco Airport', fare:'TT$ 165', status:'completed', date:'Sep 30 09:12' },
  { id:'#R-10041', type:'Package', passenger:'Dilani Silva', driver:'Devon C.', from:'Arima', to:'Chaguanas', fare:'TT$ 260', status:'in-progress', date:'Sep 30 09:08' },
  { id:'#R-10040', type:'Cargo', passenger:'Ruwani Mendis', driver:'Ravi S.', from:'Claxton Bay', to:'Marabella', fare:'TT$ 850', status:'cancelled', date:'Sep 30 08:54' },
  { id:'#R-10039', type:'Ambulance', passenger:'Chamil D.', driver:'Kwame C.', from:'Diego Martin', to:'General Hospital, POS', fare:'TT$ 1,200', status:'completed', date:'Sep 29 23:40' },
  { id:'#R-10038', type:'Ride', passenger:'Priya F.', driver:'Marcus J.', from:'Maraval', to:'MovieTowne POS', fare:'TT$ 75', status:'completed', date:'Sep 29 22:30' },
]

function RideSheet({ ride, onClose }: { ride: Ride | null; onClose: () => void }) {
  return (
    <Sheet open={ride !== null} onClose={onClose} title={ride ? `${ride.id} · ${ride.type}` : ''}>
      {ride && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-800 text-gray-900">{ride.passenger}</p>
              <p className="text-xs text-gray-400 font-500">Driver: {ride.driver}</p>
            </div>
            <Status s={ride.status} />
          </div>
          <div className="relative mb-4 ml-2">
            <div className="absolute left-[3px] top-3 bottom-3 w-0.5 bg-gray-200"/>
            <div className="space-y-4">
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-full z-10 ring-4 ring-white" style={{background:RED}}/>
                <span className="text-sm font-700 text-gray-900">{ride.from}</span>
              </div>
              <div className="flex gap-4 items-center">
                <div className="w-2 h-2 rounded-sm bg-gray-900 z-10 ring-4 ring-white"/>
                <span className="text-sm font-700 text-gray-900">{ride.to}</span>
              </div>
            </div>
          </div>
          <div className="bg-gray-50 rounded-2xl p-4 mb-4">
            <Row label="Fare" right={<span className="text-sm font-800 text-gray-900">{ride.fare}</span>} />
            <Row label="Commission (15%)" right={<span className="text-sm font-700 text-gray-900">- TT$ {Math.round(parseInt(ride.fare.replace(/\D/g,''))*0.15)}</span>} />
            <Row label="Started" right={<span className="text-sm font-700 text-gray-900">{ride.date}</span>} />
          </div>
          <div className="flex gap-3">
            <button onClick={onClose} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Contact</button>
            <button onClick={onClose} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Open trip</button>
          </div>
        </div>
      )}
    </Sheet>
  )
}

function Kpi({ label, value, change, icon, dark }: { label: string; value: string; change: string; icon: AdminSection; dark?: boolean }) {
  return (
    <div className={`rounded-2xl p-4 ${dark ? 'bg-gray-900 text-white shadow-lg shadow-gray-900/20' : 'bg-white border border-gray-100'}`}>
      <div className="flex justify-between items-start mb-2">
        <p className={`text-[10px] font-700 uppercase tracking-wider leading-tight ${dark ? 'text-gray-400' : 'text-gray-400'}`}>{label}</p>
        <span className={dark ? 'text-white' : 'text-gray-900'}><Ic name={icon} size={15} /></span>
      </div>
      <p className={`text-2xl font-800 tracking-tight ${dark ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-[11px] font-600 mt-0.5 ${change.startsWith('↓') ? 'text-red-500' : dark ? 'text-green-400' : 'text-green-600'}`}>{change}</p>
    </div>
  )
}

const CHARTS: Record<string, { bars: number[]; labels: string[] }> = {
  '7D': { bars: [65,80,55,90,70,85,95], labels: ['Sep 24','Sep 25','Sep 26','Sep 27','Sep 28','Sep 29','Sep 30'] },
  '30D': { bars: [40,55,60,50,70,65,80,75,60,85,90,70,88,100], labels: ['Sep 1','','','Sep 20','','','Sep 25','','','Sep 30'] },
  '90D': { bars: [50,65,45,70,60,80,55,75,90,65,85,95,70,100], labels: ['Jul','','','Aug','','','Sep','','','','Oct'] },
}

function Dashboard({ onNav }: { onNav: (s: AdminSection) => void }) {
  const [range, setRange] = useState<'7D'|'30D'|'90D'>('7D')
  const [day, setDay] = useState<number | null>(null)
  const [ride, setRide] = useState<Ride | null>(null)
  const chart = CHARTS[range]

  return (
    <div>
      <SectionHead title="Dashboard" sub="Wednesday, 30 September 2026" />

      <div className="grid grid-cols-2 gap-3 mb-4">
        <Kpi label="Rides Today" value="1,284" change="↑ 8% vs yesterday" icon="rides" dark />
        <Kpi label="Revenue (TT$)" value="486,200" change="↑ 12% vs yesterday" icon="fare" />
        <Kpi label="Active Drivers" value="342" change="↑ 5 online now" icon="drivers" />
        <Kpi label="Cancellations" value="47" change="↓ 3% vs yesterday" icon="notifications" />
        <Kpi label="Deliveries" value="189" change="↑ 22% vs yesterday" icon="promo" />
        <Kpi label="New Users" value="94" change="↑ 18% vs yesterday" icon="passengers" />
      </div>

      <Card className="p-4 mb-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-800 text-sm text-gray-900 tracking-tight">Trip Summary</h2>
          <div className="flex gap-1 bg-gray-100 p-0.5 rounded-lg">
            {(['7D','30D','90D'] as const).map(t => (
              <button key={t} onClick={() => setRange(t)} className={`px-2.5 py-1 rounded-md text-[10px] font-700 transition-all ${range===t?'bg-gray-900 text-white shadow':'text-gray-500'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-1.5 h-28">
          {chart.bars.map((h,i) => (
            <button key={i} onClick={() => setDay(i)} className="flex-1 flex flex-col justify-end h-full group">
              <div className="w-full rounded-t-md transition-all group-hover:opacity-100" style={{height:`${h}%`, background: day===i?RED:'#FDD', opacity: day===i?1:0.6}}/>
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {chart.labels.map((l,i) => <span key={i} className="text-[8px] text-gray-300">{l}</span>)}
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-center mb-3">
          <h2 className="font-800 text-sm text-gray-900 tracking-tight">Recent Rides</h2>
          <button onClick={() => onNav('rides')} className="text-xs text-[#E11D48] font-700">View all →</button>
        </div>
        <div className="space-y-2">
          {RIDES.map(r => (
            <button key={r.id} onClick={() => setRide(r)} className="w-full flex items-center gap-3 p-3 rounded-xl bg-gray-50 hover:bg-gray-100 text-left transition-colors active:scale-[0.99]">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${r.status==='completed'?'bg-green-100':r.status==='cancelled'?'bg-red-100':'bg-blue-100'}`}>
                <Ic name={r.type==='Ride'?'rides':r.type==='Ambulance'?'notifications':'promo'} size={14} className={r.status==='completed'?'text-green-600':r.status==='cancelled'?'text-red-500':'text-blue-500'}/>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-700 text-gray-900 truncate">{r.passenger} · {r.type}</p>
                <p className="text-[11px] text-gray-400 font-500 truncate">{r.from} → {r.to}</p>
              </div>
              <div className="text-right shrink-0">
                <p className="text-sm font-800 text-gray-900">{r.fare}</p>
                <p className="text-[10px] text-gray-400">{r.date.split(' ')[2]}</p>
              </div>
            </button>
          ))}
        </div>
      </Card>

      <Sheet open={day !== null} onClose={() => setDay(null)} title="Trips this day">
        {day !== null && (
          <div>
            <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4">
              <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">{chart.labels[day] || `${range} · point ${day+1}`}</p>
              <p className="text-3xl font-800 tracking-tight">{Math.round(chart.bars[day] * 14)} trips</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Revenue" right={<span className="text-sm font-700 text-gray-900">TT$ {(chart.bars[day] * 380).toLocaleString()}</span>} />
              <Row label="Completed" right={<span className="text-sm font-700 text-gray-900">{Math.round(chart.bars[day] * 12)}</span>} />
              <Row label="Cancelled" right={<span className="text-sm font-700 text-gray-900">{Math.round(chart.bars[day] * 0.4)}</span>} />
            </div>
            <button onClick={() => setDay(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
          </div>
        )}
      </Sheet>

      <RideSheet ride={ride} onClose={() => setRide(null)} />
    </div>
  )
}

function RidesPanel() {
  const [service, setService] = useState('All')
  const [ride, setRide] = useState<Ride | null>(null)
  const list = RIDES.filter(r => service === 'All' || r.type === service)
  return (
    <div>
      <SectionHead title="Rides & Deliveries" sub={`${list.length} trips shown · live updates`} />
      <div className="flex gap-2 overflow-x-auto pb-3 -mx-1 px-1">
        {['All','Ride','Package','Cargo','Ambulance'].map(s => (
          <button key={s} onClick={() => setService(s)} className={`px-3.5 py-2 rounded-full text-xs font-700 whitespace-nowrap transition-all ${service===s?'bg-[#111] text-white shadow':'bg-white border border-gray-200 text-gray-500'}`}>{s}</button>
        ))}
      </div>
      <div className="space-y-2.5">
        {list.map(r => (
          <button key={r.id} onClick={() => setRide(r)} className="w-full text-left bg-white border border-gray-100 rounded-2xl p-4 active:scale-[0.99] transition-transform">
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-800 text-[#E11D48]">{r.id}</span>
              <Status s={r.status} />
            </div>
            <div className="flex gap-3 items-center">
              <Avatar initials={r.passenger.split(' ').map(w=>w[0]).join('')} className="w-9 h-9 rounded-xl text-xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-700 text-gray-900 truncate">{r.passenger}</p>
                <p className="text-[11px] text-gray-400 font-500 truncate">{r.from} → {r.to}</p>
              </div>
              <div className="text-right">
                <p className="text-sm font-800 text-gray-900">{r.fare}</p>
                <p className="text-[10px] text-gray-400">{r.date}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
      <RideSheet ride={ride} onClose={() => setRide(null)} />
    </div>
  )
}

type Driver = { name: string; phone: string; vehicle: string; plate: string; rating: number; trips: number; status: string }

function DriversPanel() {
  const [drivers, setDrivers] = useState<Driver[]>([
    { name: 'Andre Browne', phone: '+1 868 555 0142', vehicle: 'Toyota Vitz', plate: 'TDT 4471', rating: 4.92, trips: 2841, status: 'online' },
    { name: 'Ravi Singh', phone: '+1 868 555 0173', vehicle: 'Nissan Note', plate: 'TDN 9832', rating: 4.85, trips: 1923, status: 'offline' },
    { name: 'Marcus Joseph', phone: '+1 868 555 0119', vehicle: 'Honda Fit', plate: 'THK 6621', rating: 4.78, trips: 1105, status: 'on-trip' },
    { name: 'Devon Charles', phone: '+1 868 555 0186', vehicle: 'Kia Picanto', plate: 'TGJ 3054', rating: 4.90, trips: 3290, status: 'online' },
    { name: 'Kwame Clarke', phone: '+1 868 555 0127', vehicle: 'Toyota Corolla', plate: 'TPH 7715', rating: 4.65, trips: 742, status: 'suspended' },
  ])
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')
  const [sel, setSel] = useState<Driver | null>(null)

  const list = drivers.filter(d =>
    (filter === 'All' || (filter === 'On Trip' ? d.status === 'on-trip' : d.status === filter.toLowerCase())) &&
    (q === '' || d.name.toLowerCase().includes(q.toLowerCase()) || d.plate.toLowerCase().includes(q.toLowerCase()))
  )
  const toggleStatus = (name: string) => {
    setDrivers(ds => ds.map(d => d.name === name ? { ...d, status: d.status === 'suspended' ? 'online' : 'suspended' } : d))
    setSel(s => s && s.name === name ? { ...s, status: s.status === 'suspended' ? 'online' : 'suspended' } : s)
  }

  const counts = (s: string) => drivers.filter(d => s === 'All' || (s === 'On Trip' ? d.status === 'on-trip' : d.status === s.toLowerCase())).length

  return (
    <div>
      <SectionHead title="Drivers" sub={`${drivers.length} registered · ${counts('Online')} online`} />
      <div className="flex gap-2 mb-3 overflow-x-auto pb-1">
        {['All','Online','On Trip','Suspended'].map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-3.5 py-2 rounded-full text-xs font-700 whitespace-nowrap transition-all ${filter===f?'bg-[#111] text-white shadow':'bg-white border border-gray-200 text-gray-500'}`}>
            {f} <span className={filter===f?'opacity-70':'text-gray-400'}>({counts(f)})</span>
          </button>
        ))}
      </div>
      <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search by name or plate…"
        className="w-full px-4 py-2.5 rounded-xl bg-white border border-gray-200 text-sm outline-none mb-3 focus:border-gray-900 transition-colors placeholder:text-gray-400"/>

      <div className="space-y-2.5">
        {list.map(d => (
          <button key={d.name} onClick={() => setSel(d)} className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left active:scale-[0.99] transition-transform">
            <div className="flex items-center gap-3">
              <Avatar initials={d.name.split(' ').map(w=>w[0]).join('')} className="w-10 h-10 rounded-xl text-xs" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-700 text-gray-900 truncate">{d.name}</p>
                <p className="text-[11px] text-gray-400 font-500">{d.vehicle} · {d.plate}</p>
              </div>
              <Status s={d.status} />
            </div>
            <div className="flex justify-between mt-3 pt-3 border-t border-gray-50 text-[11px]">
              <span className="flex items-center gap-1 font-700 text-gray-700"><Star filled size={11}/> {d.rating}</span>
              <span className="text-gray-400 font-600">{d.trips.toLocaleString()} trips</span>
              <span className="text-gray-400 font-600">{d.phone}</span>
            </div>
          </button>
        ))}
        {list.length === 0 && <p className="text-sm text-gray-400 font-500 text-center py-6">No drivers match “{q}”.</p>}
      </div>

      <Sheet open={sel !== null} onClose={() => setSel(null)} title={sel?.name ?? ''}>
        {sel && (
          <div>
            <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4 flex items-center gap-4">
              <Avatar initials={sel.name.split(' ').map(w=>w[0]).join('')} className="w-14 h-14 rounded-2xl text-base" />
              <div className="flex-1">
                <div className="flex items-center gap-1.5">
                  <Star filled size={13}/>
                  <span className="font-800">{sel.rating}</span>
                  <span className="text-xs text-gray-400">· {sel.trips.toLocaleString()} trips</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">{sel.vehicle} · {sel.plate}</p>
              </div>
              <Status s={sel.status} />
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Phone" right={<span className="text-sm font-700 text-gray-900">{sel.phone}</span>} />
              <Row label="Vehicle" right={<span className="text-sm font-700 text-gray-900">{sel.vehicle}</span>} />
              <Row label="Plate" right={<span className="text-sm font-800 text-gray-900">{sel.plate}</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSel(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Edit</button>
              <button onClick={() => toggleStatus(sel.name)} className={`flex-1 py-3.5 rounded-full font-700 text-sm ${sel.status==='suspended'?'text-white bg-[#111]':'text-[#E11D48] bg-red-50'}`}>
                {sel.status==='suspended'?'Reactivate':'Suspend'}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function PassengersPanel() {
  const [pax, setPax] = useState([
    { name: 'Kamal Perera', phone: '+1 868 555 0101', email: 'kamal@example.com', trips: 24, wallet: 'TT$ 1,250', status: 'active', joined: 'Feb 2024' },
    { name: 'Dilani Silva', phone: '+1 868 555 0164', email: 'dilani@example.com', trips: 12, wallet: 'TT$ 500', status: 'active', joined: 'Apr 2024' },
    { name: 'Ruwani Mendis', phone: '+1 868 555 0193', email: 'ruwani@example.com', trips: 5, wallet: 'TT$ 0', status: 'blocked', joined: 'Jun 2024' },
  ])
  const [sel, setSel] = useState<typeof pax[number] | null>(null)

  const toggle = (name: string) => {
    setPax(ps => ps.map(p => p.name === name ? { ...p, status: p.status === 'blocked' ? 'active' : 'blocked' } : p))
    setSel(s => s && s.name === name ? { ...s, status: s.status === 'blocked' ? 'active' : 'blocked' } : s)
  }

  return (
    <div>
      <SectionHead title="Passengers" sub={`${pax.length} shown · ${pax.filter(p=>p.status==='active').length} active`} />
      <div className="space-y-2.5">
        {pax.map(p => (
          <button key={p.name} onClick={() => setSel(p)} className="w-full bg-white border border-gray-100 rounded-2xl p-4 flex items-center gap-3 text-left active:scale-[0.99] transition-transform">
            <Avatar initials={p.name.split(' ').map(w=>w[0]).join('')} className="w-10 h-10 rounded-xl text-xs" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-700 text-gray-900 truncate">{p.name}</p>
              <p className="text-[11px] text-gray-400 font-500 truncate">{p.email}</p>
            </div>
            <div className="text-right shrink-0">
              <p className="text-sm font-800 text-gray-900">{p.wallet}</p>
              <p className="text-[10px] text-gray-400">{p.trips} trips</p>
            </div>
            <Status s={p.status} />
          </button>
        ))}
      </div>

      <Sheet open={sel !== null} onClose={() => setSel(null)} title={sel?.name ?? ''}>
        {sel && (
          <div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Phone" right={<span className="text-sm font-700 text-gray-900">{sel.phone}</span>} />
              <Row label="Email" right={<span className="text-sm font-700 text-gray-900">{sel.email}</span>} />
              <Row label="Trips" right={<span className="text-sm font-700 text-gray-900">{sel.trips}</span>} />
              <Row label="Wallet" right={<span className="text-sm font-800 text-gray-900">{sel.wallet}</span>} />
              <Row label="Member since" right={<span className="text-sm font-700 text-gray-900">{sel.joined}</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setSel(null)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Close</button>
              <button onClick={() => toggle(sel.name)} className={`flex-1 py-3.5 rounded-full font-700 text-sm ${sel.status==='blocked'?'text-white bg-[#111]':'text-[#E11D48] bg-red-50'}`}>
                {sel.status==='blocked'?'Unblock':'Block'}
              </button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

type Service = { name: string; base: number; perKm: number; perMin: number; min: number }

function FareManagement() {
  const [services, setServices] = useState<Service[]>([
    { name: 'Sedan', base: 150, perKm: 85, perMin: 2.5, min: 250 },
    { name: 'Tuk Tuk', base: 80, perKm: 55, perMin: 1.5, min: 150 },
    { name: 'SUV', base: 200, perKm: 120, perMin: 3.5, min: 350 },
    { name: 'Hatchback', base: 120, perKm: 70, perMin: 2, min: 200 },
    { name: 'Bike Taxi', base: 60, perKm: 40, perMin: 1, min: 100 },
    { name: 'Ambulance', base: 500, perKm: 150, perMin: 5, min: 800 },
  ])
  const [editing, setEditing] = useState<number | null>(null)
  const [draft, setDraft] = useState<Service | null>(null)

  const open = (i: number) => { setEditing(i); setDraft({ ...services[i] }) }
  const save = () => {
    if (editing !== null && draft) setServices(ss => ss.map((s, i) => i === editing ? { ...draft } : s))
    setEditing(null); setDraft(null)
  }
  const set = (k: keyof Service, v: string) => setDraft(d => d ? { ...d, [k]: k === 'name' ? v : Number(v) } : d)

  return (
    <div>
      <SectionHead title="Fare Management" sub="Tap a service to edit pricing" />
      <div className="grid grid-cols-2 gap-3">
        {services.map((s, i) => (
          <button key={s.name} onClick={() => open(i)} className="bg-white border border-gray-100 rounded-2xl p-4 text-left active:scale-[0.98] transition-transform">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-800 text-sm text-gray-900">{s.name}</h3>
              <span className="text-[10px] font-700 text-[#E11D48]">Edit</span>
            </div>
            <div className="space-y-1.5 text-[11px]">
              <div className="flex justify-between"><span className="text-gray-400 font-500">Base</span><span className="font-800 text-gray-900">TT$ {s.base}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-500">Per km</span><span className="font-700 text-gray-800">TT$ {s.perKm}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-500">Per min</span><span className="font-700 text-gray-800">TT$ {s.perMin}</span></div>
              <div className="flex justify-between"><span className="text-gray-400 font-500">Minimum</span><span className="font-700 text-gray-800">TT$ {s.min}</span></div>
            </div>
          </button>
        ))}
      </div>

      <Sheet open={draft !== null} onClose={() => { setEditing(null); setDraft(null) }} title={draft ? `Edit ${draft.name}` : ''}>
        {draft && (
          <div className="space-y-3">
            {([['base','Base fare'],['perKm','Per km'],['perMin','Per minute'],['min','Minimum fare']] as const).map(([k, label]) => (
              <label key={k} className="block">
                <span className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-1.5">{label}</span>
                <input type="number" value={String(draft[k])} onChange={e => set(k, e.target.value)}
                  className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-700 text-gray-900 outline-none focus:border-gray-900 transition-colors"/>
              </label>
            ))}
            <button onClick={save} className="w-full py-3.5 rounded-full font-800 text-sm text-white bg-[#111] mt-1">Save pricing</button>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function ReportsPanel() {
  const [exported, setExported] = useState<string | null>(null)
  const [stmt, setStmt] = useState<number | null>(null)
  const statements = [
    { month: 'September 2026', trips: 38420, revenue: '14,582,400', commission: '2,187,360', drivers: 342 },
    { month: 'August 2026', trips: 36100, revenue: '13,697,900', commission: '2,054,685', drivers: 328 },
    { month: 'July 2026', trips: 34500, revenue: '13,082,500', commission: '1,962,375', drivers: 315 },
  ]
  return (
    <div>
      <SectionHead title="Reports & Statements" sub="Monthly financial overview" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          {label:'Revenue (Sep)', val:'TT$ 14.6M', ch:'↑ 6.5%'},
          {label:'Commission', val:'TT$ 2.2M', ch:'↑ 6.5%'},
          {label:'Total Trips', val:'38,420', ch:'↑ 6.4%'},
          {label:'Avg Fare', val:'TT$ 380', ch:'↑ 0.5%'},
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-[10px] text-gray-400 font-700 uppercase tracking-wider mb-1">{item.label}</p>
            <p className="text-xl font-800 text-gray-900 tracking-tight">{item.val}</p>
            <p className="text-[11px] text-green-600 font-600 mt-0.5">{item.ch}</p>
          </div>
        ))}
      </div>

      <div className="flex gap-2 mb-4">
        <button onClick={() => setExported('PDF')} className="flex-1 py-3 rounded-full text-sm font-700 text-gray-700 bg-white border border-gray-200 active:scale-[0.98] transition-transform">Export PDF</button>
        <button onClick={() => setExported('Excel')} className="flex-1 py-3 rounded-full text-sm font-700 text-white bg-[#111] active:scale-[0.98] transition-transform">Export Excel</button>
      </div>

      <div className="space-y-2.5">
        {statements.map((s, i) => (
          <button key={i} onClick={() => setStmt(i)} className="w-full bg-white border border-gray-100 rounded-2xl p-4 text-left active:scale-[0.99] transition-transform">
            <div className="flex justify-between items-center mb-1">
              <p className="font-800 text-sm text-gray-900">{s.month}</p>
              <span className="text-xs font-800 text-[#E11D48]">TT$ {s.revenue}</span>
            </div>
            <p className="text-[11px] text-gray-400 font-500">{s.trips.toLocaleString()} trips · {s.drivers} drivers · commission TT$ {s.commission}</p>
          </button>
        ))}
      </div>

      <Sheet open={stmt !== null} onClose={() => setStmt(null)} title={stmt !== null ? statements[stmt].month : ''}>
        {stmt !== null && (
          <div>
            <div className="bg-gray-900 rounded-2xl p-5 text-white mb-4">
              <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-1">Gross revenue</p>
              <p className="text-3xl font-800 tracking-tight">TT$ {statements[stmt].revenue}</p>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Total trips" right={<span className="text-sm font-700 text-gray-900">{statements[stmt].trips.toLocaleString()}</span>} />
              <Row label="Commission (15%)" right={<span className="text-sm font-700 text-gray-900">TT$ {statements[stmt].commission}</span>} />
              <Row label="Active drivers" right={<span className="text-sm font-700 text-gray-900">{statements[stmt].drivers}</span>} />
              <Row label="Net payout" right={<span className="text-sm font-800 text-gray-900">TT$ 12,395,040</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setExported('PDF')} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">PDF</button>
              <button onClick={() => setExported('Excel')} className="flex-1 py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Excel</button>
            </div>
          </div>
        )}
      </Sheet>

      <Sheet open={exported !== null} onClose={() => setExported(null)} title="Export ready">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="font-800 text-gray-900 mb-1">September 2026.{exported === 'PDF' ? 'pdf' : 'xlsx'}</p>
          <p className="text-sm text-gray-400 font-500 mb-5">Your {exported} report was generated and sent to admin@pickuptt.com.</p>
          <button onClick={() => setExported(null)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
        </div>
      </Sheet>
    </div>
  )
}

function NotificationsPanel() {
  const [tab, setTab] = useState<'push'|'sms'|'email'>('push')
  const [sent, setSent] = useState(false)
  const [msg, setMsg] = useState('')
  const [audience, setAudience] = useState('All Users')
  return (
    <div>
      <SectionHead title="Notifications" sub="Broadcast messages to users" />
      <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-4">
        {(['push','sms','email'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`flex-1 py-2 rounded-lg text-xs font-700 uppercase tracking-wider transition-all ${tab===t?'bg-white text-gray-900 shadow':'text-gray-400'}`}>{t}</button>
        ))}
      </div>

      <Card className="p-4 mb-4">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Target audience</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {['All Users','All Drivers','All Passengers','Inactive Users'].map(a => (
            <button key={a} onClick={() => setAudience(a)} className={`px-3 py-1.5 rounded-full text-[11px] font-700 transition-all ${audience===a?'bg-[#111] text-white':'bg-gray-50 text-gray-500 border border-gray-100'}`}>{a}</button>
          ))}
        </div>
        {tab !== 'sms' && (
          <input placeholder="Notification title…" className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 transition-colors mb-3 placeholder:text-gray-400"/>
        )}
        <textarea value={msg} onChange={e => setMsg(e.target.value)} rows={4} placeholder="Write your message here…"
          className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm outline-none resize-none focus:border-gray-900 transition-colors placeholder:text-gray-400"/>
        <div className="flex gap-2 mt-3">
          <button onClick={() => setMsg('')} className="px-4 py-3 rounded-full text-xs font-700 text-gray-500 bg-gray-100">Clear</button>
          <button disabled={!msg.trim()} onClick={() => setSent(true)}
            className={`flex-1 py-3 rounded-full text-sm font-800 transition-all ${msg.trim() ? 'text-white bg-[#111] active:scale-[0.98]' : 'bg-gray-100 text-gray-400'}`}>
            Send to {audience}
          </button>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-3">Recent broadcasts</p>
        <div className="space-y-2">
          {[
            {title:'Promo: 20% off rides',audience:'All Users',sent:'2.4k',date:'Sep 29'},
            {title:'Driver bonus week',audience:'All Drivers',sent:'342',date:'Sep 28'},
            {title:'New area: Gampaha',audience:'All Users',sent:'2.4k',date:'Sep 25'},
          ].map((n, i) => (
            <div key={i} className="flex justify-between items-center p-3 rounded-xl bg-gray-50">
              <div className="min-w-0">
                <p className="font-700 text-sm text-gray-900 truncate">{n.title}</p>
                <p className="text-[11px] text-gray-400">{n.audience}</p>
              </div>
              <span className="text-[10px] text-gray-400 font-600 shrink-0">Sent {n.sent} · {n.date}</span>
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={sent} onClose={() => setSent(false)} title="Broadcast sent">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z" stroke="#16A34A" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="font-800 text-gray-900 mb-1">{tab.toUpperCase()} to {audience}</p>
          <p className="text-sm text-gray-400 font-500 mb-5">Delivering now · “{msg}”</p>
          <button onClick={() => { setSent(false); setMsg('') }} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
        </div>
      </Sheet>
    </div>
  )
}

type Promo = { code: string; discount: string; type: string; uses: string; status: string; expiry: string }

function PromoPanel() {
  const [promos, setPromos] = useState<Promo[]>([
    { code: 'NEWRIDE50', discount: '50%', type: 'First Ride', uses: '0/1', status: 'active', expiry: 'Oct 31, 2026' },
    { code: 'SEPT20', discount: '20%', type: 'All Services', uses: '847/1000', status: 'active', expiry: 'Sep 30, 2026' },
    { code: 'MEDI10', discount: 'TT$ 100', type: 'Medi Boy', uses: '234/500', status: 'active', expiry: 'Oct 15, 2026' },
    { code: 'SUMMER30', discount: '30%', type: 'Ride', uses: '500/500', status: 'expired', expiry: 'Aug 31, 2026' },
  ])
  const [draft, setDraft] = useState<Promo | null>(null)
  const [isNew, setIsNew] = useState(false)

  const openNew = () => { setIsNew(true); setDraft({ code: '', discount: '20%', type: 'All Services', uses: '0/1000', status: 'active', expiry: 'Nov 30, 2026' }) }
  const openEdit = (p: Promo) => { setIsNew(false); setDraft({ ...p }) }
  const save = () => {
    if (!draft) return
    setPromos(ps => isNew ? [{ ...draft }, ...ps] : ps.map(p => p.code === draft.code ? draft : p))
    setDraft(null)
  }
  const remove = (code: string) => { setPromos(ps => ps.filter(p => p.code !== code)); setDraft(null) }

  return (
    <div>
      <div className="flex justify-between items-start mb-4">
        <SectionHead title="Promo Codes" sub={`${promos.length} codes · ${promos.filter(p=>p.status==='active').length} active`} />
        <button onClick={openNew} className="px-4 py-2.5 rounded-full text-xs font-800 text-white bg-[#111] shadow-lg active:scale-95 transition-transform shrink-0">+ New</button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {promos.map(p => (
          <button key={p.code} onClick={() => openEdit(p)} className={`bg-white border-2 rounded-2xl p-4 text-left transition-all active:scale-[0.98] ${p.status==='active'?'border-gray-100 hover:border-red-100':'border-gray-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-2">
              <p className="text-[9px] font-700 text-gray-400 uppercase tracking-wider">{p.type}</p>
              <Status s={p.status} />
            </div>
            <h3 className="font-800 text-lg text-gray-900 tracking-tight mb-2">{p.code}</h3>
            <div className="flex justify-between text-[11px]">
              <span className="font-800 text-[#E11D48]">{p.discount}</span>
              <span className="text-gray-400 font-600">{p.uses}</span>
            </div>
          </button>
        ))}
      </div>

      <Sheet open={draft !== null} onClose={() => setDraft(null)} title={isNew ? 'Create promo' : `Edit ${draft?.code ?? ''}`}>
        {draft && (
          <div className="space-y-3">
            <label className="block">
              <span className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-1.5">Code</span>
              <input value={draft.code} onChange={e => setDraft({ ...draft, code: e.target.value.toUpperCase() })} placeholder="SUMMER20"
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-800 tracking-wider text-gray-900 outline-none focus:border-gray-900 uppercase"/>
            </label>
            <label className="block">
              <span className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-1.5">Discount</span>
              <input value={draft.discount} onChange={e => setDraft({ ...draft, discount: e.target.value })}
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-700 text-gray-900 outline-none focus:border-gray-900"/>
            </label>
            <label className="block">
              <span className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-1.5">Applies to</span>
              <input value={draft.type} onChange={e => setDraft({ ...draft, type: e.target.value })}
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-700 text-gray-900 outline-none focus:border-gray-900"/>
            </label>
            <label className="block">
              <span className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-1.5">Expires</span>
              <input value={draft.expiry} onChange={e => setDraft({ ...draft, expiry: e.target.value })}
                className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm font-700 text-gray-900 outline-none focus:border-gray-900"/>
            </label>
            <div className="flex gap-3 pt-1">
              {!isNew && <button onClick={() => remove(draft.code)} className="px-5 py-3.5 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Delete</button>}
              <button onClick={save} className="flex-1 py-3.5 rounded-full font-800 text-sm text-white bg-[#111]">{isNew ? 'Create promo' : 'Save changes'}</button>
            </div>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function WalletPanel() {
  const [sheet, setSheet] = useState<null | { mode: 'add'|'deduct'; wallet: string }>(null)
  const [amount, setAmount] = useState('1000')
  const transactions = [
    { user:'Kamal Perera', type:'Recharge', amount:'+TT$ 1,000', bal:'TT$ 1,250', date:'Sep 30 10:20' },
    { user:'Saman Kumara', type:'Cashout', amount:'-TT$ 5,000', bal:'TT$ 8,430', date:'Sep 30 09:15' },
    { user:'Admin', type:'Bonus', amount:'+TT$ 500', bal:'TT$ 9,430', date:'Sep 29 18:00' },
  ]
  return (
    <div>
      <SectionHead title="Wallet Management" sub="Manage user and driver wallets" />
      <div className="grid grid-cols-2 gap-3 mb-4">
        {[
          {title:'User Wallets', total:'TT$ 1.24M', count:'1,840 users', w:'users'},
          {title:'Driver Wallets', total:'TT$ 2.86M', count:'342 drivers', w:'drivers'},
        ].map(w => (
          <div key={w.title} className="bg-gray-900 text-white rounded-2xl p-4 shadow-lg shadow-gray-900/20">
            <p className="text-[10px] font-700 text-gray-400 uppercase tracking-wider mb-1">{w.title}</p>
            <p className="text-xl font-800 tracking-tight">{w.total}</p>
            <p className="text-[11px] text-gray-400 mb-3">{w.count}</p>
            <div className="flex gap-1.5">
              <button onClick={() => setSheet({ mode: 'add', wallet: w.title })} className="flex-1 py-2 rounded-lg text-[11px] font-700 text-gray-900 bg-white active:scale-95 transition-transform">Add</button>
              <button onClick={() => setSheet({ mode: 'deduct', wallet: w.title })} className="flex-1 py-2 rounded-lg text-[11px] font-700 text-white bg-white/10 active:scale-95 transition-transform">Deduct</button>
            </div>
          </div>
        ))}
      </div>

      <Card className="p-4">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-3">Recent transactions</p>
        <div className="space-y-2">
          {transactions.map((t, i) => (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-gray-50">
              <span className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${t.amount.startsWith('+')?'bg-green-100':'bg-red-100'}`}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d={t.amount.startsWith('+')?'M12 19V5M5 12l7-7 7 7':'M12 5v14M19 12l-7 7-7-7'} stroke={t.amount.startsWith('+')?'#16A34A':'#E11D48'} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"/></svg>
              </span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-700 text-gray-900 truncate">{t.user} · {t.type}</p>
                <p className="text-[11px] text-gray-400">{t.date}</p>
              </div>
              <div className="text-right shrink-0">
                <p className={`text-sm font-800 ${t.amount.startsWith('+')?'text-green-600':'text-red-500'}`}>{t.amount}</p>
                <p className="text-[10px] text-gray-400">{t.bal}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Sheet open={sheet !== null} onClose={() => setSheet(null)} title={sheet ? `${sheet.mode === 'add' ? 'Add funds' : 'Deduct funds'} · ${sheet.wallet}` : ''}>
        {sheet && (
          <div>
            <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-2">Amount (TT$)</p>
            <div className="flex gap-2 mb-3">
              {[500, 1000, 5000, 10000].map(a => (
                <button key={a} onClick={() => setAmount(String(a))}
                  className={`flex-1 py-2.5 rounded-xl text-xs font-700 border-2 transition-all ${amount===String(a)?'border-[#111] bg-gray-50 text-gray-900':'border-gray-100 text-gray-500'}`}>
                  {a >= 1000 ? `${a/1000}k` : a}
                </button>
              ))}
            </div>
            <input value={amount} onChange={e => setAmount(e.target.value)} inputMode="numeric"
              className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-lg font-800 text-gray-900 outline-none focus:border-gray-900 mb-4"/>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Adjustment" right={<span className={`text-sm font-800 ${sheet.mode==='add'?'text-green-600':'text-red-500'}`}>{sheet.mode==='add'?'+':'-'} TT$ {Number(amount || 0).toLocaleString()}</span>} />
              <Row label="Requires note" right={<span className="text-sm font-700 text-gray-900">Optional</span>} />
            </div>
            <button onClick={() => setSheet(null)} className={`w-full py-3.5 rounded-full font-800 text-sm text-white ${sheet.mode==='add'?'bg-[#111]':'bg-[#E11D48]'}`}>
              {sheet.mode==='add' ? 'Add to wallet' : 'Deduct from wallet'}
            </button>
          </div>
        )}
      </Sheet>
    </div>
  )
}

function SettingsPanel() {
  const [toggles, setToggles] = useState({ cash: true, stripe: true, fareEdit: false })
  const [saved, setSaved] = useState(false)
  const [pw, setPw] = useState(false)
  return (
    <div>
      <SectionHead title="Settings" sub="Platform configuration" />

      <Card className="p-4 mb-3">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-3">Site settings</p>
        <div className="space-y-3">
          {[
            {label:'App Name', val:'Pickuptt'},
            {label:'Support Phone', val:'+1 868 000 0000'},
            {label:'SOS Number', val:'999'},
            {label:'Map API Key', val:'AIzaSy••••••••••••'},
          ].map(f => (
            <label key={f.label} className="block">
              <span className="text-[11px] font-700 text-gray-400 uppercase tracking-wider block mb-1">{f.label}</span>
              <input defaultValue={f.val} className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-sm font-600 text-gray-900 outline-none focus:border-gray-900 transition-colors"/>
            </label>
          ))}
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-1">Payment settings</p>
        <div className="space-y-3">
          {[
            {label:'Commission (%)', val:'15'},
            {label:'Tax (%)', val:'0'},
            {label:'Currency', val:'TT$'},
          ].map(f => (
            <label key={f.label} className="block">
              <span className="text-[11px] font-700 text-gray-400 uppercase tracking-wider block mb-1">{f.label}</span>
              <input defaultValue={f.val} className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-sm font-600 text-gray-900 outline-none focus:border-gray-900 transition-colors"/>
            </label>
          ))}
          <div className="flex justify-between items-center pt-1 border-t border-gray-50">
            <span className="text-sm font-600 text-gray-700">Cash payments</span>
            <Toggle on={toggles.cash} onChange={v => setToggles(t => ({ ...t, cash: v }))}/>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-600 text-gray-700">Stripe payments</span>
            <Toggle on={toggles.stripe} onChange={v => setToggles(t => ({ ...t, stripe: v }))}/>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm font-600 text-gray-700">Driver fare edit</span>
            <Toggle on={toggles.fareEdit} onChange={v => setToggles(t => ({ ...t, fareEdit: v }))}/>
          </div>
        </div>
      </Card>

      <Card className="p-4 mb-3">
        <p className="text-xs font-700 text-gray-500 uppercase tracking-wider mb-3">Business settings</p>
        <div className="space-y-3">
          {[
            {label:'Driver accept timeout (sec)', val:'30'},
            {label:'Search radius (km)', val:'5'},
            {label:'Time zone', val:'America/Port_of_Spain'},
          ].map(f => (
            <label key={f.label} className="block">
              <span className="text-[11px] font-700 text-gray-400 uppercase tracking-wider block mb-1">{f.label}</span>
              <input defaultValue={f.val} className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-2.5 text-sm font-600 text-gray-900 outline-none focus:border-gray-900 transition-colors"/>
            </label>
          ))}
        </div>
      </Card>

      <button onClick={() => setPw(true)} className="w-full p-4 rounded-2xl border-2 border-dashed border-red-200 bg-red-50/50 text-left mb-3 active:scale-[0.99] transition-transform">
        <p className="font-800 text-sm text-[#E11D48] mb-0.5">Change password</p>
        <p className="text-xs text-gray-500 font-500">Update your admin account password →</p>
      </button>

      <button onClick={() => setSaved(true)} className="w-full py-4 rounded-full font-800 text-sm text-white bg-[#111] shadow-lg active:scale-[0.98] transition-transform">
        Save all changes
      </button>

      <Sheet open={saved} onClose={() => setSaved(false)} title="Settings saved">
        <div className="text-center py-2">
          <div className="w-14 h-14 rounded-2xl bg-green-50 flex items-center justify-center mx-auto mb-4">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none"><path d="M5 12l5 5L20 7" stroke="#16A34A" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"/></svg>
          </div>
          <p className="text-sm text-gray-400 font-500 mb-5">All configuration changes are now live across the platform.</p>
          <button onClick={() => setSaved(false)} className="w-full py-3.5 rounded-full font-700 text-sm text-white bg-[#111]">Done</button>
        </div>
      </Sheet>

      <Sheet open={pw} onClose={() => setPw(false)} title="Change password">
        <div className="space-y-3">
          <input type="password" placeholder="Current password" className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 placeholder:text-gray-400"/>
          <input type="password" placeholder="New password" className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 placeholder:text-gray-400"/>
          <input type="password" placeholder="Confirm new password" className="w-full bg-gray-50 border-2 border-transparent rounded-xl px-4 py-3 text-sm outline-none focus:border-gray-900 placeholder:text-gray-400"/>
          <button onClick={() => setPw(false)} className="w-full py-3.5 rounded-full font-800 text-sm text-white bg-[#E11D48] mt-1">Update password</button>
        </div>
      </Sheet>
    </div>
  )
}

export default function AdminPanel() {
  const [section, setSection] = useState<AdminSection>('dashboard')
  const [profile, setProfile] = useState(false)

  const NAV: { key: AdminSection; label: string }[] = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'rides', label: 'Rides' },
    { key: 'drivers', label: 'Drivers' },
    { key: 'passengers', label: 'Passengers' },
    { key: 'fare', label: 'Fares' },
    { key: 'reports', label: 'Reports' },
    { key: 'notifications', label: 'Alerts' },
    { key: 'promo', label: 'Promos' },
    { key: 'wallet', label: 'Wallet' },
    { key: 'settings', label: 'Settings' },
  ]

  const content = () => {
    switch (section) {
      case 'dashboard': return <Dashboard onNav={setSection}/>
      case 'rides': return <RidesPanel/>
      case 'drivers': return <DriversPanel/>
      case 'passengers': return <PassengersPanel/>
      case 'fare': return <FareManagement/>
      case 'reports': return <ReportsPanel/>
      case 'notifications': return <NotificationsPanel/>
      case 'promo': return <PromoPanel/>
      case 'wallet': return <WalletPanel/>
      case 'settings': return <SettingsPanel/>
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-200 flex flex-col items-center py-10">
      <PhoneFrame>
        <div className="flex flex-col bg-gray-50 relative" style={{height: 680}}>
          {/* Header */}
          <div className="px-5 pt-4 pb-3 flex items-center gap-3 bg-white border-b border-gray-100">
            <img src={logo} alt="Pickuptt" className="w-10 h-10 rounded-xl object-cover shadow-sm"/>
            <div className="flex-1">
              <p className="font-800 text-gray-900 tracking-[-0.02em] leading-tight">Pickuptt Admin</p>
              <p className="text-[11px] text-gray-400 font-500">Operations console</p>
            </div>
            <button onClick={() => setSection('notifications')} className="w-9 h-9 rounded-full bg-gray-50 flex items-center justify-center text-gray-700 active:scale-95 transition-transform relative">
              <Ic name="notifications" size={16}/>
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full" style={{background:RED}}/>
            </button>
            <button onClick={() => setProfile(true)} className="active:scale-95 transition-transform">
              <Avatar initials="AA" className="w-9 h-9 rounded-full text-xs"/>
            </button>
          </div>

          {/* Section nav */}
          <div className="bg-white border-b border-gray-100">
            <div className="flex gap-1.5 px-4 py-2.5 overflow-x-auto">
              {NAV.map(n => (
                <button key={n.key} onClick={() => setSection(n.key)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-full text-[11px] font-700 whitespace-nowrap transition-all ${section===n.key?'bg-[#111] text-white shadow-md':'text-gray-500 bg-gray-50 hover:bg-gray-100'}`}>
                  <Ic name={n.key} size={13}/>
                  {n.label}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-5 py-4">
            {content()}
            <div className="h-2"/>
          </div>

          {/* Admin profile sheet */}
          <Sheet open={profile} onClose={() => setProfile(false)} title="Admin account">
            <div className="flex items-center gap-4 bg-gray-900 rounded-2xl p-4 mb-4 text-white">
              <Avatar initials="AA" className="w-14 h-14 rounded-2xl text-base" />
              <div>
                <p className="font-800">Amara Admin</p>
                <p className="text-xs text-gray-400">Super Admin · amara@pickuptt.com</p>
                <p className="text-[11px] text-gray-500 mt-0.5">Last login today, 08:12</p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-2xl p-4 mb-4">
              <Row label="Role" right={<span className="text-sm font-700 text-gray-900">Super Admin</span>} />
              <Row label="Sections access" right={<span className="text-sm font-700 text-gray-900">All</span>} />
              <Row label="2-factor auth" right={<span className="text-sm font-700 text-green-600">Enabled</span>} />
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setProfile(false); setSection('settings') }} className="flex-1 py-3.5 rounded-full font-700 text-sm text-gray-700 bg-gray-100">Settings</button>
              <button onClick={() => setProfile(false)} className="flex-1 py-3.5 rounded-full font-700 text-sm text-[#E11D48] bg-red-50">Log out</button>
            </div>
          </Sheet>
        </div>
      </PhoneFrame>
    </div>
  )
}
