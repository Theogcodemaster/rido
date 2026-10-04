import { useEffect, useRef, useState } from "react"
import { Row, Sheet } from "./shared-ui"
import RideMapView from "./RideMapView"
import PlaceSearchSheet from "./PlaceSearchSheet"
import {
  POS_CENTER,
  carsAround,
  formatDistance,
  formatDuration,
  getSavedPlaces,
  pushRecent,
  reverseGeocode,
  type Place,
} from "../lib/places"
import { fetchRoute, type RouteResult } from "../lib/route"

const SAVED_ICONS: Record<string, React.ReactNode> = {
  home: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 10.5L12 3l9 7.5V20a1.5 1.5 0 01-1.5 1.5h-15A1.5 1.5 0 013 20v-9.5z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  work: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="7"
        width="18"
        height="13"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <path
        d="M9 7V5.5A1.5 1.5 0 0110.5 4h3A1.5 1.5 0 0115 5.5V7M3 12.5h18"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  pin: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 21s-7.5-4.4-7.5-11A7.5 7.5 0 0112 2.5 7.5 7.5 0 0119.5 10c0 6.6-7.5 11-7.5 11z"
        stroke="currentColor"
        strokeWidth="2.2"
      />
      <circle cx="12" cy="10" r="2.6" stroke="currentColor" strokeWidth="2.2" />
    </svg>
  ),
  star: (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l2.4 5.1 5.6.8-4 4 .9 5.6-4.9-2.7-4.9 2.7.9-5.6-4-4 5.6-.8L12 3z"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinejoin="round"
      />
    </svg>
  ),
}

export function RideScreen({
  onNext,
  onBack,
  pickup,
  setPickup,
  dest,
  setDest,
}: {
  onNext: () => void
  onBack: () => void
  pickup: Place
  setPickup: (p: Place) => void
  dest: Place | null
  setDest: (p: Place | null) => void
}) {
  const [timing, setTiming] = useState<"now" | "later">("now")
  const [sheet, setSheet] = useState<null | "schedule" | "promo" | "map">(null)
  const [searchMode, setSearchMode] = useState<null | "pickup" | "dest">(null)
  const [whenLabel, setWhenLabel] = useState("Leave now")
  const [promo, setPromo] = useState("")
  const [appliedPromo, setAppliedPromo] = useState<string | null>(null)
  const [toast, setToast] = useState("")
  const [myLocation, setMyLocation] = useState<Place>(POS_CENTER)
  const [route, setRoute] = useState<RouteResult | null>(null)
  const [routeLoading, setRouteLoading] = useState(false)
  const [pinLoading, setPinLoading] = useState(false)
  const [recenter, setRecenter] = useState<{
    center: [number, number]
    nonce: number
  }>({
    center: [POS_CENTER.lat, POS_CENTER.lng],
    nonce: 0,
  })

  const pickupRef = useRef(pickup)
  pickupRef.current = pickup

  const flash = (msg: string) => {
    setToast(msg)
    setTimeout(() => setToast(""), 1800)
  }

  // Resolve the device position once, and use it to label "Current location".
  useEffect(() => {
    if (!navigator.geolocation) return
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const found: Place = {
          id: "current",
          label: "Current location",
          lat: pos.coords.latitude,
          lng: pos.coords.longitude,
        }
        try {
          const resolved = await reverseGeocode(found.lat, found.lng)
          const labelled = { ...resolved, id: "current" }
          setMyLocation(labelled)
          if (pickupRef.current.id === "current") setPickup(labelled)
        } catch {
          setMyLocation(found)
          if (pickupRef.current.id === "current") setPickup(found)
        }
      },
      () => {
        /* permission denied or unavailable — stay on the POS fallback */
      },
      { enableHighAccuracy: false, timeout: 8000, maximumAge: 60000 },
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Live driving route between pickup and destination (OSRM, straight-line fallback).
  const routeKey = `${pickup.lat},${pickup.lng}|${
    dest ? `${dest.lat},${dest.lng}` : ""
  }`
  useEffect(() => {
    if (!dest) {
      setRoute(null)
      setRouteLoading(false)
      return
    }
    const ctrl = new AbortController()
    setRouteLoading(true)
    fetchRoute(pickup, dest, ctrl.signal)
      .then((r) => {
        if (ctrl.signal.aborted) return
        setRoute(r)
        setRouteLoading(false)
      })
      .catch((err) => {
        if (
          ctrl.signal.aborted ||
          (err instanceof DOMException && err.name === "AbortError")
        )
          return
        setRouteLoading(false)
        setRoute(null)
      })
    return () => ctrl.abort()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeKey])

  const openSearch = (mode: "pickup" | "dest") => setSearchMode(mode)

  const pickPlace = (place: Place) => {
    if (searchMode === "pickup") {
      setPickup(place)
      flash(`Pickup set to ${place.label}`)
    } else {
      setDest(place)
      pushRecent(place)
      flash(`Destination set to ${place.label}`)
    }
    setSearchMode(null)
  }

  const handleMapClick = async (lat: number, lng: number) => {
    if (pinLoading) return
    setPinLoading(true)
    try {
      const place = await reverseGeocode(lat, lng)
      setDest(place)
      pushRecent(place)
      flash(`Destination set to ${place.label}`)
    } catch {
      const pin: Place = {
        id: `pin-${Date.now()}`,
        label: "Dropped pin",
        sub: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
        lat,
        lng,
      }
      setDest(pin)
      pushRecent(pin)
      flash("Destination set to dropped pin")
    } finally {
      setPinLoading(false)
    }
  }

  const handleRecenter = () => {
    setRecenter((r) => ({
      center: [pickup.lat, pickup.lng],
      nonce: r.nonce + 1,
    }))
    flash("Map recentered on your location")
  }

  const swapEndpoints = () => {
    if (!dest) return
    const nextPickup = dest
    const nextDest: Place = {
      ...pickup,
      id: pickup.id === "current" ? `swap-${Date.now()}` : pickup.id,
    }
    setPickup(nextPickup)
    setDest(nextDest)
    flash("Swapped pickup and destination")
  }

  const savedPlaces = getSavedPlaces()

  const statsLabel = route
    ? `${formatDistance(route.distanceM)} · ${formatDuration(route.durationS)}`
    : null

  const scheduleShortLabel =
    whenLabel === "Leave now"
      ? "Schedule"
      : whenLabel
          .replace("In ", "")
          .replace(" minutes", " min")
          .replace(" minute", " min")
          .replace(" hour", " hr")
          .replace("Tomorrow · ", "Tomorrow ")

  return (
    <div className="flex flex-col bg-white relative" style={{ height: 680 }}>
      {/* Live map */}
      <div className="relative h-[38%] shrink-0 isolate">
        <RideMapView
          pickup={pickup}
          dest={dest}
          route={route?.coords ?? null}
          cars={carsAround(pickup)}
          onMapClick={handleMapClick}
          recenter={recenter}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/15 via-transparent to-black/10 pointer-events-none" />

        <button
          onClick={onBack}
          className="absolute top-4 left-4 w-9 h-9 rounded-full bg-white/95 backdrop-blur-md shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform z-[1100]"
        >
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
            <path
              d="M15 5l-7 7 7 7"
              stroke="#111"
              strokeWidth="2.6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          onClick={handleRecenter}
          className="absolute bottom-10 right-4 w-9 h-9 rounded-full bg-white shadow-[0_2px_10px_rgba(0,0,0,0.18)] flex items-center justify-center active:scale-95 transition-transform z-[1100]"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <circle cx="12" cy="12" r="3.4" fill="#111" />
            <circle cx="12" cy="12" r="7.4" stroke="#111" strokeWidth="2.2" />
            <path
              d="M12 1.5v3M12 19.5v3M22.5 12h-3M4.5 12h-3"
              stroke="#111"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Route / hint chip */}
        <div className="absolute bottom-10 left-4 z-[1100] max-w-[62%]">
          {statsLabel ? (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)] anim-fade">
              <span className="text-[11px] font-bold text-gray-900">
                {statsLabel}
              </span>
              {route?.fallback && (
                <span className="text-[11px] font-semibold text-gray-400">
                  {" "}
                  · approx.
                </span>
              )}
            </div>
          ) : routeLoading ? (
            <div className="bg-white/95 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
              <span className="text-[11px] font-bold text-gray-500 animate-pulse">
                Calculating route…
              </span>
            </div>
          ) : !dest ? (
            <div className="bg-white/90 backdrop-blur-md rounded-full px-3 py-1.5 shadow-[0_2px_10px_rgba(0,0,0,0.18)]">
              <span className="text-[11px] font-semibold text-gray-500">
                Tap the map to drop a destination
              </span>
            </div>
          ) : null}
        </div>

        {pinLoading && (
          <div className="absolute top-4 right-4 z-[1100] bg-gray-900/90 text-white text-[11px] font-bold px-3 py-1.5 rounded-full anim-fade">
            Dropping pin…
          </div>
        )}

        {toast && (
          <div className="absolute top-14 left-1/2 -translate-x-1/2 z-[1200] bg-gray-900 text-white text-xs font-bold px-4 py-2 rounded-full shadow-lg anim-fade whitespace-nowrap">
            {toast}
          </div>
        )}
      </div>

      {/* Floating route card */}
      <div className="relative z-10 -mt-6 px-4">
        <div className="bg-white rounded-2xl shadow-[0_6px_24px_rgba(0,0,0,0.10)] ring-1 ring-black/5 px-4 py-3">
          <div className="relative flex gap-3 items-center">
            <div className="flex flex-col items-center gap-1 pt-0.5 shrink-0">
              <div className="w-2.5 h-2.5 rounded-full bg-[#111]" />
              <div className="w-px flex-1 min-h-[18px] bg-gradient-to-b from-gray-300 to-gray-300" />
              <div className="w-2.5 h-2.5 rounded-[3px] bg-[#E11D48]" />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <button
                onClick={() => openSearch("pickup")}
                className="w-full flex items-center gap-2 text-left group"
              >
                <span className="flex-1 min-w-0 truncate text-[15px] font-semibold text-gray-900 group-hover:text-black">
                  {pickup.label}
                </span>
                {pickup.id !== "current" && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setPickup(myLocation)
                      flash("Pickup reset to current location")
                    }}
                    className="text-[11px] font-bold text-[#E11D48] shrink-0"
                  >
                    Reset
                  </span>
                )}
              </button>
              <button
                onClick={() => openSearch("dest")}
                className="w-full flex items-center gap-2 text-left group"
              >
                <span
                  className={`flex-1 min-w-0 truncate text-[15px] font-semibold ${
                    dest
                      ? "text-gray-900"
                      : "text-gray-400 group-hover:text-gray-600"
                  }`}
                >
                  {dest ? dest.label : "Where to?"}
                </span>
                {dest && (
                  <span
                    role="button"
                    tabIndex={0}
                    onClick={(e) => {
                      e.stopPropagation()
                      setDest(null)
                      flash("Destination cleared")
                    }}
                    className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center shrink-0"
                  >
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M18 6L6 18M6 6l12 12"
                        stroke="#6B7280"
                        strokeWidth="3"
                        strokeLinecap="round"
                      />
                    </svg>
                  </span>
                )}
              </button>
            </div>
            <div className="shrink-0 flex flex-col gap-1.5">
              <button
                onClick={() => openSearch("pickup")}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform"
              >
                <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    stroke="#111"
                    strokeWidth="2.4"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
              <button
                onClick={swapEndpoints}
                disabled={!dest}
                className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center active:scale-95 transition-transform disabled:opacity-40"
                aria-label="Swap pickup and destination"
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M7 4v14M7 18l-3-3M7 18l3-3M17 20V6M17 6l-3 3M17 6l3 3"
                    stroke="#111"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Plan your ride */}
      <div className="flex-1 flex flex-col px-5 pt-4 pb-4 overflow-hidden">
        <div className="flex-1 overflow-y-auto -mx-1 px-1">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-[22px] font-extrabold text-gray-900 tracking-[-0.02em] leading-none">
            Plan your ride
          </h2>
          <button
            onClick={() => setSheet("map")}
            className="text-xs font-bold text-gray-500 flex items-center gap-1 hover:text-gray-900"
          >
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 21s-7.5-4.4-7.5-11A7.5 7.5 0 0112 2.5 7.5 7.5 0 0119.5 10c0 6.6-7.5 11-7.5 11z"
                stroke="currentColor"
                strokeWidth="2.4"
              />
              <circle
                cx="12"
                cy="10"
                r="2.6"
                stroke="currentColor"
                strokeWidth="2.4"
              />
            </svg>
            Map
          </button>
        </div>

        {/* Trip summary */}
        <div className="flex items-center gap-2 mb-3 min-h-[18px]">
          {dest ? (
            routeLoading ? (
              <span className="text-[12px] font-semibold text-gray-400 animate-pulse">
                Calculating route…
              </span>
            ) : route ? (
              <span className="text-[12px] font-semibold text-gray-700">
                {formatDistance(route.distanceM)}
                <span className="text-gray-400 mx-1.5">·</span>
                {formatDuration(route.durationS)}
                <span className="text-gray-400 mx-1.5">·</span>
                {route.fallback ? "Estimated route" : "Driving route"}
              </span>
            ) : (
              <span className="text-[12px] font-semibold text-gray-400">
                Route unavailable
              </span>
            )
          ) : (
            <span className="text-[12px] font-semibold text-gray-400">
              Choose a destination to see the route
            </span>
          )}
        </div>

        {/* Timing toggle */}
        <div className="flex bg-gray-100 rounded-xl p-1 mb-4">
          {([
            {
              key: "now",
              label: "Leave now",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              ),
            },
            {
              key: "later",
              label: "Schedule",
              icon: (
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
                  <rect
                    x="3.5"
                    y="5"
                    width="17"
                    height="15.5"
                    rx="3"
                    stroke="currentColor"
                    strokeWidth="2.3"
                  />
                  <path
                    d="M8 2.5V6M16 2.5V6M3.5 10.5h17"
                    stroke="currentColor"
                    strokeWidth="2.3"
                    strokeLinecap="round"
                  />
                </svg>
              ),
            },
          ] as const).map((t) => (
            <button
              key={t.key}
              onClick={() => {
                if (t.key === "later") setSheet("schedule")
                else {
                  setTiming("now")
                  setWhenLabel("Leave now")
                }
              }}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-lg text-[13px] font-bold transition-all ${
                timing === t.key
                  ? "bg-white text-gray-900 shadow-[0_1px_3px_rgba(0,0,0,0.12)]"
                  : "text-gray-500"
              }`}
            >
              {t.icon}
              {t.key === "later" && timing === "later"
                ? scheduleShortLabel
                : t.label}
            </button>
          ))}
        </div>

        {/* Saved places */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {savedPlaces.map((p) => (
            <button
              key={p.id}
              onClick={() => {
                setDest(p)
                pushRecent(p)
                flash(`Destination set to ${p.label}`)
              }}
              className="group flex items-center gap-2 bg-gray-50 hover:bg-gray-100 rounded-xl px-2.5 py-2 text-left transition-colors"
            >
              <div className="w-7 h-7 rounded-lg bg-white shadow-sm ring-1 ring-black/5 flex items-center justify-center text-gray-700 shrink-0">
                {SAVED_ICONS[p.icon]}
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-bold text-gray-900 leading-tight truncate">
                  {p.label}
                </p>
                <p className="text-[10px] text-gray-400 truncate">{p.sub}</p>
              </div>
            </button>
          ))}
        </div>
        </div>

        <div className="mt-2.5 shrink-0 flex items-center gap-2.5">
          <button
            onClick={() => setSheet("promo")}
            className={`shrink-0 h-[51px] px-3.5 rounded-full flex items-center gap-1.5 text-[12px] font-bold transition-colors ${
              appliedPromo
                ? "bg-[#E11D48]/10 text-[#E11D48] border border-[#E11D48]/30"
                : "border border-dashed border-gray-200 text-gray-600 hover:border-[#E11D48]/50"
            }`}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
              <path
                d="M20 12v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 20v-8M2 8.5V4h20v4.5a2.5 2.5 0 000 5V18H2v-4.5a2.5 2.5 0 000-5z"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinejoin="round"
              />
            </svg>
            {appliedPromo ?? "Promo"}
          </button>

          <button
            onClick={() => (dest ? onNext() : openSearch("dest"))}
            className="flex-1 min-w-0 py-3.5 rounded-full bg-[#111] text-white text-[15px] font-bold tracking-tight active:scale-[0.98] transition-transform shadow-[0_6px_20px_rgba(0,0,0,0.22)] flex items-center justify-center gap-2"
          >
            <span className="truncate">
              {dest ? "Choose Vehicle" : "Choose a destination"}
            </span>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Place search */}
      <PlaceSearchSheet
        open={searchMode !== null}
        title={searchMode === "pickup" ? "Choose pickup" : "Choose destination"}
        placeholder={
          searchMode === "pickup" ? "Search pickup location" : "Where to?"
        }
        currentLocation={searchMode === "pickup" ? myLocation : null}
        from={pickup}
        onPick={pickPlace}
        onClose={() => setSearchMode(null)}
      />

      {/* Schedule sheet */}
      <Sheet
        open={sheet === "schedule"}
        onClose={() => setSheet(null)}
        title="Schedule your ride"
      >
        <div className="space-y-2 mb-4">
          {[
            "Leave now",
            "In 15 minutes",
            "In 30 minutes",
            "In 1 hour",
            "Tomorrow · 8:00 AM",
          ].map((t) => (
            <button
              key={t}
              onClick={() => {
                setWhenLabel(t)
                setTiming(t === "Leave now" ? "now" : "later")
                setSheet(null)
              }}
              className={`w-full flex items-center justify-between px-4 py-3.5 rounded-xl border-2 transition-all ${
                whenLabel === t
                  ? "border-[#111] bg-gray-50"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <span className="text-sm font-bold text-gray-900">{t}</span>
              {whenLabel === t && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12l5 5L20 7"
                    stroke="#111"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              )}
            </button>
          ))}
        </div>
      </Sheet>

      {/* Promo sheet */}
      <Sheet
        open={sheet === "promo"}
        onClose={() => setSheet(null)}
        title="Promo codes"
      >
        <div className="space-y-2.5 mb-4">
          {[
            {
              code: "WELCOME20",
              desc: "20% off your next ride",
              exp: "Expires Oct 31",
            },
            {
              code: "AIRPORT10",
              desc: "TT$ 10 off airport trips",
              exp: "Expires Nov 15",
            },
          ].map((o) => (
            <button
              key={o.code}
              onClick={() => {
                setPromo(o.code)
              }}
              className={`w-full flex items-center gap-3 p-3.5 rounded-xl border-2 transition-all text-left ${
                promo === o.code
                  ? "border-[#E11D48] bg-red-50"
                  : "border-gray-100 hover:bg-gray-50"
              }`}
            >
              <div className="w-9 h-9 rounded-lg bg-[#E11D48]/10 flex items-center justify-center shrink-0">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 12v8a1.5 1.5 0 01-1.5 1.5h-13A1.5 1.5 0 014 20v-8M2 8.5V4h20v4.5a2.5 2.5 0 000 5V18H2v-4.5a2.5 2.5 0 000-5z"
                    stroke="#E11D48"
                    strokeWidth="2.2"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div className="flex-1">
                <p className="font-extrabold text-sm text-gray-900">{o.code}</p>
                <p className="text-xs text-gray-500">
                  {o.desc} · {o.exp}
                </p>
              </div>
            </button>
          ))}
          <div className="flex gap-2 pt-1">
            <input
              value={promo}
              onChange={(e) => setPromo(e.target.value.toUpperCase())}
              placeholder="Enter code"
              className="flex-1 bg-gray-50 rounded-xl px-4 py-3 text-sm font-semibold outline-none uppercase placeholder-gray-300 placeholder:normal-case border-2 border-transparent focus:border-gray-300"
            />
            <button
              onClick={() => {
                if (promo) {
                  setAppliedPromo(promo)
                  setSheet(null)
                  flash(`${promo} applied`)
                }
              }}
              className="px-5 rounded-xl font-bold text-sm text-white bg-[#111]"
            >
              Apply
            </button>
          </div>
        </div>
      </Sheet>

      {/* Route preview sheet */}
      <Sheet
        open={sheet === "map"}
        onClose={() => setSheet(null)}
        title="Route preview"
      >
        <div className="relative h-56 rounded-2xl overflow-hidden ring-1 ring-black/5 mb-4">
          <RideMapView
            pickup={pickup}
            dest={dest}
            route={route?.coords ?? null}
            cars={carsAround(pickup)}
            interactive={false}
          />
          {!dest && (
            <div className="absolute inset-0 flex items-center justify-center bg-white/70">
              <p className="text-sm font-semibold text-gray-500">
                Choose a destination to preview the route
              </p>
            </div>
          )}
        </div>
        <div className="bg-gray-50 rounded-2xl p-4">
          <Row
            label="Pickup"
            sub={pickup.sub ?? "Port of Spain, Trinidad"}
            right={
              <span className="text-sm font-bold text-gray-900 truncate max-w-[150px] text-right">
                {pickup.label}
              </span>
            }
          />
          <Row
            label="Destination"
            sub={dest?.sub}
            right={
              <span className="text-sm font-bold text-gray-900 truncate max-w-[150px] text-right">
                {dest?.label ?? "—"}
              </span>
            }
          />
          <Row
            label="Distance"
            right={
              <span className="text-sm font-bold text-gray-900">
                {route ? formatDistance(route.distanceM) : "—"}
              </span>
            }
          />
          <Row
            label="Est. time"
            right={
              <span className="text-sm font-bold text-gray-900">
                {route ? formatDuration(route.durationS) : "—"}
              </span>
            }
          />
        </div>
        <button
          onClick={() => setSheet(null)}
          className="mt-4 w-full py-3.5 rounded-full font-bold text-sm text-white bg-[#111]"
        >
          Done
        </button>
      </Sheet>
    </div>
  )
}
