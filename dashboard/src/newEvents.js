// Remembers when the dashboard first saw each event, so new events can be
// highlighted. Events already there on the first refresh count as old.
// The key includes the time, so a replayed demo (same seq after a reset)
// counts as new again.

export const HIGHLIGHT_MS = 3000

const firstSeen = new Map()
let isFirstRefresh = true

function key(boxId, event) {
  return `${boxId}:${event.seq}:${event.time}`
}

// Adds `arrivedAt` (ms, 0 = was already there) to every event
export function markArrivals({ boxes, timelines }) {
  const now = Date.now()
  const stillThere = new Set()
  const marked = {}

  for (const [boxId, timeline] of Object.entries(timelines)) {
    const events = timeline.events.map((event) => {
      const k = key(boxId, event)
      stillThere.add(k)
      if (!firstSeen.has(k)) firstSeen.set(k, isFirstRefresh ? 0 : now)
      return { ...event, arrivedAt: firstSeen.get(k) }
    })
    marked[boxId] = { ...timeline, events }
  }

  // Forget events that disappeared (demo reset)
  for (const k of firstSeen.keys()) {
    if (!stillThere.has(k)) firstSeen.delete(k)
  }
  isFirstRefresh = false
  return { boxes, timelines: marked }
}

// True while an event is less than 3 s old on this screen
export function isNew(event, now = Date.now()) {
  return event.arrivedAt > 0 && now - event.arrivedAt < HIGHLIGHT_MS
}
