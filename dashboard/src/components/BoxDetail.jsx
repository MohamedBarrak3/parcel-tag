import { useEffect, useRef, useState } from 'react'
import { getTimeline } from '../api'
import BackendBanner from './BackendBanner'
import EventItem from './EventItem'
import LiabilityCard from './LiabilityCard'
import ProfileBadge from './ProfileBadge'

const POLL_MS = 2000
const HIGHLIGHT_MS = 3000

const STATUS_COLORS = {
  ok: 'bg-green-500',
  warning: 'bg-amber-500',
  severe: 'bg-red-500',
}

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
    <div className="p-10">
      <button
        type="button"
        onClick={onBack}
        className="mb-8 text-2xl font-semibold text-blue-600 hover:underline"
      >
        &larr; Back
      </button>

      {error && <BackendBanner error={error} />}

      {!timeline ? (
        !error && <p className="text-2xl text-gray-500">Loading...</p>
      ) : (
        <>
          <div className="mb-8 flex items-center gap-4">
            <span className={`h-6 w-6 rounded-full ${STATUS_COLORS[timeline.status]}`} />
            <h1 className="text-4xl font-bold text-gray-900">{timeline.box_id}</h1>
          </div>

          <div className="mb-8">
            <ProfileBadge profile={timeline.profile} />
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
                  <EventItem key={event.seq} event={event} isNew={newSeqs.has(event.seq)} />
                ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}

export default BoxDetail
