import { useEffect, useRef, useState } from 'react'
import { getTimeline } from '../api'
import BackendBanner from './BackendBanner'
import EventItem from './EventItem'
import LiabilityCard from './LiabilityCard'
import ProfileBadge from './ProfileBadge'
import { STATUS, clock, personName, roleText } from '../labels'

const POLL_MS = 2000
const HIGHLIGHT_MS = 3000

function BoxDetail({ boxId, onBack }) {
  const [timeline, setTimeline] = useState(null)
  const [error, setError] = useState(null)
  const [newSeqs, setNewSeqs] = useState(new Set())
  // seqs in the last response; null until the first load so existing events are not highlighted
  const seenSeqs = useRef(null)

  useEffect(() => {
    let cancelled = false
    const timers = new Set()
    seenSeqs.current = null

    async function load() {
      try {
        const data = await getTimeline(boxId)
        if (cancelled) return

        const seqs = data.events.map((e) => e.seq)
        if (seenSeqs.current) {
          const fresh = seqs.filter((s) => !seenSeqs.current.has(s))
          if (fresh.length > 0) {
            setNewSeqs((cur) => new Set([...cur, ...fresh]))
            const timer = setTimeout(() => {
              timers.delete(timer)
              setNewSeqs((cur) => {
                const next = new Set(cur)
                fresh.forEach((s) => next.delete(s))
                return next
              })
            }, HIGHLIGHT_MS)
            timers.add(timer)
          }
        }
        seenSeqs.current = new Set(seqs)

        setTimeline(data)
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
      timers.forEach(clearTimeout)
    }
  }, [boxId])

  return (
    <div>
      <button
        type="button"
        onClick={onBack}
        className="mb-6 inline-flex items-center gap-1 rounded-lg px-2 py-1 text-sm font-medium text-blue-600 hover:bg-blue-50"
      >
        &larr; All boxes
      </button>

      {error && <BackendBanner error={error} />}

      {!timeline ? (
        !error && <p className="text-slate-500">Loading…</p>
      ) : (
        <BoxView timeline={timeline} newSeqs={newSeqs} />
      )}
    </div>
  )
}

// The handovers, in order: Warehouse A → Driver B → Client C
function CustodyChain({ events }) {
  const taps = events.filter((e) => e.type === 'tap')
  if (taps.length === 0) {
    return <p className="text-sm text-slate-500">Nobody has tapped a badge on this box yet.</p>
  }
  return (
    <ol className="flex flex-wrap items-center gap-2">
      {taps.map((t, i) => (
        <li key={t.seq} className="flex items-center gap-2">
          {i > 0 && <span className="text-slate-300">→</span>}
          <span
            className={`rounded-xl border px-3 py-2 text-sm ${
              i === taps.length - 1 ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-white'
            }`}
          >
            <span className="font-semibold text-slate-800">{personName(t.holder)}</span>
            {roleText(t.holder) && <span className="text-slate-500"> · {roleText(t.holder)}</span>}
            <span className="block text-xs text-slate-400">from {clock(t.time)}</span>
          </span>
        </li>
      ))}
    </ol>
  )
}

function BoxView({ timeline, newSeqs }) {
  const st = STATUS[timeline.status] ?? STATUS.ok
  const events = [...timeline.events].sort((a, b) => a.seq - b.seq)
  const lastHolder = events.length ? events[events.length - 1].holder : null

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h1 className="text-3xl font-bold text-slate-900">📦 Box {timeline.box_id}</h1>
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 font-semibold ring-1 ${st.pill}`}>
            <span className={`h-2.5 w-2.5 rounded-full ${st.dot}`} />
            {st.word}
          </span>
        </div>
        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div>
            <div className="text-xs font-medium uppercase tracking-wide text-slate-400">Now held by</div>
            <div className="text-lg text-slate-800">
              {lastHolder ? personName(lastHolder) : 'Nobody yet'}
              {roleText(lastHolder) && <span className="text-slate-500"> · {roleText(lastHolder)}</span>}
            </div>
          </div>
          <div>
            <div className="mb-1 text-xs font-medium uppercase tracking-wide text-slate-400">Handling profile</div>
            <ProfileBadge profile={timeline.profile} size="sm" />
          </div>
        </div>
      </div>

      <LiabilityCard liable={timeline.liable} />

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="mb-3 font-semibold text-slate-900">Chain of custody</h2>
        <CustodyChain events={events} />
      </section>

      <section>
        <h2 className="mb-3 flex items-baseline justify-between font-semibold text-slate-900">
          What happened
          <span className="text-sm font-normal text-slate-400">newest first</span>
        </h2>
        {events.length === 0 ? (
          <p className="text-slate-500">No events yet.</p>
        ) : (
          <ol className="relative flex flex-col gap-3 before:absolute before:bottom-3 before:left-[17px] before:top-3 before:w-px before:bg-slate-200">
            {[...events].reverse().map((event) => (
              <EventItem key={event.seq} event={event} isNew={newSeqs.has(event.seq)} />
            ))}
          </ol>
        )}
      </section>
    </div>
  )
}

export default BoxDetail
