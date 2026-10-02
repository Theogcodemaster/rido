import { useState } from 'react'
import CustomerApp from './components/CustomerApp'
import DriverApp from './components/DriverApp'
import AdminPanel from './components/AdminPanel'
import logo from './assets/logo.jpeg'

type Panel = 'customer' | 'driver' | 'admin'

export default function App() {
  const [panel, setPanel] = useState<Panel>('customer')

  return (
    <div className="min-h-screen bg-white">
      {/* Top switcher bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-0 max-w-[1440px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 mr-8">
            <img src={logo} alt="Pickuptt" className="w-7 h-7 rounded-lg object-cover shadow-sm" />
            <span className="font-bold text-sm tracking-tight text-gray-900">Pickuptt</span>
          </div>
          <div className="flex gap-1">
            {(['customer', 'driver', 'admin'] as Panel[]).map(p => (
              <button
                key={p}
                onClick={() => setPanel(p)}
                className={`px-4 py-1.5 rounded-full text-xs font-600 transition-all capitalize ${
                  panel === p
                    ? 'bg-[#E11D48] text-white'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                {p === 'customer' ? 'Customer App' : p === 'driver' ? 'Driver App' : 'Admin Panel'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="pt-14">
        {panel === 'customer' && <CustomerApp />}
        {panel === 'driver' && <DriverApp />}
        {panel === 'admin' && <AdminPanel />}
      </div>
    </div>
  )
}
