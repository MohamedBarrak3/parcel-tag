import { clockTime, eventLabel, holderName, isFault, ROLE_LABELS } from '../format'
import { LEVELS, ROLE_STYLES } from '../theme'
import { EventIcon, LevelIcon, RoleIcon } from './Icons'

// Splits the events into custody periods: a tap by a new badge starts
// a new period. Events before the first tap go to an "Unassigned" period.
function custodyPeriods(events) {
  const periods = []
  let current = { holder: null, start: null, events: [] }

  for (const e of [...events].sort((a, b) => a.seq - b.seq)) {
    const isHandover = e.type === 'tap' && e.holder && e.holder.badge_id !== current.holder?.badge_id
    if (isHandover) {
      if (current.holder || current.events.length) periods.push(current)
      current = { holder: e.holder, start: e.time, events: [] }
    } else if (e.type !== 'tap') {
      current.events.push(e)
    }
  }
  if (current.holder || current.events.length) periods.push(current)
  return periods
}

function Arrow() {
  return (
    <svg viewBox="0 0 24 24" className="h-6 w-6 shrink-0 self-center text-slate-400" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 12h15M13 6l6 6-6 6" />
    </svg>
  )
}

// Small icon under the holder for each problem (or expected) event
function Marker({ event }) {
  const style = event.expected ? 'bg-slate-200 text-slate-600' : LEVELS[event.severity].solid
  return (
    <span title={`${clockTime(event.time)} ${eventLabel(event)}${event.expected ? ' (expected)' : ''}`} className={`rounded-full p-1 ${style}`}>
      <EventIcon type={event.type} className="h-5 w-5" />
    </span>
  )
}

function Period({ period, isCurrent }) {
  const { holder } = period
  const marked = period.events.filter((e) => isFault(e) || e.expected)
  const faults = marked.filter(isFault)
  const known = holder?.role

  return (
    <div
      className={`flex min-w-0 flex-1 flex-col gap-2 rounded-xl border-2 bg-white p-3 ${
        faults.length ? 'border-red-700' : 'border-slate-300'
      } ${known ? '' : 'border-dashed'}`}
    >
      <div className="flex min-w-0 items-start gap-2">
        <span className={`shrink-0 rounded-full border p-1 ${known ? ROLE_STYLES[holder.role] : 'border-slate-300 bg-slate-100 text-slate-600'}`}>
          <RoleIcon role={holder?.role ?? null} className="h-5 w-5" />
        </span>
        <div className="min-w-0 leading-tight">
          <div className={`break-words text-lg font-bold ${known ? '' : 'text-slate-600'}`}>{holderName(holder)}</div>
          <div className="break-words text-base text-slate-600">
            {known ? ROLE_LABELS[holder.role] : holder ? holder.badge_id : 'Before first tap'}
          </div>
          {period.start && <div className="text-base tabular-nums text-slate-600">from {clockTime(period.start)}</div>}
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-1.5">
        {isCurrent && (
          <span className="rounded-md bg-slate-900 px-2 py-0.5 text-sm font-bold uppercase text-white">Now</span>
        )}
        {faults.length > 0 && (
          <span className="inline-flex items-center gap-1 text-base font-bold text-red-800">
            <LevelIcon level="severe" className="h-4 w-4" />
            {faults.length} problem{faults.length > 1 ? 's' : ''}
          </span>
        )}
        {marked.map((e) => (
          <Marker key={`${e.seq}-${e.time}`} event={e} />
        ))}
        {marked.length === 0 && !isCurrent && <span className="text-base text-green-800">No problems</span>}
      </div>
    </div>
  )
}

function CustodyChain({ events }) {
  const periods = custodyPeriods(events)
  if (periods.length === 0) return null

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xl font-bold uppercase tracking-wide text-slate-500">Chain of custody</h3>
      <div className="flex items-stretch gap-1">
        {periods.map((period, i) => (
          <div key={`${i}-${period.start}`} className="contents">
            {i > 0 && <Arrow />}
            <Period period={period} isCurrent={i === periods.length - 1} />
          </div>
        ))}
      </div>
    </section>
  )
}

export default CustodyChain
