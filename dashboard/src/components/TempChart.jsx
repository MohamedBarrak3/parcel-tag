import { clockTime, SAFE_TEMP_MAX_C, SAFE_TEMP_MIN_C } from '../format'

// Drawing area in SVG units (the SVG scales to the card width)
const W = 1000
const H = 200
const PAD = { left: 48, right: 16, top: 16, bottom: 32 }

// Temperature of every event over time, safe range shaded
function TempChart({ events }) {
  const points = events
    .filter((e) => e.temp_c != null && e.time)
    .map((e) => ({ t: Date.parse(e.time), temp: e.temp_c, seq: e.seq, time: e.time }))
    .sort((a, b) => a.t - b.t)

  if (points.length === 0) return null

  // Scales: time -> x, temperature -> y
  const tMin = points[0].t
  const tMax = points[points.length - 1].t
  const yMin = Math.min(SAFE_TEMP_MIN_C - 5, ...points.map((p) => p.temp - 2))
  const yMax = Math.max(SAFE_TEMP_MAX_C + 5, ...points.map((p) => p.temp + 2))
  const x = (t) =>
    tMax === tMin ? (PAD.left + W - PAD.right) / 2 : PAD.left + ((t - tMin) / (tMax - tMin)) * (W - PAD.left - PAD.right)
  const y = (temp) => PAD.top + ((yMax - temp) / (yMax - yMin)) * (H - PAD.top - PAD.bottom)

  const line = points.map((p, i) => `${i ? 'L' : 'M'}${x(p.t)},${y(p.temp)}`).join(' ')
  const outOfRange = (temp) => temp > SAFE_TEMP_MAX_C || temp < SAFE_TEMP_MIN_C

  return (
    <section className="flex flex-col gap-2">
      <h3 className="text-xl font-bold uppercase tracking-wide text-slate-500">
        Temperature <span className="font-normal normal-case">(safe range {SAFE_TEMP_MIN_C}–{SAFE_TEMP_MAX_C} °C shaded)</span>
      </h3>
      <div className="rounded-xl border-2 border-slate-300 bg-white p-3">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Temperature over time">
          {/* safe range band */}
          <rect
            x={PAD.left}
            width={W - PAD.left - PAD.right}
            y={y(SAFE_TEMP_MAX_C)}
            height={y(SAFE_TEMP_MIN_C) - y(SAFE_TEMP_MAX_C)}
            fill="#dcfce7"
          />
          {[SAFE_TEMP_MIN_C, SAFE_TEMP_MAX_C].map((v) => (
            <g key={v}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(v)} y2={y(v)} stroke="#15803d" strokeDasharray="6 4" strokeWidth="1.5" />
              <text x={PAD.left - 8} y={y(v) + 6} textAnchor="end" fontSize="18" fill="#334155">{v}°</text>
            </g>
          ))}

          {/* time labels: first and last */}
          <text x={PAD.left} y={H - 6} fontSize="16" fill="#475569">{clockTime(points[0].time)}</text>
          {points.length > 1 && (
            <text x={W - PAD.right} y={H - 6} textAnchor="end" fontSize="16" fill="#475569">
              {clockTime(points[points.length - 1].time)}
            </text>
          )}

          <path d={line} fill="none" stroke="#0f172a" strokeWidth="2.5" strokeLinejoin="round" />

          {/* one dot per event, red and bigger when out of range; hover shows the value */}
          {points.map((p) => (
            <circle
              key={`${p.seq}-${p.time}`}
              cx={x(p.t)}
              cy={y(p.temp)}
              r={outOfRange(p.temp) ? 8 : 5}
              fill={outOfRange(p.temp) ? '#b91c1c' : '#0f172a'}
              stroke="#fff"
              strokeWidth="2"
            >
              <title>{`${clockTime(p.time)}: ${p.temp} °C${outOfRange(p.temp) ? ' (out of range)' : ''}`}</title>
            </circle>
          ))}

          {/* out-of-range values are also written, not only shown in red */}
          {points.filter((p) => outOfRange(p.temp)).map((p) => (
            <text
              key={`label-${p.seq}-${p.time}`}
              x={x(p.t) + 12}
              y={y(p.temp) + (p.temp > SAFE_TEMP_MAX_C ? -8 : 20)}
              fontSize="18"
              fontWeight="700"
              fill="#7f1d1d"
            >
              {p.temp} °C
            </text>
          ))}
        </svg>
      </div>
    </section>
  )
}

export default TempChart
