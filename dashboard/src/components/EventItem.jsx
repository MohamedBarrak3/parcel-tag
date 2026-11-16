import { EVENT_ICON, SEVERITY, ago, clock, eventTitle, personName, roleText } from '../labels'

function EventItem({ event, isNew }) {
  const sev = event.expected ? SEVERITY.info : (SEVERITY[event.severity] ?? SEVERITY.info)
  const role = roleText(event.holder)

  return (
    <li className="relative pl-12">
      <span className="absolute left-0 top-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-lg shadow ring-1 ring-slate-200">
        {EVENT_ICON[event.type] ?? '•'}
      </span>
      <div
        className={`rounded-xl border p-4 transition-colors duration-700 ${
          isNew ? 'border-yellow-300 bg-yellow-100' : sev.card
        }`}
      >
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-2">
            <span className="font-semibold text-slate-900">{eventTitle(event)}</span>
            {event.type !== 'tap' && (
              <span className={`rounded-full px-2 py-0.5 text-xs font-semibold ${sev.pill}`}>
                {event.expected ? 'Expected' : sev.word}
              </span>
            )}
            {isNew && <span className="rounded-full bg-yellow-400 px-2 py-0.5 text-xs font-bold text-yellow-900">NEW</span>}
          </div>
          <span className="text-sm text-slate-500" title={new Date(event.time).toLocaleString()}>
            {clock(event.time)} · {ago(event.time)}
          </span>
        </div>

        <div className="mt-1 flex flex-wrap gap-x-4 gap-y-1 text-sm text-slate-600">
          {event.type !== 'tap' && (
            <span>
              Held by <span className="font-medium text-slate-800">{event.holder ? personName(event.holder) : 'nobody yet'}</span>
              {role && ` (${role})`}
            </span>
          )}
          {event.type === 'tap' && role && <span>Role: {role}</span>}
          {event.temp_c != null && (
            <span className={event.type === 'temp_breach' ? 'font-semibold text-red-600' : ''}>
              {event.temp_c} °C{event.hum_pct != null && ` · ${event.hum_pct} % humidity`}
            </span>
          )}
        </div>
      </div>
    </li>
  )
}

export default EventItem
