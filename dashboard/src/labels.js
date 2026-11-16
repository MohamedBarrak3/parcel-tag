// Plain-language words for everything the backend sends, so the dashboard reads like sentences

export const STATUS = {
  ok: { word: 'All good', dot: 'bg-emerald-500', pill: 'bg-emerald-50 text-emerald-700 ring-emerald-200' },
  warning: { word: 'Warning', dot: 'bg-amber-500', pill: 'bg-amber-50 text-amber-800 ring-amber-200' },
  severe: { word: 'Serious problem', dot: 'bg-red-500', pill: 'bg-red-50 text-red-700 ring-red-200' },
}

export const SEVERITY = {
  info: { word: 'Info', pill: 'bg-slate-100 text-slate-600', dot: 'bg-slate-400', card: 'border-slate-200 bg-white' },
  warning: { word: 'Warning', pill: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500', card: 'border-amber-200 bg-amber-50/60' },
  severe: { word: 'Serious', pill: 'bg-red-100 text-red-700', dot: 'bg-red-500', card: 'border-red-200 bg-red-50/60' },
}

export const ROLE = {
  warehouse: 'Warehouse',
  driver: 'Driver',
  client: 'Client',
}

export const EVENT_ICON = {
  tap: '🪪',
  drop: '⬇️',
  impact: '💥',
  upside_down: '🔄',
  tamper: '📦',
  temp_breach: '🌡️',
}

// One sentence per event
export function eventTitle(e) {
  switch (e.type) {
    case 'tap':
      return e.holder ? `${personName(e.holder)} took the box` : 'Badge tapped'
    case 'drop':
      return e.height_m != null ? `Dropped from about ${e.height_m} m` : 'Dropped'
    case 'impact':
      return 'Hit hard (impact)'
    case 'upside_down':
      return 'Turned upside down'
    case 'tamper':
      return e.expected ? 'Opened by the client (expected)' : 'Lid opened'
    case 'temp_breach':
      return e.temp_c != null ? `Temperature out of range: ${e.temp_c} °C` : 'Temperature out of range'
    default:
      return e.type
  }
}

// The backend's short reasons ("drop 0.8 m", "tamper", "temp_breach") in words
export function reasonText(reason) {
  if (!reason) return ''
  if (reason.startsWith('drop')) return `a drop${reason.slice(4) ? ` of ${reason.slice(5)}` : ''}`
  const words = {
    impact: 'a hard hit',
    upside_down: 'turning it upside down',
    tamper: 'opening the lid',
    temp_breach: 'a temperature problem',
  }
  return words[reason] ?? reason
}

export function personName(p) {
  if (!p) return 'Nobody'
  return p.name || 'Unknown badge'
}

export function roleText(p) {
  if (!p || !p.role) return null
  return ROLE[p.role] ?? p.role
}

// "2 min ago", "just now"
export function ago(iso, now = Date.now()) {
  if (!iso) return null
  const s = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000))
  if (s < 10) return 'just now'
  if (s < 60) return `${s} s ago`
  const m = Math.round(s / 60)
  if (m < 60) return `${m} min ago`
  const h = Math.round(m / 60)
  if (h < 24) return `${h} h ago`
  return new Date(iso).toLocaleDateString()
}

export function clock(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}
