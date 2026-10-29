import { useEffect, useState } from 'react'
import { getBoxes } from '../api'

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

function BoxList({ onSelect }) {
  const [boxes, setBoxes] = useState([])

  useEffect(() => {
    getBoxes().then(setBoxes)
  }, [])

  return (
    <div className="grid grid-cols-1 gap-8 p-10 sm:grid-cols-2 lg:grid-cols-3">
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
            {box.current_holder
              ? `${box.current_holder.name} (${box.current_holder.role})`
              : 'Unassigned'}
          </div>
          <div className="text-xl text-gray-500">
            {new Date(box.last_event_time).toLocaleString()}
          </div>
        </button>
      ))}
    </div>
  )
}

export default BoxList
