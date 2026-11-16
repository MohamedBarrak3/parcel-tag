import { useEffect, useState } from 'react'
import { getBoxes } from '../api'
import { STATUS, ago, personName, roleText } from '../labels'
import BackendBanner from './BackendBanner'
import ProfileBadge from './ProfileBadge'

const POLL_MS = 2000

function Summary({ boxes }) {
  const count = (s) => boxes.filter((b) => b.status === s).length
  const items = [
    { label: 'Boxes', value: boxes.length, cls: 'text-slate-900' },
    { label: 'All good', value: count('ok'), cls: 'text-emerald-600' },
    { label: 'Warning', value: count('warning'), cls: 'text-amber-600' },
    { label: 'Serious problem', value: count('severe'), cls: 'text-red-600' },
  ]
  return (
    <div className="mb-8 grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((i) => (
        <div key={i.label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <div className={`text-3xl font-bold ${i.cls}`}>{i.value}</div>
          <div className="text-sm text-slate-500">{i.label}</div>
        </div>
      ))}
    </div>
  )
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
    <div>
      {error && <BackendBanner error={error} />}

      {!boxes ? (
        !error && <p className="text-slate-500">Loading…</p>
      ) : boxes.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-300 bg-white p-12 text-center">
          <div className="mb-3 text-5xl">📦</div>
          <p className="text-lg font-semibold text-slate-800">No boxes yet</p>
          <p className="mt-1 text-slate-500">Switch on a tag. Its box appears here after its first upload.</p>
        </div>
      ) : (
        <>
          <Summary boxes={boxes} />
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {boxes.map((box) => {
              const st = STATUS[box.status] ?? STATUS.ok
              const role = roleText(box.current_holder)
              return (
                <button
                  key={box.box_id}
                  type="button"
                  onClick={() => onSelect(box.box_id)}
                  className="group flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition hover:-translate-y-0.5 hover:shadow-lg"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-2xl font-bold text-slate-900">📦 {box.box_id}</span>
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-semibold ring-1 ${st.pill}`}>
                      <span className={`h-2 w-2 rounded-full ${st.dot}`} />
                      {st.word}
                    </span>
                  </div>

                  <div>
                    <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Now held by</div>
                    <div className="text-lg text-slate-800">
                      {box.current_holder ? personName(box.current_holder) : 'Nobody yet'}
                      {role && <span className="text-slate-500"> · {role}</span>}
                    </div>
                  </div>

                  <ProfileBadge profile={box.profile} size="sm" />

                  <div className="mt-auto flex items-center justify-between border-t border-slate-100 pt-3 text-sm">
                    <span className="text-slate-500">
                      {box.last_event_time ? `Last activity ${ago(box.last_event_time)}` : 'No events yet'}
                    </span>
                    <span className="font-medium text-blue-600 group-hover:underline">Open timeline →</span>
                  </div>
                </button>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

export default BoxList
