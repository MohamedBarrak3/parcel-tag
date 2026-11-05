// Turns API values into the words shown on screen.

// Safe temperature range of the parcel (to be tuned by Sarah).
// Used for the liability text and the shaded band of the temperature chart.
export const SAFE_TEMP_MIN_C = 5
export const SAFE_TEMP_MAX_C = 30

export const ROLE_LABELS = {
  warehouse: 'Warehouse',
  driver: 'Driver',
  client: 'Client',
}

// "12 s ago", "3 min ago"... or "No events yet" when there is no time
export function timeAgo(iso, now = Date.now()) {
  if (!iso) return 'No events yet'
  const seconds = Math.max(0, Math.round((now - new Date(iso).getTime()) / 1000))
  if (seconds < 60) return `${seconds} s ago`
  if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`
  if (seconds < 86400) return `${Math.floor(seconds / 3600)} h ago`
  return new Date(iso).toLocaleString()
}

// "10:02:40"
export function clockTime(iso) {
  if (!iso) return ''
  return new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
}

// holder null = nobody tapped yet; role null = badge not registered
export function holderName(holder) {
  if (!holder) return 'Unassigned'
  if (!holder.role) return 'Unknown badge'
  return holder.name
}

function tempDirection(tempC) {
  if (tempC == null) return 'out of range'
  if (tempC > SAFE_TEMP_MAX_C) return 'too high'
  if (tempC < SAFE_TEMP_MIN_C) return 'too low'
  return 'out of range'
}

// Title of an event in the timeline
export function eventLabel(event) {
  switch (event.type) {
    case 'tap':
      return event.holder ? `${holderName(event.holder)} took the box` : 'Badge tapped'
    case 'drop':
      return event.height_m != null ? `Dropped about ${event.height_m} m` : 'Dropped'
    case 'impact':
      return 'Hard impact'
    case 'upside_down':
      return 'Turned upside down'
    case 'tamper':
      return 'Lid opened'
    case 'temp_breach':
      return event.temp_c != null
        ? `Temperature ${event.temp_c} °C, out of range`
        : 'Temperature out of range'
    default:
      return event.type
  }
}

// What the holder did wrong, for the liability card
export function faultText(event) {
  switch (event.type) {
    case 'drop':
      return event.height_m != null ? `dropped from ${event.height_m} m` : 'dropped it'
    case 'impact':
      return 'hard impact'
    case 'upside_down':
      return 'turned it upside down'
    case 'tamper':
      return 'opened the lid'
    case 'temp_breach':
      return `temperature ${tempDirection(event.temp_c)}` +
        (event.temp_c != null ? ` (${event.temp_c} °C)` : '')
    default:
      return event.type
  }
}

// True for events that count against the holder
export function isFault(event) {
  return !event.expected && (event.severity === 'warning' || event.severity === 'severe')
}
