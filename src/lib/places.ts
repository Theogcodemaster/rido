export type Place = {
  id: string
  label: string
  sub?: string
  lat: number
  lng: number
}

export type SavedIcon = "home" | "work" | "pin" | "star"

export type SavedPlace = Place & { icon: SavedIcon }

/** Port of Spain town centre — fallback before geolocation resolves. */
export const POS_CENTER: Place = {
  id: "current",
  label: "Current location",
  lat: 10.6596,
  lng: -61.5019,
}

const TT_VIEWBOX = "-62.15,10.05,-60.55,10.95"

const SAVED_PLACES: SavedPlace[] = [
  {
    id: "saved-home",
    label: "Home",
    sub: "12 Walker St, Port of Spain",
    lat: 10.6737,
    lng: -61.5107,
    icon: "home",
  },
  {
    id: "saved-work",
    label: "Work",
    sub: "Level 3, Invaders Bay",
    lat: 10.6545,
    lng: -61.505,
    icon: "work",
  },
  {
    id: "saved-piarco",
    label: "Piarco Int’l",
    sub: "Golden Grove Rd, Piarco",
    lat: 10.5954,
    lng: -61.3372,
    icon: "pin",
  },
  {
    id: "saved-movietowne",
    label: "MovieTowne",
    sub: "Audrey Jeffers Hwy",
    lat: 10.6647,
    lng: -61.5072,
    icon: "star",
  },
]

const SEED_RECENTS: Place[] = [
  {
    id: "recent-piarco",
    label: "Piarco International Airport",
    sub: "Golden Grove Rd, Piarco",
    lat: 10.5954,
    lng: -61.3372,
  },
  {
    id: "recent-movietowne",
    label: "MovieTowne Port of Spain",
    sub: "Audrey Jeffers Hwy, Port of Spain",
    lat: 10.6647,
    lng: -61.5072,
  },
  {
    id: "recent-savannah",
    label: "Queen’s Park Savannah",
    sub: "Port of Spain",
    lat: 10.676,
    lng: -61.5055,
  },
  {
    id: "recent-hyatt",
    label: "Hyatt Regency Trinidad",
    sub: "Wrightson Rd, Port of Spain",
    lat: 10.652,
    lng: -61.505,
  },
]

export function getSavedPlaces(): SavedPlace[] {
  return SAVED_PLACES
}

const RECENTS_KEY = "pickuptt.recentPlaces"

export function getRecents(): Place[] {
  try {
    const raw = localStorage.getItem(RECENTS_KEY)
    if (!raw) return SEED_RECENTS
    const parsed = JSON.parse(raw) as Place[]
    if (!Array.isArray(parsed) || parsed.length === 0) return SEED_RECENTS
    return parsed.filter(
      (p) => p && typeof p.lat === "number" && typeof p.lng === "number",
    )
  } catch {
    return SEED_RECENTS
  }
}

export function pushRecent(place: Place): Place[] {
  if (place.id === "current") return getRecents()
  const next = [
    place,
    ...getRecents().filter((p) => p.id !== place.id && p.label !== place.label),
  ].slice(0, 6)
  try {
    localStorage.setItem(RECENTS_KEY, JSON.stringify(next))
  } catch {
    /* storage unavailable — keep in-memory only */
  }
  return next
}

export function matchLocal(
  query: string,
): { place: Place; kind: "saved" | "recent" }[] {
  const q = query.trim().toLowerCase()
  if (!q) return []
  const hit = (p: Place) =>
    p.label.toLowerCase().includes(q) || (p.sub ?? "").toLowerCase().includes(q)
  const saved = SAVED_PLACES.filter(hit).map((place) => ({
    place,
    kind: "saved" as const,
  }))
  const recents = getRecents()
    .filter(hit)
    .map((place) => ({ place, kind: "recent" as const }))
  const seen = new Set<string>()
  return [...saved, ...recents].filter((r) => {
    if (seen.has(r.place.id)) return false
    seen.add(r.place.id)
    return true
  })
}

type NominatimResult = {
  place_id: number
  lat: string
  lon: string
  display_name: string
  name?: string
  address?: Record<string, string>
}

function fromNominatim(r: NominatimResult): Place {
  const addr = r.address ?? {}
  const locality =
    addr.neighbourhood ??
    addr.suburb ??
    addr.quarter ??
    addr.village ??
    addr.town ??
    addr.city ??
    addr.county
  const road = addr.road ?? addr.pedestrian ?? addr.hamlet
  const rawName = (r.name ?? "").trim()
  const isHouseNumber = /^\d+[A-Za-z]?$/.test(rawName)
  const nameIsUseful = rawName.length > 0 && !isHouseNumber

  const label =
    (nameIsUseful
      ? rawName
      : isHouseNumber && road
        ? `${rawName} ${road}`
        : road) || r.display_name.split(",")[0].trim()

  const sub =
    [nameIsUseful ? road : null, nameIsUseful || isHouseNumber ? locality : null]
      .filter(Boolean)
      .filter((part) => part !== label)
      .join(", ") ||
    r.display_name
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s && s !== label)
      .join(", ") ||
    undefined

  return {
    id: `osm-${r.place_id}`,
    label: label || r.display_name,
    sub: sub || undefined,
    lat: Number(r.lat),
    lng: Number(r.lon),
  }
}

export async function searchPlaces(
  query: string,
  signal?: AbortSignal,
): Promise<Place[]> {
  const url = new URL("https://nominatim.openstreetmap.org/search")
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("q", query)
  url.searchParams.set("limit", "8")
  url.searchParams.set("addressdetails", "1")
  url.searchParams.set("viewbox", TT_VIEWBOX)
  url.searchParams.set("bounded", "0")
  const res = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  })
  if (!res.ok) throw new Error(`Search failed (${res.status})`)
  const rows = (await res.json()) as NominatimResult[]
  return rows
    .map(fromNominatim)
    .filter((p) => Number.isFinite(p.lat) && Number.isFinite(p.lng))
}

export async function reverseGeocode(
  lat: number,
  lng: number,
  signal?: AbortSignal,
): Promise<Place> {
  const url = new URL("https://nominatim.openstreetmap.org/reverse")
  url.searchParams.set("format", "jsonv2")
  url.searchParams.set("lat", String(lat))
  url.searchParams.set("lon", String(lng))
  url.searchParams.set("zoom", "18")
  url.searchParams.set("addressdetails", "1")
  const res = await fetch(url.toString(), {
    signal,
    headers: { Accept: "application/json" },
  })
  if (!res.ok) throw new Error(`Reverse geocode failed (${res.status})`)
  const row = (await res.json()) as NominatimResult & { error?: string }
  if (row.error) throw new Error(row.error)
  return fromNominatim(row)
}

export function haversineKm(
  a: { lat: number; lng: number },
  b: { lat: number; lng: number },
): number {
  const R = 6371
  const dLat = ((b.lat - a.lat) * Math.PI) / 180
  const dLng = ((b.lng - a.lng) * Math.PI) / 180
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a.lat * Math.PI) / 180) *
      Math.cos((b.lat * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return 2 * R * Math.asin(Math.sqrt(s))
}

export function formatDistance(meters: number): string {
  if (!Number.isFinite(meters)) return "—"
  if (meters < 1000) return `${Math.max(10, Math.round(meters / 10) * 10)} m`
  return `${(meters / 1000).toFixed(1)} km`
}

export function formatDuration(seconds: number): string {
  const mins = Math.max(1, Math.round(seconds / 60))
  if (mins < 60) return `${mins} min`
  const h = Math.floor(mins / 60)
  return `${h} hr ${mins % 60} min`
}

const CAR_OFFSETS: [number, number][] = [
  [0.0042, 0.0031],
  [-0.0035, 0.0048],
  [0.0021, -0.0044],
  [-0.0052, -0.0018],
  [0.0058, -0.0026],
]

/** Deterministic scatter of car positions around a center (Uber-style nearby vehicles). */
export function carsAround(
  center: { lat: number; lng: number },
  count = 4,
): [number, number][] {
  return CAR_OFFSETS.slice(0, Math.min(count, CAR_OFFSETS.length)).map(
    ([dLat, dLng]) =>
      [center.lat + dLat, center.lng + dLng] as [number, number],
  )
}
