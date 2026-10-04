import { useEffect, useMemo, useRef, useState } from "react"
import { Sheet } from "./shared-ui"
import {
  formatDistance,
  getRecents,
  getSavedPlaces,
  haversineKm,
  matchLocal,
  searchPlaces,
  type Place,
} from "../lib/places"

type Status = "idle" | "loading" | "ok" | "empty" | "error"

const icons = {
  current: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="3.4" fill="#111" />
      <circle cx="12" cy="12" r="7.4" stroke="#111" strokeWidth="2.2" />
      <path
        d="M12 1.5v3M12 19.5v3M22.5 12h-3M4.5 12h-3"
        stroke="#111"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
    </svg>
  ),
  saved: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 3l2.4 5.1 5.6.8-4 4 .9 5.6-4.9-2.7-4.9 2.7.9-5.6-4-4 5.6-.8L12 3z"
        stroke="#111"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  ),
  recent: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 7.5V12l3 2m6-2.5a9 9 0 11-18 0 9 9 0 0118 0z"
        stroke="#111"
        strokeWidth="2.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  ),
  pin: (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"
        stroke="#111"
        strokeWidth="2.2"
      />
      <circle cx="12" cy="10" r="2.6" stroke="#111" strokeWidth="2.2" />
    </svg>
  ),
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 mt-4 first:mt-0">
      {children}
    </p>
  )
}

function ResultRow({
  place,
  kind,
  from,
  onClick,
}: {
  place: Place
  kind: keyof typeof icons
  from?: Place | null
  onClick: () => void
}) {
  const dist = from ? haversineKm(from, place) : null
  return (
    <button
      onClick={onClick}
      className="w-full flex items-center gap-3 px-2 py-2.5 rounded-xl hover:bg-gray-50 active:bg-gray-100 text-left transition-colors"
    >
      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
        {icons[kind]}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900 truncate">
          {place.label}
        </p>
        {place.sub && (
          <p className="text-xs text-gray-400 truncate">{place.sub}</p>
        )}
      </div>
      {dist !== null && dist > 0 && (
        <span className="text-[11px] font-semibold text-gray-400 shrink-0">
          {formatDistance(dist * 1000)}
        </span>
      )}
    </button>
  )
}

type Props = {
  open: boolean
  title: string
  placeholder?: string
  /** Shown as the first row when searching for a pickup. */
  currentLocation?: Place | null
  /** Distance reference point (usually the pickup). */
  from?: Place | null
  onPick: (place: Place) => void
  onClose: () => void
}

export default function PlaceSearchSheet({
  open,
  title,
  placeholder = "Search address or place",
  currentLocation,
  from,
  onPick,
  onClose,
}: Props) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Place[]>([])
  const [status, setStatus] = useState<Status>("idle")
  const [recents, setRecents] = useState<Place[]>([])
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (open) {
      setRecents(getRecents())
      setQuery("")
      setResults([])
      setStatus("idle")
      const t = setTimeout(() => inputRef.current?.focus(), 60)
      return () => clearTimeout(t)
    }
  }, [open])

  const trimmed = query.trim()

  useEffect(() => {
    if (!open || trimmed.length < 2) {
      setResults([])
      setStatus("idle")
      return
    }
    const ctrl = new AbortController()
    setStatus("loading")
    const t = setTimeout(() => {
      searchPlaces(trimmed, ctrl.signal)
        .then((found) => {
          if (ctrl.signal.aborted) return
          setResults(found)
          setStatus(found.length ? "ok" : "empty")
        })
        .catch((err) => {
          if (
            ctrl.signal.aborted ||
            (err instanceof DOMException && err.name === "AbortError")
          )
            return
          setStatus("error")
        })
    }, 350)
    return () => {
      clearTimeout(t)
      ctrl.abort()
    }
  }, [trimmed, open])

  const localMatches = useMemo(() => matchLocal(trimmed), [trimmed])
  const dedupedResults = useMemo(() => {
    const seen = new Set(localMatches.map((m) => m.place.label.toLowerCase()))
    return results.filter((r) => {
      const key = r.label.toLowerCase()
      if (seen.has(key)) return false
      seen.add(key)
      return true
    })
  }, [results, localMatches])
  const searching = trimmed.length >= 2
  const saved = getSavedPlaces()

  const pick = (place: Place) => {
    onPick(place)
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title={title}>
      <div className="flex gap-3 items-center border-2 border-gray-100 rounded-2xl px-4 py-3 mb-1 focus-within:border-[#E11D48] transition-colors">
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            stroke="#9CA3AF"
            strokeWidth="2.4"
            strokeLinecap="round"
          />
        </svg>
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={placeholder}
          className="flex-1 outline-none text-gray-900 font-semibold text-[15px] bg-transparent placeholder-gray-300"
        />
        {query && (
          <button
            onClick={() => setQuery("")}
            className="w-5 h-5 rounded-full bg-gray-200 flex items-center justify-center shrink-0"
          >
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none">
              <path
                d="M18 6L6 18M6 6l12 12"
                stroke="#6B7280"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </button>
        )}
        {status === "loading" && (
          <span className="w-4 h-4 rounded-full border-2 border-gray-200 border-t-[#E11D48] animate-spin shrink-0" />
        )}
      </div>

      {!searching && (
        <div className="max-h-[300px] overflow-y-auto -mx-1 px-1">
          {currentLocation && (
            <>
              <SectionLabel>Location</SectionLabel>
              <ResultRow
                place={currentLocation}
                kind="current"
                onClick={() => pick(currentLocation)}
              />
            </>
          )}
          <SectionLabel>Saved places</SectionLabel>
          {saved.map((p) => (
            <ResultRow
              key={p.id}
              place={p}
              kind="saved"
              from={from}
              onClick={() => pick(p)}
            />
          ))}
          <SectionLabel>Recent</SectionLabel>
          {recents.length === 0 && (
            <p className="text-sm text-gray-400 py-2">
              No recent destinations yet.
            </p>
          )}
          {recents.map((p) => (
            <ResultRow
              key={p.id}
              place={p}
              kind="recent"
              from={from}
              onClick={() => pick(p)}
            />
          ))}
        </div>
      )}

      {searching && (
        <div className="max-h-[300px] overflow-y-auto -mx-1 px-1">
          {localMatches.length > 0 && (
            <>
              <SectionLabel>Saved &amp; recent</SectionLabel>
              {localMatches.map(({ place, kind }) => (
                <ResultRow
                  key={`${kind}-${place.id}`}
                  place={place}
                  kind={kind}
                  from={from}
                  onClick={() => pick(place)}
                />
              ))}
            </>
          )}
          {(status === "loading" ||
            status === "error" ||
            dedupedResults.length > 0) && (
            <SectionLabel>
              {status === "loading"
                ? "Searching…"
                : status === "error"
                  ? "Nearby places"
                  : "Search results"}
            </SectionLabel>
          )}
          {status === "ok" &&
            dedupedResults.map((p) => (
              <ResultRow
                key={p.id}
                place={p}
                kind="pin"
                from={from}
                onClick={() => pick(p)}
              />
            ))}
          {status === "empty" &&
            localMatches.length === 0 &&
            dedupedResults.length === 0 && (
            <p className="text-sm text-gray-400 py-2">
              No places found for “{trimmed}”.
            </p>
          )}
          {status === "error" && (
            <div className="rounded-xl bg-red-50 border border-red-100 px-3 py-2.5 mb-1">
              <p className="text-xs text-red-600 font-semibold">
                Live search is unreachable right now.
              </p>
              <p className="text-xs text-red-500/80 mt-0.5">
                Check your connection — saved places and recents still work.
              </p>
            </div>
          )}
          {status === "idle" && localMatches.length === 0 && (
            <p className="text-sm text-gray-400 py-2">
              Type at least 2 characters to search.
            </p>
          )}
        </div>
      )}

      <p className="text-[11px] text-gray-300 text-center mt-4">
        Search by OpenStreetMap · Nominatim
      </p>
    </Sheet>
  )
}
