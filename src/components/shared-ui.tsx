export function MapCanvas() {
  return (
    <div className="absolute inset-0 overflow-hidden bg-[#E9ECEF]">
      <svg className="absolute inset-0 h-full w-full" viewBox="0 0 375 400" preserveAspectRatio="xMidYMid slice" fill="none">
        <rect width="375" height="400" fill="#E9ECEF" />

        {/* water: Gulf of Paria coastline */}
        <path d="M0 344c55-9 95 20 155 18s95-24 165-20c22 1 38-5 55-9v67H0z" fill="#CBE1F2" />
        <path d="M0 344c55-9 95 20 155 18s95-24 165-20c22 1 38-5 55-9" stroke="#B3D2EA" strokeWidth="2" fill="none" />

        {/* parks / green areas */}
        <path d="M12 46c22-22 72-19 91 7 17 24 2 67-34 75-33 7-65-14-65-47 0-13 3-26 8-35z" fill="#D6EDD4" />
        <rect x="256" y="166" width="82" height="74" rx="16" fill="#D6EDD4" />
        <path d="M38 252c19-9 46-5 54 12 8 17-4 35-25 39-23 4-48-8-50-27-1-12 8-21 21-24z" fill="#D6EDD4" />

        {/* city blocks / buildings */}
        <g fill="#F5F7F8" stroke="#DFE4E8" strokeWidth="1">
          <rect x="126" y="60" width="42" height="32" rx="3" />
          <rect x="176" y="60" width="58" height="26" rx="3" />
          <rect x="126" y="100" width="30" height="40" rx="3" />
          <rect x="164" y="94" width="36" height="46" rx="3" />
          <rect x="208" y="94" width="26" height="46" rx="3" />
          <rect x="256" y="60" width="36" height="30" rx="3" />
          <rect x="300" y="60" width="36" height="24" rx="3" />
          <rect x="256" y="98" width="36" height="42" rx="3" />
          <rect x="300" y="92" width="36" height="48" rx="3" />
          <rect x="28" y="164" width="32" height="30" rx="3" />
          <rect x="68" y="164" width="30" height="24" rx="3" />
          <rect x="28" y="202" width="42" height="36" rx="3" />
          <rect x="78" y="196" width="22" height="42" rx="3" />
          <rect x="126" y="164" width="46" height="32" rx="3" />
          <rect x="180" y="164" width="54" height="26" rx="3" />
          <rect x="126" y="204" width="30" height="36" rx="3" />
          <rect x="164" y="198" width="36" height="42" rx="3" />
          <rect x="208" y="198" width="26" height="42" rx="3" />
          <rect x="28" y="264" width="34" height="28" rx="3" />
          <rect x="70" y="264" width="28" height="22" rx="3" />
          <rect x="28" y="300" width="42" height="30" rx="3" />
          <rect x="78" y="294" width="22" height="34" rx="3" />
          <rect x="126" y="264" width="50" height="30" rx="3" />
          <rect x="184" y="264" width="50" height="24" rx="3" />
          <rect x="126" y="302" width="34" height="28" rx="3" />
          <rect x="168" y="296" width="32" height="34" rx="3" />
          <rect x="208" y="296" width="26" height="34" rx="3" />
          <rect x="256" y="264" width="36" height="28" rx="3" />
          <rect x="300" y="264" width="34" height="22" rx="3" />
          <rect x="256" y="300" width="42" height="30" rx="3" />
          <rect x="306" y="294" width="28" height="34" rx="3" />
        </g>

        {/* road casings */}
        <g stroke="#D7DDE2" fill="none" strokeLinecap="round">
          <path d="M-10 150H385" strokeWidth="23" />
          <path d="M-10 46H385" strokeWidth="14" />
          <path d="M-10 252H385" strokeWidth="16" />
          <path d="M-10 338H385" strokeWidth="16" />
          <path d="M110 -10V410" strokeWidth="23" />
          <path d="M245 -10V410" strokeWidth="16" />
          <path d="M18 -10V410" strokeWidth="13" />
          <path d="M345 -10V410" strokeWidth="13" />
          <path d="M-10 312L385 78" strokeWidth="20" />
        </g>

        {/* major roads */}
        <g stroke="#FFFFFF" fill="none" strokeLinecap="round">
          <path d="M-10 150H385" strokeWidth="18" />
          <path d="M-10 46H385" strokeWidth="9" />
          <path d="M-10 252H385" strokeWidth="11" />
          <path d="M-10 338H385" strokeWidth="11" />
          <path d="M110 -10V410" strokeWidth="18" />
          <path d="M245 -10V410" strokeWidth="11" />
          <path d="M18 -10V410" strokeWidth="8" />
          <path d="M345 -10V410" strokeWidth="8" />
          <path d="M-10 312L385 78" strokeWidth="14" />
        </g>

        {/* minor streets */}
        <g stroke="#FFFFFF" fill="none" strokeWidth="5" strokeLinecap="round">
          <path d="M18 98H345" />
          <path d="M18 200H345" />
          <path d="M18 295H345" />
          <path d="M62 -10V352" />
          <path d="M178 -10V352" />
          <path d="M295 -10V352" />
        </g>

        {/* lane markings on the two main arteries */}
        <g stroke="#C9D0D6" strokeWidth="1.5" strokeDasharray="7 9" fill="none">
          <path d="M-10 150H385" />
          <path d="M110 -10V410" />
          <path d="M-10 312L385 78" />
        </g>

        {/* labels */}
        <text x="57" y="92" textAnchor="middle" fontSize="7.5" fontWeight="700" fill="#6FA36B" letterSpacing="1">QUEEN'S PARK</text>
        <text x="297" y="207" textAnchor="middle" fontSize="7" fontWeight="700" fill="#6FA36B" letterSpacing="1">PARK</text>
        <text x="66" y="279" textAnchor="middle" fontSize="6.5" fontWeight="700" fill="#6FA36B">SAVANNAH</text>
        <text x="140" y="374" fontSize="8" fontWeight="700" fill="#82B4D8" letterSpacing="2">GULF OF PARIA</text>
        <text x="124" y="147" fontSize="7" fontWeight="600" fill="#9AA5AD" letterSpacing="0.5">WRIGHTSON RD</text>
        <text transform="translate(107 244) rotate(-90)" fontSize="7" fontWeight="600" fill="#9AA5AD" letterSpacing="0.5">INDEPENDENCE AVE</text>
        <text transform="translate(242 66) rotate(-90)" fontSize="7" fontWeight="600" fill="#9AA5AD" letterSpacing="0.5">FREDERICK ST</text>
        <text x="176" y="234" fontSize="11" fontWeight="800" fill="#B3BCC3" letterSpacing="2.5">PORT OF SPAIN</text>
        <text x="300" y="40" fontSize="7.5" fontWeight="700" fill="#AEB7BE" letterSpacing="1.5">ST. JAMES</text>
      </svg>
    </div>
  )
}

export function Route({ d, color = '#111111', w = 4.5, flow = true }: { d: string; color?: string; w?: number; flow?: boolean }) {
  return (
    <g fill="none" strokeLinecap="round">
      <path d={d} stroke="#FFFFFF" strokeWidth={w + 4} />
      <path d={d} stroke={color} strokeWidth={w} />
      {flow && <path d={d} stroke="#FFFFFF" strokeWidth={w - 1.5} strokeDasharray="0.5 13" className="route-flow" />}
    </g>
  )
}

export function Avatar({ initials, className = '' }: { initials: string; className?: string }) {
  return (
    <div className={`flex items-center justify-center bg-[#111] text-white font-800 tracking-tight shrink-0 ${className}`}>
      {initials}
    </div>
  )
}

export function Star({ filled, size = 24 }: { filled: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={filled ? '#F5B301' : 'none'} stroke={filled ? '#F5B301' : '#C4CBD1'} strokeWidth="1.8" strokeLinejoin="round">
      <path d="M12 3l2.7 5.6 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3z" />
    </svg>
  )
}

export function Sheet({ open, onClose, title, children }: { open: boolean; onClose: () => void; title?: string; children: React.ReactNode }) {
  if (!open) return null
  return (
    <div className="absolute inset-0 z-50 flex flex-col justify-end">
      <button aria-label="Close" onClick={onClose} className="absolute inset-0 bg-black/45 backdrop-blur-[2px] anim-fade" />
      <div className="relative bg-white rounded-t-3xl px-5 pt-3 pb-6 shadow-[0_-10px_40px_rgba(0,0,0,0.25)] anim-slide-up max-h-[88%] overflow-y-auto">
        <div className="w-10 h-1.5 bg-gray-200 rounded-full mx-auto mb-4" />
        <div className="flex items-center justify-between mb-4">
          {title ? <h3 className="text-lg font-800 text-gray-900 tracking-tight">{title}</h3> : <span />}
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center active:scale-90 transition-transform">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none"><path d="M18 6L6 18M6 6l12 12" stroke="#111" strokeWidth="2.5" strokeLinecap="round" /></svg>
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}

export function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-12 h-7 rounded-full transition-colors shrink-0 ${on ? 'bg-[#111]' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-0.5 w-6 h-6 bg-white rounded-full shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
    </button>
  )
}

export function Row({ label, sub, right, onClick }: { label: string; sub?: string; right?: React.ReactNode; onClick?: () => void }) {
  const cls = 'w-full flex items-center gap-3 py-3 border-b border-gray-100 last:border-0 text-left'
  const inner = (
    <>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-700 text-gray-900">{label}</p>
        {sub && <p className="text-xs text-gray-400 font-500 mt-0.5">{sub}</p>}
      </div>
      {right}
    </>
  )
  if (onClick) return <button onClick={onClick} className={cls}>{inner}</button>
  return <div className={cls}>{inner}</div>
}
