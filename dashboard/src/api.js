import rawMockBoxes from './mock/boxes.json'
import rawMockTimelines from './mock/timelines.json'

const API_URL = import.meta.env.VITE_API_URL

// Without VITE_API_URL the dashboard shows the mock data in src/mock/
export const MOCK_MODE = !API_URL

// Mock times are moved so the newest mock event happened 1 minute ago
const newestMock = Math.max(...rawMockBoxes.map((b) => Date.parse(b.last_event_time) || 0))
const mockShiftMs = Date.now() - 60_000 - newestMock
const shift = (iso) => iso && new Date(Date.parse(iso) + mockShiftMs).toISOString()

const mockBoxes = rawMockBoxes.map((b) => ({ ...b, last_event_time: shift(b.last_event_time) }))
const mockTimelines = Object.fromEntries(
  Object.entries(rawMockTimelines).map(([id, t]) => [
    id,
    { ...t, events: t.events.map((e) => ({ ...e, time: shift(e.time) })) },
  ]),
)

// An error with the HTTP status (0 means the backend could not be reached)
export class ApiError extends Error {
  constructor(message, status) {
    super(message)
    this.status = status
  }
}

async function request(path, options = {}) {
  let res
  try {
    // Give up after 4 s so a frozen backend also shows the offline banner
    res = await fetch(`${API_URL}${path}`, { ...options, signal: AbortSignal.timeout(4000) })
  } catch {
    throw new ApiError('Backend offline', 0)
  }
  if (!res.ok) throw new ApiError(`HTTP ${res.status} on ${path}`, res.status)
  return res.json()
}

export async function getBoxes() {
  if (MOCK_MODE) return mockBoxes
  return request('/api/boxes')
}

export async function getTimeline(boxId) {
  if (MOCK_MODE) {
    if (!mockTimelines[boxId]) throw new ApiError('Unknown box', 404)
    return mockTimelines[boxId]
  }
  return request(`/api/boxes/${encodeURIComponent(boxId)}/timeline`)
}

export async function resetDemo() {
  return request('/api/reset', { method: 'POST' })
}

// One refresh: the box list plus the timeline of every box.
// A box deleted between the two calls (demo reset) is simply left out.
export async function getEverything() {
  const boxes = await getBoxes()
  const timelines = {}
  await Promise.all(
    boxes.map(async (box) => {
      try {
        timelines[box.box_id] = await getTimeline(box.box_id)
      } catch (err) {
        if (err.status !== 404) throw err
      }
    }),
  )
  return { boxes, timelines }
}
