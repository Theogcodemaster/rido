import { useState } from 'react'

const RED = '#E11D48'
const LIGHT_RED = '#FFF1F2'

type AdminSection = 'dashboard' | 'rides' | 'drivers' | 'passengers' | 'fare' | 'reports' | 'notifications' | 'promo' | 'wallet' | 'settings'

function Sidebar({ active, onChange }: { active: AdminSection; onChange: (s: AdminSection) => void }) {
  const items: { icon: string; label: string; key: AdminSection }[] = [
    { icon: '📊', label: 'Dashboard', key: 'dashboard' },
    { icon: '🚗', label: 'Rides', key: 'rides' },
    { icon: '🧑‍✈️', label: 'Drivers', key: 'drivers' },
    { icon: '👥', label: 'Passengers', key: 'passengers' },
    { icon: '💰', label: 'Fare Management', key: 'fare' },
    { icon: '📈', label: 'Reports', key: 'reports' },
    { icon: '🔔', label: 'Notifications', key: 'notifications' },
    { icon: '🎁', label: 'Promo Codes', key: 'promo' },
    { icon: '💳', label: 'Wallet', key: 'wallet' },
    { icon: '⚙️', label: 'Settings', key: 'settings' },
  ]
  return (
    <div className="w-56 min-h-screen bg-gray-950 flex flex-col fixed left-0 top-14">
      <div className="p-5 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-[#E11D48] rounded-lg flex items-center justify-center">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <span className="font-800 text-white text-sm">Admin Panel</span>
        </div>
      </div>
      <nav className="flex-1 p-3">
        {items.map(item => (
          <button
            key={item.key}
            onClick={() => onChange(item.key)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl mb-0.5 text-left transition-all text-sm ${
              active === item.key
                ? 'bg-[#E11D48] text-white font-700'
                : 'text-gray-400 hover:text-white hover:bg-white/5 font-500'
            }`}
          >
            <span className="text-base">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-white/10">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full overflow-hidden">
            <img src="https://images.unsplash.com/photo-1560250097-0b93528c311a?w=60&h=60&fit=crop&auto=format" alt="admin" className="w-full h-full object-cover"/>
          </div>
          <div>
            <p className="text-xs font-700 text-white">Amara Admin</p>
            <p className="text-[10px] text-gray-500">Super Admin</p>
          </div>
        </div>
      </div>
    </div>
  )
}

function KpiCard({ label, value, change, icon, highlight }: { label: string; value: string; change: string; icon: string; highlight?: boolean }) {
  return (
    <div className={`rounded-2xl p-5 ${highlight ? 'text-white' : 'bg-white border border-gray-100'}`} style={highlight ? { background: RED } : {}}>
      <div className="flex justify-between items-start mb-3">
        <p className={`text-xs font-600 uppercase tracking-wider ${highlight ? 'text-white/70' : 'text-gray-400'}`}>{label}</p>
        <span className="text-xl">{icon}</span>
      </div>
      <p className={`text-3xl font-800 mb-1 ${highlight ? 'text-white' : 'text-gray-900'}`}>{value}</p>
      <p className={`text-xs font-600 ${highlight ? 'text-white/80' : 'text-green-600'}`}>{change}</p>
    </div>
  )
}

function Dashboard() {
  const kpis = [
    { label: 'Total Rides Today', value: '1,284', change: '↑ 8% vs yesterday', icon: '🚗', highlight: true },
    { label: 'Revenue (TT$)', value: '486,200', change: '↑ 12% vs yesterday', icon: '💵', highlight: false },
    { label: 'Active Drivers', value: '342', change: '↑ 5 online now', icon: '🧑‍✈️', highlight: false },
    { label: 'Cancellations', value: '47', change: '↓ 3% vs yesterday', icon: '❌', highlight: false },
    { label: 'Package Deliveries', value: '189', change: '↑ 22% vs yesterday', icon: '📦', highlight: false },
    { label: 'Logistics Runs', value: '28', change: '↑ 4% vs yesterday', icon: '🚛', highlight: false },
    { label: 'Ambulance Calls', value: '6', change: 'Avg 4.2 min ETA', icon: '🚑', highlight: false },
    { label: 'New Users', value: '94', change: '↑ 18% vs yesterday', icon: '👥', highlight: false },
  ]

  const recentRides = [
    { id: '#R-10042', passenger: 'Kamal Perera', driver: 'Saman K.', from: 'Colombo Fort', to: 'Bambalapitiya', fare: 'TT$ 380', status: 'completed', time: '09:12' },
    { id: '#R-10041', passenger: 'Dilani Silva', driver: 'Nuwan S.', from: 'Kandy Road', to: 'Pettah', fare: 'TT$ 220', status: 'in-progress', time: '09:08' },
    { id: '#R-10040', passenger: 'Ruwani Mendis', driver: 'Ajith P.', from: 'Mount Lavinia', to: 'Wellawatte', fare: 'TT$ 450', status: 'cancelled', time: '08:54' },
    { id: '#R-10039', passenger: 'Priya Fernando', driver: 'Gayan R.', from: 'Dehiwala', to: 'Nugegoda', fare: 'TT$ 310', status: 'completed', time: '08:45' },
    { id: '#R-10038', passenger: 'Chamil D.', driver: 'Suresh M.', from: 'Maradana', to: 'Galle Face', fare: 'TT$ 190', status: 'completed', time: '08:30' },
  ]

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-800 text-gray-900 mb-1">Dashboard</h1>
        <p className="text-gray-400 text-sm">Wednesday, 30 September 2026</p>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-8">
        {kpis.map(k => <KpiCard key={k.label} {...k}/>)}
      </div>

      {/* Trip summary chart placeholder */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5 mb-6">
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-700 text-gray-900">Trip Summary</h2>
          <div className="flex gap-2">
            {['7D','30D','90D'].map(t => (
              <button key={t} className={`px-3 py-1 rounded-lg text-xs font-700 ${t==='7D'?'bg-[#E11D48] text-white':'bg-gray-100 text-gray-500'}`}>{t}</button>
            ))}
          </div>
        </div>
        <div className="flex items-end gap-2 h-32">
          {[65,80,55,90,70,85,95,60,75,88,72,80,95,100].map((h,i) => (
            <div key={i} className="flex-1 rounded-t-lg transition-all" style={{height:`${h}%`, background: i===13?RED:'#FDD', opacity: i===13?1:0.5}}/>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {['Sep 17','Sep 18','Sep 19','Sep 20','Sep 21','Sep 22','Sep 23','Sep 24','Sep 25','Sep 26','Sep 27','Sep 28','Sep 29','Sep 30'].map((d,i) => (
            <span key={i} className="text-[8px] text-gray-300">{i%3===0?d:''}</span>
          ))}
        </div>
      </div>

      {/* Recent rides */}
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-700 text-gray-900">Recent Rides</h2>
          <button className="text-xs text-[#E11D48] font-700">View All →</button>
        </div>
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-100">
              {['ID','Passenger','Driver','Route','Fare','Status','Time'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider pb-3 pr-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recentRides.map(r => (
              <tr key={r.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                <td className="py-3 pr-3 text-xs font-700 text-[#E11D48]">{r.id}</td>
                <td className="py-3 pr-3 text-sm font-500 text-gray-700">{r.passenger}</td>
                <td className="py-3 pr-3 text-sm font-500 text-gray-700">{r.driver}</td>
                <td className="py-3 pr-3 text-xs text-gray-400">{r.from} → {r.to}</td>
                <td className="py-3 pr-3 text-sm font-700 text-gray-800">{r.fare}</td>
                <td className="py-3 pr-3">
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${
                    r.status==='completed'?'bg-green-100 text-green-700':
                    r.status==='in-progress'?'bg-blue-100 text-blue-700':
                    'bg-red-100 text-red-700'
                  }`}>{r.status}</span>
                </td>
                <td className="py-3 text-xs text-gray-400">{r.time}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function DriversPanel() {
  const drivers = [
    { name: 'Saman Kumara', phone: '+94 77 234 5678', vehicle: 'Toyota Sedan', plate: 'WP CAA-1234', rating: 4.92, trips: 2841, status: 'online', joined: 'Jan 2024' },
    { name: 'Nuwan Silva', phone: '+94 71 345 6789', vehicle: 'Suzuki Alto', plate: 'WP CBB-5678', rating: 4.85, trips: 1923, status: 'offline', joined: 'Mar 2024' },
    { name: 'Ajith Perera', phone: '+94 76 456 7890', vehicle: 'Honda Fit', plate: 'WP CCC-9012', rating: 4.78, trips: 1105, status: 'on-trip', joined: 'May 2024' },
    { name: 'Gayan Rajapaksa', phone: '+94 70 567 8901', vehicle: 'Toyota Vitz', plate: 'WP CDD-3456', rating: 4.90, trips: 3290, status: 'online', joined: 'Nov 2023' },
    { name: 'Suresh Mahinda', phone: '+94 77 678 9012', vehicle: 'Suzuki Wagon R', plate: 'WP CEE-7890', rating: 4.65, trips: 742, status: 'suspended', joined: 'Jul 2024' },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-800 text-gray-900 mb-1">Drivers</h1>
          <p className="text-sm text-gray-400">342 registered drivers · 198 online</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-700 text-white" style={{background:RED}}>+ Add Driver</button>
      </div>

      <div className="flex gap-3 mb-5">
        {[
          {label:'All Drivers',val:'342',active:true},
          {label:'Online',val:'198',active:false},
          {label:'On Trip',val:'87',active:false},
          {label:'Suspended',val:'12',active:false},
        ].map(f => (
          <button key={f.label} className={`px-4 py-2 rounded-xl text-xs font-700 ${f.active?'bg-[#E11D48] text-white':'bg-white border border-gray-200 text-gray-600'}`}>
            {f.label} <span className={`ml-1 ${f.active?'opacity-80':'text-gray-400'}`}>({f.val})</span>
          </button>
        ))}
        <input className="ml-auto px-4 py-2 rounded-xl bg-white border border-gray-200 text-sm text-gray-600 outline-none w-48" placeholder="Search drivers..."/>
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Driver','Contact','Vehicle','Trips','Rating','Status','Actions'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {drivers.map((d, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50 transition-colors">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-gray-200 overflow-hidden flex-shrink-0">
                      <img src={`https://images.unsplash.com/photo-${['1472099645785-5658abf4ff4e','1507003211169-0a1dd7228f2d','1560250097-0b93528c311a'][i%3]}?w=60&h=60&fit=crop&auto=format`} alt="" className="w-full h-full object-cover"/>
                    </div>
                    <div>
                      <p className="font-700 text-sm text-gray-900">{d.name}</p>
                      <p className="text-xs text-gray-400">{d.plate}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500 font-500">{d.phone}</td>
                <td className="px-5 py-4 text-sm text-gray-500 font-500">{d.vehicle}</td>
                <td className="px-5 py-4 font-700 text-sm text-gray-800">{d.trips.toLocaleString()}</td>
                <td className="px-5 py-4">
                  <div className="flex items-center gap-1">
                    <span className="text-yellow-400 text-xs">★</span>
                    <span className="font-700 text-sm text-gray-800">{d.rating}</span>
                  </div>
                </td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-700 px-2.5 py-1 rounded-full ${
                    d.status==='online'?'bg-green-100 text-green-700':
                    d.status==='on-trip'?'bg-blue-100 text-blue-700':
                    d.status==='suspended'?'bg-red-100 text-red-700':
                    'bg-gray-100 text-gray-500'
                  }`}>{d.status}</span>
                </td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button className="px-3 py-1 rounded-lg bg-gray-100 text-xs font-700 text-gray-600 hover:bg-gray-200">Edit</button>
                    <button className={`px-3 py-1 rounded-lg text-xs font-700 ${d.status==='suspended'?'bg-green-100 text-green-700':'bg-red-50 text-red-600'} hover:opacity-80`}>
                      {d.status==='suspended'?'Activate':'Block'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center px-5 py-3 border-t border-gray-100">
          <span className="text-xs text-gray-400">Showing 5 of 342 drivers</span>
          <div className="flex gap-1">
            {[1,2,3,'...',35].map((p,i) => (
              <button key={i} className={`w-7 h-7 rounded-lg text-xs font-700 ${p===1?'bg-[#E11D48] text-white':'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>{p}</button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function FareManagement() {
  const services = [
    { name: 'Sedan', icon: '🚗', base: 150, perKm: 85, perMin: 2.5, min: 250 },
    { name: 'Tuk Tuk', icon: '🛺', base: 80, perKm: 55, perMin: 1.5, min: 150 },
    { name: 'SUV', icon: '🚙', base: 200, perKm: 120, perMin: 3.5, min: 350 },
    { name: 'Hatchback', icon: '🚘', base: 120, perKm: 70, perMin: 2, min: 200 },
    { name: 'Bike Taxi', icon: '🏍️', base: 60, perKm: 40, perMin: 1, min: 100 },
    { name: 'Ambulance', icon: '🚑', base: 500, perKm: 150, perMin: 5, min: 800 },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-800 text-gray-900 mb-1">Fare Management</h1>
          <p className="text-sm text-gray-400">Configure per-service pricing</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-700 text-white" style={{background:RED}}>+ Add Service</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.name} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex items-center gap-3 mb-4">
              <span className="text-2xl">{s.icon}</span>
              <h3 className="font-800 text-gray-900">{s.name}</h3>
              <button className="ml-auto text-xs text-[#E11D48] font-700">Edit</button>
            </div>
            <div className="grid grid-cols-2 gap-3">
              {[
                {label:'Base Fare',val:`TT$ ${s.base}`},
                {label:'Per km',val:`TT$ ${s.perKm}`},
                {label:'Per minute',val:`TT$ ${s.perMin}`},
                {label:'Minimum',val:`TT$ ${s.min}`},
              ].map(item => (
                <div key={item.label} className="bg-gray-50 rounded-xl p-3">
                  <p className="text-[10px] text-gray-400 font-600 uppercase tracking-wider">{item.label}</p>
                  <p className="font-800 text-gray-900 text-sm mt-0.5">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function ReportsPanel() {
  const statements = [
    { month: 'September 2026', trips: 38420, revenue: '14,582,400', commission: '2,187,360', drivers: 342 },
    { month: 'August 2026', trips: 36100, revenue: '13,697,900', commission: '2,054,685', drivers: 328 },
    { month: 'July 2026', trips: 34500, revenue: '13,082,500', commission: '1,962,375', drivers: 315 },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-800 text-gray-900 mb-1">Reports & Statements</h1>
          <p className="text-sm text-gray-400">Monthly financial overview</p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 rounded-xl text-sm font-700 text-gray-600 bg-white border border-gray-200">Export PDF</button>
          <button className="px-4 py-2 rounded-xl text-sm font-700 text-white" style={{background:RED}}>Export Excel</button>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          {label:'Total Revenue (Sep)', val:'TT$ 14.6M', ch:'↑ 6.5%'},
          {label:'Commission (Sep)', val:'TT$ 2.2M', ch:'↑ 6.5%'},
          {label:'Total Trips (Sep)', val:'38,420', ch:'↑ 6.4%'},
          {label:'Avg Fare', val:'TT$ 380', ch:'↑ 0.5%'},
        ].map(item => (
          <div key={item.label} className="bg-white border border-gray-100 rounded-2xl p-4">
            <p className="text-xs text-gray-400 font-600 uppercase tracking-wider mb-2">{item.label}</p>
            <p className="text-2xl font-800 text-gray-900">{item.val}</p>
            <p className="text-xs text-green-600 font-600 mt-1">{item.ch} vs last month</p>
          </div>
        ))}
      </div>

      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="font-700 text-gray-900">Monthly Statements</h2>
        </div>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Month','Total Trips','Gross Revenue','Commission (15%)','Active Drivers','Actions'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {statements.map((s, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-4 font-700 text-sm text-gray-900">{s.month}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{s.trips.toLocaleString()}</td>
                <td className="px-5 py-4 text-sm font-700 text-gray-800">TT$ {s.revenue}</td>
                <td className="px-5 py-4 text-sm text-gray-600">TT$ {s.commission}</td>
                <td className="px-5 py-4 text-sm text-gray-600">{s.drivers}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-2">
                    <button className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-700 text-gray-600">PDF</button>
                    <button className="px-3 py-1 rounded-lg text-xs font-700 text-white" style={{background:RED}}>Excel</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function NotificationsPanel() {
  const [tab, setTab] = useState<'push'|'sms'|'email'>('push')
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-800 text-gray-900 mb-1">Notifications</h1>
        <p className="text-sm text-gray-400">Broadcast messages to users</p>
      </div>

      <div className="flex gap-2 mb-6">
        {(['push','sms','email'] as const).map(t => (
          <button key={t} onClick={() => setTab(t)} className={`px-5 py-2 rounded-xl text-sm font-700 uppercase tracking-wider transition-all ${tab===t?'text-white':'bg-white border border-gray-200 text-gray-500'}`} style={tab===t?{background:RED}:{}}>
            {t==='push'?'Push':'sms'===t?'SMS':'Email'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-3 gap-6">
        <div className="col-span-2 bg-white border border-gray-100 rounded-2xl p-6">
          <h2 className="font-700 text-gray-900 mb-5">Compose {tab==='push'?'Push':tab==='sms'?'SMS':'Email'} Notification</h2>
          <div className="space-y-4">
            <div>
              <label className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-2">Target Audience</label>
              <select className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none">
                <option>All Users</option>
                <option>All Drivers</option>
                <option>All Passengers</option>
                <option>Inactive Users (30+ days)</option>
                <option>Premium Users</option>
              </select>
            </div>
            {tab !== 'sms' && (
              <div>
                <label className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-2">Title</label>
                <input className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none" placeholder="Notification title..."/>
              </div>
            )}
            <div>
              <label className="text-xs font-700 text-gray-500 uppercase tracking-wider block mb-2">Message</label>
              <textarea className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none resize-none" rows={5} placeholder="Write your message here..."/>
            </div>
            <div className="flex gap-3">
              <button className="px-5 py-2.5 bg-gray-100 rounded-xl text-sm font-700 text-gray-600">Save Draft</button>
              <button className="flex-1 py-2.5 rounded-xl text-sm font-700 text-white" style={{background:RED}}>Send Now →</button>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h3 className="font-700 text-gray-900 mb-4 text-sm">Recent Broadcasts</h3>
          <div className="space-y-3">
            {[
              {title:'Promo: 20% off rides',audience:'All Users',sent:'2.4k',date:'Sep 29'},
              {title:'Driver bonus week',audience:'All Drivers',sent:'342',date:'Sep 28'},
              {title:'New area: Gampaha',audience:'All Users',sent:'2.4k',date:'Sep 25'},
            ].map((n, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-3">
                <p className="font-700 text-sm text-gray-900 mb-1">{n.title}</p>
                <div className="flex justify-between text-xs text-gray-400">
                  <span>{n.audience}</span>
                  <span>Sent {n.sent} · {n.date}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function PromoPanel() {
  const promos = [
    { code: 'NEWRIDE50', discount: '50%', type: 'First Ride', uses: '0/1', status: 'active', expiry: 'Oct 31, 2026' },
    { code: 'SEPT20', discount: '20%', type: 'All Services', uses: '847/1000', status: 'active', expiry: 'Sep 30, 2026' },
    { code: 'MEDI10', discount: 'TT$ 100', type: 'Medi Boy', uses: '234/500', status: 'active', expiry: 'Oct 15, 2026' },
    { code: 'SUMMER30', discount: '30%', type: 'Ride', uses: '500/500', status: 'expired', expiry: 'Aug 31, 2026' },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-800 text-gray-900 mb-1">Promo Codes</h1>
          <p className="text-sm text-gray-400">4 codes · 2 active</p>
        </div>
        <button className="px-4 py-2 rounded-xl text-sm font-700 text-white" style={{background:RED}}>+ Create Promo</button>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {promos.map((p, i) => (
          <div key={i} className={`bg-white border-2 rounded-2xl p-5 ${p.status==='active'?'border-gray-100':'border-gray-100 opacity-60'}`}>
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="text-[10px] font-700 text-gray-400 uppercase tracking-wider mb-1">{p.type}</p>
                <h3 className="font-800 text-xl text-gray-900 tracking-wide">{p.code}</h3>
              </div>
              <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${p.status==='active'?'bg-green-100 text-green-700':'bg-gray-100 text-gray-500'}`}>{p.status}</span>
            </div>
            <div className="flex items-center gap-4 mb-3">
              <div className="bg-red-50 rounded-xl px-4 py-2">
                <p className="text-xs text-gray-400 font-500">Discount</p>
                <p className="font-800 text-[#E11D48]">{p.discount}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-500">Uses</p>
                <p className="font-700 text-gray-800 text-sm">{p.uses}</p>
              </div>
              <div>
                <p className="text-xs text-gray-400 font-500">Expires</p>
                <p className="font-700 text-gray-800 text-sm">{p.expiry}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-gray-100 rounded-xl text-xs font-700 text-gray-600">Edit</button>
              <button className="flex-1 py-2 bg-red-50 rounded-xl text-xs font-700 text-red-600">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function SettingsPanel() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-800 text-gray-900 mb-1">Settings</h1>
        <p className="text-sm text-gray-400">Platform configuration</p>
      </div>
      <div className="grid grid-cols-2 gap-6">
        {/* Site settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-700 text-gray-900 mb-4">Site Settings</h2>
          <div className="space-y-4">
            {[
              {label:'App Name', val:'Pickuptt', type:'text'},
              {label:'Support Phone', val:'+94 11 234 5678', type:'text'},
              {label:'SOS Number', val:'119', type:'text'},
              {label:'Map API Key', val:'AIzaSy••••••••••••', type:'password'},
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-700 text-gray-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input type={f.type} defaultValue={f.val} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E11D48] transition-colors"/>
              </div>
            ))}
          </div>
        </div>

        {/* Payment settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-700 text-gray-900 mb-4">Payment Settings</h2>
          <div className="space-y-4">
            {[
              {label:'Commission (%)', val:'15', type:'number'},
              {label:'Tax (%)', val:'0', type:'number'},
              {label:'Booking ID Prefix', val:'R-', type:'text'},
              {label:'Currency', val:'TT$', type:'text'},
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-700 text-gray-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input type={f.type} defaultValue={f.val} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E11D48] transition-colors"/>
              </div>
            ))}
            <div className="flex justify-between items-center">
              <span className="text-sm font-600 text-gray-700">Cash Payments</span>
              <div className="w-12 h-6 rounded-full bg-green-500 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"/>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-600 text-gray-700">Stripe Payments</span>
              <div className="w-12 h-6 rounded-full bg-green-500 relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full"/>
              </div>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm font-600 text-gray-700">Driver Fare Edit</span>
              <div className="w-12 h-6 rounded-full bg-gray-300 relative cursor-pointer">
                <div className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full"/>
              </div>
            </div>
          </div>
        </div>

        {/* Business settings */}
        <div className="bg-white border border-gray-100 rounded-2xl p-5">
          <h2 className="font-700 text-gray-900 mb-4">Business Settings</h2>
          <div className="space-y-4">
            {[
              {label:'Country Code', val:'+94', type:'text'},
              {label:'Driver Accept Timeout (sec)', val:'30', type:'number'},
              {label:'Search Radius (km)', val:'5', type:'number'},
              {label:'Distance Unit', val:'km', type:'text'},
              {label:'Time Zone', val:'Asia/Colombo', type:'text'},
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-700 text-gray-400 uppercase tracking-wider block mb-1.5">{f.label}</label>
                <input type={f.type} defaultValue={f.val} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-700 outline-none focus:border-[#E11D48] transition-colors"/>
              </div>
            ))}
          </div>
        </div>

        {/* Save */}
        <div className="flex flex-col justify-end gap-3">
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4">
            <p className="font-700 text-[#E11D48] text-sm mb-1">⚠️ Change Password</p>
            <p className="text-xs text-gray-500 mb-3">Update your admin account password.</p>
            <input type="password" placeholder="New password" className="w-full bg-white border border-gray-200 rounded-xl px-4 py-2.5 text-sm outline-none mb-2"/>
            <button className="w-full py-2.5 rounded-xl text-sm font-700 text-white" style={{background:RED}}>Update Password</button>
          </div>
          <button className="w-full py-3 rounded-xl text-base font-700 text-white" style={{background:RED}}>Save All Changes</button>
        </div>
      </div>
    </div>
  )
}

function PassengersPanel() {
  const passengers = [
    { name: 'Kamal Perera', phone: '+94 77 123 4567', email: 'kamal@example.com', trips: 24, wallet: 'TT$ 1,250', status: 'active', joined: 'Feb 2024' },
    { name: 'Dilani Silva', phone: '+94 71 234 5678', email: 'dilani@example.com', trips: 12, wallet: 'TT$ 500', status: 'active', joined: 'Apr 2024' },
    { name: 'Ruwani Mendis', phone: '+94 76 345 6789', email: 'ruwani@example.com', trips: 5, wallet: 'TT$ 0', status: 'blocked', joined: 'Jun 2024' },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-800 text-gray-900">Passengers</h1>
        <button className="px-4 py-2 rounded-xl text-sm font-700 text-white" style={{background:RED}}>+ Add Passenger</button>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['Passenger','Contact','Trips','Wallet','Status','Joined','Actions'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider px-5 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {passengers.map((p, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-5 py-4">
                  <div className="flex items-center gap-3">
                    <img src={`https://images.unsplash.com/photo-${i===0?'1507003211169-0a1dd7228f2d':i===1?'1494790108377-be9c29b29330':'1438761681033-6461ffad8d80'}?w=60&h=60&fit=crop&auto=format`} alt="" className="w-9 h-9 rounded-xl object-cover"/>
                    <div>
                      <p className="font-700 text-sm text-gray-900">{p.name}</p>
                      <p className="text-xs text-gray-400">{p.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-5 py-4 text-sm text-gray-500">{p.phone}</td>
                <td className="px-5 py-4 font-700 text-sm text-gray-800">{p.trips}</td>
                <td className="px-5 py-4 font-700 text-sm text-gray-800">{p.wallet}</td>
                <td className="px-5 py-4">
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${p.status==='active'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{p.status}</span>
                </td>
                <td className="px-5 py-4 text-sm text-gray-400">{p.joined}</td>
                <td className="px-5 py-4">
                  <div className="flex gap-1">
                    <button className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-700 text-gray-600">Edit</button>
                    <button className="px-3 py-1 bg-red-50 rounded-lg text-xs font-700 text-red-600">{p.status==='blocked'?'Unblock':'Block'}</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function WalletPanel() {
  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-800 text-gray-900 mb-1">Wallet Management</h1>
        <p className="text-sm text-gray-400">Manage user and driver wallets</p>
      </div>
      <div className="grid grid-cols-2 gap-6 mb-6">
        {[
          {title:'User Wallets', total:'TT$ 1.24M', count:'1,840 users', icon:'👥'},
          {title:'Driver Wallets', total:'TT$ 2.86M', count:'342 drivers', icon:'🧑‍✈️'},
        ].map(w => (
          <div key={w.title} className="bg-white border border-gray-100 rounded-2xl p-5">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-700 text-gray-900">{w.title}</h3>
              <span className="text-2xl">{w.icon}</span>
            </div>
            <p className="text-3xl font-800 text-gray-900 mb-1">{w.total}</p>
            <p className="text-xs text-gray-400 mb-4">{w.count}</p>
            <div className="flex gap-2">
              <button className="flex-1 py-2 rounded-xl text-xs font-700 text-white" style={{background:RED}}>Add Funds</button>
              <button className="flex-1 py-2 rounded-xl text-xs font-700 text-gray-600 bg-gray-100">Deduct</button>
            </div>
          </div>
        ))}
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl p-5">
        <h3 className="font-700 text-gray-900 mb-4">Recent Transactions</h3>
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['User','Type','Amount','Balance After','Date','Notes'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider px-4 py-2.5">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[
              {user:'Kamal Perera',type:'Recharge',amount:'+TT$ 1,000',bal:'TT$ 1,250',date:'Sep 30 10:20',note:'Self recharge'},
              {user:'Saman Kumara',type:'Cashout',amount:'-TT$ 5,000',bal:'TT$ 8,430',date:'Sep 30 09:15',note:'Weekly cashout'},
              {user:'Admin',type:'Bonus',amount:'+TT$ 500',bal:'TT$ 9,430',date:'Sep 29 18:00',note:'Performance bonus'},
            ].map((t, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-sm font-600 text-gray-900">{t.user}</td>
                <td className="px-4 py-3"><span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${t.type==='Recharge'||t.type==='Bonus'?'bg-green-100 text-green-700':'bg-red-100 text-red-700'}`}>{t.type}</span></td>
                <td className={`px-4 py-3 font-700 text-sm ${t.amount.startsWith('+')? 'text-green-600':'text-red-600'}`}>{t.amount}</td>
                <td className="px-4 py-3 text-sm text-gray-600">{t.bal}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{t.date}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{t.note}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function RidesPanel() {
  const rides = [
    { id:'#R-10042', type:'Ride', passenger:'Kamal Perera', driver:'Saman K.', from:'Colombo Fort', to:'Bambalapitiya', fare:'TT$ 380', status:'completed', date:'Sep 30 09:12' },
    { id:'#R-10041', type:'Package', passenger:'Dilani Silva', driver:'Ajith P.', from:'Kandy Road', to:'Pettah', fare:'TT$ 220', status:'in-progress', date:'Sep 30 09:08' },
    { id:'#R-10040', type:'Logistics', passenger:'Ruwani Mendis', driver:'Nuwan S.', from:'Mount Lavinia', to:'Wellawatte', fare:'TT$ 850', status:'cancelled', date:'Sep 30 08:54' },
    { id:'#R-10039', type:'Ambulance', passenger:'Chamil D.', driver:'Gayan R.', from:'Dehiwala', to:'National Hospital', fare:'TT$ 1,200', status:'completed', date:'Sep 29 23:40' },
    { id:'#R-10038', type:'Ride', passenger:'Priya F.', driver:'Suresh M.', from:'Maradana', to:'Galle Face', fare:'TT$ 190', status:'completed', date:'Sep 29 22:30' },
  ]
  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-800 text-gray-900">Rides & Deliveries</h1>
        <div className="flex gap-2">
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none">
            <option>All Services</option>
            <option>Ride</option>
            <option>Package</option>
            <option>Logistics</option>
            <option>Ambulance</option>
          </select>
          <select className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 outline-none">
            <option>All Status</option>
            <option>Completed</option>
            <option>In Progress</option>
            <option>Cancelled</option>
          </select>
        </div>
      </div>
      <div className="bg-white border border-gray-100 rounded-2xl overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              {['ID','Service','Passenger','Driver','Route','Fare','Status','Date','Actions'].map(h => (
                <th key={h} className="text-left text-xs font-700 text-gray-400 uppercase tracking-wider px-4 py-3">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rides.map((r, i) => (
              <tr key={i} className="border-t border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-3 text-xs font-700 text-[#E11D48]">{r.id}</td>
                <td className="px-4 py-3">
                  <span className="text-[10px] font-700 px-2 py-0.5 rounded-full bg-gray-100 text-gray-600">{r.type}</span>
                </td>
                <td className="px-4 py-3 text-sm font-500 text-gray-700">{r.passenger}</td>
                <td className="px-4 py-3 text-sm font-500 text-gray-700">{r.driver}</td>
                <td className="px-4 py-3 text-xs text-gray-400">{r.from} → {r.to}</td>
                <td className="px-4 py-3 font-700 text-sm text-gray-800">{r.fare}</td>
                <td className="px-4 py-3">
                  <span className={`text-[10px] font-700 px-2 py-0.5 rounded-full ${r.status==='completed'?'bg-green-100 text-green-700':r.status==='in-progress'?'bg-blue-100 text-blue-700':'bg-red-100 text-red-700'}`}>{r.status}</span>
                </td>
                <td className="px-4 py-3 text-xs text-gray-400">{r.date}</td>
                <td className="px-4 py-3">
                  <button className="px-3 py-1 bg-gray-100 rounded-lg text-xs font-700 text-gray-600">View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default function AdminPanel() {
  const [section, setSection] = useState<AdminSection>('dashboard')

  const renderContent = () => {
    switch (section) {
      case 'dashboard': return <Dashboard/>
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
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar active={section} onChange={setSection}/>
      <div className="flex-1 ml-56 p-8 min-h-screen">
        {renderContent()}
      </div>
    </div>
  )
}
