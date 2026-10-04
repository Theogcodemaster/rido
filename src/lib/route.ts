import { haversineKm, type Place } from "./places"

export type RouteResult = {
  coords: [number, number][]
  distanceM: number
  durationS: number
  /** true when the OSRM network route was unavailable and a straight line was used */
  fallback: boolean
}

const OSRM_BASE = "https://router.project-osrm.org/route/v1/driving"

function straightLine(from: Place, to: Place): RouteResult {
  const km = haversineKm(from, to)
  return {
    coords: [
      [from.lat, from.lng],
      [to.lat, to.lng],
    ],
    distanceM: km * 1000,
    durationS: (km / 35) * 3600,
    fallback: true,
  }
}

/** Driving route (geometry + distance + duration) from the public OSRM demo server. */
export async function fetchRoute(
  from: Place,
  to: Place,
  signal?: AbortSignal,
): Promise<RouteResult> {
  try {
    const url = `${OSRM_BASE}/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson&alternatives=false`
    const res = await fetch(url, { signal })
    if (!res.ok) throw new Error(`OSRM ${res.status}`)
    const data = (await res.json()) as {
      routes?: {
        geometry?: { coordinates?: [number, number][] }
        distance?: number
        duration?: number
      }[]
    }
    const route = data.routes?.[0]
    const coordinates = route?.geometry?.coordinates
    if (!route || !coordinates || coordinates.length < 2)
      throw new Error("No route returned")
    return {
      coords: coordinates.map(([lng, lat]) => [lat, lng] as [number, number]),
      distanceM: route.distance ?? 0,
      durationS: route.duration ?? 0,
      fallback: false,
    }
  } catch (err) {
    if (err instanceof DOMException && err.name === "AbortError") throw err
    return straightLine(from, to)
  }
}

/** Point at fraction t (0..1) along a polyline, measured by cumulative distance. */
export function pointAt(
  coords: [number, number][],
  t: number,
): [number, number] {
  if (coords.length === 0) return [0, 0]
  if (coords.length === 1 || t <= 0) return coords[0]
  if (t >= 1) return coords[coords.length - 1]

  const segs: number[] = []
  let total = 0
  const segKm = (a: [number, number], b: [number, number]) =>
    haversineKm({ lat: a[0], lng: a[1] }, { lat: b[0], lng: b[1] })
  for (let i = 1; i < coords.length; i++) {
    const d = segKm(coords[i - 1], coords[i])
    segs.push(d)
    total += d
  }
  if (total === 0) return coords[0]

  let target = total * t
  for (let i = 0; i < segs.length; i++) {
    if (target <= segs[i]) {
      const f = segs[i] === 0 ? 0 : target / segs[i]
      return [
        coords[i][0] + (coords[i + 1][0] - coords[i][0]) * f,
        coords[i][1] + (coords[i + 1][1] - coords[i][1]) * f,
      ]
    }
    target -= segs[i]
  }
  return coords[coords.length - 1]
}
