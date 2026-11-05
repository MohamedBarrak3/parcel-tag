import mockBoxes from './mock/boxes.json'
import mockTimeline from './mock/timeline.json'

const API_URL = import.meta.env.VITE_API_URL

export async function getBoxes() {
  if (!API_URL) return mockBoxes
  const res = await fetch(`${API_URL}/api/boxes`)
  return res.json()
}

export async function getTimeline(boxId) {
  if (!API_URL) {
    return mockTimeline[boxId] ?? { box_id: boxId, status: 'ok', liable: [], events: [] }
  }
  const res = await fetch(`${API_URL}/api/boxes/${boxId}/timeline`)
  return res.json()
}
