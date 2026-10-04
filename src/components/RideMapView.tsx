import { useEffect, useMemo } from "react"
import {
  MapContainer,
  TileLayer,
  Marker,
  Polyline,
  useMap,
  useMapEvents,
} from "react-leaflet"
import L from "leaflet"
import "leaflet/dist/leaflet.css"
import { POS_CENTER, type Place } from "../lib/places"

const pickupIcon = L.divIcon({
  className: "",
  iconSize: [18, 18],
  iconAnchor: [9, 9],
  html: `<div style="position:relative;width:18px;height:18px">
      <div style="position:absolute;inset:-9px;border-radius:9999px;background:rgba(225,29,72,0.45);animation:rmvPulse 1.8s cubic-bezier(0,0,0.2,1) infinite"></div>
      <div style="position:relative;width:18px;height:18px;border-radius:9999px;background:#fff;border:4px solid #E11D48;box-shadow:0 2px 8px rgba(0,0,0,0.55)"></div>
    </div>`,
})

const carGlyph = (size: number) =>
  `<div style="width:${size}px;height:${size}px;filter:drop-shadow(0 2px 4px rgba(0,0,0,0.55))">
    <svg width="${size}" height="${size}" viewBox="0 0 32 32" fill="none">
      <rect x="9.5" y="3" width="13" height="26" rx="5.5" fill="#fff" stroke="rgba(0,0,0,0.35)" stroke-width="1"/>
      <path d="M11.5 10c0-1.4 1.1-2.5 2.5-2.5h4c1.4 0 2.5 1.1 2.5 2.5v3.2h-9V10z" fill="#141414"/>
      <path d="M11.5 16.8h9v4.4c0 1.4-1.1 2.5-2.5 2.5h-4c-1.4 0-2.5-1.1-2.5-2.5v-4.4z" fill="#141414" opacity="0.85"/>
      <rect x="9.5" y="14.6" width="13" height="1.4" fill="#d9d9d9"/>
    </svg>
  </div>`

const carIcon = (size = 24) =>
  L.divIcon({
    className: "",
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    html: carGlyph(size),
  })

const destIcon = L.divIcon({
  className: "",
  iconSize: [26, 26],
  iconAnchor: [13, 26],
  html: `<div style="width:26px;height:26px;background:#E11D48;border:3px solid #fff;border-radius:50% 50% 50% 0;transform:rotate(-45deg);box-shadow:0 3px 8px rgba(0,0,0,0.3);display:flex;align-items:center;justify-content:center">
      <div style="width:8px;height:8px;background:#fff;border-radius:9999px"></div>
    </div>`,
})

function MapEvents({
  onMapClick,
}: {
  onMapClick?: (lat: number, lng: number) => void
}) {
  useMapEvents({
    click: (e) => onMapClick?.(e.latlng.lat, e.latlng.lng),
  })
  return null
}

function FitController({
  signature,
  points,
}: {
  signature: string
  points: [number, number][]
}) {
  const map = useMap()
  useEffect(() => {
    if (points.length === 1) {
      map.setView(points[0], Math.max(map.getZoom(), 15), { animate: true })
      return
    }
    if (points.length > 1) {
      map.fitBounds(L.latLngBounds(points), {
        padding: [44, 44],
        animate: true,
        maxZoom: 16,
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [signature])
  return null
}

function RecenterController({
  center,
  nonce,
}: {
  center: [number, number]
  nonce: number
}) {
  const map = useMap()
  useEffect(() => {
    if (nonce === 0) return
    map.setView(center, Math.max(map.getZoom(), 15), { animate: true })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nonce])
  return null
}

type Props = {
  pickup?: Place | null
  dest?: Place | null
  route?: [number, number][] | null
  cars?: [number, number][]
  onMapClick?: (lat: number, lng: number) => void
  recenter?: { center: [number, number]; nonce: number }
  interactive?: boolean
  zoom?: number
  className?: string
}

export default function RideMapView({
  pickup,
  dest,
  route,
  cars,
  onMapClick,
  recenter,
  interactive = true,
  zoom = 14,
  className = "",
}: Props) {
  const start: [number, number] = pickup
    ? [pickup.lat, pickup.lng]
    : [POS_CENTER.lat, POS_CENTER.lng]

  const fitPoints = useMemo<[number, number][]>(() => {
    if (route && route.length > 1) return [route[0], route[route.length - 1]]
    const pts: [number, number][] = []
    if (pickup) pts.push([pickup.lat, pickup.lng])
    if (dest) pts.push([dest.lat, dest.lng])
    return pts
  }, [pickup, dest, route])

  const signature = useMemo(
    () =>
      fitPoints
        .map((p) => `${p[0].toFixed(4)},${p[1].toFixed(4)}`)
        .concat(route && route.length > 1 ? `n${route.length}` : [])
        .join("|"),
    [fitPoints, route],
  )

  return (
    <div
      className={`absolute inset-0 overflow-hidden bg-[#0e0f10] isolate ${className}`}
    >
      <MapContainer
        center={start}
        zoom={zoom}
        zoomControl={false}
        scrollWheelZoom={interactive}
        dragging={interactive}
        doubleClickZoom={interactive}
        attributionControl
        style={{ height: "100%", width: "100%" }}
        className="rmv-map"
      >
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
          attribution='&copy; <a href="https://www.esri.com/">Esri</a>, HERE, Garmin, OpenStreetMap contributors'
          maxZoom={19}
          maxNativeZoom={17}
        />
        <TileLayer
          url="https://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Reference/MapServer/tile/{z}/{y}/{x}"
          maxZoom={19}
          maxNativeZoom={17}
        />
        <MapEvents onMapClick={onMapClick} />
        {signature && (
          <FitController signature={signature} points={fitPoints} />
        )}
        {recenter && (
          <RecenterController center={recenter.center} nonce={recenter.nonce} />
        )}
        {pickup && (
          <Marker position={[pickup.lat, pickup.lng]} icon={pickupIcon} />
        )}
        {dest && <Marker position={[dest.lat, dest.lng]} icon={destIcon} />}
        {cars?.map((c, i) => (
          <Marker
            key={`car-${i}-${c[0].toFixed(4)},${c[1].toFixed(4)}`}
            position={c}
            icon={carIcon(24)}
            zIndexOffset={50}
          />
        ))}
        {route && route.length > 1 && (
          <>
            <Polyline
              positions={route}
              pathOptions={{
                color: "#ffffff",
                weight: 9,
                opacity: 0.95,
                lineCap: "round",
              }}
            />
            <Polyline
              positions={route}
              pathOptions={{
                color: "#E11D48",
                weight: 5,
                opacity: 1,
                lineCap: "round",
              }}
            />
            <Polyline
              positions={route}
              pathOptions={{
                color: "#ffffff",
                weight: 2.5,
                opacity: 0.95,
                dashArray: "0.5 14.5",
                lineCap: "butt",
                className: "rmvFlow",
              }}
            />
          </>
        )}
      </MapContainer>
    </div>
  )
}
