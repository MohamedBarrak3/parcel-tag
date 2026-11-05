const TYPE_LABELS = {
  tap: 'Badge tap',
  drop: 'Drop',
  impact: 'Impact',
  upside_down: 'Upside down',
  tamper: 'Lid opened',
  temp_breach: 'Temperature alert',
}

const SEVERITY_BORDER = {
  info: 'border-gray-300',
  warning: 'border-amber-400',
  severe: 'border-red-400',
}

const SEVERITY_BG = {
  info: 'bg-gray-50',
  warning: 'bg-amber-50',
  severe: 'bg-red-50',
}

const SEVERITY_DOT = {
  info: 'bg-gray-400',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

function EventItem({ event, isNew }) {
  const holderText = !event.holder
    ? 'Unassigned'
    : event.holder.name
      ? `${event.holder.name}${event.holder.role ? ` (${event.holder.role})` : ''}`
      : 'Unknown badge'

  const isTempBreach = event.type === 'temp_breach'

  return (
    <div
      className={`flex flex-col gap-3 rounded-2xl border-2 p-6 transition-colors duration-700 ${
        SEVERITY_BORDER[event.severity]
      } ${isNew ? 'bg-yellow-200' : SEVERITY_BG[event.severity]} ${
        isTempBreach ? 'ring-4 ring-red-600' : ''
      }`}
    >
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <span className={`h-4 w-4 rounded-full ${SEVERITY_DOT[event.severity]}`} />
          <span className="text-2xl font-bold text-gray-900">
            {TYPE_LABELS[event.type]}
          </span>
          {isTempBreach && (
            <span className="rounded-full bg-red-600 px-3 py-1 text-base font-bold text-white">
              ALERT
            </span>
          )}
          {event.expected && (
            <span className="rounded-full bg-gray-200 px-3 py-1 text-base font-semibold text-gray-700">
              expected
            </span>
          )}
        </div>
        <span className="text-lg text-gray-500">
          {new Date(event.time).toLocaleString()}
        </span>
      </div>

      <div className="text-xl text-gray-800">{holderText}</div>

      <div className="flex gap-6 text-lg text-gray-600">
        {event.temp_c != null && event.hum_pct != null && (
          <span className={isTempBreach ? 'font-bold text-red-600' : ''}>
            {event.temp_c} °C · {event.hum_pct} %
          </span>
        )}
        {event.height_m != null && <span>≈{event.height_m} m</span>}
      </div>
    </div>
  )
}

export default EventItem
