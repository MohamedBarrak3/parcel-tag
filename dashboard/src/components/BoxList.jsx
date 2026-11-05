import { timeAgo } from '../format'
import { isNew } from '../newEvents'
import { LEVELS } from '../theme'
import HolderTag from './HolderTag'
import { LevelIcon } from './Icons'
import StatusPill from './StatusPill'

const CARD_BORDER = {
  ok: 'border-l-green-700',
  warning: 'border-l-amber-500',
  severe: 'border-l-red-700',
}

// "2 severe · 1 warning · 3 info" as small chips
function SeverityCounts({ events }) {
  const levels = ['severe', 'warning', 'info']
  return (
    <div className="flex flex-wrap gap-2">
      {levels.map((level) => {
        const count = events.filter((e) => e.severity === level).length
        return (
          <span
            key={level}
            className={`inline-flex items-center gap-1.5 rounded-md border-2 px-2 py-0.5 text-base font-semibold ${
              count ? LEVELS[level].soft : 'border-slate-200 text-slate-400'
            }`}
          >
            <LevelIcon level={level} className="h-4 w-4" />
            {count} {LEVELS[level].label.toLowerCase()}
          </span>
        )
      })}
    </div>
  )
}

function BoxCard({ box, timeline, onSelect }) {
  const events = timeline?.events ?? []
  const hasNew = events.some((e) => isNew(e))

  return (
    <button
      type="button"
      onClick={() => onSelect(box.box_id)}
      className={`flex flex-col items-start gap-4 rounded-2xl border-2 border-l-[12px] border-slate-200 bg-white p-6 text-left shadow-sm transition hover:shadow-lg ${CARD_BORDER[box.status]} ${hasNew ? 'card-new' : ''}`}
    >
      <div className="flex w-full items-center justify-between gap-3">
        <span className="text-4xl font-extrabold">{box.box_id}</span>
        <StatusPill level={box.status} />
      </div>

      <div className="flex flex-col gap-1">
        <span className="text-base font-medium uppercase tracking-wide text-slate-500">Held by</span>
        <HolderTag holder={box.current_holder} className="text-2xl" />
      </div>

      <div className="text-xl text-slate-700">
        {box.last_event_time ? `Last event ${timeAgo(box.last_event_time)}` : 'No events yet'}
      </div>

      <SeverityCounts events={events} />
    </button>
  )
}

function BoxList({ boxes, timelines, onSelect }) {
  if (boxes.length === 0) {
    return (
      <p className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-10 text-2xl text-slate-600">
        No boxes yet. Waiting for a tag to upload its first events…
      </p>
    )
  }

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {boxes.map((box) => (
        <BoxCard key={box.box_id} box={box} timeline={timelines[box.box_id]} onSelect={onSelect} />
      ))}
    </div>
  )
}

export default BoxList
