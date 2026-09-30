import { useMemo, useState } from "react";

type IconName =
  | "grid" | "users" | "car" | "route" | "pin" | "wallet" | "chart"
  | "tag" | "bell" | "headset" | "settings" | "search" | "plus" | "chevron"
  | "arrow" | "clock" | "check" | "package" | "shield" | "building" | "menu"
  | "home" | "star" | "phone" | "bike" | "ambulance" | "truck" | "globe";

const paths: Record<IconName, React.ReactNode> = {
  grid: <><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></>,
  users: <><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></>,
  car: <><path d="M5 17h14v-5l-2-5H7l-2 5v5Z"/><path d="M7 17v2M17 17v2M5 12h14"/><circle cx="8" cy="14.5" r=".5"/><circle cx="16" cy="14.5" r=".5"/></>,
  route: <><circle cx="6" cy="19" r="2"/><circle cx="18" cy="5" r="2"/><path d="M8 19h5a3 3 0 0 0 0-6h-2a3 3 0 0 1 0-6h5"/></>,
  pin: <><path d="M20 10c0 5-8 11-8 11S4 15 4 10a8 8 0 1 1 16 0Z"/><circle cx="12" cy="10" r="2.5"/></>,
  wallet: <><path d="M3 6h16a2 2 0 0 1 2 2v11H5a2 2 0 0 1-2-2V6Z"/><path d="M3 6V5a2 2 0 0 1 2-2h13M16 12h5"/></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2"/></>,
  tag: <><path d="m20 13-7 7L3 10V3h7l10 10Z"/><circle cx="7.5" cy="7.5" r="1"/></>,
  bell: <><path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9ZM14 21h-4"/></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2M4 14h3v6H5a1 1 0 0 1-1-1v-5ZM20 14h-3v6h2a1 1 0 0 0 1-1v-5ZM17 20c-1 2-3 2-5 2"/></>,
  settings: <><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .34 1.88l.06.06-2.83 2.83-.06-.06a1.7 1.7 0 0 0-1.88-.34 1.7 1.7 0 0 0-1 1.55V21h-4v-.08a1.7 1.7 0 0 0-1-1.55 1.7 1.7 0 0 0-1.88.34l-.06.06-2.83-2.83.06-.06A1.7 1.7 0 0 0 4.6 15a1.7 1.7 0 0 0-1.55-1H3v-4h.08a1.7 1.7 0 0 0 1.55-1 1.7 1.7 0 0 0-.34-1.88l-.06-.06 2.83-2.83.06.06A1.7 1.7 0 0 0 9 4.6a1.7 1.7 0 0 0 1-1.55V3h4v.08a1.7 1.7 0 0 0 1 1.55 1.7 1.7 0 0 0 1.88-.34l.06-.06 2.83 2.83-.06.06A1.7 1.7 0 0 0 19.4 9a1.7 1.7 0 0 0 1.55 1H21v4h-.08a1.7 1.7 0 0 0-1.52 1Z"/></>,
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-4-4"/></>,
  plus: <path d="M12 5v14M5 12h14"/>,
  chevron: <path d="m9 18 6-6-6-6"/>,
  arrow: <path d="m5 12 5 5L20 7"/>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  check: <path d="m5 12 4 4L19 6"/>,
  package: <><path d="m4 7 8-4 8 4-8 4-8-4Z"/><path d="m4 7v10l8 4 8-4V7M12 11v10"/></>,
  shield: <><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10Z"/><path d="m9 12 2 2 4-4"/></>,
  building: <><path d="M4 21V3h12v18M16 9h4v12M8 7h4M8 11h4M8 15h4M2 21h20"/></>,
  menu: <><path d="M4 7h16M4 12h16M4 17h16"/></>,
  home: <><path d="m3 11 9-8 9 8"/><path d="M5 10v11h14V10M9 21v-7h6v7"/></>,
  star: <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/>,
  phone: <path d="M21 16.5v3a2 2 0 0 1-2.2 2 19.8 19.8 0 0 1-8.6-3 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3-8.7A2 2 0 0 1 3.2 1.6h3a2 2 0 0 1 2 1.7c.1 1 .4 2 .7 2.9a2 2 0 0 1-.5 2.1L7.1 9.6a16 16 0 0 0 6 6l1.3-1.3a2 2 0 0 1 2.1-.5c.9.4 1.9.6 2.9.7a2 2 0 0 1 1.6 2Z"/>,
  bike: <><circle cx="6" cy="17" r="3"/><circle cx="18" cy="17" r="3"/><path d="m6 17 4-7 4 7h-8ZM14 17l3-8h-3M9 7h3"/></>,
  ambulance: <><path d="M3 6h12v12H3zM15 10h4l2 3v5h-6M7 9v6M4 12h6"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  truck: <><path d="M3 6h12v12H3zM15 10h4l2 3v5h-6"/><circle cx="7" cy="19" r="2"/><circle cx="18" cy="19" r="2"/></>,
  globe: <><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></>,
};

function Icon({ name, size = 20, className = "" }: { name: IconName; size?: number; className?: string }) {
  return <svg className={className} width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

function Button({ children, kind = "primary", onClick, className = "" }: { children: React.ReactNode; kind?: "primary" | "soft" | "ghost"; onClick?: () => void; className?: string }) {
  return <button onClick={onClick} className={`btn btn-${kind} ${className}`}>{children}</button>;
}

const nav = [
  ["Overview", "grid"], ["Users", "users"], ["Drivers", "car"], ["Rides & Deliveries", "route"],
  ["Live dispatch", "pin"], ["Fares & services", "tag"], ["Payments & wallets", "wallet"],
  ["Reports", "chart"], ["Promotions", "tag"], ["Notifications", "bell"], ["Customer support", "headset"], ["Settings", "settings"],
] as const;

const roleData: Record<string, { title: string; subtitle: string; stats: [string, string, string][] }> = {
  Admin: { title: "Good morning, Alex", subtitle: "Here’s what’s happening across Rido today.", stats: [["12,842", "Total users", "+12.5%"], ["1,436", "Active drivers", "+8.2%"], ["3,862", "Trips today", "+16.4%"], ["$48.2k", "Gross volume", "+11.8%"]] },
  Dispatcher: { title: "Dispatch center", subtitle: "Monitor demand and assign available drivers in real time.", stats: [["42", "Open requests", "Live"], ["318", "Drivers online", "82%"], ["4.2 min", "Avg. pickup", "-8%"], ["12", "Priority cases", "Review"]] },
  Corporate: { title: "Corporate travel", subtitle: "Manage employee mobility, policies and monthly billing.", stats: [["186", "Employees", "+12"], ["428", "Trips this month", "+9%"], ["$8,420", "Monthly spend", "74%"], ["$2,930", "Budget remaining", "On track"]] },
  "Sub-Company": { title: "Fleet operations", subtitle: "Your drivers, vehicles and daily operating performance.", stats: [["74", "Fleet drivers", "68 online"], ["63", "Vehicles", "92% ready"], ["486", "Jobs today", "+14%"], ["$12.8k", "Weekly earnings", "+6%"]] },
  "Account Manager": { title: "Account portfolio", subtitle: "Track client health, activity and upcoming renewals.", stats: [["38", "Managed accounts", "+3"], ["92%", "Portfolio health", "+4%"], ["7", "Renewals due", "30 days"], ["$284k", "Portfolio value", "+11%"]] },
  "Hotel / Restaurant": { title: "Guest transport", subtitle: "Book and monitor rides or deliveries for your guests.", stats: [["18", "Bookings today", "+4"], ["6", "Active trips", "Live"], ["4.8", "Guest rating", "Excellent"], ["$1,240", "Monthly spend", "61%"]] },
  "Customer Care": { title: "Support workspace", subtitle: "Resolve customer and driver issues quickly.", stats: [["28", "Open tickets", "-12%"], ["7", "Urgent", "Priority"], ["3.8 min", "First response", "-18%"], ["94%", "CSAT score", "+2.4%"]] },
};

const activity = [
  { icon: "car" as IconName, title: "Ride completed", meta: "RID-29384 · Sarah Ahmed", value: "$18.40", time: "2 min ago", status: "Completed" },
  { icon: "package" as IconName, title: "Package in transit", meta: "DEL-10293 · Midtown → Airport", value: "$24.80", time: "6 min ago", status: "In transit" },
  { icon: "wallet" as IconName, title: "Wallet top-up", meta: "WAL-82931 · Michael Chen", value: "+$50.00", time: "11 min ago", status: "Successful" },
  { icon: "ambulance" as IconName, title: "Ambulance dispatched", meta: "AMB-20918 · Priority request", value: "4.2 km", time: "14 min ago", status: "En route" },
];

function Sidebar({ active, setActive, role, setRole }: { active: string; setActive: (v: string) => void; role: string; setRole: (v: string) => void }) {
  const [rolesOpen, setRolesOpen] = useState(false);
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Icon name="pin" size={21}/></div><span>RIDO</span></div>
    <div className="role-wrap">
      <button className="role-switch" onClick={() => setRolesOpen(!rolesOpen)}>
        <span className="avatar small">AR</span><span><b>{role}</b><small>Workspace</small></span><Icon name="chevron" size={15}/>
      </button>
      {rolesOpen && <div className="role-menu">{Object.keys(roleData).map((r) => <button key={r} className={r === role ? "selected" : ""} onClick={() => { setRole(r); setRolesOpen(false); }}>{r}</button>)}</div>}
    </div>
    <div className="nav-label">Workspace</div>
    <nav>{nav.map(([label, icon]) => <button key={label} className={active === label ? "nav-item active" : "nav-item"} onClick={() => setActive(label)}><Icon name={icon}/><span>{label}</span>{label === "Customer support" && <em>8</em>}</button>)}</nav>
    <div className="sidebar-foot"><div className="help-card"><div className="help-icon"><Icon name="headset"/></div><b>Need help?</b><small>Visit the support center</small><Button kind="soft">Get support</Button></div><div className="profile-row"><span className="avatar">AR</span><span><b>Alex Rivera</b><small>alex@rido.co</small></span><Icon name="menu" size={18}/></div></div>
  </aside>;
}

function Topbar({ setMode }: { setMode: (v: string) => void }) {
  return <header className="topbar">
    <div className="search"><Icon name="search" size={18}/><input aria-label="Search" placeholder="Search anything..." /><kbd>⌘ K</kbd></div>
    <div className="top-actions">
      <button className="language"><Icon name="globe" size={17}/> EN <Icon name="chevron" size={13}/></button>
      <button className="icon-button"><Icon name="bell" size={19}/><i/></button>
      <Button onClick={() => setMode("Customer App")}><Icon name="plus" size={17}/> New booking</Button>
    </div>
  </header>;
}

function Stats({ items }: { items: [string, string, string][] }) {
  const icons: IconName[] = ["users", "car", "route", "wallet"];
  return <div className="stat-grid">{items.map(([value, label, delta], i) => <div className="stat-card" key={label}><div className={`stat-icon c${i}`}><Icon name={icons[i]}/></div><div className="stat-content"><span>{label}</span><strong>{value}</strong><small className={delta.includes("-") || delta === "Review" ? "warn" : ""}>{delta} <span>{delta.startsWith("+") || delta.startsWith("-") ? "vs last month" : ""}</span></small></div></div>)}</div>;
}

function Overview({ role, setMode }: { role: string; setMode: (v: string) => void }) {
  const data = roleData[role];
  return <>
    <div className="page-heading"><div><div className="eyebrow">MONDAY, 18 MAY</div><div className="title">{data.title}</div><div className="subtitle">{data.subtitle}</div></div><div className="heading-actions"><Button kind="soft"><Icon name="chart" size={17}/> Export report</Button><Button onClick={() => setMode("Customer App")}><Icon name="plus" size={17}/> Create booking</Button></div></div>
    <Stats items={data.stats}/>
    <div className="dashboard-grid">
      <section className="panel performance">
        <div className="panel-head"><div><b>Booking performance</b><small>Trips and deliveries completed</small></div><select aria-label="Period"><option>Last 7 days</option><option>Last 30 days</option></select></div>
        <div className="chart-legend"><span><i className="dot red"/>Rides</span><span><i className="dot pink"/>Deliveries</span><strong>4,892 <small>Total bookings</small></strong></div>
        <div className="chart-area"><div className="y-axis"><span>1k</span><span>750</span><span>500</span><span>250</span><span>0</span></div><svg viewBox="0 0 640 180" preserveAspectRatio="none"><defs><linearGradient id="fill" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#e41f2b" stopOpacity=".18"/><stop offset="1" stopColor="#e41f2b" stopOpacity="0"/></linearGradient></defs><path className="area" d="M0 150 C55 130,75 90,120 110 S210 120,255 70 S345 105,390 55 S480 75,520 42 S600 30,640 18 L640 180 L0 180Z"/><path className="line" d="M0 150 C55 130,75 90,120 110 S210 120,255 70 S345 105,390 55 S480 75,520 42 S600 30,640 18"/><path className="line secondary" d="M0 166 C70 150,100 145,145 152 S235 125,285 135 S370 115,415 125 S520 94,570 105 S620 92,640 95"/></svg><div className="x-axis"><span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span></div></div>
      </section>
      <section className="panel map-panel"><div className="panel-head"><div><b>Live operations</b><small>Currently active across the city</small></div><button className="link-btn">Open dispatch <Icon name="chevron" size={14}/></button></div><div className="map"><div className="road r1"/><div className="road r2"/><div className="road r3"/><div className="road r4"/>{[[18,32],[42,20],[69,38],[77,72],[32,68]].map((p,i)=><div key={i} className={`map-pin p${i}`} style={{left:`${p[0]}%`,top:`${p[1]}%`}}><Icon name={i===2 ? "package":"car"} size={14}/></div>)}<div className="map-pop"><b>318</b><span>drivers online</span></div></div><div className="map-stats"><span><i className="online"/>318 Online</span><span><i className="busy"/>126 On trip</span><span><i className="offline"/>54 Offline</span></div></section>
    </div>
    <section className="panel activity"><div className="panel-head"><div><b>Recent activity</b><small>Latest platform transactions and bookings</small></div><button className="link-btn">View all activity <Icon name="chevron" size={14}/></button></div><div className="activity-list">{activity.map((a) => <div className="activity-row" key={a.title}><span className="activity-icon"><Icon name={a.icon}/></span><span className="activity-main"><b>{a.title}</b><small>{a.meta}</small></span><span className="activity-time"><b>{a.value}</b><small>{a.time}</small></span><span className={`pill ${a.status.replace(" ","-").toLowerCase()}`}>{a.status}</span><button className="more">•••</button></div>)}</div></section>
  </>;
}

function GenericPage({ title }: { title: string }) {
  const desc: Record<string,string> = { Users:"Manage customer accounts, verification and platform access.", Drivers:"Review drivers, compliance, vehicles and availability.", "Rides & Deliveries":"Monitor every ride, package and logistics request.", "Live dispatch":"Assign jobs and monitor active operations.", "Fares & services":"Configure service types, zones and dynamic pricing.", "Payments & wallets":"Track transactions, payouts, balances and refunds.", Reports:"Explore performance, revenue and operational insights.", Promotions:"Create offers, promo codes and customer campaigns.", Notifications:"Send and manage platform communications.", "Customer support":"Resolve customer and driver cases.", Settings:"Configure platform, permissions and integrations." };
  return <><div className="page-heading"><div><div className="eyebrow">PLATFORM MANAGEMENT</div><div className="title">{title}</div><div className="subtitle">{desc[title]}</div></div><Button><Icon name="plus" size={17}/> Add new</Button></div><Stats items={[["2,842",`Total ${title.toLowerCase()}`,"+12.5%"],["186","Active now","+8.2%"],["98.4%","Success rate","+2.1%"],["24","Needs attention","Review"]]}/><section className="panel table-panel"><div className="table-tools"><div className="search table-search"><Icon name="search" size={17}/><input aria-label="Filter records" placeholder={`Search ${title.toLowerCase()}...`}/></div><Button kind="soft">Filters</Button></div><div className="data-table"><div className="tr th"><span>Reference</span><span>Customer / owner</span><span>Service</span><span>Updated</span><span>Status</span></div>{activity.concat(activity.slice(0,2)).map((a,i)=><div className="tr" key={i}><span><b>#{(29384+i*183).toString()}</b></span><span>{["Sarah Ahmed","Michael Chen","James Wilson","Emma Brown"][i%4]}</span><span>{a.title}</span><span>{a.time}</span><span><i className="status-dot"/>{i===3?"Needs review":"Active"}</span></div>)}</div></section></>;
}

const services: {name:string; icon:IconName; note:string}[] = [
  {name:"Ride",icon:"car",note:"2 min away"},{name:"Bike",icon:"bike",note:"Fast & easy"},{name:"Package",icon:"package",note:"Send anything"},{name:"Logistics",icon:"truck",note:"Larger loads"},{name:"Ambulance",icon:"ambulance",note:"Emergency"},{name:"Medi Boy",icon:"shield",note:"Medical help"},{name:"Towing",icon:"truck",note:"Roadside help"},{name:"Schedule",icon:"clock",note:"Book ahead"},
];

function PhoneApp({ driver, onClose }: { driver: boolean; onClose: () => void }) {
  const [isDriver, setIsDriver] = useState(driver);
  const [step, setStep] = useState(driver ? "online" : "home");
  const [lang, setLang] = useState("EN");
  return <div className="app-preview">
    <div className="preview-info"><button className="back-admin" onClick={onClose}><Icon name="chevron" size={18}/> Back to dashboard</button><div className="preview-kicker">{isDriver ? "DRIVER & DELIVERY PARTNER" : "CUSTOMER MOBILE APP"}</div><div className="preview-title">{isDriver ? "Earn on your schedule." : "Your city, one tap away."}</div><p>{isDriver ? "Accept rides and deliveries, navigate efficiently and track earnings from one clear workspace." : "Book rides, send packages and access essential services with live tracking and secure payments."}</p><div className="feature-list">{["Multi-language experience","Real-time status & tracking","Wallet and secure payments","Ratings, support & notifications"].map((f)=><span key={f}><Icon name="check" size={16}/>{f}</span>)}</div><Button kind="soft" onClick={() => setStep(isDriver ? "trip" : "tracking")}>Preview active {isDriver ? "job" : "trip"}</Button></div>
    <div className="phone">
      <div className="phone-top"><span>9:41</span><i/><b>◔ ʷ</b></div>
      <div className="mobile-head"><div className="mobile-logo"><Icon name="pin" size={16}/> Rido</div><button onClick={()=>setLang(lang==="EN"?"AR":"EN")}><Icon name="globe" size={15}/>{lang}</button><button><Icon name="bell" size={18}/></button></div>
      {isDriver ? <DriverScreen step={step} setStep={setStep}/> : <CustomerScreen step={step} setStep={setStep}/>}
    </div>
    <div className="app-toggle"><button className={!isDriver ? "active":""} onClick={() => { setIsDriver(false); setStep("home"); }}>Customer</button><button className={isDriver ? "active":""} onClick={() => { setIsDriver(true); setStep("online"); }}>Driver</button></div>
  </div>;
}

function CustomerScreen({step,setStep}:{step:string;setStep:(s:string)=>void}) {
  if(step==="tracking") return <div className="tracking-screen"><div className="mini-map"><div className="route-line"/><span className="pickup-pin"><Icon name="pin" size={18}/></span><span className="driver-pin"><Icon name="car" size={17}/></span><button className="map-back" onClick={()=>setStep("home")}><Icon name="chevron" size={18}/></button></div><div className="trip-sheet"><div className="handle"/><div className="arrival"><div><small>Your driver is arriving in</small><b>3 min</b></div><span className="live-pill">LIVE</span></div><div className="driver-card"><span className="avatar driver-avatar">MO</span><span><b>Mohamed Ali</b><small><Icon name="star" size={12}/> 4.9 · Toyota Camry</small></span><strong>AB 2381</strong></div><div className="trip-progress"><i className="done"/><span/><i className="active"/><span/><i/></div><div className="trip-labels"><span>Accepted</span><span>Arriving</span><span>Drop-off</span></div><div className="trip-actions"><Button kind="soft"><Icon name="phone" size={17}/> Call</Button><Button><Icon name="headset" size={17}/> Support</Button></div></div></div>;
  return <div className="mobile-body"><div className="hello"><div><small>Good morning,</small><b>Hi, Sarah</b></div><span className="avatar">SA</span></div><div className="location-box"><div className="location-row"><i className="loc from"/><span><small>Pickup location</small><b>Current location</b></span></div><div className="location-line"/><button className="location-row" onClick={()=>setStep("tracking")}><i className="loc to"/><span><small>Where to?</small><b>Enter your destination</b></span><Icon name="chevron" size={16}/></button></div><div className="mobile-section-title"><b>What do you need?</b><button>See all</button></div><div className="service-grid">{services.map(s=><button key={s.name} onClick={()=>setStep("tracking")}><span><Icon name={s.icon}/></span><b>{s.name}</b><small>{s.note}</small></button>)}</div><MobileNav/></div>;
}

function DriverScreen({step,setStep}:{step:string;setStep:(s:string)=>void}) {
  return <div className="mobile-body driver-body"><div className="driver-summary"><div><small>Today's earnings</small><b>$128.40</b><span>8 completed jobs</span></div><button className="online-toggle"><i/> Online</button></div>{step==="trip"?<div className="driver-job"><div className="mini-map driver-map"><div className="route-line"/><span className="driver-pin"><Icon name="car" size={17}/></span></div><div className="job-card"><div className="job-type"><span><Icon name="package" size={18}/></span><div><b>Package delivery</b><small>DEL-10293 · 4.8 km</small></div><strong>$14.80</strong></div><div className="job-route"><i/><span><small>Pickup</small><b>24 King Street</b></span><i/><span><small>Drop-off</small><b>Airport Terminal 2</b></span></div><Button onClick={()=>setStep("online")}><Icon name="check" size={17}/> Mark as picked up</Button></div></div>:<><div className="driver-map overview-map"><div className="demand-zone">High<br/>demand</div>{[[20,40],[68,25],[52,66]].map((p,i)=><span key={i} className="tiny-pin" style={{left:`${p[0]}%`,top:`${p[1]}%`}}><Icon name="pin" size={17}/></span>)}</div><div className="request-card"><div className="request-top"><span><Icon name="car"/></span><div><b>New ride request</b><small>4 min pickup · 6.2 km trip</small></div><strong>$18.60</strong></div><div className="countdown"><i/><span>Expires in 18 seconds</span></div><div className="request-actions"><Button kind="soft">Decline</Button><Button onClick={()=>setStep("trip")}>Accept job</Button></div></div><div className="driver-metrics"><span><b>4.9</b><small>Rating</small></span><span><b>92%</b><small>Acceptance</small></span><span><b>248</b><small>Total trips</small></span></div></>}<MobileNav driver/></div>;
}

function MobileNav({driver=false}:{driver?:boolean}) { return <div className="mobile-nav">{[[driver?"home":"home",driver?"Jobs":"Home"],[driver?"wallet":"route",driver?"Earnings":"Trips"],["bell","Alerts"],["users","Profile"]].map(([i,l],idx)=><button className={idx===0?"active":""} key={l}><Icon name={i as IconName} size={19}/><span>{l}</span></button>)}</div> }

function AuthFlow({ onComplete }: { onComplete: (role: string) => void }) {
  const [view, setView] = useState<"signin" | "signup" | "forgot" | "workspace">("signin");
  const [persona, setPersona] = useState<"Customer" | "Driver">("Customer");
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("alex@rido.co");
  const workspaces = [
    { name: "Admin", note: "Full platform control", icon: "shield" as IconName },
    { name: "Dispatcher", note: "Live fleet operations", icon: "pin" as IconName },
    { name: "Corporate", note: "Business travel", icon: "building" as IconName },
    { name: "Customer Care", note: "Support workspace", icon: "headset" as IconName },
  ];
  return <div className="auth-shell">
    <section className="auth-story">
      <div className="auth-brand"><span><Icon name="pin" size={21}/></span> RIDO</div>
      <div className="story-content">
        <div className="story-tag"><i/> ONE PLATFORM. EVERY JOURNEY.</div>
        <div className="story-title">Moving people.<br/><span>Delivering possibilities.</span></div>
        <div className="story-copy">From everyday rides to essential deliveries, Rido keeps cities moving with one intelligent mobility platform.</div>
        <div className="story-metrics"><div><b>2.4M+</b><small>Journeys completed</small></div><div><b>38K</b><small>Trusted partners</small></div><div><b>4.9</b><small>Average rating</small></div></div>
      </div>
      <div className="story-card floating-card-one"><span><Icon name="car" size={17}/></span><div><b>Your driver is arriving</b><small>2 minutes away</small></div><i>LIVE</i></div>
      <div className="story-card floating-card-two"><span><Icon name="package" size={17}/></span><div><b>Package delivered</b><small>Right on time</small></div><Icon name="check" size={16}/></div>
      <div className="auth-map-lines"><i/><i/><i/></div>
      <div className="story-footer">© 2025 Rido Technologies <span>Privacy</span><span>Terms</span></div>
    </section>
    <section className="auth-form-side">
      <div className="mobile-auth-brand"><span><Icon name="pin" size={18}/></span> RIDO</div>
      {view === "workspace" ? <div className="auth-box workspace-picker">
        <span className="auth-success"><Icon name="check" size={22}/></span>
        <div className="auth-title">Welcome back, Alex</div>
        <div className="auth-subtitle">Choose a workspace to continue</div>
        <div className="workspace-list">{workspaces.map((w,i)=><button key={w.name} onClick={()=>onComplete(w.name)}><span className={`workspace-icon wi${i}`}><Icon name={w.icon}/></span><span><b>{w.name}</b><small>{w.note}</small></span><Icon name="chevron" size={17}/></button>)}</div>
        <button className="auth-back" onClick={()=>setView("signin")}><Icon name="chevron" size={14}/> Use another account</button>
      </div> : <div className="auth-box">
        {view === "forgot" ? <>
          <button className="auth-back top" onClick={()=>setView("signin")}><Icon name="chevron" size={14}/> Back to sign in</button>
          <span className="forgot-icon"><Icon name="shield" size={23}/></span>
          <div className="auth-title">Reset your password</div>
          <div className="auth-subtitle">Enter your work email and we’ll send you a secure reset link.</div>
          <label className="field-label">Work email</label>
          <div className="auth-input"><span>@</span><input value={email} onChange={e=>setEmail(e.target.value)} aria-label="Work email"/></div>
          <Button className="auth-submit" onClick={()=>setView("signin")}>Send reset link <Icon name="chevron" size={16}/></Button>
        </> : <>
          <div className="persona-toggle" aria-label="Choose account type">
            <button className={persona === "Customer" ? "active" : ""} onClick={() => setPersona("Customer")}><Icon name="users" size={16}/> Customer</button>
            <button className={persona === "Driver" ? "active" : ""} onClick={() => setPersona("Driver")}><Icon name="car" size={16}/> Driver</button>
          </div>
          <div className="auth-kicker">{view === "signin" ? "WELCOME BACK" : "CREATE YOUR ACCOUNT"}</div>
          <div className="auth-title">{view === "signin" ? `${persona} sign in` : `Join as a ${persona.toLowerCase()}`}</div>
          <div className="auth-subtitle">{view === "signin" ? persona === "Customer" ? "Book rides, send packages and manage your wallet." : "Go online, accept jobs and track your earnings." : "Set up your account in less than a minute."}</div>
          <div className="social-row"><button><b>G</b> Google</button><button><b>⌘</b> Apple</button></div>
          <div className="auth-divider"><span>or continue with email</span></div>
          {view === "signup" && <><label className="field-label">Full name</label><div className="auth-input"><Icon name="users" size={17}/><input placeholder="Alex Rivera" aria-label="Full name"/></div></>}
          <label className="field-label">Work email</label>
          <div className="auth-input"><span>@</span><input value={email} onChange={e=>setEmail(e.target.value)} aria-label="Work email"/></div>
          <div className="password-label"><label className="field-label">Password</label>{view === "signin" && <button onClick={()=>setView("forgot")}>Forgot password?</button>}</div>
          <div className="auth-input"><Icon name="shield" size={17}/><input type={showPassword?"text":"password"} defaultValue={view==="signin"?"rido2025":""} placeholder="8+ characters" aria-label="Password"/><button onClick={()=>setShowPassword(!showPassword)}>{showPassword ? "Hide" : "Show"}</button></div>
          {view === "signup" && <label className="terms-check"><input type="checkbox" defaultChecked/><span>I agree to the <b>Terms of Service</b> and <b>Privacy Policy</b>.</span></label>}
          <Button className="auth-submit" onClick={()=>onComplete(persona)}>{view === "signin" ? `Continue as ${persona}` : "Create account"} <Icon name="chevron" size={16}/></Button>
          <div className="auth-switch">{view === "signin" ? "New to Rido?" : "Already have an account?"}<button onClick={()=>setView(view==="signin"?"signup":"signin")}>{view === "signin" ? "Create an account" : "Sign in"}</button></div>
          <button className="business-access" onClick={()=>setView("workspace")}><Icon name="building" size={14}/> Access a business or admin workspace</button>
        </>}
      </div>}
      <div className="auth-security"><Icon name="shield" size={14}/> Protected by enterprise-grade encryption</div>
    </section>
  </div>;
}

function App() {
  const [active, setActive] = useState("Overview");
  const [role, setRole] = useState("Admin");
  const [mode, setMode] = useState("Dashboard");
  const [authenticated, setAuthenticated] = useState(false);
  const hashDriver = useMemo(() => location.hash === "#driver", [mode]);
  if (!authenticated) return <AuthFlow onComplete={(selectedRole) => {
    if (selectedRole === "Customer" || selectedRole === "Driver") setMode(`${selectedRole} App`);
    else { setRole(selectedRole); setMode("Dashboard"); }
    setAuthenticated(true);
  }}/>;
  if (mode !== "Dashboard") return <PhoneApp driver={hashDriver || mode === "Driver App"} onClose={() => setMode("Dashboard")}/>;
  return <div className="app-shell"><Sidebar active={active} setActive={setActive} role={role} setRole={setRole}/><main><Topbar setMode={setMode}/><div className="content">{active === "Overview" ? <Overview role={role} setMode={setMode}/> : <GenericPage title={active}/>}</div></main><div className="prototype-switch"><button onClick={()=>setMode("Customer App")}>Customer app</button><button onClick={()=>setMode("Driver App")}>Driver app</button></div></div>;
}

export default App;
