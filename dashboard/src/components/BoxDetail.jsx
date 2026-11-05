import { useEffect, useState } from 'react'
import { getTimeline } from '../api'
import EventItem from './EventItem'
import LiabilityCard from './LiabilityCard'

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

function BoxDetail({ boxId, onBack }) {
  const [timeline, setTimeline] = useState(null)

  useEffect(() => {
    getTimeline(boxId).then(setTimeline)
  }, [boxId])

  return (
    <div className="p-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 text-2xl font-semibold text-blue-600 hover:underline"
      >
        &larr; Back
      </button>

      {!timeline ? (
        <p className="text-2xl text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mb-8 flex items-center gap-4">
            <span className={`h-6 w-6 rounded-full ${STATUS_COLORS[timeline.status]}`} />
            <h1 className="text-4xl font-bold text-gray-900">{timeline.box_id}</h1>
          </div>

          <div className="mb-8">
            <LiabilityCard liable={timeline.liable} />
          </div>

          {timeline.events.length === 0 ? (
            <p className="text-2xl text-gray-500">No events yet</p>
          ) : (
            <div className="flex flex-col gap-4">
              {[...timeline.events]
                .sort((a, b) => a.seq - b.seq)
                .map((event) => (
                  <EventItem key={event.seq} event={event} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BoxDetail
