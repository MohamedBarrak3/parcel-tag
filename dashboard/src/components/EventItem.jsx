import { useEffect, useRef } from 'react'
import { clockTime, eventLabel, SAFE_TEMP_MAX_C, SAFE_TEMP_MIN_C } from '../format'
import { isNew } from '../newEvents'
import { LEVELS } from '../theme'
import HolderTag from './HolderTag'
import { EventIcon, LevelIcon } from './Icons'
import StatusPill from './StatusPill'

const ROW_STYLES = {
  severe: 'border-red-700 bg-red-50',
  warning: 'border-amber-500 bg-amber-50',
  info: 'border-slate-300 bg-white',
}

function Readings({ event }) {
  const outOfRange =
    event.temp_c != null && (event.temp_c > SAFE_TEMP_MAX_C || event.temp_c < SAFE_TEMP_MIN_C)
  return (
    <span className="text-lg text-slate-600">
      {event.temp_c != null && (
        <span className={outOfRange ? 'font-bold text-red-700' : ''}>{event.temp_c} °C</span>
      )}
      {event.hum_pct != null && <span> · {event.hum_pct} % hum.</span>}
    </span>
  )
}

// One row of the timeline
function EventItem({ event, scrollOnArrival }) {
  const ref = useRef(null)
  const fresh = isNew(event)
  const level = event.expected ? 'info' : event.severity

  // An event that arrives while the box is open scrolls into view
  // (the newest is at the bottom)
  useEffect(() => {
    if (scrollOnArrival) ref.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' })
  }, [scrollOnArrival])

  return (
    <li
      ref={ref}
      className={`flex flex-wrap items-center gap-x-4 gap-y-1 rounded-xl border-2 border-l-8 px-4 py-2 ${ROW_STYLES[level]} ${
        event.expected ? 'opacity-75' : ''
      } ${fresh ? 'event-new' : ''}`}
    >
      <span className="w-24 text-lg tabular-nums text-slate-600">{clockTime(event.time)}</span>
      <span className={`rounded-full p-1.5 ${event.expected ? 'bg-slate-200 text-slate-700' : LEVELS[level].solid}`}>
        <EventIcon type={event.type} className="h-6 w-6" />
      </span>
      <span className="text-2xl font-bold">{eventLabel(event)}</span>
      {event.type !== 'tap' && <HolderTag holder={event.holder} className="text-lg" />}
      <span className="ml-auto flex items-center gap-3">
        <Readings event={event} />
        {fresh && (
          <span className="rounded-full bg-sky-600 px-2 py-0.5 text-base font-bold text-white">NEW</span>
        )}
        {event.expected ? (
          <span className="inline-flex items-center gap-1.5 rounded-full border-2 border-slate-400 px-3 py-0.5 text-lg font-bold uppercase text-slate-700">
            <LevelIcon level="ok" className="h-5 w-5" />
            Expected
          </span>
        ) : (
          <StatusPill level={event.severity} />
        )}
      </span>
    </li>
  )
}

export default EventItem
