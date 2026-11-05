import { timeAgo } from '../format'
import HolderTag from './HolderTag'
const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

function BoxList({ boxes, onSelect }) {
  return (
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
          <HolderTag holder={box.current_holder} className="text-2xl" />
          <div className="text-xl text-gray-500">{timeAgo(box.last_event_time)}</div>
        </button>
      ))}
    </div>
  )
}

export default BoxList
