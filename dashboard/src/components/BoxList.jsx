import { useEffect, useState } from 'react'
import { getBoxes } from '../api'
import BackendBanner from './BackendBanner'

const POLL_MS = 2000

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

function BoxList({ onSelect }) {
  const [boxes, setBoxes] = useState(null)
  const [error, setError] = useState(null)

  useEffect(() => {
    let cancelled = false

    async function load() {
      try {
        const data = await getBoxes()
        if (cancelled) return
        setBoxes(data)
        setError(null)
      } catch (err) {
        if (!cancelled) setError(err.message)
      }
    }

    load()
    const interval = setInterval(load, POLL_MS)
    return () => {
      cancelled = true
      clearInterval(interval)
    }
  }, [])

  return (
    <div className="p-10">
      {error && <BackendBanner error={error} />}

      {!boxes ? (
        !error && <p className="text-2xl text-gray-500">Loading...</p>
      ) : (
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {boxes.map((box) => (
            <button
              key={box.box_id}
              type="button"
              onClick={() => onSelect(box.box_id)}
              className="flex flex-col gap-4 rounded-2xl border border-gray-300 bg-white p-8 text-left shadow transition hover:shadow-xl"
            >
              <div className="flex items-center gap-4">
                <span className={`h-6 w-6 rounded-full ${STATUS_COLORS[box.status]}`} />
                <span className="text-4xl font-bold text-gray-900">{box.box_id}</span>
              </div>
              <div className="text-2xl text-gray-700">
                {!box.current_holder
                  ? 'Unassigned'
                  : box.current_holder.name
                    ? `${box.current_holder.name}${box.current_holder.role ? ` (${box.current_holder.role})` : ''}`
                    : 'Unknown badge'}
              </div>
              <div className="text-xl text-gray-500">
                {box.last_event_time
                  ? new Date(box.last_event_time).toLocaleString()
                  : 'No events yet'}
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

export default BoxList
