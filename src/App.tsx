import { useState } from 'react'
import CustomerApp from './components/CustomerApp'
import DriverApp from './components/DriverApp'
import AdminPanel from './components/AdminPanel'

type Panel = 'customer' | 'driver' | 'admin'

export default function App() {
  const [panel, setPanel] = useState<Panel>('customer')

  return (
    <div className="min-h-screen bg-white">
      {/* Top switcher bar */}
      <div className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-100">
        <div className="flex items-center gap-0 max-w-[1440px] mx-auto px-6 py-3">
          <div className="flex items-center gap-2 mr-8">
            <div className="w-7 h-7 bg-[#E11D48] rounded-lg flex items-center justify-center">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
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
